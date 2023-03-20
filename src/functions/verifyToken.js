const verifyToken = async (token) => {
    const jwt = require('jsonwebtoken') 

    try {
        const data = jwt.verify(token, 'secret')
        return data
    } catch (e) {
        return e
    }
}

module.exports = verifyToken