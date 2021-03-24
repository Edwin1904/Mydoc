const express = require('express')
const router = express.Router()
const Doctor = require('../modules/doctor')
const Appointment = require('../modules/appointment')
const doctor = require('../modules/doctor')
const { update } = require('../modules/appointment')
const { query } = require('express')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

router.get('/', async (req,res) => {
  let appointments
  try {
      appointments = await Appointment.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
      appointments = []
  }
  res.render('admin/index', { appointments: appointments, layout : './layouts/admin' })
})

//All Doctors route
router.get('/doctors', async (req,res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== ''){
      searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
      const doctors = await Doctor.find(searchOptions)
      res.render('admin/doctors', { 
          doctors: doctors, 
          searchOptions: req.query,
          layout: 'layouts/admin'
      })
    } catch {
      res.redirect('/admin')
    }
  })

// New Doctor Route
router.get('/doctors/new', (req, res) => {
  res.render('admin/new', { doctor: new Doctor(), layout: 'layouts/admin'})
})

// Create doctor Route

router.post('/doctors', async (req, res) => {
  const doctor = new Doctor({
      name: req.body.name,
      surname: req.body.surname,
      speciality: req.body.surname
  })
  saveImage(doctor, req.body.Image)
  try {
      const newDoctor = await doctor.save()
      res.redirect(`/admin/doctors/${newDoctor.id}`)
    } catch (err) {
      console.log(err)
      res.render('admin/new', {
        doctor: doctor,
        errorMessage: 'Error creating Author', 
        layout : './layouts/admin'
      })
    }
})


router.get('/doctors/:id', async (req, res) => {
try {
  const doctor = await Doctor.findById(req.params.id)
  const appointments = await Appointment.find({ doctor: doctor.id }).limit(6).exec()
  res.render('admin/show_doctors', {
    doctor: doctor,
    doctorAppointments: appointments, 
    layout : './layouts/admin'
  })
} catch {
  res.redirect('/admin')
}
})

router.get('/doctors/:id/edit', async (req, res) => {
try {
  const doctor = await Doctor.findById(req.params.id) 
  res.render('admin/edit', { doctor: doctor, layout : './layouts/admin' })
} catch (err) {
  console.log(err)
  res.redirect('/admin/doctors')
}
})

// Update doctor
router.put('/doctors/:id', async (req, res) => {
let doctor
try {
  doctor = await Doctor.findById(req.params.id)
  doctor.name = req.body.name
  doctor.surname = req.body.surname
  doctor.speciality = req.body.speciality
  if (req.body.Image != null && req.body.Image !== '') {
    saveCover(doctor, req.body.Image)
  }
  await doctor.save()
  res.redirect(`/admin/doctors/${doctor.id}`)
} catch {
  if (doctor == null) {
    req.redirect('/admin')
  } else {
    res.render('admin/edit', {
      doctor: doctor,
      errorMessage: 'Error updatinng Author', 
      layout : './layouts/admin'
    })
  }
}
})

router.delete('/doctors/:id', async (req, res) => {
let doctor
try {
    doctor = await Doctor.findById(req.params.id)
    await doctor.remove()
    res.redirect('/admin/doctors')
  } catch {
    if (doctor == null) {
      req.redirect('/admin')
    } else {
      res.redirect(`/admin/doctors/${doctor.id}`)
    }
  }
})

//All Appointments route
router.get('/appointments', async (req,res) => {
  let query = Appointment.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  if (req.query.reservedBefore != null && req.query.reservedBefore != '') {
    query = query.lte('appDate', req.query.reservedBefore)
  }
  if (req.query.reservedAfter != null && req.query.reservedAfter != '') {
    query = query.gte('appDate', req.query.reservedAfter)
  }
  try {
      const appointments = await Appointment.find({}).populate('doctor')
      res.render('admin/appointments', {
      appointments: appointments,
      searchOptions: req.query,
      layout: './layouts/admin'
    })
  } catch {
    res.redirect('/admin')
  }
  })

  router.get('/appointments/:id', async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id)
                                                  .populate('doctor')
                                                  .exec()
      res.render('admin/show_appointment', {appointment: appointment, layout: 'layouts/admin'})
    } catch {
      res.redirect('/admin')
    }
  })

    // Delete appointment Route
  router.delete('/appointments/:id', async (req, res) => {
    let appointment
    try {
      appointment = await Appointment.findById(req.params.id)
      await appointment.remove()
      res.redirect('/admin/appointments')
    } catch {
      
      if (appointment != null) { 
        res.render('admin/appointments', {
          appointment: appointment,
          errorMessage: 'Could not cancel Appointment', 
          layout : './layouts/admin'
        })
      } else {
        res.redirect('/admin')
      }
    }
  })


function saveImage(doctor, imageEncoded) {
  if (imageEncoded == null) return
  const image = JSON.parse(imageEncoded)
  if (image != null && imageMimeTypes.includes(image.type)) {
    doctor.Image = new Buffer.from(image.data, 'base64')
    doctor.imageType = image.type
  }
}

module.exports = router