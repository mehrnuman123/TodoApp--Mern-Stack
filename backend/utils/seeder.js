const Product=require('../models/product')
const dotenv = require('dotenv')
const connectDataBase = require('../config/database')

const product = require('../data/products.json')

// setting dotenv file
dotenv.config({path: 'backend/config/config.env'})

connectDataBase();

const seedProducts =async () => {
  try {
     await Product.deleteMany();
     console.log('all products deleted successfully')
     
     await Product.insertMany(product);
     console.log('all products saved into database successfully')

     process.exit();
}
  catch(error){
      console.log(error.message);
      process.exit();
  }
}
seedProducts();
