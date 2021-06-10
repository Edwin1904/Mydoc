const mongoose = require('mongoose')
const Appointment = require('./appointment')

const doctorSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    // hours: {
    //     type: 
    // }
    Image: {
        type: Buffer,
        required: true
      },
      imageType: {
        type: String,
        required: true
      },

})

doctorSchema.pre('remove', function(next) {
    Appointment.find({ doctor: this.id }, (err, appointments) => {
        if (err) {
            next(err)
        } else if (appointments.length > 0) {
            next(new Error('This doctor has appointments still'))
        } else {
            next()
        }
    })
}).virtual('coverImagePath').get(function() {
    if (this.Image != null && this.imageType != null) {
      return `data:${this.imageType};charset=utf-8;base64,${this.Image.toString('base64')}`
    }
  })
module.exports = mongoose.model('Doctor', doctorSchema)