const Kategori = require('../models/kategori.model');

const express = require('express');
const formData = require('express-form-data');

const router = express.Router();
router.use(formData.parse());


// ----- HENT/GET ALLE ------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    console.log("HENT ALLE kategorier");

    try {
        const kategorier = await Kategori.find().sort([['title', 1]]);
        res.json(kategorier);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message });
        //res.status(500).end();
    }

});



// ----- HENT/GET UDVALGT  ------------------------------------------------------------------------------------------------------------- 

router.get('/:id', findKategori, async (req, res) => { //

    console.log("HENT UDVALGT kategori")

    res.json(res.kategori);

});



// ----- OPRET/POST NY - ADMIN ---------------------------------------------------------------------------------------

router.post('/admin', async (req, res) => {

    console.log("POST kategori")

    let kategori = new Kategori(req.body);

    try {
        const ny = await kategori.save();
        res.status(201).json({ message: "Ny er oprettet body", oprettet: ny });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
    }

});



// ----- SLET/DELETE - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.delete('/admin/:id', findKategori, async (req, res) => {

    console.log("DELETE kategori")

    try {

        await res.kategori.remove();
        res.status(200).json({ message: 'kategori er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'kategori kan ikke slettes - der er opstået en fejl: ' + error.message })
    }

});



// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.put('/admin/:id', findKategori, async (req, res) => {

    console.log("PUT kategori")

    try {

        res.kategori.titel = req.body.titel;

        await res.kategori.save();
        res.status(200).json({ message: 'kategori er rettet', rettetkategori: res.kategori });

    } catch (error) {
        res.status(400).json({ message: 'kategori kan ikke rettes - der er opstået en fejl: ' + error.message })
    }

});



// MIDDLEWARE 
// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findKategori(req, res, next) {

    console.log("FIND kategori UD FRA ID")

    let kategori;

    try {

        kategori = await Kategori.findById(req.params.id);

        if (kategori == null) {
            return res.status(404).json({ message: 'Ingen med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.kategori = kategori; // put det fundne ind i responset
    next();
}

module.exports = router;