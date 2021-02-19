const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Appointment = require('../modules/appointment')
const uploadPath = path.join('public', Appointment.patientFileImageBasePath)
const Doctor = require('../modules/doctor')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})


//All Appointment route
router.get('/', async (req,res) => {
  try {
      const appointments = await Appointment.find({})   
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
router.post('/', upload.single('ImageName'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const appointment = new Appointment({
    name: req.body.name,
    doctor: req.body.doctor,
    appDate: new Date(req.body.appDate),
    time: req.body.time,
    ImageName: fileName,
    description: req.body.description
  }) 
   try {
     const newAppointment = await appointment.save()
     // res.redirect(`appointments/${newAppointment.id}`)
     res.redirect(`appointments`)
   } catch {
     if (appointment.ImageName != null) {
    removeFile(appointment.ImageName)
  }
    renderNewPage(res, appointment, true)
   }
  })

  function removeFile(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if(err) console.error(err)
    })
  }

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

module.exports = router