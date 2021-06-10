const express = require( 'express' )
const router = express.Router()
const Prescription = require('../modules/prescription')
const Appointment = require('../modules/appointment')



router.get('/', async (req, res) => {
  try {
    const prescription = await Prescription.find({}).populate('appointment')
    res.render('admin/prescription', {
    prescription: prescription,
    layout: 'layouts/admin'
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
        res.render('physicians/successful', { layout: 'layouts/physician' })
      } catch (err) {
        console.log(err)
        renderNewPage(res, prescription, true)
      }
  })

  //Show prescription
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