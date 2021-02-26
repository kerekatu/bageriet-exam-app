const mongoose = require('mongoose')

const kommentarSchema = new mongoose.Schema({
  titel: {
    type: String,
  },
  kommentaren: {
    type: String,
    required: [true, 'Husk kommentaren'],
  },
  oprettet: {
    type: Date,
    default: Date.now(),
  },
  bruger: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bruger', // fordi vi refererer til en anden model/schema
  },
  produkt: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Produkt', // fordi vi refererer til en anden model/schema
  },
})

// TODO: PRE REMOVE: Find reference i Produkt - i produktets kommentar array: pull kommentaren med slettet produkts id

module.exports = mongoose.model('Kommentar', kommentarSchema, 'kommentarer')
