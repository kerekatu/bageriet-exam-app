const Nyhed = require('../models/nyhed.model');

const express = require('express');
//const formData = require('express-form-data');              

const router = express.Router();
//router.use(formData.parse());   


// MULTER - til images
const multer = require('multer');
const upload = multer({

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images');
        },
        filename: function (req, file, cb) {
            //cb(null, Date.now() + '-' + file.originalname)
            cb(null, file.originalname)
        }
    })
});


// ----- HENT/GET ALLE ------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {

    console.log("HENT ALLE nyheder");

    try {
        const nyheder = await Nyhed.find().sort([['oprettet', -1]]);
        res.json(nyheder);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT ANTAL NYESTE ------------------------------------------------------------------------------------------

router.get('/antal/:antal', async (req, res) => {

    console.log("HENT X ANTAL NYHEDER");

    let { antal } = req.params;


    if (!isNaN(parseInt(antal))) {
        antal = parseInt(antal);
    } else {
        antal = 0;
    }


    try {
        const nyheder = await Nyhed.find().sort([['oprettet', -1]]).limit(antal);
        res.json(nyheder);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET SØGNING  ------------------------------------------------------------------------------------------------------------- 
// ----- OBS! Denne skal ligge før /:id da ordet "soeg" i routen ellers bliver regnet for en "id"

router.get('/soeg/:soegeord', async (req, res) => { //

    console.log("SØG nyhed");

    const { soegeord } = req.params;

    try {

        const nyheder = await Nyhed.find({
            $or: [
                { "titel": { "$regex": soegeord, "$options": "i" } },       // søg i alt som små bogstaver
                { "teaser": { "$regex": soegeord, "$options": "i" } },
                { "nyhedstekst": { "$regex": soegeord, "$options": "i" } }
            ]
        }).sort([['oprettet', -1]]);

        res.json(nyheder);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT  ------------------------------------------------------------------------------------------------------------- 

router.get('/:id', findNyhed, async (req, res) => { //

    console.log("HENT UDVALGT nyhed")

    res.json(res.nyhed);

});



// ----- OPRET/POST NY - ADMIN ---------------------------------------------------------------------------------------

router.post('/admin', upload.single('image'), async (req, res) => {

    console.log("POST nyhed");

    let nyhed;

    try {

        if (req.body.nyhed) {
            // Hvis data kommer som stringified object + et image
            nyhed = new Nyhed({
                ...JSON.parse(req.body.nyhed),
                "image": req.file ? req.file.filename : "paavej.jpg" //req.file.filename
            })
        } else {
            // Hvis data kommer som et samlet form-objekt
            nyhed = new Nyhed(req.body);
            nyhed.image = req.file ? req.file.filename : "paavej.jpg";
        }

        const ny = await nyhed.save();
        res.status(201).json({ message: "Ny er oprettet ", oprettet: ny });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
        //res.status(400).end();
    }

});



// ----- SLET/DELETE - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.delete('/admin/:id', findNyhed, async (req, res) => {

    console.log("DELETE nyhed")

    try {

        await res.nyhed.remove();
        res.status(200).json({ message: 'Der er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'Kan ikke slettes - der er opstået en fejl: ' + error.message })
        //res.status(500).end();
    }

});



// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.put('/admin/:id', upload.single('image'), findNyhed, async (req, res) => {

    console.log("PUT nyhed")

    let nyhed;

    try {

        if (req.body.nyhed) {
            nyhed = JSON.parse(req.body.nyhed)
        } else {
            nyhed = req.body
        }

        res.nyhed.titel = nyhed.titel;
        res.nyhed.teaser = nyhed.teaser;
        res.nyhed.nyhedstekst = nyhed.nyhedstekst
        // fra multer - skal kunne håndtere at billedet måske ikke skal udskiftes
        if (req.file) {
            res.nyhed.image = req.file.filename;
        }

        await res.nyhed.save();

        res.status(200).json({ message: 'Der er rettet', rettet: res.nyhed });

    } catch (error) {
        res.status(400).json({ message: 'Kan ikke rettes - der er opstået en fejl: ' + error.message })
        //res.status(400).end();
    }

});



// MIDDLEWARE 

// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findNyhed(req, res, next) {

    console.log("FIND nyhed UD FRA ID")

    let nyhed;

    try {

        nyhed = await Nyhed.findById(req.params.id);

        if (nyhed == null) {
            return res.status(404).json({ message: 'Ingen med den ID' });
            //return res.status(404).end();
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.nyhed = nyhed;
    next();
}


module.exports = router;