const mongoose = require('mongoose')

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
        unique: true,
        require: true
    },
    time: {
      type: String,
      unique: true
      //required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    Image: {
      type: Buffer,
      // required: true
    },
    imageType: {
      type: String,
      // required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor'
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription'
    }
})

appointmentSchema.virtual('patientFileImageBasePath').get(function() {
  if (this.Image != null && this.imageType != null) {
    return `data:${this.imageType};charset=utf-8;base64,${this.Image.toString('base64')}`
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)
