const express = require("express")
const server = express()
const http = require('http')
const cors = require('cors')
const env = require('dotenv')
const cookieParser = require('cookie-parser')
env.config({ path: './.env' })

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

// server.use(cookieParser())
// server.use("/api/v1/user", require("./router/userRoute"),require("./router/userRoute"),require("./router/userRoute"))

server.get("/",(req,res)=>{
    res.send("Tesing")
})

// server.use("/api",require("./router/userRoute"))

// server.("/api/", (req, res, next) => {
//     req.
//     res.json({
//         success: false,
//         message: "Hello"
//     })
// })


http.createServer(server).listen(8081, () => {
    console.log("server is on")
})