const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./services/users")


const server = express()

const port = process.env.PORT || 5003

server.use(express.json())

server.use("/users", usersRouter)

console.log(listEndpoints(server))

server.listen(port, () => { console.log(`Server on port: ${port}`) })