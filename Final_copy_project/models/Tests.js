const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = Schema({
    test_name: {
        type: String,
        required: true,
		trim:true
    }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
