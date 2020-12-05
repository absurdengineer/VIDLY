//Load Modules
const express = require('express')
const Joi = require('joi')
const genres = require('./routes/apis/genres.api')

// creating app
const app = express()

// Settings
const port = process.env.PORT || 8080

// Middlewares
app.use(express.json())

// Routers 
app.use('/api/genres/', genres)

// Listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(`Starting Server at http://127.0.0.1:${port}`)
})