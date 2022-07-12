const express = require("express");
const app = express();

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/errors')
const cors = require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
// import routes
const car=require('./routes/car');
const auth= require('./routes/auth');

app.use('/api/v1',car) 
app.use('/api/v1',auth) 

// configuring cloudinary API for images  => commentign for now , it was creating issues in the app
{/**
app.use(fileUpload())
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    secret_key:process.env.CLOUDINARY_API_SECRET
})

*/}


// middleware to handle errors
app.use(errorMiddleware);
module.exports = app