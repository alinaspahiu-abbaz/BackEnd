const express = require("express")
const uniqid = require("uniqid")
const path = require("path")
const{check, validationResult, sanitizeBody} = require("express-validator")
const {getProducts, writeProducts, getRev} = require("../../lib")

const productsRouter = express.Router()

const productsFolder = path.join(__dirname, "../../data/products.json")
// 1. GET all:
productsRouter.get("/", async(req, res, next) => {
     try{
         //const products = await getProducts()
         const products = await getProducts(productsFolder)
         res.send({numberOfItem: products.length, products})
         if(products.length > 0){
           
            console.log(products.length)
         } else if(!products){
                            res.status(404).send("No such a directory here!")
                          } else { res.status(404).send("No product found!")}
         
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

        if(productFound) {
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
        const err = new Error("Generic Error Happend!")
        next(err)
    }
})

// get the full list of reviews, and filter them by productID
productsRouter.get("/:id/reviews", async(req, res, next) =>{
try{ // get reviews
     const reviews = await getRev()
     // filter reviews
     const filteredReviewsByProductID = reviews.filter(rev => rev.productId === req.params.id)
    // ⇩⇩⇩ nxjerr ID e produktit qe ka reviewa. Nese nji produkt ka 3 reviewa, e nxjerr 3 here ate id te produktit.
    //const filteredReviewsByProductID = reviews.filter(rev => {console.log(rev.productId )})
  
     
     // send reviwes
     res.send(filteredReviewsByProductID)
    }
    catch(error) {
        console.log(error)
        const err = new Error("Generic Error Happend!")
        next(err)
    }
})

module.exports = productsRouter