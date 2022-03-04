const mongoose = require('mongoose')
const {Schema } = mongoose
const newSchema =Schema({
    name:String,
    last:String,
    buy:String,
    sell:String,
    volume:String,
    base_unit:String
})

module.exports = new mongoose.model('Crypto', newSchema)