const mongoose = require('mongoose')
const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Appointment'
      },
    prescription: {
        type: String,
        required: true
    },
    pickup: {
        type: String,
    }
})

module.exports = mongoose.model('Persription', prescriptionSchema)