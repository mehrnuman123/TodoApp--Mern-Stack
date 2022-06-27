const express = require("express");
const app = express();

const bodyParser = require('body-parser')
const errorMiddleware = require('./middleware/errors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));


// import all the routes
const products=require('./routes/product');
const auth = require('./routes/auth')
const order =require('./routes/order')


app.use('/api/v1',products) 
app.use('/api/v1',auth)
app.use('/api/v1',order)
// middleware to handle errors
app.use(errorMiddleware);
module.exports = app