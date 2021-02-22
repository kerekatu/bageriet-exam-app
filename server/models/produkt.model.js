const mongoose = require('mongoose');
const PORT = process.env.PORT;

const ingrediensSchema = new mongoose.Schema(
    {
        ingrediens_titel: {
            type: String,
            required: [true, 'Ingrediensens navn er påkrævet']
        },
        maengde: {
            type: Number
        },
        enhed_forkortet: {
            type: String
        },
        enhed_navn: {
            type: String
        }
    }
);

const produktSchema = new mongoose.Schema({

    titel: {
        type: String,
        required: [true, 'Produktets navn er påkrævet'],
    },
    teaser: {
        type: String,
        required: [true, 'Kort teaser er påkrævet'],
    },
    beskrivelse: {
        type: String,
        required: [true, 'Beskrivelse er påkrævet'],
    },
    tilberedningstid: {
        type: Number,
        required: [true, 'Produktets tid (arbejdstid) er påkrævet'],
    },
    antal: {
        type: Number,
        required: [true, 'Produktets antal er påkrævet'],
    },
    pris: {
        type: Number,
        required: [true, 'Produktets pris er påkrævet'],
    },
    image: {
        type: String,
        required: [true, 'Et foto af produktet er påkrævet'],
    },
    oprettet: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Kategori' // fordi vi refererer til en anden model/schema - value SKAL matche navnet på navnet i export i modellen der referes til
    },
    kommentar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kommentar' // fordi vi refererer til en anden model/schema - value SKAL matche navnet på navnet i export i modellen der referes til
    }],
    ingredienser: [ingrediensSchema]
}
    // #region
    // , {
    //     toObject: { virtuals: true },
    //     toJSON: { virtuals: true }
    // }
    // #endregion
)

// PRE REMOVE: Find alle referencer i Kommentarer - remove alle kommentarer med slettet produkts id


module.exports = mongoose.model('Produkt', produktSchema, 'produkter')