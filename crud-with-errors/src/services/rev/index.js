const express = require("express")
const {check, validationResult,sanitizeBody} = require("express-validator")
const uniqid = require("uniqid")

const {getRev, writeRev, getProducts} = require("../../lib/index")
// we get the getProducts, to get the products



const reviewsRouter = express.Router()

//-------------
// 1. GET all:
//http://localhost:3031/reviews
reviewsRouter.get("/", async(req, res, next) =>{
    try{
        const reviews = await getRev()
        if(reviews.length > 0){
           res.status(200).send(reviews)
           console.log(reviews.length)
        } else if(!reviews){
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

//--------------------
// 2. GET only one:
// http://localhost:3031/reviews/4ynngcpckciyjixj
reviewsRouter.get("/:rid", async(req, res, next) =>{
    try{
        const reviews = await getRev()
        const review = reviews.find(rev => rev.id === req.params.rid)

     if(review){
         res.send(review)
         console.log(review)
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

//----------------
// POST:
reviewsRouter.post("/", 
[
    check("rate").exists().withMessage("Rate is missing").isNumeric().withMessage("Must be a number"),
    check("comment").exists().withMessage("Comment is missing!"),
    check("productId").exists().withMessage("Product ID is missing!"),
],
async(req, res, next) =>{

    const validationErrors = validationResult(req)

        if(!validationErrors.isEmpty()) {
            const error = new Error()
            error.httpStatusCode = 400
            error.message = validationErrors
            next(error)
        } else {
           const  products = await getProducts()
           const productFound = products.find(prod => prod.id === req.body.productId)
        
        if(productFound){
           const newReview = {
               ...req.body,
              id:uniqid(),
               createdAt: new Date(),
               updatedAt: new Date()
           }

           const reviews = await getRev()
           reviews.push(newReview)
           await writeRev(reviews)
           res.send(newReview)
           console.log(newReview)
        }else{
            const error = new Error("Procudt ID is wrong!")
            error.httpStatusCode = 400
            next(err)
        }
    }
})

//------------------
reviewsRouter.put("/:id", async(req, res, next) =>{

    try{
          const products = await getProducts()
          const productFound = products.find(prod =>prod.id === req.params.productId)

        if(productFound) 
          {
            const reviews = await getRev()
            const reviewsFound = reviews.find((rev => rev.id === req.params.id))
              if(reviewsFound) 
                {
                 const position = reviews.indexOf(reviewsFound)
                 const body = req.body.productId
                 delete body.createdAt
                 delete body.id
                 delete body.updatedAt
                 const updatedReview = {...reviewsFound,...req.body}
                 reviews[position] = updatedReview
                 await writeRev(reviews)
                 res.send(updatedReview)
                } else {
                         const err = new Error(`Review with id ${req.params.id} not found`)
                         err.httpStatusCode = 404
                         console.log(error)
                         next(err)
                       } 
           }else{
                  const error = new Error ("Product id is wrong!")
                  error.httpStatusCode = 404
                  next(error)
                  console.log(error)
                }
       } catch (error){
                        console.log(error)
                        const err = new Error("Generic error!")
                        next(err)
                      }
})

reviewsRouter.delete("/:rid", async(req, res, next) =>{
    try{
        const reviews = await getRev()
        const reviewFound = reviews.find(rev => rev.id === req.params.rid)

        if(reviewFound){
            const filteredReviews = reviews.filter(rev => rev.id !== req.params.rid)
            await writeRev(filteredReviews)
            res.send("Deleted!")
            
        } else {
            const error = new Error ("Review not found")
            error.httpStatusCode = 404
            console.log(error)
            next(error)
        }
    } catch(error) {
        console.log(error)
        const err = new Error("Generic error Happened!")
        next(err)
    }
})



module.exports = reviewsRouter