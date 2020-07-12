const express = require("express")
const cors = require ("cors")
const fs = require("fs")

const app = express() //new instance of express

app.use(cors())
app.use(express.json())

const myLogger = (req, res, next) => {
    
    fs.appendFileSync("log.txt", `\ndate: ${new Date()} - method: ${req.method} -> url:${req.originalUrl}`)
    next()
}


const bookRouter = require("./routes/book")

app.get("/hello",  async (req, res) => {
    //req will have all the information about the request
    //res will have all the information about the response

    //here we can have arbitrary code

    console.log("Something is happening!")
    res.status(200).send("HEllo World")
})

app.use("/books", myLogger, bookRouter)

app.listen(4000, () => console.log("Hey, the server is running on port 4000"))