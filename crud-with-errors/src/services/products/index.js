const express = require("express")
const uniqid = require("uniqid")
const{check, validationResult, sanitizeBody} = require("express-validator")
const {getProducts, writeProducts} = require("../../lib")

const productsRouter = express.Router()

// 1. GET all:
productsRouter.get("/", async(req, res, next) => {
     try{
          const products = await getProducts()
          res.send(products)
          console.log(products)
        } 

    catch(error) 
        {
           console.log(error)
           const err = new Error("Generic Error Happened!")
           next(err)
        }
   })


// 2. GET only one:
productsRouter.get("/:pid", async(req, res, next) => {
    try{
        const products = await getProducts()
        const product = products.find(prod => prod.id === req.params.pid)

     if(product){
         res.send(product)
     } else {
         const err = new Error()
         err.httpStatusCode = 404
         next(err)
     }
    } catch(error){
        console.log(error)
        const err = new Error("Generic error Happend!")
        next(err)
    }
})

// 3. POST:
productsRouter.post("/", 
    [
        check("name").isLength({min: 3}).withMessage("Too short"),
        check("category").exists().withMessage("Category is missing!"),
        check("description").isLength({min:10, max:30}).withMessage("Description must be beteww 10-30 characters."),
        check("price").isNumeric().withMessage("Must be a number!"),
        sanitizeBody("price").toFloat()
    ],
    async(req, res, next) => {

        const validationErrors = validationResult(req)

        if(!validationErrors.isEmpty()) {
            const error = new Error()
            error.httpStatusCode = 400
            error.message = validationErrors
            next(error)
        } else {
            try{
                const newProduct = {
                    ...req.body,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id: uniqid()
                }
            const products = await getProducts()
            products.push(newProduct)
            await writeProducts(products)
            res.send(newProduct)
            }
            catch(error){
                console.log(error)
                const err = new Error("Generic Error!")
                next(err)
            }
        }
   
})

// 4. PUT
productsRouter.put("/:pid", async(req, res, next) => {
    try{
        const products = await getProducts()

        const productFound = products.find(prod =>prod.id === req.params.pid)

        if(productsRouter) {
            const position = products.indexOf(productFound)
            const body = req.body
            delete body.createdAt
            delete body.id
            delete body.updatedAt


            const updateProduct = {...productFound,...req.body}
            products[position] = updateProduct
            await writeProducts(products)
            res.send(updateProduct)
        } else {
            const err = new Error ()
            err.httpStatusCode = 404
            next(err)

        }
    } catch (error){
        console.log(error)
        const err = new Error("Generic error!")
        next(err)
    }
})

// 5. DELETE:
productsRouter.delete("/:pid", async(req, res, next) => {
    try{
        const products = await getProducts()
        const productFound = products.find(prod => prod.id === req.params.pid)

        if(!productFound){
            const error = new Error ("Product not Found!")
            error.httpStatusCode = 404
            console.log(error)
            next(error)
        } else {
            const filteredProducts = products.filter(prod => prod.id !== req.params.pid)
            await writeProducts(filteredProducts)
            res.send("Deleted!")
        }
    } catch(error) {
        console.log(error)
        next(err)
    }
})

module.exports = productsRouter