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

// New Doctor Route
router.get('/new', (req, res) => {
    res.render('doctors/new', { doctor: new Doctor()})
  })

  // Create Author Route

router.post('/', async (req, res) => {
    const doctor = new Doctor({
        name: req.body.name
    })
    try {
        const newDoctor = await doctor.save()
        res.redirect(`doctors/${newDoctor.id}`)
      } catch {
        res.render('doctors/new', {
          doctor: doctor,
          errorMessage: 'Error creating Author'
        })
      }
  })


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

router.get('/:id/edit', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id) 
    res.render('doctors/edit', { doctor: doctor})
  } catch {
    res.redirect('/doctors')
  }
})

router.put('/:id', async (req, res) => {
  let doctor
try {
    doctor = await Doctor.findById(req.params.id)
    doctor.name = req.body.name
    await doctor.save()
    res.redirect(`/doctors/${doctor.id}`)
  } catch {
    if (doctor == null) {
      req.redirect('/')
    } else {
      res.render('doctors/edit', {
        doctor: doctor,
        errorMessage: 'Error updatinng Author'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let doctor
  try {
      doctor = await Doctor.findById(req.params.id)
      await doctor.remove()
      res.redirect('/doctors')
    } catch {
      if (doctor == null) {
        req.redirect('/')
      } else {
        res.redirect(`/doctors/${doctor.id}`)
      }
    }
})

module.exports = router