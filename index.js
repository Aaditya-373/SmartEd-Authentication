const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const authRouter = require('./routes/authRoutes')
const userDataRouter = require('./routes/users')
dotenv.config()

const app = express()
//db
mongoose.connect(process.env.DB_CONNECT_URL, { useNewUrlParser: true }).then(() => {
    console.log("Connected to db!")
}).catch((error) => { console.log("Couldnt connect to db") }
)




app.use(express.json())
app.use('/api/users', authRouter)
app.use('/api/users', userDataRouter)

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc' }, process.env.CLIENT_SECRET)
//     console.log(token)
// }

// myFunction()



app.listen(3000, () => {
    console.log("Server running on port 3000")
})

//8ZsD1we8oViSWbMY