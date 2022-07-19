const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({

    userListId:{
      type:String
    },
    title: {
        type: String,
        required: [true, 'Please enter task name'],
        trim: true,
        maxLength: [200, 'task name cannot exceed 50 characters']
    },
    marked:{
        type: Boolean
    },
    dueDate: {
      type: Date,
      required: [true, 'Please enter task deadline'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
 
 })

module.exports = mongoose.model('Task', taskSchema);