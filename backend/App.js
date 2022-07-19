const express = require("express");
const app = express();

const bodyParser = require('body-parser')


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// import routes
const list=require('./routes/list');
const task = require('./routes/task');


app.use('/api/v1',list) 
app.use('/api/v1/',task)

module.exports = app