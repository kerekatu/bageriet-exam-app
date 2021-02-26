const Bruger = require('../models/bruger.model')

const express = require('express')
const formData = require('express-form-data')

const router = express.Router()
router.use(formData.parse())

// ----- LOGIN (tilføj session hvis match) ---------------------------------------------------------------------------------

router.post('/login', async (req, res) => {
  console.log('LOGIN')

  try {
    const { email, password } = req.body

    const bruger = await Bruger.findOne({ email: email })

    if (!bruger) {
      return res
        .status(401)
        .json({ message: 'Bruger findes ikke', login_godkendt: false })
    }

    bruger.comparePassword(password, function (err, isMatch) {
      if (err) throw err

      if (isMatch) {
        req.session.userID = bruger._id // SESSION med brugers id

        res.json({
          login_godkendt: true,
          email: bruger.email,
          bruger_id: bruger._id,
          brugernavn: bruger.brugernavn,
          fornavn: bruger.fornavn,
          efternavn: bruger.efternavn,
        })
      } else {
        res
          .status(401)
          .clearCookie(process.env.SESSION_NAME)
          .json({ message: 'Bruger findes ikke', login_godkendt: false })
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message, login_godkendt: false }) // 500 = serverproblem
  }
})

// ----- LOGUD (destroy session) --------------------------------------------------------------------------------------------

router.get('/logout', async (req, res) => {
  console.log('LOGUD')

  req.session.destroy((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'Logud lykkedes ikke - prøv igen' }) // hvis fejl/ikke kan destroy så send til ???
    res
      .clearCookie(process.env.SESSION_NAME)
      .json({ message: 'Bruger logget ud - cookie slettet' })
  })
})

// ----- LOGGET IND? true eller false ---------------------------------------------------------------------------------------

router.get('/loggedin', async (req, res) => {
  if (req.session.userID) {
    // Hvis der er logget ind
    return res
      .status(200)
      .json({ message: 'Login er stadig aktiv', user: req.session.userID }) //route
  } else {
    // Hvis der ikke er et login/en session
    return res
      .status(401)
      .json({ message: 'Login eksisterer ikke eller er udløbet' })
  }
})

module.exports = router
