const app =require('./App.js')
const dotenv= require("dotenv")
const connectDataBase= require('./config/database')

// configuring dotenv file herer
dotenv.config({path:"backend/config/config.env"})

connectDataBase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is listening on ${process.env.PORT} and in ${process.env.NODE_ENV} mode`)
})

// Hanlde unHandled Promise rejections
process.on('unhandledRejections', err=>{
    console.log(`Error: ${err.message}`)
    console.log('shutting down due to unhandled promise Rejections')
    server.close( ()=>{
    process.exit(1)
    })
})