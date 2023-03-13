const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./src/routes/user')
const path = require('path')


const app = express()
const port = process.env.PORT || 9000
const api_key = process.env.MONGODB_KEY



//Swagger config
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de usuarios',
            version: '1.0.0',
            description: 'API de usuarios',
        },
        servers: [
            {
                url: ['http://localhost:9000', 'https://backend-pink-omega.vercel.app'],
            }
        ]
    },
    apis : [
        `${path.join(__dirname, './src/routes/*.js')}`
    ]
}





//middleware
app.use(express.json())
app.use('/api', userRoutes)

//middleware for swagger
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(
    swaggerJsDoc(swaggerSpec)
))



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