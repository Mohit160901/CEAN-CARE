const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = Schema({
    name: {
        type: String,
        required: true,
		trim:true
    },
    speciality: {
        type: String,
        required: false,
        trim: true
    },
    qualifications: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
