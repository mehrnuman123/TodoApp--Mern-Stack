const Task = require('../models/task')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


// create new Task  => api/v1/new/Task
exports.newTask =catchAsyncErrors( async (req,res, next)=>{
const task = await Task.create(req.body);
 res.status(201).json({
     success:true,
     message: 'Task created successfully',
     task
 })
})
// get all Tasks from the database  :> /api/v1/Tasks
exports.getAllTask = catchAsyncErrors( async (req,res,next)=>{

    const tasks = await Task.find();

res.status(201).json({
    success:true,
    tasks
})
})
//:- params are the parametters of the id
exports.getSingleTask=async(req,res,next )=>{
    const task = await Task.findById(req.params.id)
    if (!task) {
        res.status(404).json({
            success:false,
            message:'task not found in the database'
        })
    }
    res.status(201).json({
        success:true,
        message: 'Here is the task',
        task
    })
    }
    

 // update single Task
exports.updateSingleTask = async(req,res,next)=>{

    var task = await Task.findById(req.params.id)

    if(!task){
        res.status(404).json({
            success:false,
            message:'task not found in the database'
        })
        
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new :true,
        runValidators:true,
        useFindAndModify: false
       
    })

    res.status(200).json({
        success:true,
        message:`Task specifications updated successfully`,
        task
    })

}

// Delete Task by id
exports.deleteSingleTask = async(req,res,next) => {

 var task = await Task.findById(req.params.id)

   await task.remove()
    res.status(201).json({
     success:true,
     message:'Task deleted succesffully',
     task
 })
}

// get all tasks by list id 
exports.getListTasks = async (req, res)=> {

   const tasks= await Task.find({userListId: req.params.id})

    res.status(202).json({
        success: true,
        message:'list tasks succesffully',
        tasks
    })

}