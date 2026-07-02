import { createGunzip } from 'node:zlib'
import { Readable, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import mongoose from 'mongoose'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/pick.js'
import { streamObject } from 'stream-json/streamers/stream-object.js'

import { MONGO_CONNECTION_STRING } from '../src/config.js'
import Card from '../src/models/Card.js'

const MTGJSON_URL =
  process.env.MTGJSON_URL || 'https://mtgjson.com/api/v5/AllPrintings.json.gz'
const BATCH_SIZE = Number(process.env.SEED_BATCH_SIZE || 1000)

function joinStringArray(value) {
  if (Array.isArray(value)) return value.join(',')
  return value ?? undefined
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function transformCard(card) {
  return {
    name: card.name,
    manaCost: card.manaCost,
    rarity: card.rarity,
    setCode: card.setCode,
    colorIdentity: joinStringArray(card.colorIdentity),
    convertedManaCost: toNumber(card.convertedManaCost ?? card.manaValue),
    power: card.power,
    toughness: card.toughness,
    text: card.text,
    type: card.type,
    types: joinStringArray(card.types),
    scryfallId: card.identifiers?.scryfallId,
  }
}

async function downloadStream(url) {
  console.log(`Downloading MTGJSON data from ${url}`)

  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`)
  }

  return Readable.fromWeb(response.body)
}

async function main() {
  await mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.log('MongoDB connected')
  console.log('Dropping existing cards collection')
  await Card.collection.drop().catch((error) => {
    if (error.codeName !== 'NamespaceNotFound' && error.code !== 26) throw error
  })

  let batch = []
  let cardCount = 0
  let setCount = 0

  async function flushBatch() {
    if (batch.length === 0) return

    await Card.collection.insertMany(batch, { ordered: false })
    cardCount += batch.length
    batch = []

    if (cardCount % (BATCH_SIZE * 10) === 0) {
      console.log(`Imported ${cardCount.toLocaleString()} cards...`)
    }
  }

  const importer = new Writable({
    objectMode: true,
    async write({ value: set }, _encoding, callback) {
      try {
        setCount += 1

        for (const card of set.cards || []) {
          batch.push(transformCard(card))

          if (batch.length >= BATCH_SIZE) {
            await flushBatch()
          }
        }

        callback()
      } catch (error) {
        callback(error)
      }
    },
    async final(callback) {
      try {
        await flushBatch()
        callback()
      } catch (error) {
        callback(error)
      }
    },
  })

  const source = await downloadStream(MTGJSON_URL)
  const streams = [source]

  if (MTGJSON_URL.endsWith('.gz')) {
    streams.push(createGunzip())
  }

  streams.push(
    parser.asStream(),
    pick.asStream({ filter: 'data' }),
    streamObject.asStream(),
    importer,
  )

  await pipeline(...streams)

  console.log('Rebuilding card indexes')
  await Card.syncIndexes()

  console.log(
    `Seed complete: imported ${cardCount.toLocaleString()} cards from ${setCount.toLocaleString()} sets`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
