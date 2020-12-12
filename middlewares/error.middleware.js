const winston = require('winston')
//?       exception, request, response, next
module.exports = (ex, req, res, next) => {
    winston.error(ex.message, ex)
    res.status(500).send('Something Went Wrong!!!')
}