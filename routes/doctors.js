const express = require('express')
const router = express.Router()
const Doctor = require('../modules/doctor')
const Appointment = require('../modules/appointment')

//All Doctors route
router.get('/', async (req,res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const doctors = await Doctor.find(searchOptions)
        res.render('doctors/index', { 
            doctors: doctors, 
            searchOptions: req.query
        })
      } catch {
        res.redirect('/')
      }
    })

//Show doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    const appointments = await Appointment.find({ doctor: doctor.id }).limit(6).exec()
    res.render('doctors/show', {
      doctor: doctor,
      doctorAppointments: appointments
    })
  } catch {
    res.redirect('/')
  }
})


module.exports = router