const Produkt = require('../models/produkt.model');

const express = require('express');
const formData = require('express-form-data');            

const router = express.Router();
router.use(formData.parse());                     


// ----- OPRET/POST NY INGREDIENS TIL PRODUKT - ADMIN ---------------------------------------------------------------------------------------

router.post('/admin/:produktid', async (req, res) => {

    console.log("POST ingrediens");

    let produkt;

    try {
        produkt = await Produkt.findById(req.params.produktid);
        produkt.ingredienser.push(req.body);
        produkt.save();
        res.status(201).json({ message: "Ny er oprettet ", oprettet: req.body });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl her ...", error: error });
    }

});


// ----- DELETE/SLET INGREDIENS TIL PRODUKT - ADMIN ---------------------------------------------------------------------------------------

router.delete('/admin/:produkt_id/:ingrediens_id', async (req, res) => {

    console.log("DELETE ingrediens");

    try {

        let produkt = await Produkt.findById(req.params.produkt_id);
        let ingredienserantal = produkt.ingredienser.length     // tæl antal ingre inden slet
        produkt.ingredienser.pull(req.params.ingrediens_id);     // slet ingrediens hvis den er der
        produkt.save();

        // hvis antal ingredienser før-slet minus 1 er = antal ingredienser efter slet ...
        if (ingredienserantal - 1 === produkt.ingredienser.length) {
            return res.status(201).json({ message: "Ingrediens er fjernet ", produkt: produkt });
        }
        
        return res.status(201).json({ message: "Der blev ikke slettet en ingrediens ", produkt: produkt });


    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl her ...", error: error });
    }

});


module.exports = router;