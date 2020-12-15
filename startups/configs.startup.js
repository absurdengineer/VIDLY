const config = require('config')

if(!config.get('JSONPRIVATEKEY')) {
    console.error('FATAL ERROR : JSONPRIVATEKEY is not defined!!!')
    process.exit(1)
}
