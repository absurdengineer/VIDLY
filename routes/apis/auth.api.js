const _ = require('lodash')
const Joi = require('joi')
const express = require('express')
const bcrypt = require('bcrypt')
const {checkUser} = require('../../models/user.model')

const router = express.Router()

const userSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).max(255).required()
})

const validate = (user) => userSchema.validate(user)

router.post("/", async (req,res) => {
    try{
        const {error} = validate(req.body)
        if(error) return res.status(400).send(`${error.name} : ${error.message}`)
        const {email, password} = req.body
        const user = await checkUser(email)
        if(!user) return res.status(400).send(`Authentication Error : Invalid Email or Password...`) 
        const isValid = await bcrypt.compare(password,user.password)
        if(!isValid) return res.status(400).send('Authentication Error : Invalid Email or Password')
        return res.status(200).json(_.pick(user,['name','email']))
    } catch({name,message}){
        console.error(`${name} : ${message}`)
    }
})

module.exports = router