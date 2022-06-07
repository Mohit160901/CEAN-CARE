const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    firstname: {
        type: String,
        required: true,
		trim:true
    },
    lastname: {
        type: String,
        required: true,
		trim:true
    },
    dob:{
        type: String,
        required: true,
        trim:true
    },
    gender:{
        type: String,
        required: true,
        trim:true
    },
	email: {
		type: String,
		unique: true,
		trim:true
	},
    phoneno: {
		type: String,
		unique: true,
		trim:true
	},
    username: {
		type: String,
		unique: true,
		trim:true
	},
    password: {
		type: String,
		unique: true,
		trim:true
	}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
