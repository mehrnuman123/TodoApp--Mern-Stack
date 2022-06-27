const mongoose = require('mongoose')

const connectMongoDB = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con => {
        console.log(`app is connected with mongodb connected : ${con.connection.host}`)
    })
}

module.exports= connectMongoDB