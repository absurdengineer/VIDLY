const Joi = require('joi')
const pool = require('../databases/db')

const rentalSchema = Joi.object({
    customer_id : Joi.number().required(),
    movie_id : Joi.number().required(),
    dateReturn : Joi.date().timestamp(),
    rentalFee : Joi.number().min(0)
})

const validateRental = rental => rentalSchema.validate(rental)

const checkRental = async id => {
    try {
        const {rows, rowCount} = await pool.query(`SELECT R.id, C.name as customerName ,M.title as movieTitle ,R.dateOut,R.dateReturn,R.rentalFee from rentals R JOIN customers C ON R.customer_id=C.id JOIN movies M ON R.movie_id=M.id where R.id=${id};`)
        if(!rowCount) return false
        return rows[0]
    } catch ({name, message}) {
        console.error(`${name} : ${message}`)
    }
}

module.exports.validateRental = validateRental
module.exports.checkRental = checkRental