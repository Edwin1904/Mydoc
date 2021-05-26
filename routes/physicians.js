const express = require('express')
const router = express.Router()
const Doctor = require('../modules/doctor')
const Appointment = require('../modules/appointment')
const Prescription = require('../modules/prescription')

      //All Doctors route
router.get('/', async (req,res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== ''){
      searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
      const doctors = await Doctor.find(searchOptions)
      res.render('physicians/doctors', { 
          doctors: doctors, 
          searchOptions: req.query,
          layout: 'layouts/physician'
      })
    } catch {
      res.redirect('/physician')
    }
  })

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

    router.get('/prescription/new', async (req, res) => {
      renderNewPage(res, new Appointment())
     })
    
    router.post('/prescription', async (req, res) => {
      const prescription = new Prescription({
          patient: req.body.patient,
          prescription: req.body.prescription
      })
      try {
          const newPrescription = await prescription.save()
          res.redirect(`/physicians/prescription/${newPrescription.id}`)
        } catch {
          res.render('physicians/prescription', {
            prescription: prescription,
            errorMessage: 'Error creating prescription', 
            layout : './layouts/physicians'
          })
        }
    })



    async function renderNewPage(res, prescription, hasError = false) {
      try {
        const patient = await Appointment.find({})
        const params = {
          patient: patient,
          prescription: prescription
        }
        if (hasError) params.errorMessage = 'Error Saving Prescription'
        res.render('physicians/new_prescription', params, {layout: 'layouts/physician'})
      } catch {
        res.redirect('/physicians/prescription')
      }
    }

module.exports = router