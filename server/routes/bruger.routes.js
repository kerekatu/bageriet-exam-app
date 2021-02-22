const Bruger = require('../models/bruger.model');
const Kommentar = require('../models/kommentar.model')
const Produkt = require('../models/produkt.model')

const express = require('express');
const formData = require('express-form-data');

const router = express.Router();
router.use(formData.parse());



// ----- HENT/GET ALLE - ADMIN -----------------------------------------------------------------------------------------

router.get('/admin', async (req, res) => {

    console.log("HENT ALLE brugere");

    try {
        const bruger = await Bruger.find();

        res.json(bruger);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i: " + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT  - ADMIN -----------------------------------------------------------------------------------------------------

router.get('/admin/:id', findBruger, async (req, res) => { //

    console.log("HENT UDVALGT bruger")

    res.json(res.bruger);

});


// router.get('/admin/:id', async (req, res) => { //

//     console.log("HENT UDVALGT bruger")

//     let bruger = await Bruger.findById(req.params.id).populate('kommentarer', [{ path: kommentar, match: { _id: req.params.id } }])
//     //let bruger = await Bruger.findById(req.params.id).populate([{ path: 'kategori' }, { path: 'kommentar', model: Kommentar, populate: { path: 'bruger', model: Bruger } }]) // {path: 'kommentar'},
//     //produkt = await Produkt.findById(req.params.id)//.populate([{ path: 'kategori' }, { path: 'kommentar', model: Kommentar, populate: { path: 'bruger', model: Bruger } }]) // {path: 'kommentar'},

//     res.json(bruger);

// });



// ----- OPRET/POST NY - IKKE ADMIN! ---------------------------------------------------------------------------------------------------
// ----- Ikke admin - alle skal kunne oprette sig

router.post('/', async (req, res) => {

    console.log("POST bruger");

    try {

        let bruger = await Bruger.findOne({ email: req.body.email })

        if (bruger) {

            console.log("Bruger findes i forvejen = kan ikke oprettes igen")
            return res.status(401).json({ message: "Bruger findes allerede (OBS - denne besked skal laves om - GDPR!" })

        } else {

            console.log("Bruger findes IKKE i forvejen")
            bruger = new Bruger(req.body);
            const ny = await bruger.save();
            res.status(201).json({ message: "Ny bruger er oprettet", ny: bruger });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error.message });
    }

});



// ----- SLET/DELETE - ADMIN ------------------------------------------------------------------------------------------------------------ 
// ----- OBS! HVIS BRUGER SLETTES slettes alle brugers kommentarer også -----------------------------------------------------------------
// ----- OBS! Bruger med ADMIN-rolle kan ikke slettes  ----------------------------------------------------------------------------------

router.delete('/admin/:id', findBruger, async (req, res) => {

    console.log("DELETE bruger")
    console.log("Brugers rolle: ", res.bruger.rolle)

    if (res.bruger.rolle != "ADMIN") {

        try {

            // Bør flyttes til pre.remove el.lign. i Kommentar-model el. model-method el.lign.
            // 1. Find i Kommentar  alle kommentarer knyttet til denne brugers id
            // 2. Loop gennem kommentarer: Snup produktets id som kommentaren er tilknyttet + snup kommentarens id
            // 3. I loop: Find i Produkt produktet ud fra produktid - fjern kommentarid fra produktets kommentarer-array

            // Kommentar-model
            let brugerskommentarer = await Kommentar.find({ bruger: res.bruger._id });

            // Produkt-model
            brugerskommentarer.forEach(async bk => {
                console.log("produktets id: ", bk.produkt, " brugers id: ", res.bruger._id)
                let p = await Produkt.findById(bk.produkt);
                p.kommentar.pull(bk._id);
                p.save();
            });

            await Kommentar.deleteMany({ bruger: res.bruger._id })
            //await Kommentar.remove({ bruger: res.bruger._id })

            // Bruger: Slet så bruger
            await res.bruger.delete(); //ændret fra remove
            res.status(200).json({ message: 'Der er nu slettet' })


        } catch (error) {
            res.status(500).json({ message: 'Der kan ikke slettes - der er opstået en fejl: ' + error.message })
        }

    } else {

        return res.status(500).json({ message: 'ADMIN kan ikke slettes!' })

    }

});



// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.put('/admin/:id', findBruger, async (req, res) => {

    console.log("PUT bruger")

    try {

        res.bruger.brugernavn = req.body.brugernavn;
        res.bruger.fornavn = req.body.fornavn;
        res.bruger.efternavn = req.body.efternavn;
        res.bruger.email = req.body.email;
        if (req.body.password) res.bruger.password = req.body.password;

        await res.bruger.save();
        res.status(200).json({ message: 'Der er rettet', rettet: res.bruger });

    } catch (error) {
        res.status(400).json({ message: 'Der kan ikke rettes - der er opstået en fejl: ' + error.message })

    }

});



// MIDDLEWARE 
// FIND FRA ID  ---------------------------------------------------------------------------------------------

async function findBruger(req, res, next) {

    console.log("FIND UD FRA ID", req.params.id)
    let bruger;

    try {

        bruger = await Bruger.findById(req.params.id);

        if (bruger == null) {
            return res.status(404).json({ message: 'Der findes ikke en  med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.bruger = bruger; // put det fundne ind i responset
    next();
}


module.exports = router;
