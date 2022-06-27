const Product = require('../models/product')
const product =require('../data/products.json')
const connectMongoDB = require('../config/database')
const dotenv = require('dotenv')

dotenv.config({path:'backend/config/config.env'})

connectMongoDB();

const bulkSeeder = async (req,res,next)=>{

    try{
        await Product.deleteMany()
        console.log('products deleted successfully')

        await Product.insertMany(product);
        console.log('products added successfully')

        process.exit()
    }
    catch(error){
     console.log(error.message)
     process.exit
    }
}

bulkSeeder();