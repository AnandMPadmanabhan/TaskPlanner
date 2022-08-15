const mongoose = require('mongoose')

const connectDB = (url)=>{
    return mongoose,mongoose.connect(url,
        {useNewUrlParser:true, useUnifiedTopology: true})
        .then(()=>console.log('connected to db'))
        .catch(error=>console.log('Error' + error))
}

module.exports = connectDB