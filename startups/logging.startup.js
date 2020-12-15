const winston = require('winston')
require('express-async-errors')

module.exports = () => {
    //? Loggers
    winston.add(winston.transports.File, {filename : 'logfile.log'})

    //? Handling uncaughtException
    process.on('uncaughtException', (ex) => {
        console.log(`Node got an Unhandled Exception.`)
        winston.error(ex.message,ex)
        process.exit(1)
    })

    //? throwing Exception to check 
    //! throw new Error(`Error Occured during startup!!!`)

    //? Handling unhandledRejection
    process.on('unhandledRejection', (ex) => {
        console.log(`Node got an Unhandled Rejection.`)
        winston.error(ex.message,ex)
        process.exit(1)
    })

    //? throwing unhandledRejection by leaving catch to check 
    //! p = Promise.reject(new Error(`Something Went Wrong Miserable!!!`))
    //! p.then(() => console.log(`Done`))
}