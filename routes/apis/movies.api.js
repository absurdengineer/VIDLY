const express = require('express')
const auth = require('../../middlewares/auth.middleware')
const admin = require('../../middlewares/admin.middleware')
const asyncMiddleware = require('../../middlewares/async.middleware')
const pool = require('../../databases/db')
const { validateMovie, checkMovie } = require('../../models/movie.model')
const { checkGenre } = require('../../models/genre.model')

const router = express.Router()

router.get('/', auth, asyncMiddleware(async (req, res) => {
        const {rowCount, rows} = await pool.query(`SELECT M.id,M.title,G.name as genre ,M.numberinstock,M.dailyrentalrate from movies as M JOIN genres as G ON M.genre_id=G.id;`)
        if(!rowCount) return res.status(200).send("There is no Data in this API.")
        return res.status(200).json(rows)
    })
)
router.get('/:id', auth, asyncMiddleware(async (req, res) => {
        const movie = await checkMovie(parseInt(req.params.id))
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
        return res.status(200).json(movie)
    })
)
router.post('/', auth, asyncMiddleware(async (req, res) => {
        let {error} = validateMovie(req.body)
        if(error) return res.status(400).send(`${error.name} : ${error.message}`)  
        const {title, genre_id, numberinstock, dailyrentalrate} = req.body
        const result = await checkGenre(req.body.genre_id)
        if(!result) return res.status(400).send(`Invalid Id : There is no genre with the provided Id...`)  
        const {rows} = await pool.query(`INSERT INTO movies VALUES(DEFAULT,'${title}','${genre_id}','${numberinstock}','${dailyrentalrate}') RETURNING *`)
        return res.status(200).json(rows[0])
    })
)
router.put('/:id', auth, asyncMiddleware(async (req, res, next) => {
        const id = parseInt(req.params.id)
        const {error} = validateMovie(req.body)
        if(error) return res.status(400).send(`${error.name} : ${error.message}`) 
        const movie = await checkMovie(id)
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
        const result = await checkGenre(req.body.genre_id)
        if(!result) return res.status(400).send(`Invalid Id : There is no genre with the provided Id...`)  
        const {title, genre_id, numberinstock, dailyrentalrate} = req.body
        const {rows} = await pool.query(`UPDATE movies SET title='${title}', genre_id='${genre_id}', numberinstock='${numberinstock}', dailyrentalrate='${dailyrentalrate}' WHERE id='${id}' RETURNING *`)
        return res.status(200).json(rows[0])
    })
)
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
        const id = parseInt(req.params.id)
        const movie = await checkMovie(id)
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
        const {rows} = await pool.query(`DELETE FROM movies WHERE id='${id}' RETURNING *`)
        return res.status(200).json(rows[0])
    })
)

module.exports = router
