const express = require('express')
const router = express.Router()
const Doctor = require('../modules/doctor')
const Appointment = require('../modules/appointment')
const Prescription = require('../modules/prescription')



// Doctor homepage route  
  router.get('/:id', async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id)
      const appointments = await Appointment.find({ doctor: doctor.id }).limit(6).exec()
      res.render('physicians/show_doctors', {
        doctor: doctor,
        doctorAppointments: appointments, 
        layout : './layouts/physician'
      })
    } catch {
      res.redirect('/physician')
    }
    })

 // doctor patient info route
    router.get('/appointments/:id', async (req, res) => {
      try {
        const appointment = await Appointment.findById(req.params.id)
                                                    .populate('doctor')
                                                    .exec()
        res.render('physicians/show_patient', {appointment: appointment, layout : './layouts/physician'})
      } catch {
        res.redirect('/')
      }
    })



module.exports = router