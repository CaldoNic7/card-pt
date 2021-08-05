const { Schema, model } = require('mongoose')

const prSchema = new Schema({
  deckName: String,
  date: Date,
  exercises: Number,
  time: Number,
  cardsCompleted: Number
})

const deckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  exercises: {
    type: Array,
    required: true
  },
  timer: Number,
  personalRecord: [prSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = model('Deck', deckSchema)
