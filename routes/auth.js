const router = require('express').Router()
const User = require('../model/User')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//user details validation
const registerValidationSchema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(7).required()

});

const loginValidationSchema = Joi.object({
    usernameOrEmail: Joi.alternatives().try(Joi.string().min(6).required(), Joi.string().min(6).email().required()),
    password: Joi.string().min(7).required()
})

router.post('/register', async (req, res) => {
    //validate user details
    const { error } = registerValidationSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //email already exists
    const emailExists = await User.findOne({ email: req.body.email })
    const usernameExists = await User.findOne({ username: req.body.username })
    if (emailExists) {
        return res.status(400).send('Email already exists')
    }
    if (usernameExists) {
        return res.status(400).send('Username already exists')
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //saving a user to the database
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const newUser = await user.save();
        res.send('New user created with id' + newUser.id)

    }
    catch (error) {
        res.status(400).send(err);

    }
})

router.post('/login', async (req, res) => {
    //validation
    const { error } = loginValidationSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    // check if user exists
    const user = await User.findOne({
        $or: [
            { username: req.body.usernameOrEmail },
            { email: req.body.usernameOrEmail }
        ]
    });
    if (!user) {
        return res.status(400).send('Invalid username or email')
    }
    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isCorrectPassword) {
        return res.status(400).send('Incorrect password')
    }
    
    const token = jwt.sign({ _id: user.id }, process.env.CLIENT_SECRET)
    res.header('auth_token', token).send(token)
    // res.status(200).send('Successfully Logged in!')
    


})

module.exports = router;