const express = require('express')
const { OAuth2Client } = require('google-auth-library');


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
        const userid = payload['sub']

        return {
            payload,
            userid
        }
    }

    verify(clientId,credential).then((data) => {
        res.status(200).json(data)
    })

})


module.exports = router