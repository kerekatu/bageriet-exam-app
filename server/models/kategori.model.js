const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({

    titel: {
        type: String,
        required: [true, 'Kategoriens titel er påkrævet'],
    }
})


module.exports = mongoose.model('Kategori', kategoriSchema, 'kategorier')