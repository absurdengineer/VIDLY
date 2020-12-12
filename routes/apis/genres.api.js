const express = require('express')
const auth = require('../../middlewares/auth.middleware')
const admin = require('../../middlewares/admin.middleware')
const pool = require('../../databases/db')
const {checkGenre, validateGenre} = require('../../models/genre.model')

const router = express.Router()

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
    try{
        const result = await checkGenre(parseInt(req.params.id))
        if(!result) return res.status(404).send("Invalid Id : There is no genre with the provided Id.")
        return res.status(200).json(result)
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})
router.post("/", auth, async (req,res) => {
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
router.put("/:id", auth, async (req,res) => {
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
router.delete("/:id", [auth, admin], async (req,res) => {
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