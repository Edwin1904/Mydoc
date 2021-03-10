const mongoose = require('mongoose')
const Appointment = require('./appointment')

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
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
})

module.exports = mongoose.model('Doctor', doctorSchema)