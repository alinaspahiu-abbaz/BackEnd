const express = require("express")
const path = require("path")
const listEndpoints = require("express-list-endpoints")
const productsRouter = require("./services/products")
const { notFoundHandler, badRequestHandler, genericErrorHandler} = require("./errorHandlers")

const server = express()
const port = process.env.PORT || 2020

// MidlleWares:
server.use(express.json())

// Routes:
server.use("/products", productsRouter)

// Error HAndlers
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
    console.log(`Hey guys! Server is running on port: ${port}`)
})