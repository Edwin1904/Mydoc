const mongoose = require('mongoose')
const path = require('path')

const patientFileImageBasePath = 'uploads/images'

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    appDate: {
        type: Date,
        require: true
    },
    time: {
      type: String,
      //required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    ImageName: {
      type: String,
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor'
    }
})

appointmentSchema.virtual('patientFileImageBasePath').get(function() {
  if (this.ImageName != null) {
    return path.join('/', patientFileImageBasePath, this.ImageName)
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)
module.exports.patientFileImageBasePath = patientFileImageBasePath