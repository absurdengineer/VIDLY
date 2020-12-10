const Joi = require('joi')
const pool = require('../databases/db')

const genreSchema = Joi.object({
    name : Joi.string().min(3).max(30).required()
})
const validateGenre = genre => {
    return genreSchema.validate(genre)
}
const checkGenre = async id => {
    try{
        const result = await pool.query(`SELECT * FROM genres WHERE id=${id}`)
        if(result.rowCount===0) return false
        return result.rows[0]
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
}

module.exports.genreSchema = genreSchema
module.exports.validateGenre = validateGenre
module.exports.checkGenre = checkGenre
