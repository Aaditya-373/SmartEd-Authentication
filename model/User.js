mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 7
    },
    current: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('User', userSchema)