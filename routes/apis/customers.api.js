const express = require('express')
const pool = require('../../databases/db')
const auth = require('../../middlewares/auth.middleware')
const admin = require('../../middlewares/admin.middleware')
const asyncMiddleware = require('../../middlewares/async.middleware')
const {checkCustomer, validateCustomer} = require('../../models/customer.model')
const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
        const result = await pool.query('SELECT * FROM customers ORDER BY id ASC')
        if(result.rowCount === 0) return res.status(200).send("There is no data in this API...")
        res.status(200).json(result.rows)
    })
)
router.get('/:id',asyncMiddleware(async (req, res) => {
        const result = await checkCustomer(parseInt(req.params.id))
        if(!result) return res.status(404).send("Invalid Id : There is no customer with the provided Id...")
        return res.status(200).json(result)
    })
)
//?        ( route, middleware, handler )
router.post('/', auth, asyncMiddleware(async (req, res) => {
        const {error} = validateCustomer(req.body)
        if(error) return res.status(400).send(error.message)
        const {name, phone, isgold} = req.body
        const {rows} = await pool.query(`INSERT INTO customers VALUES (DEFAULT, '${name}', '${phone}', '${isgold}') RETURNING *`)
        return res.status(200).json(rows)
    })
)
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
        const id = parseInt(req.params.id)
        let result = await checkCustomer(id)
        if(!resultconsole.error(`${name} : ${message}`)) return res.status(404).send("Invalid Id : There is no customer with the provided Id...")
        const {error} = validateCustomer(req.body)
        if(error) return res.status(400).send(error.message)
        const {name, phone, isgold} = req.body
        const {rows} = await pool.query(`UPDATE customers SET name='${name}', phone='${phone}', isGold='${isgold}' WHERE id=${id} RETURNING *`)
        return res.status(200).json(rows[0])
    })
)
// ?         [firstMiddlware, secondMiddleware]
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
        const id = parseInt(req.params.id)
        const result = await checkCustomer(id)
        if(!result) return res.status(404).send("Invalid Id : There is no customer with the provided Id...")
        const {rows} = await pool.query(`DELETE FROM customers WHERE id=${id} RETURNING *`)
        return res.status(200).json(rows[0])
    })
)

module.exports = router