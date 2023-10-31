const jwt = require('jsonwebtoken')
const User = require('../models/User')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const jwtkey = process.env.CLIENT_SECRET
dotenv.config()
const auth = async (req, res, next) => {
    try {
        if (!req.header('Authorization')) {
            return res.status(401).send({ error: "you must be logged in" })
        }
        const token = req.header('Authorization').replace('Bearer ', '')
        jwt.verify(token, process.env.CLIENT_SECRET, async (error, payload) => {
            if (err) {
                return res.status(401).send({ error: 'you must be logged in' })

            }
            const { userId } = payload;
            const user = await User.findById(userId)
            req.user = user
            next()

        })



        next()


    }
    catch (e) {
        res.status(401).send({ error: 'User not authenticated' })

    }

}



module.exports = auth