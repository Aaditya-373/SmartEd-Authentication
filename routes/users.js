const mongoose = require('mongoose')
const User = require('../models/User')
const router = require('express').Router()
const auth = require('../middleware/auth-middleware')


router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('getUsers/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send()
        }
        else {
            res.send(user)
        }
    }
    catch (e) {
        res.send(e)
    }
})

router.post('/logout', auth, async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
    } catch (e) {
        res.status(500).send()
    }

})

router.patch('/updateUsers/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password']
    const isValid = updates.every((update) => {
        allowedUpdates.includes(update)

    })
    if (!isValid) {
        return res.status(400).send({ error: 'Invalid put request' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }

    } catch (e) {
        res.status(400).send(e)

    }
})

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }
        res.send(user)

    }
    catch (e) {
        res.status(500).send(e)

    }
})



module.exports = router