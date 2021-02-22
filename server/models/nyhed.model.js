const mongoose = require('mongoose');

const nyhedSchema = new mongoose.Schema({

    titel: {
        type: String,
        required: [true, 'Nyheden skal have en titel'],
    },
    teaser: {
        type: String,
        required: [true, 'Nyheden skal have en teaser (kort tekst)'],
    },
    nyhedstekst: {
        type: String,
        required: [true, 'Nyheden skal have en nyhedstekst'],
    },
    image: {
        type: String
    },
    oprettet: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Nyhed', nyhedSchema, 'nyheder')