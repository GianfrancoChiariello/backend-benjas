const verifyToken = async (token,res) => {
    const jwt = require('jsonwebtoken') 

    try {
        const data = await jwt.verify(token, 'secret')
        if (!data?.id || !data?.email) {
            return {data, status: false}
        }
        return {data, status: true}
    } catch (e) {
        return e
    }
}

const middlewareVerify = async (req,res,next) => {
    //Verify token
    if ( !req?.headers.token ) return res.json("Token missing")
    const status = await verifyToken(req?.headers.token)
    if (status.status !== true) return res.json("Invalid structure token")
    res.locals.id = status.data.id
    next() //Sigue al siguiente middleware
}

module.exports = {verifyToken,middlewareVerify}