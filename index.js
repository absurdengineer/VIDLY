//? Load Modules
const express = require('express')
const cors = require('cors')
//? creating app
const app = express()
app.use(cors())
require('./startups/logging.startup')
require('./startups/routes.startup')(app)
require('./startups/configs.startup')

//? Settings
const port = process.env.PORT || 3000

//? Listener
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(`Starting Server at http://127.0.0.1:${port}/`)
})