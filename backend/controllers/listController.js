const List = require('../models/list')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const task = require('../models/task');


// create new list  => api/v1/new/list
exports.newList =catchAsyncErrors( async (req,res, next)=>{
const list = await List.create(req.body);
 res.status(201).json({
     success:true,
     message: 'List created successfully',
     list
 })
})
// get all lists from the database  :> /api/v1/lists
exports.getAllList = catchAsyncErrors( async (req,res,next)=>{

    const lists = await List.find();

res.status(201).json({
    success:true,
    lists
})
})
//:- params are the parametters of the id
exports.getSingleList=async(req,res,next )=>{
const list = await List.findById(req.params.id)
if (!list) {
    res.status(404).json({
        success:false,
        message:'list not found in the database'
    })
}
res.status(201).json({
    success:true,
    message: 'Here is the list',
    list
})
}

 // update single list
exports.updateSingleList = async(req,res,next)=>{

    var list = await List.findById(req.params.id)

    if(!list){
        res.status(404).json({
            success:false,
            message:'list not found in the database'
        })
        
    }
    list = await List.findByIdAndUpdate(req.params.id, req.body, {
        new :true,
        runValidators:true,
        useFindAndModify: false
       
    })

    res.status(200).json({
        success:true,
        message:`list specifications updated successfully`,
        list
    })

}

// Delete list by id
exports.deleteSingleList = async(req,res,next) => {

 var list = await List.findById(req.params.id)

   await list.remove()
    res.status(201).json({
     success:true,
     message:'list deleted succesffully',
     list
 })
}

