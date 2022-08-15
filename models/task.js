const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    assignedTo:{
        type: String,
        required:true,
        trim:true
    },
    dueDate:{
        type: Date
    },
    status:{
        type:String,
        required: true,
        default: 'to-do'
    }
})
 module.exports= mongoose.model('task',taskSchema)
