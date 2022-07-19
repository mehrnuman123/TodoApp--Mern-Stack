const mongoose = require('mongoose')
const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter list name'],
        trim: true,
        maxLength: [100, 'list name cannot exceed 50 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
 
 })

module.exports = mongoose.model('List', listSchema);