const Card = require('../models/Card.js')
const cards = require('express').Router()

cards.get('/', async (req, res, next) => {
  const query = { ...req.query }

  for (const [key, value] of Object.entries(query)) {
    query[key] = new RegExp(value)
  }

  console.log({ query })

  const data = await Card.find({ ...query })
    .limit(50)
    .select(
      'manaCost name type rarity text power toughness convertedManaCost colorIdentity'
    )

  return res.json({ query, data })
})

module.exports = cards
