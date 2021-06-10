const express = require('express')
const router = express.Router()
const Appointment = require('../modules/appointment')
const Doctor = require('../modules/doctor')
const Prescription = require('../modules/prescription')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

//All Appointment route
router.get('/', async (req,res) => {
  try {
      const appointments = await Appointment.find({}).populate('doctor')
      res.render('appointments/index', {
      appointments: appointments,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
  })



// New Appointment Route
router.get('/new', async (req, res) => {
   renderNewPage(res, new Appointment())
  })

  // Create Appointment Route
router.post('/', async (req, res) => {
  const appointment = new Appointment({
    name: req.body.name,
    surname: req.body.surname,
    SSN: req.body.SSN,
    doctor: req.body.doctor,
    appDate: new Date(req.body.appDate),
    time: req.body.time,
    description: req.body.description
  }) 
  saveImage(appointment, req.body.Image)

   try {  
     const newAppointment = await appointment.save()
     // res.redirect(`appointments/${newAppointment.id}`)
     res.redirect(`appointments`)
   } catch  {
    renderNewPage(res, appointment, true)
   }
  })

//show appointments
  router.get('/:id', async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id)
                                                  .populate('doctor')
                                                  .exec()
      const prescriptions = await Prescription.find({ appointment: appointment.id })
      res.render('appointments/show', {
        appointment: appointment,
        prescription: prescriptions})
    } catch {
      res.redirect('/')
    }
  })

// Delete Route
  router.delete('/:id', async (req, res) => {
    let appointment
    try {
      appointment = await Appointment.findById(req.params.id)
      await appointment.remove()
      res.redirect('/appointments')
    } catch {
      
      if (appointment != null) { 
        res.render('appointments/index', {
          appointment: appointment,
          errorMessage: 'Could not cancel Appointment'
        })
      } else {
        res.redirect('/')
      }
    }
  })

  //render form page function
  async function renderNewPage(res, appointment, hasError = false) {
    try {
      const doctors = await Doctor.find({})
      const params = {
        doctors: doctors,
        appointment: appointment
      }
      if (hasError) params.errorMessage = 'Error Making Appointment'
      res.render('appointments/new', params)
    } catch {
      res.redirect('/appointments')
    }
  }

  // Save Image Function
  function saveImage(appointment, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
      appointment.Image = new Buffer.from(image.data, 'base64')
      appointment.imageType = image.type
    }
  }

module.exports = router