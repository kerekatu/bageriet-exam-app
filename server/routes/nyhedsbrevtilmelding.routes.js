const Nyhedsbrevtilmelding = require('../models/nyhedsbrevtilmelding.model');

const express = require('express');
const formData = require('express-form-data');             

const router = express.Router();
router.use(formData.parse());                    



// ----- HENT/GET ALLE - ADMIN -----------------------------------------------------------------------------------------

router.get('/admin', async (req, res) => {

    console.log("HENT ALLE nyhedsbrevtilmelding");

    try {
        const nyhedsbrevtilmelding = await Nyhedsbrevtilmelding.find();

        res.json(nyhedsbrevtilmelding);

    } catch (err) {
        res.status(500).json({ message: "Der var en fejl i / :" + err.message }); // 500 = serverproblem
    }

});



// ----- HENT/GET UDVALGT nyhedsbrevtilmelding - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.get('/admin/:id', findNyhedsbrevtilmelding, async (req, res) => { //

    console.log("HENT UDVALGT nyhedsbrevtilmelding")

    res.json(res.nyhedsbrevtilmelding);

});



// ----- OPRET/POST NY - IKKE ADMIN! ---------------------------------------------------------------------------------------
// ----- Kræver ikke admin - brugerne skal kunne poste en tilmelding til nyhedsbrev!

router.post('/', async (req, res) => {

    console.log("POST nyhedsbrevtilmelding");
   
    // Tjek først om findes i forvejen....    
    let tilmelding = await Nyhedsbrevtilmelding.findOne({ email: req.body.email })
    
    if (tilmelding) {
        
        return res.status(201).json({ message: "Bruger findes allerede (OBS - denne besked skal laves om - GDPR!)" })
        
    } 

    const nyhedsbrevtilmelding = new Nyhedsbrevtilmelding(req.body);

    try {
        const ny = await nyhedsbrevtilmelding.save();
        res.status(201).json({ message: "Ny nyhedsbrevtilmelding er oprettet", nyhedsbrevtilmelding: ny });

    } catch (error) {
        res.status(400).json({ message: "Der er sket en fejl", error: error });
    }

});



// ----- SLET/DELETE UD FRA ID - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.delete('/admin/:id', findNyhedsbrevtilmelding, async (req, res) => {

    console.log("DELETE nyhedsbrevtilmelding ud fra ID")

    try {

        await res.nyhedsbrevtilmelding.remove();
        res.status(200).json({ message: 'nyhedsbrevtilmelding er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'nyhedsbrevtilmelding kan ikke slettes - der er opstået en fejl: ' + error.message })
    }



});


// ----- SLET/DELETE UD FRA EMAIL - IKKE ADMIN (en besøgende skal kunne afmelde sig med sin email) ------------------------------------------------------------------------------------------------------------ 

router.delete('/afmeld/:email', async (req, res) => {

    console.log("DELETE nyhedsbrevtilmelding ud fra EMAIL", req.params.email)

    try {

        let nyhedsbrevtilmelding = await Nyhedsbrevtilmelding.findOne({email: req.params.email});

        if (nyhedsbrevtilmelding == null) {
            return res.status(404).json({ message: 'Ingen nyhedsbrevtilmelding med den EMAIL' });
        }

        await nyhedsbrevtilmelding.remove();
        res.status(200).json({ message: 'nyhedsbrevtilmelding er nu slettet' })

    } catch (error) {
        res.status(500).json({ message: 'nyhedsbrevtilmelding kan ikke slettes - der er opstået en fejl: ' + error.message })
    }



});

// ----- RET/PUT - ADMIN ------------------------------------------------------------------------------------------------------------ 

router.put('/admin/:id', findNyhedsbrevtilmelding, async (req, res) => {

    console.log("PUT nyhedsbrevtilmelding")

    try {

        // Husk at id ikke er med i req.body - derfor dur det ikke med res.gaade = req.body;
        res.nyhedsbrevtilmelding.email = req.body.email;


        await res.nyhedsbrevtilmelding.save();
        res.status(200).json({ message: 'nyhedsbrevtilmelding er rettet', rettetnyhedsbrevtilmelding: res.nyhedsbrevtilmelding });

    } catch (error) {
        res.status(400).json({ message: 'nyhedsbrevtilmelding kan ikke rettes - der er opstået en fejl: ' + error.message })
    }

});



// MIDDLEWARE 
// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findNyhedsbrevtilmelding(req, res, next) {

    console.log("FIND UD FRA ID")

    let nyhedsbrevtilmelding;

    try {

        nyhedsbrevtilmelding = await Nyhedsbrevtilmelding.findById(req.params.id);

        if (nyhedsbrevtilmelding == null) {
            return res.status(404).json({ message: 'Ingen nyhedsbrevtilmelding med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message }); // problemer med server
    }

    res.nyhedsbrevtilmelding = nyhedsbrevtilmelding; // put det fundne ind i responset
    next();
}


module.exports = router;