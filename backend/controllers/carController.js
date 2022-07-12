const Car = require('../models/car')
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

// create new car  => api/v1/car/new
exports.newCar =catchAsyncErrors( async (req,res, next)=>{
    req.body.user = req.user.id;
const car = await Car.create(req.body);
 res.status(201).json({
     success:true,
     message: 'car created successfully',
     car
 })
})

// get all cars from the database
    exports.getCars = catchAsyncErrors( async (req,res,next)=>{
        const resPerPage = 4;
        const carsCount = await Car.countDocuments();

    const apiFeatures = new APIFeatures(Car.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    
    let cars = await apiFeatures.query;
    let filteredCarsCount = cars.length;

    apiFeatures.pagination(resPerPage)
    

    res.status(201).json({
        success:true,
        carsCount,
        resPerPage,
        filteredCarsCount,
        cars
    })
    })

    // get all cars for Admin from the database  :> /api/v1/admin/cars
    exports.getAdminCarsCount = catchAsyncErrors( async (req,res,next)=>{

        const cars = await Car.find();

    res.status(201).json({
        success:true,
        cars
    })
    })
// get single car from the database /api/v1/car/:id         :- params are the parametters of the id
exports.getSingleCar=async(req,res,next )=>{
const car = await Car.findById(req.params.id)
console.log(car,'car is working')
if (!car) {
    res.status(404).json({
        success:false,
        message:'car not found in the database'
    })
}
res.status(201).json({
    success:true,
    message: 'Here is the car',
    car
})
}

// admin update car /api/v1/car/:id :- params are the parametters for the id of that car


exports.updateSingleCar = async(req,res,next)=>{

    var car = await Car.findById(req.params.id)

    if(!car){
        return next( new ErrorHandler('car Not found', 404))
    }
    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new :true,
        runValidators:true,
        useFindAndModify: false
       
    })

    res.status(200).json({
        success:true,
        message:`car specifications updated successfully`,
        car
    })

}

// admin delete prouct by id  /api/v1/admin/delete/product/:id

exports.deleteSingleCar = async(req,res,next) => {

 var car = await Car.findById(req.params.id)

 if(!car){
     return next(new ErrorHandler('car not Found', 404))
 }

   await car.remove()
    res.status(201).json({
     success:true,
     message:'car deleted succesffully',
     car
 })
}

