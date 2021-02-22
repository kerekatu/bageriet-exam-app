const Kontakt = require('../models/kontakt.model');

const express = require('express');
const formData = require('express-form-data');             

const router = express.Router();
router.use(formData.parse());                               



// ----- HENT/GET ALLE - ADMIN (kun en bruger med ADMIN bør kunne se kontaktbeskeder) ---------------------------------------------------------

router.get('/admin', async (req, res) => {

    console.log("HENT ALLE kontakt");

    try {
        const kontakt = await Kontakt.find();

        res.json(kontakt);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i / :" + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT kontakt - ADMIN (kun en bruger med ADMIN bør kunne se kontaktbeskeder) --------------------------------------------------

router.get('/admin/:id', findKontakt, async (req, res) => { //

    console.log("HENT UDVALGT kontakt")

    res.json(res.kontakt);

});



// ----- OPRET/POST NY - ikke ADMIN! Alle besøgende skal kunne sende en kontaktbesked -----------------------------------------------------------------

router.post('/', async (req, res) => {
    
    console.log("POST kontakt");
    
    const kontakt = new Kontakt(req.body);
    // dato sættes automatisk med default i model
    
    try {
        const ny = await kontakt.save();
        res.status(201).json({ message: "Ny kontakt er oprettet", kontakt: ny });
        
    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
    }
    
});



// ----- SLET/DELETE - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.delete('/admin/:id', findKontakt, async (req, res) => {

    console.log("DELETE kontakt")

    try {

        await res.kontakt.remove();
        res.status(200).json({ message: 'kontakt er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'kontakt kan ikke slettes - der er opstået en fejl: ' + error.message })
    }

});



// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 
// NB! Giver det mening at kunne rette en kontaktbesked???

router.put('/admin/:id', findKontakt, async (req, res) => {

    console.log("PUT kontakt")

    try {

        res.kontakt.navn = req.body.navn;
        res.kontakt.email = req.body.email;
        res.kontakt.emne = req.body.emne;
        res.kontakt.besked = req.body.besked;
        // dato skal ikke kunne rettes

        await res.kontakt.save();
        res.status(200).json({ message: 'kontakt er rettet', rettetkontakt: res.kontakt });

    } catch (error) {
        res.status(400).json({ message: 'kontakt kan ikke rettes - der er opstået en fejl: ' + error.message })
    }

});



// MIDDLEWARE 

// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findKontakt(req, res, next) {

    console.log("FIND kontakt UD FRA ID")
    let kontakt;

    try {

        kontakt = await Kontakt.findById(req.params.id);

        if (kontakt == null) {
            return res.status(404).json({ message: 'Ingen kontakt med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.kontakt = kontakt; // put det fundne ind i responset
    next();
}


module.exports = router;