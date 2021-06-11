if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { auth, requiresAuth, claimEquals } = require('express-openid-connect');
const jwtAuthz = require("express-jwt-authz")


const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctors')
const appointmentRouter = require('./routes/appointments')
const adminRouter = require('./routes/admin')
const physicianRouter = require('./routes/physicians')
const prescriptionRouter = require('./routes/prescription')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(
  auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    authRequired: false,
    auth0Logout:true,
  })
);

app.use('/', indexRouter)
app.use('/doctors', requiresAuth(), doctorRouter)
app.use('/appointments', requiresAuth(), appointmentRouter)
app.use('/admin', requiresAuth(), adminRouter)
app.use('/physician', requiresAuth(), physicianRouter)
app.use('/prescription', requiresAuth(), prescriptionRouter)


app.listen(process.env.PORT || 3000)