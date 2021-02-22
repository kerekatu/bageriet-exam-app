const mongoose = require('mongoose');

const kontaktSchema = new mongoose.Schema({

    navn: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emne: {
        type: String,
        required: true
    },
    besked: {
        type: String,
        required: true
    },
    modtagetdato: {
        type: Date,
        required: true,
        default: Date.now
    }
})


module.exports = mongoose.model('Kontakt', kontaktSchema, 'kontakter')