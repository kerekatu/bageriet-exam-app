const Produkt = require('../models/produkt.model');
const Kommentar = require('../models/kommentar.model') // for at kunne tælle kommentarer
const Bruger = require('../models/bruger.model') // for at kunne tælle kommentarer

const express = require('express');
const router = express.Router();


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

    console.log("HENT ALLE produkt");

    try {
        const produkter = await Produkt.find({}, 'titel teaser image pris likes kommentar').sort([['title', 1]]).populate('kategori')//.limit(antal); populate('kategori kommentar')

        res.json(produkter);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT ANTAL NYESTE ------------------------------------------------------------------------------------------
// ----- OBS! Denne skal ligge før /:id da ordet "soeg" i routen ellers bliver regnet for en "id"

router.get('/antal/:antal', async (req, res) => {

    console.log("HENT ANTALp produkt");


    let { antal } = req.params;
    console.log(antal)


    if (!isNaN(parseInt(antal))) {
        antal = parseInt(antal);
    } else {
        antal = 0;
    }

    try {
        //const produkter = await Produkt.find().sort([['oprettet', -1]]).limit(antal);
        const produkter = await Produkt.find({}, 'titel teaser image pris oprettet kommentar').sort([['oprettet', -1]]).limit(antal);
        res.json(produkter);
        console.log(produkter.length)

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET SØGNING  ------------------------------------------------------------------------------------------------------------- 
// ----- OBS! Denne skal ligge før /:id da ordet "soeg" i routen ellers bliver regnet for en "id"

router.get('/soeg/:soegeord', async (req, res) => { //

    console.log("SØG produkt");

    try {

        const produkter = await Produkt.find({
            $or: [
                { "titel": { "$regex": req.params.soegeord, "$options": "i" } },       // søg i alt som små bogstaver
                { "teaser": { "$regex": req.params.soegeord, "$options": "i" } },
                { "beskrivelse": { "$regex": req.params.soegeord, "$options": "i" } },
                { "ingredienser.ingrediens_titel": { "$regex": req.params.soegeord, "$options": "i" } }
            ]
        }, 'titel teaser image pris')

        res.json(produkter);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT  ------------------------------------------------------------------------------------------------------------- 

router.get('/:id', async (req, res) => { //

    console.log("HENT UDVALGT produkt")
    //produkt = await Produkt.findById(req.params.id).populate('kategori kommentar', [{path: kommentar}])
    let produkt = await Produkt.findById(req.params.id).populate([{ path: 'kategori' }, { path: 'kommentar', model: Kommentar, populate: { path: 'bruger', model: Bruger } }]) // {path: 'kommentar'},
    //produkt = await Produkt.findById(req.params.id)//.populate([{ path: 'kategori' }, { path: 'kommentar', model: Kommentar, populate: { path: 'bruger', model: Bruger } }]) // {path: 'kommentar'},
    res.json(produkt);

});



// ----- PATCH / ADD LIKE TIL PRODUKT ----------------------------------------------------------------------------------------

router.patch('/likes/:id', async (req, res) => {

    console.log("POST LIKE til produkt")

    try {

        await Produkt.findById(req.params.id, async function (err, p) {
            if (err) next(err)
            p.likes = p.likes + 1
            await p.save();
            res.status(201).json({ message: "Der er tilføjet 1 like", "antal_likes": p.likes })
        });


    } catch (error) {

        res.status(400).json({ message: "Der er sket en fejl", error: error });

    }

})



// ----- OPRET/POST NY - ADMIN ---------------------------------------------------------------------------------------

router.post('/admin', upload.single('image'), async (req, res) => {

    console.log("POST produkt");

    let produkt 

    try {

        if (req.body.produkt) {
            // Hvis data kommer som stringified object + et image
            produkt = new Produkt({
                ...JSON.parse(req.body.produkt),
                "image": req.file ? req.file.filename : "paavej.jpg" //req.file.filename
            })
        } else {
            // Hvis data kommer som et samlet form-objekt
            produkt = new Produkt(req.body);
            produkt.image = req.file ? req.file.filename : "paavej.jpg";
        }


        const ny = await produkt.save();
        res.status(201).json({ message: "Ny er oprettet", oprettet: ny });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
        //res.status(400).end();
    }

});



// ----- SLET/DELETE - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.delete('/admin/:id', findProdukt, async (req, res) => {

    console.log("DELETE produkt")

    try {

        // let kommentar = await Kommentar.findById(res.kommentar.produkt);
        // produkt.kommentar.pull(res.kommentar._id);



        // Kommentar: Slet først alle kommentarer i Kommentar som vedrører produktet
        await Kommentar.deleteMany({ produkt: res.produkt._id }) // ændret fra remove

        // Produkt: Slet så produktet
        await res.produkt.delete();
        res.status(200).json({ message: 'Der er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'Kan ikke slettes - der er opstået en fejl: ' + error.message })
        //res.status(500).end();
    }

});



// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.put('/admin/:id', upload.single('image'), findProdukt, async (req, res) => {

    console.log("PUT produkt")

    let produkt;

    try {

        if (req.body.produkt) {
            produkt = JSON.parse(req.body.produkt)
        } else {
            produkt = req.body
        }

        res.produkt.titel = produkt.titel;
        res.produkt.teaser = produkt.teaser;
        res.produkt.beskrivelse = produkt.beskrivelse
        res.produkt.tilberedningstid = produkt.tilberedningstid
        res.produkt.antal = produkt.antal
        res.produkt.pris = produkt.pris
        res.produkt.kategori = produkt.kategori
        //res.produkt.ingredienser = req.body.ingredienser // array af flere ingredienser - håndteres med særskilt post af ingrediens
        // fra multer - skal kunne håndtere at billedet måske ikke skal udskiftes
        if (req.file) {
            res.produkt.image = req.file.filename;
        }

        await res.produkt.save();

        res.status(200).json({ message: 'Der er rettet', rettet: res.produkt });

    } catch (error) {
        res.status(400).json({ message: 'Kan ikke rettes - der er opstået en fejl: ' + error.message })
        //res.status(400).end();
    }

});



// MIDDLEWARE 

// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findProdukt(req, res, next) {

    console.log("FIND UD FRA ID", req.params.id)

    let produkt;

    try {

        produkt = await Produkt.findById(req.params.id);

        if (produkt == null) {
            return res.status(404).json({ message: 'Ingen med den ID' });
            //return res.status(404).end();
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.produkt = produkt; // put det fundne ind i responset
    next();
}


module.exports = router;