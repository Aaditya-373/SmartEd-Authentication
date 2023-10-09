const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res.send('Access denied')
    }
    try {
        const verified = jwt.verify(token, process.env.CLIENT_SECRET)
        req.user = verified;
        next()
    } catch (e) {
        res.status(400).send('Invalid token')
    }
}

module.exports = auth 