const express = require( 'express' )
const router = express.Router()
const Prescription = require('../modules/prescription')
const Appointment = require('../modules/appointment')


// show all prescritions
router.get('/', async (req, res) => {
  try {
    const prescription = await Prescription.find({}).populate('appointment')
    res.render('physicians/prescription', {
    prescription: prescription,
    layout: 'layouts/physician'
  })
} catch {
  res.redirect('/')
}
})

   //New Presciption
router.get('/new', async (req,res ) => {
  renderNewPage(res, new Prescription())
})

// Create Prescription
  router.post('/', async (req, res) => {
    const prescription = new Prescription({
        appointment: req.body.appointment,
        prescription: req.body.prescription
    })
    try {
        const newPrescription = await prescription.save()
        // res.redirect(`/prescription/${newPrescription.id}`)
        res.redirect('/prescription')
      } catch (err) {
        console.log(err)
        renderNewPage(res, prescription, true)
      }
  })

    // Delete Route
  router.delete('/:id', async (req, res) => {
    let prescription
    try {
      prescription = await Prescription.findById(req.params.id)
      await prescription.remove()
      res.redirect('/prescription')
    } catch {
      
      if (prescription != null) { 
        res.render('admin/prescription', {
          prescription: prescription,
          errorMessage: 'Could not delete prescription'
        })
      } else {
        res.redirect('/prescription')
      }
    }
  })



async function renderNewPage(res, prescription, hasError = false) {
  try {
    const appointment = await Appointment.find({})
    const prescription = new Prescription()
    res.render('physicians/new_prescription', {
      appointment: appointment,
      prescription: prescription,
      layout: 'layouts/physician'
    })
  } catch { 
    res.redirect('/physician')
    
  }
}


module.exports = router