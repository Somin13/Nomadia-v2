const express = require("express");
const session = require("express-session")

const userRouter = require("./routeur/userRouter")

const app = express()

app.use(express.static('./public'))
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static('uploads'))

require("dotenv").config()
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use(userRouter)


app.listen(process.env.NODE_PORT,() => {
    console.log(`Ecoute sur le port ${process.env.NODE_PORT}`)
})