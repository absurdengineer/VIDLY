const express = require('express')
const auth = require('../../middlewares/auth.middleware')
const admin = require('../../middlewares/admin.middleware')
const pool = require('../../databases/db')
const { checkRental, validateRental } = require('../../models/rental.model')
const {checkCustomer} = require('../../models/customer.model')
const {checkMovie} = require('../../models/movie.model')
const router = express.Router()

router.get('/', [auth, admin], async (req, res) => {
    try {
        const {rows, rowCount} = await pool.query(`SELECT R.id, C.name as customerName ,M.title as movieTitle ,R.dateOut,R.dateReturn,R.rentalFee from rentals R JOIN customers C ON R.customer_id=C.id JOIN movies M ON R.movie_id=M.id ORDER BY R.dateOut DESC;`)
        if(!rowCount) return res.status(200).send(`There is no data in this API...`)
        return res.status(200).json(rows)
    } catch ({name, message}) {
        console.error(`${name} : ${message}`)
        res.status(500).send('Something Went Wrong!!!')
    }
})
router.get('/:id', auth, async (req, res) => {
    try {
        const rental = await checkRental(parseInt(req.params.id))
        if(!rental) return res.status(404).send(`Invalid Id : There is no Rental with the provided Id...`)
        return res.status(200).json(rental)
    } catch ({name, message}) {
        console.error(`${name} : ${message}`)
        res.status(500).send('Something Went Wrong!!!')
    }
})
router.post('/', auth, async (req, res) => {
    try {
        const {error} = validateRental(req.body)
        if(error) return res.status(400).send(`${error.name} : ${error.message}`)
        const {customer_id, movie_id} = req.body
        const movie = checkMovie(movie_id)
        if(!movie) return res.status(400).send(`Invalid Movie Id : There is no movie with the provided Id.`)
        const customer = checkCustomer(customer_id)
        if(!customer) return res.status(400).send(`Invalid Customer Id : There is no customer with the provided Id.`)
        const result = await pool.query(
            `BEGIN;
            INSERT INTO rentals (id, customer_id, movie_id, dateOut) VALUES (DEFAULT, ${customer_id}, ${movie_id}, DEFAULT) RETURNING *;
            UPDATE movies SET numberInStock= numberInStock-1 WHERE id=${movie_id};
            COMMIT;`
        )
        res.status(200).json(result[1].rows[0])
    } catch ({name, message}) {
        console.error(`${name} : ${message}`)
        res.status(500).send('Something Went Wrong!!!')
    }
})
module.exports = router