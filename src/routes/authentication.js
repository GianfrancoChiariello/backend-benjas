const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')


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






module.exports = router