const Product = require('../models/product')
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

// create new products  => api/v1/product/new

exports.newProduct =catchAsyncErrors( async (req,res, next)=>{

req.body.user= req.user.id; 

const product = await Product.create(req.body);
 res.status(201).json({
     success:true,
     product
 })
})


// get all products from the database
    exports.getProducts = catchAsyncErrors( async (req,res,next)=>{

        const resPerPage = 4;
        const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    

    res.status(201).json({
        success:true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })
    })

// get single product from the database /api/v1/product/:id         :- params are the parametters of the id

exports.getSingleProduct=async(req,res,next )=>{
const product = await Product.findById(req.params.id)

if (!product) {
    res.status(404).json({
        success:false,
        message:'Product not found in the database'
    })
}
res.status(201).json({
    success:true,
    message: 'Here is the product',
    product
})
}

// admin update product  /api/v1/product/:id :- params are the parametters for the id of that product


exports.updateSingleProduct = async(req,res,next)=>{

    var product = await Product.findById(req.params.id)

    if(!product){
        return next( new ErrorHandler('Product Not found', 404))
    }
    

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new :true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        product
    })

}

// admin delete prouct by id  /api/v1/admin/delete/product/:id

exports.deleteSingleProduct = async(req,res,next) => {

 var product = await Product.findById(req.params.id)

 if(!product){
     return next(new ErrorHandler('Product not Found', 404))
 }

   await product.remove()
    res.status(201).json({
     success:true,
     message:'product deleted succesffully',
     product
 })
}


// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// get review from the database /api/v1/reviews         

exports.getProductReviews=async(req,res,next )=>{
    const product = await Product.findById(req.query.id)
    
    if (!product) {
        res.status(404).json({
            success:false,
            message:'Product not found in the database'
        })
    }
    res.status(201).json({
        success:true,
        message: 'Reviews',
        reviews:product.reviews
    })
    }

    // Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})