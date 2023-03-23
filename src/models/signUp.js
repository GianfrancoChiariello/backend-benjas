const mongoose = require('mongoose')


const createAccount = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        }, 
        password: {
            type: String,
            required: true
        },
        id: {
            type: Object,
        }
    }
)

module.exports = mongoose.model('createAccount', createAccount)