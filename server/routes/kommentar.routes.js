const Kommentar = require('../models/kommentar.model');
const Produkt = require('../models/produkt.model');

const express = require('express');
const formData = require('express-form-data');              

const router = express.Router();
router.use(formData.parse());                              


// ----- HENT/GET ALLE ------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    console.log("HENT ALLE kommentarer");

    try {
        const kommentarer = await Kommentar.find().sort([['produkt', 1]]);

        res.json(kommentarer);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET KOMMENTAR UD FRA PRODUKTS ID  ------------------------------------------------------------------------------------------------------------- 
// ----- OBS! Denne skal ligge før /:id da ordet "soeg" i routen ellers bliver regnet for en "id"

router.get('/produkt/:produktid', async (req, res) => { //

    console.log("ALLE KOMMENTARER UD FRA PRODUKT ID");

    try {

        const kommentarer = await Kommentar.find({
            "produkt": req.params.produktid
        }) 

        res.json(kommentarer);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET KOMMENTAR UD FRA BRUGER ID ------------------------------------------------------------------------------------------------------------- 

router.get('/bruger/:brugerid', async (req, res) => { //

    console.log("ALLE KOMMENTARER UD FRA BRUGERS ID");

    try {

        const kommentarer = await Kommentar.find({
            "bruger": req.params.brugerid
        })

        res.json(kommentarer);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT  ------------------------------------------------------------------------------------------------------------- 

router.get('/:id', findKommentar, async (req, res) => { //

    console.log("HENT UDVALGT kommentar")

    res.json(res.kommentar);

});



// ----- OPRET/POST NY - ADMIN (medlem skal være logget ind) ---------------------------------------------------------------------------------------

router.post('/admin', async (req, res) => {

    console.log("POST kommentar")

    let kommentar = new Kommentar(req.body);

    try {

        // Kommentar: Gem ny kommentar
        let ny = await kommentar.save();

        // Produkt: Tilføj kommentars id til kommenteret produkts kommentar-array
        let produkt = await Produkt.findById(req.body.produkt);
        produkt.kommentar.push(ny._id);
        await produkt.save();

        res.status(201).json({ message: "Ny er oprettet", oprettet: ny });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
    }

});



// ----- SLET/DELETE - ADMIN (medlem skal være logget ind) ------------------------------------------------------------------------------------------------------------ 
// ----- Et medlem bør kun kunne slette egne kommentarer men det er der ikke taget højde for i backenden - forsøg at tage højde for det i frontenden/React

router.delete('/admin/:id', findKommentar, async (req, res) => {

    console.log("DELETE kommentar")

    try {

        // Produkt: Slet kommentars id fra kommenteret produkts kommentar-array
        let produkt = await Produkt.findById(res.kommentar.produkt);
        produkt.kommentar.pull(res.kommentar._id);
        await produkt.save();

        // Kommentar: Slet kommentar
        await res.kommentar.deleteOne(); // ændret fra remove
        res.status(200).json({ message: 'Der er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'Kan ikke slettes - der er opstået en fejl: ' + error.message })
    }

});


// ----- PUT/RET - ADMIN (medlem skal være logget ind) ------------------------------------------------------------------------------------------------------------ 
// ----- Et medlem bør kun kunne rette egne kommentarer men det er der ikke taget højde for i backenden - forsøg at tage højde for det i frontenden/React

router.put('/admin/:id', findKommentar, async (req, res) => {

    console.log("PUT kommentar")

    try {

        res.kommentar.titel = req.body.titel;
        res.kommentar.kommentaren = req.body.kommentaren

        // Giver ingen mening at bruger kan skifte id eller produkt som kommentaren skal knyttes til
        // res.kommentar.bruger = req.body.bruger
        // res.kommentar.produkt = req.body.produkt

        await res.kommentar.save();

        res.status(200).json({ message: 'Der er rettet', rettet: res.kommentar });

    } catch (error) {
        res.status(400).json({ message: 'Kan ikke rettes - der er opstået en fejl: ' + error.message })
    }

});



// MIDDLEWARE 

// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findKommentar(req, res, next) {

    console.log("FIND kommentar UD FRA ID", req.params.id)

    let kommentar;

    try {

        kommentar = await Kommentar.findById(req.params.id);

        if (kommentar == null) {
            return res.status(404).json({ message: 'Ingen med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.kommentar = kommentar; // put det fundne ind i responset
    next();
}


module.exports = router;