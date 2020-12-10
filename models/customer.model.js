const Joi = require('joi')
const pool = require('../databases/db')

const customerSchema = Joi.object({
    name : Joi.string().min(2).max(255).required(),
    phone : Joi.number().min(6000000000).max(9999999999).required(),
    isgold : Joi.boolean().required(),
})
const checkCustomer = async id => {
    try{
        const result = await pool.query(`SELECT * FROM customers WHERE id=${id}`)
        if(result.rowCount===0) return false
        return result.rows[0]
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
}
const validateCustomer = customer => customerSchema.validate(customer)

module.exports.customerSchema = customerSchema
module.exports.checkCustomer = checkCustomer
module.exports.validateCustomer = validateCustomer