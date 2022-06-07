const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labSchema = Schema({
    labname: {
        type: String,
        required: true,
		trim:true
    },
    addr_filter: {
        type: String,
        required: false,
        trim: true
    },
    addr: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
