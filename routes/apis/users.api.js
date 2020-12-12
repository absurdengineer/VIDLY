const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcrypt')
const auth = require('../../middlewares/auth.middleware')
const asyncMiddleware = require('../../middlewares/async.middleware')
const pool = require('../../databases/db')
const {validateuser, checkUser} = require('../../models/user.model')

const router = express.Router()

//? No need to implement Log out Feature here because we're not storing the Auth Token 
//? anywhere in the server. 
//? To Log Out simply delete the token from header via client application and the user 
//? will be Logged Out.
router.get('/me', auth, (req, res) => {
    res.status(200).send(_.pick(req.user, ['name','email','isadmin']))
})
router.post("/", asyncMiddleware(async (req,res, next) => {
        const {error} = validateuser(req.body)
        if(error) return res.status(400).send(`${error.name} : ${error.message}`)
        const {name, email, password} = req.body
        const user = await checkUser(email)
        if(user) return res.status(400).send(`Already Registered : User with the email : ${email} already exists.`) 
        const salt = await bcrypt.genSalt(11)
        const hashedPassword = await bcrypt.hash(password, salt)
        const {rows} = await pool.query(`INSERT INTO users VALUES(DEFAULT, '${name}', '${email}','${hashedPassword}', DEFAULT) RETURNING *`)
        const token = jwt.sign(_.pick(rows[0],['id','name','email','isadmin']), config.get('JSONPRIVATEKEY'))
        //* Sending JWT to user in Header after successful Registration.
        //* use x- as pefix for any custom header 
        return res.status(200).header('x-auth-token',token).json(_.pick(rows[0],['name', 'email', 'isAdmin']))
    })
)

module.exports = router