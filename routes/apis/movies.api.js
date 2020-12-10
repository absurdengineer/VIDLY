Mconst express = require('express')
const pool = require('../../databases/db')
const { validateMovie, checkMovie } = require('../../models/movie.model')

const router = express.Router()

router.get('/',async (req, res) => {
    try{
        const {rowCount, rows} = await pool.query(`SELECT M.id,M.title,G.name as genre ,M.numberinstock,M.dailyrentalrate from movies as M JOIN genres as G ON M.genre_id=G.id;`)
        if(!rowCount) return res.status(200).send("There is no Data in this API.")
        return res.status(200).json(rows)
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})
router.get('/:id',async (req, res) => {
    try{
        const movie = await checkMovie(parseInt(req.params.id))
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
        return res.status(200).json(movie)
    } catch({name, message}){
        console.error(`${name} : ${message}`)
    }
})
router.post('/', async (req, res) => {
    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send(`${error.name} : ${error.message}`)  
    const {title, genre_id, numberinstock, dailyrentalrate} = req.body
    try {
        const {rows} = await pool.query(`INSERT INTO movies VALUES(DEFAULT,'${title}','${genre_id}','${numberinstock}','${dailyrentalrate}') RETURNING *`)
        return res.status(200).json(rows[0])
    } catch ({name, message}) {
        return res.status(400).send(`${name} : ${message}`)
    }
})
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const movie = await checkMovie(id)
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send(`${error.name} : ${error.message}`)  
    const {title, genre_id, numberinstock, dailyrentalrate} = req.body
    try {
        const {rows} = await pool.query(`UPDATE movies SET title='${title}', genre_id='${genre_id}', numberinstock='${numberinstock}', dailyrentalrate='${dailyrentalrate}' WHERE id='${id}' RETURNING *`)
        return res.status(200).json(rows[0])
    } catch ({name, message}) {
        return res.status(400).send(`${name} : ${message}`)
    }
})
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const movie = await checkMovie(id)
        if(!movie) return res.status(404).send("Invalid Id : There is no movie with the provided Id...")
    try {
        const {rows} = await pool.query(`DELETE FROM movies WHERE id='${id}' RETURNING *`)
        return res.status(200).json(rows[0])
    } catch ({name, message}) {
        return res.status(400).send(`${name} : ${message}`)
    }
})

module.exports = router