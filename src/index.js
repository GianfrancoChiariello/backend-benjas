const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./routes/user')

const app = express()
const port = process.env.PORT || 9000
const api_key = process.env.MONGODB_KEY


//middleware
app.use(express.json())
app.use('/api', userRoutes)



//Routes
app.get('/', (req,res) => {
    res.send('Welcome to my API')
})



//MongoDB connection
mongoose.connect(api_key)
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch((error) => {
        console.log(error)
    })
//



app.listen(port, () => {
    console.log("Servidor funcional")
})