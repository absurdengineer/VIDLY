module.exports = (req, res, next) => {
    if(!req.user.isadmin) return res.status(403).send(`Access Denied : You are not authorized to access this resource.`)
    next()
}   