const Joi = require('joi')
const pool = require('../databases/db')
const userSchema = Joi.object({
    name : Joi.string().min(2).max(255).required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).max(255).required()
})
const checkUser = async email => {
    try {
        const { rowCount } = await pool.query(`SELECT * FROM users where email='${email}';`)
        if(!rowCount) return true
        return false
    } catch ({name, message}) {
        console.error(`${name} : ${message}`)
    }
}

const validateuser = (user) => userSchema.validate(user)

module.exports.validateuser = validateuser
module.exports.checkUser = checkUser
