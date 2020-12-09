const express = require('express')
const Joi = require('joi')
const pool = require('../../databases/db')

router = express.Router()

const genreSchema = Joi.object({
    name : Joi.string().min(3).max(30).required()
})
const validateGenre = genre => {
    return genreSchema.validate(genre)
}

router.get("/", async (req,res) => {
    try{
        const result = await pool.query('SELECT *  FROM genres')
        if(result.rowCount === 0)
            return res.status(200).send("There is no Data in this API.")
        return res.status(200).json(result.rows)
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})
router.get("/:id", async (req,res) => {
    const id = parseInt(req.params.id)
    try{
        const result = await pool.query(`SELECT *  FROM genres WHERE id=${id}`)
        if(result.rowCount === 0)
            return res.status(404).send("Invalid Id : There is no genre with the provided Id.")
        return res.status(200).json(result.rows[0])
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})
router.post("/", async (req,res) => {
    const {error} = validateGenre(req.body)
    if(error) return res.status(400).send(error.message)
    const {name} = req.body
    try{
        const result = await pool.query(`INSERT INTO genres VALUES(DEFAULT, '${name}') RETURNING *`)
        return res.status(200).send(result.rows[0])
    } catch({name,message}){
        console.error(`${name} : ${message}`)
    }
})
router.put("/:id", async (req,res) => {
    const id = parseInt(req.params.id)
    let result = await pool.query(`SELECT *  FROM genres WHERE id=${id}`)
    if(result.rowCount === 0)
        return res.status(404).send("Invalid Id : There is no genre with the provided Id.")
    const {error} = validateGenre(req.body)
    if(error) return res.status(400).send(error.message)
    const {name} = req.body
    try{
        result = await pool.query(`UPDATE genres SET name='${name}' WHERE id=${id} RETURNING *`)
        return res.status(200).json(result.rows[0])
    } catch({name,message}){
        console.error(`${name} : ${message}`)
    }
})
router.delete("/:id", async (req,res) => {
    const id = parseInt(req.params.id)
    let result = await pool.query(`SELECT *  FROM genres WHERE id=${id}`)
    if(result.rowCount === 0)
        return res.status(404).send("Invalid Id : Genre with the provided ID doesn't exists. ")
    try{
        result = await pool.query(`DELETE FROM genres WHERE id=${id} RETURNING *`)
        return res.status(200).json(result.rows[0])
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})

module.exports = router