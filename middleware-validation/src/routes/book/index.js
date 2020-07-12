const express = require("express")
const fs = require("fs")
const path = require("path")
const {resolveSoa} = require ("dns")

const getBooks = () => {
    const bookJsonPath = path.join(__dirname, "books.json")
    const bookBuffer = fs.readFileSync(bookJsonPath)
    const bookString = bookBuffer.toString()
    const books = JSON.parse(bookString)

    return books
}

const writeBooks = (books) => {
    const bookJsonPath = path.join(__dirname, "books.json")
    fs.writeFileSync(bookJsonPath, JSON.stringify(books))
}

const bookRouter = express.Router()

bookRouter.get("/:asin", (req, res) => {
    const books = getBooks()
    const book = books.find( b => b.asin === req.params.asin)

    if(book)
    res.send(book)
    else 
    res.status(404).send("Not found!")
})



bookRouter.get("/", (req, res) => {
    let books = getBooks()
    for (let p in req.body){
        books = books.filter(book => book[p].toLowerCase().indexOf(req.query[p].toLowerCase()) > -1)
    }
    res.send(books)
})

bookRouter.post("/", (req, res) => {
    const books = getBooks()
    books.push(req.body)
    writeBooks(books)

    res.status(201).send(req.body)
})

bookRouter.put("/:asin", (req, res) => {
    const books = getBooks()
    const index = books.map(x => x.asin).indexOf(req.params.asin)
    if(index === -1)
      return res.status(404).send("Not found!")
      else {
          books[index] = req.body
          writeBooks(books)
          res.send("PUT")
      }
})

bookRouter.delete("/:asin", (req, res) =>{
    const books = getBooks()
    const filtered = book.filter(books.asin !== req.params.asin)
    if(books.length === filtered.length)
      return res.status(404).send("Not found!")
    else {
        writeBooks(filtered)
        res.send("DELETE")
    }
})

module.exports = bookRouter;