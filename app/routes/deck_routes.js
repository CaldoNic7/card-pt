const express = require('express')
const passport = require('passport')
const Deck = require('../models/deck')

const {
  BadParamsError,
  BadCredentialsError,
  handle404,
  requireOwnership
} = require('./../../lib/custom_errors')

const reqToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// Create deck
// POST /decks
// Authenticated route
router.post('/decks', reqToken, (req, res, next) => {
  // incoming data looks like {deck: { name: 'deck name', exercises: ['array', 'of',
  // 'four', 'exercises'] timer: 25 } }
  const deckData = req.body.deck

  deckData.owner = req.user._id

  Deck.create(deckData)
    .then(deck => res.status(201).json({ deck }))
    .catch(next)
})

// INDEX decks
// GET /decks
router.get('/decks', reqToken, (req, res, next) => {
  Deck.find()
    .then(handle404)
    .then(decks => {
      return decks.map(deck => deck.toObject())
    })
    .then(decks => res.status(200).json({ decks }))
    .catch(next)
})

// SHOW deck
// GET /decks/610c49041867ff22a6f10759
router.get('/decks/:id', reqToken, (req, res, next) => {
  const id = req.params.id
  Deck.findById(id)
    .then(handle404)
    .then(deck => requireOwnership(req, deck))
    .then(deck => res.status(200).json({ deck: deck.toObject() }))
    .catch(next)
})

// UPDATE deck
// PATCH /decks/610c49041867ff22a6f10759
// Authenticated Route
router.patch('/decks/:id', reqToken, (req, res, next) => {
  const id = req.params.id
  Deck.findById(id)
    .then(handle404)
    .then(deck => {
      requireOwnership(req, deck)
      return deck.updateOne(req.body.deck)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY deck
// DELETE /decks/610c49041867ff22a6f10759
router.delete('/decks/:id', reqToken, (req, res, next) => {
  Deck.findById(req.params.id)
    .then(handle404)
    .then((deck) => {
      requireOwnership(req, deck)
      deck.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
