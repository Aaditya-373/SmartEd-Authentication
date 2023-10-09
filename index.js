const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
dotenv.config()
//db
mongoose.connect(process.env.DB_CONNECT_URL).then(() => {
    console.log("Connected to db!")
}).catch((error) => { console.log("Couldnt connect to db") }
)


app.use(express.json())
app.use('/api/user', authRoute)









app.listen(3000, () => {
    console.log("Server running on port 3000")
})

//8ZsD1we8oViSWbMY