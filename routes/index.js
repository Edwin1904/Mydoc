const express = require('express')
const router = express.Router()
const Appointment = require('../modules/appointment')

router.get('/', async (req,res) => {
    let appointments
    try {
        appointments = await Appointment.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        appointments = []
    }
    res.render('index', { appointments: appointments })
})

module.exports = router