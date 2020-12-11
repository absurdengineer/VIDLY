const bycrypt = require('bcrypt')

const run = async () => {
    const salt = await bycrypt.genSalt(11)
    console.log(salt)
    const pwd = await bycrypt.hash('1234', salt)
    console.log(pwd)
}
run()