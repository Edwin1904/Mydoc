const express = require( 'express' )
const router = express.Router()
const Prescription = require('../modules/prescription')
const Appointment = require('../modules/appointment')
const prescription = require('../modules/prescription')


router.get('/', async (req, res) => {
    // renderNewPage(res, new Prescription())
    // res.render('physicians/new_prescription', {layout: 'layouts/physician'})
    res.send('working')
   })

router.get('/new', async (req,res ) => {
  try {
    const appointment = await Appointment.find({})
    const prescription = new Prescription()
    res.render('physicians/new_prescription', {
      appointment:appointment,
      prescription: prescription,
      layout: 'layouts/physician'
    })
  } catch { 
    res.redirect('/physician')
    
  }
})
  
  router.post('/', async (req, res) => {
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







module.exports = router