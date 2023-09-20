const mongoose = require('mongoose')

const connect = () => {
    return mongoose.connect(process.env.MONGO_URI)
}

module.exports = connect