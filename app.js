const express = require('express')
const app= express()
const port = 3000


const connectDB= require('./db/connect')
app.use(express.static('./public'))
app.use(express.json())
const tasks = require('./routes/tasks')
require('dotenv').config()

app.use('/api/v1/tasks', tasks)

const start =async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`port is listening on ${port}`))
    }
    catch(error){
        console.log(error)
    }
    
}

start()