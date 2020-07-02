

const express = require("express")
const router = require("./index")

const server = express()

server.use("/upload", router)

server.listen(3005, () => {
    console.log("Port - 3005")
})