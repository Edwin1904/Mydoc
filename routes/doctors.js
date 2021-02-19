const express = require('express')
const router = express.Router()
const Doctor = require('../modules/doctor')


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
        res.redirect(`doctors`)
        //res.redirect(`doctors/${newDoctor.id}`)
      } catch {
        res.render('doctors/new', {
          doctor: doctor,
          errorMessage: 'Error creating Author'
        })
      }

  })

module.exports = router