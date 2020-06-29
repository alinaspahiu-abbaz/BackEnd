const path = require("path")
const {readDB, writeDB} = require('./utilities')
const { write } = require("fs")

const productsPath = path.join(__dirname, "../data/products.json")
const revPath = path.join(__dirname, "../data/rev.json")

module.exports = {
    getProducts: async() => readDB(productsPath),
    writeProducts: async(data) => writeDB(productsPath, data),

    getRev: async() => readDB(revPath),
    writeRev: async()=> write(revPath, data)
}