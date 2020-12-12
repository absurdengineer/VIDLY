//?       exception, request, response, next
module.exports = (ex, req, res, next) => {
    console.error(`${ex.name} : ${ex.message}`)
    res.status(500).send('Something Went Wrong!!!')
}