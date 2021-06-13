const express = require('express')
const router = express.Router()
const Appointment = require('../modules/appointment')
const Doctor = require('../modules/doctor')
const { auth, requiresAuth } = require('express-openid-connect');

// landing page
router.get('/', async (req,res) => {
    try {
        const doctor = await Doctor.find({})
        res.render('landing', {
            doctor: doctor,
            layout: "layouts/landing"
        })
    } catch {
        res.send("error404")
    }
    
})


// Homepage Route
router.get('/home', requiresAuth(), async (req,res) => {
    try {
        const appointments = await Appointment.find().populate('doctor').sort({ createdAt: 'desc' }).limit(10).exec()
        res.render('index', { appointments: appointments })
    } catch {
        res.redirect('/')
    }
    
})

module.exports = router