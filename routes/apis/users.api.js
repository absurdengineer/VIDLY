const _ = require('lodash')
const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('../../databases/db')
const {validateuser, checkUser} = require('../../models/user.model')

const router = express.Router()

router.post("/", async (req,res) => {
    const {error} = validateuser(req.body)
    if(error) return res.status(400).send(`${error.name} : ${error.message}`)
    const {name, email, password} = req.body
    const user = await checkUser(email)
    if(!user) return res.status(400).send(`Already Registered : User with the email : ${email} already exists.`) 
    try{
        const salt = await bcrypt.genSalt(11)
        const hashedPassword = await bcrypt.hash(password, salt)
        const {rows} = await pool.query(`INSERT INTO users VALUES(DEFAULT, '${name}', '${email}','${hashedPassword}') RETURNING *`)
        return res.status(200).json(_.pick(rows[0],['name', 'email']))
    } catch({name,message}){
        console.error(`${name} : ${message}`)
    }
})

module.exports = router