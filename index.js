//Load Modules
const express = require('express')
const genres = require('./routes/apis/genres.api')
const customers = require('./routes/apis/customers.api')
const movies = require('./routes/apis/movies.api')
const rentals = require('./routes/apis/rentals.api')
const users = require('./routes/apis/users.api')
const auth = require('./routes/apis/auth.api')

// creating app
const app = express()

// Settings
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Routers 
app.use('/api/genres/', genres)
app.use('/api/customers/', customers)
app.use('/api/movies/', movies)
app.use('/api/rentals/', rentals)
app.use('/api/users/', users)
app.use('/api/auth/', auth)

// Listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(`Starting Server at http://127.0.0.1:${port}/`)
})