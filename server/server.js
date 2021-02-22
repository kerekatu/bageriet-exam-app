require('dotenv').config() // KUN TIL DEV/test lokalt -

const cors = require('cors')
const express = require('express')

const app = express()
const PORT = process.env.PORT

// Mongoose og MongoDB ---------------------------------------------------
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('DB connection is now open'))

// APP ----------------------------------------------------------------
app.use(cors({ credentials: true, origin: true }))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SESSION --------------------------------------------------------------

// For at bruge mongo som store for session - isf hukommelsen som ikke dur på fx heroku - Se også lidt info i _OM.txt i oprindelige tut-projekt SessionAuthenticationExpress
const session = require('express-session')
const MongoStore = require('connect-mongo')(session) // session store - kunne også være i memory (uden store) eller file-store (json-fil for hver session)

const ONE_DAY = 1000 * 60 * 60 * 24
app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }), // session gemmes i mongo
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: ONE_DAY,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
)

// ROUTES ----------------------------------------------------------

//  INDEX
app.get('/', async (req, res) => {
  console.log(
    'HEJ og velkommen serverens startside - vælg en route hvis du vil have andet end bare lidt console.log-snak!'
  )
})

///////// UDKOMMENTER DENNE - hvis login skal slås fra ////////////////////////
// ----- TJEK OM AUTHORIZED (der er logget ind og sessioncookie er sat) hvis route indeholder ordet admin
// app.use('*/admin*', async (req, res, next) => {

//     if (req.session && req.session.userID) {
//         return next()
//     } else {
//         return res.status(401).json({ message: 'Du har ikke adgang - du skal være logget ind' }) //route
//     }

// })

//  ROUTES -------------------------------------------
app.use('/kategorier', require('./routes/kategori.routes'))
app.use('/produkter', require('./routes/produkt.routes'))
app.use('/produktingrediens', require('./routes/produktingrediens.routes'))
app.use('/bruger', require('./routes/bruger.routes'))
app.use('/nyheder', require('./routes/nyhed.routes'))
app.use(
  '/nyhedsbrevtilmelding',
  require('./routes/nyhedsbrevtilmelding.routes')
)
app.use('/kommentar', require('./routes/kommentar.routes'))
app.use('/kontakt', require('./routes/kontakt.routes'))
app.use('/login', require('./routes/login.routes'))

// LISTEN --------------------------------------------------------------------------------------------------
app.listen(PORT, () =>
  console.log(
    '///// Din SERVER er eksamensklar, fuld af krudt og lytter for vildt på port ' +
      PORT +
      ' /////'
  )
)
