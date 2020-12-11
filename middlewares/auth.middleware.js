const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send(`Access Denied : No Token Provided!!!`)
    try{
        const decoded = jwt.verify(token, config.get('JSONPRIVATEKEY'))
        req.user = decoded
        next()
    } catch({name}) {
        res.status(400).send(`${name} : Invalid Token!!!`)
    }
}