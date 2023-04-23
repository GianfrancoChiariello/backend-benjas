const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')
const signUpSchema = require('../models/signUp')
const mongoose = require('mongoose')


const router = express.Router()


router.post('/gmailVerify', (req,res) => {

    const {clientId, credential} = req.body

    async function verify(clientId,credential) {

        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        })
        const payload = ticket.getPayload()


        //Crea el token con la respuesta de gmail
        const token = jwt.sign({
            email: payload.email,
            name: payload.name,
            id: payload.sub,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        }, 'secret')

        return {
            payload,
            token
        }
    }

    verify(clientId,credential)
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((error) => {
        res.status(401).json(error)
    })

})

router.post('/createAccount', async (req,res) => {

    try {
        
        const infoUser = signUpSchema(req?.body)

        if (!infoUser) return res.json({"Message": "Not send user data"}) 
    
    
                var id = new mongoose.Types.ObjectId();
    
                const createUser = {
                    email: infoUser.email,
                    password: infoUser.password,
                    id: id
                }

                const exist = await signUpSchema.find({"email": infoUser.email})
                if (exist.length > 0) return res.json({"Message": "Email en uso"}) 
    
    
                const finalley = signUpSchema(createUser)
                finalley.save()
                return res.json({"Message": "Create user sucess"})

    } catch (error) {
        return res.json(error)
    }

})

router.post('/signIn', async (req,res) => {

    const credentials = req?.body

    try {
        
        if (!credentials.email && !credentials.password) return res.json("Missing credentials")

        const search = await signUpSchema.find({email: credentials.email, password: credentials.password})
        if (search.length <= 0) return res.json("Credentials error")




        const token = jwt.sign({
                email: credentials.email,
                password: credentials.password,
                id: search[0].id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        }, 'secret')


        //Header
/*         return res.cookie('auth', credentials, {
            domain: 'localhost',
            path: '/',
            expires: new Date(Date.now + 900000)
        }) */


        return res.json({
            "message": "successful login",
            "token" : token
        })



    } catch (error) {
        return res.json(error)
    }

})






module.exports = router