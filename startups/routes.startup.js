const express = require('express')
const genres = require('../routes/apis/genres.api')
const customers = require('../routes/apis/customers.api')
const movies = require('../routes/apis/movies.api')
const rentals = require('../routes/apis/rentals.api')
const users = require('../routes/apis/users.api')
const auth = require('../routes/apis/auth.api')
const error = require('../middlewares/error.middleware')

module.exports = app => {
    //? Middlewares
    app.use(express.json())
    //? Routers 
    app.use('/api/genres/', genres)
    app.use('/api/customers/', customers)
    app.use('/api/movies/', movies)
    app.use('/api/rentals/', rentals)
    app.use('/api/users/', users)
    app.use('/api/auth/', auth)
    //? Middlewares to load after Route Handlers
    app.use(error)
}