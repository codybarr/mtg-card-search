import mongoose from 'mongoose'
const { Schema, model } = mongoose

const SETS = ['10E']

const CardSchema = new Schema({
  name: { type: String, index: true },
  manaCost: { type: String, index: true },
  rarity: { type: String, index: true },
  setCode: { type: String, index: true },
  colorIdentity: { type: String, index: true },
  convertedManaCost: { type: Number, index: true },
  power: { type: Number, index: true },
  toughness: { type: Number, index: true },
  text: { type: String, index: true },
  type: { type: String, index: true },
  types: { type: String, index: true },
  scryfallId: String,
})

const Card = model('card', CardSchema)

export default Card
