const express = require('express')
const Joi = require('joi')

router = express.Router()

const genres = [
    {
        id : 1,
        name : "Action"
    },
    {
        id : 2,
        name : "Romantic"
    },
    {
        id : 3,
        name : "Adventure"
    },
    {
        id : 4,
        name : "Sci-fi"
    },
    {
        id : 5,
        name : "Fantasy"
    }
]

const validateGenre = genre => {
    const schema = Joi.object({
        name : Joi.string().min(3).max(30).required()
    })
    return schema.validate(genre)
}

const checkGenre = id => genres.find(genre => genre.id === parseInt(id))

router.get("/",(req,res) => {
    res.status(200).send(genres)
})

router.get("/:id",(req,res) => {
    const genre = checkGenre(req.params.id)
    if(!genre) return res.status(404).send("Genre with the povided ID doesn't exists.")
    return res.status(200).send(genre)
})

router.post("/",(req,res) => {
    const {error} = validateGenre(req.body)
    if(error) return res.status(400).send(error.message)
    genre = {
        id : genres.length + 1,
        name : req.body.name
    }
    genres.push(genre)
    return res.status(200).send(genre)
})

router.put("/:id",(req,res) => {
    const genre = checkGenre(req.params.id)
    if(!genre) return res.status(404).send("Genre with the povided ID doesn't exists. ")
    const {error} = validateGenre(req.body)
    if(error) return res.status(400).send(error.message)
    genre.name = req.body.name
    return res.status(200).send(genre)
})

router.delete("/:id",(req,res) => {
    const genre = checkGenre(req.params.id)
    if(!genre) return res.status(404).send("Genre with the provided ID doesn't exists. ") 
    genres.splice(genre.id - 1, 1)
    return res.status(200).send(genre)
})

module.exports = router