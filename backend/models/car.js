const mongoose = require('mongoose')
const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter car name'],
        trim: true,
        maxLength: [100, 'car name cannot exceed 100 characters']
    },
    model: {
        type: Number,
        required: [true, 'Please enter car model'],
        maxLength: [5, 'car name cannot exceed 5 characters'],
    },
    resgistrationNumber: {
        type: String,
        required: [true, 'Please enter car registration number'],
    },
    make: {
        type: String,
        required: [true, 'Please enter car company'],
    },
    color: {
        type: String,
        required: [true, 'Please enter car color'],
    },
    category: {
        type: String,
        required: [false, 'Please select category for this car'],
        enum: {
            values: [
                'car',
                'SUV',
                'Hatchback'
            ],
            message: 'Please select correct category for car'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
 
 })

module.exports = mongoose.model('Car', carSchema);