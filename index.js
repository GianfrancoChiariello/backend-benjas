const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const cors = require('cors');


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
                url: 'http://localhost:9000',
            },
            {
                url: 'https://backend-pink-omega.vercel.app/'
            }
        ]
    },
    apis : [
        `${path.join(__dirname, './src/routes/*.js')}`
    ]
}





//middleware
app.use(express.json())


//Config error al pegarle
app.options('/api/gmailVerify', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
  });


//Import all routes in the "routes" folder
fs.readdirSync('./src/routes').forEach((file) => {
    const route = require(`./src/routes/${file}`)
    app.use('/api', route)
})

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

app.use(cors({
    origin: ['http://localhost:3000']
  }));


app.listen(port, () => {
    console.log("Servidor funcional")
})