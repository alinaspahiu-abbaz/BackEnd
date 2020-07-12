const express = require("express")
const {join} = require("path")
const listEndpoints = require("express-list-endpoints")
//const cors = require("cors")

const productsRouter = require("./services/products")
const reviewsRouter = require("./services/rev")
const routerImg = require("./services/files")

const { notFoundHandler,forbiddenHandler, 
    unauthorizedHandler, badRequestHandler, genericErrorHandler} = require("./errorHandlers")

const server = express()
const port = process.env.PORT || 2020

const publicFolderPath = join(__dirname, '../public')

// MidlleWares:
//server.use(cors())
server.use(express.static(publicFolderPath))
server.use(express.json())


// Routes:

server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)
server.use("/files", routerImg)


// Error HAndlers
server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)
server.use(forbiddenHandler)
server.use(unauthorizedHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
    console.log(`Hey guys! Server is running on port: ${port}`)
})