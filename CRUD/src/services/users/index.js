const express = require("express")
const fs = require ("fs-extra")
const path = require ("path")
const uniqid = require("uniqid")


const router = express.Router()


const readFile = (fileName) => {
    const buffer = fs.readFileSync(path.join(__dirname, fileName))
    const bufferToString = buffer.toString()
          return JSON.parse(bufferToString)
}

const usersDB = readFile("users.json")
const pathJoin = path.join(__dirname, "users.json")


// 1. GET all:
router.get("/", (req, res) =>{
    
    
    res.status(200).send(usersDB)
    console.log("The users are:", usersDB)
})


// 2. GET only one
router.get("/:idu", (req, res) => {
    
    const theUser = usersDB.filter( user => user.ID === req.params.idu)
    res.send(usersDB)
    console.log("The user: ", theUser)
})

// 3. POST
router.post("/", (req, res) =>{
    
    const newUser = { ...req.body, ID: uniqid()}
    usersDB.push(newUser)
    

    fs.writeFileSync(pathJoin, JSON.stringify(usersDB))
    res.status(201).send(usersDB)
})
module.exports = router

// 4. PUT 
router.put("/:idu", (req, res) => {
    
const newDB = usersDB.filter((user) => user.ID !== req.params.idu)
    const modifiedUser = {...req.body, ID: req.params.idu}
    newDB.push(modifiedUser)
    fs.writeFileSync(pathJoin, JSON.stringify(newDB))
  
    res.status(201).send(modifiedUser)
  
  })

//5. DELETE

router.delete("/:idu", (req, res) => {
    
const filteredUsersArray = usersDB.filter(user => user.ID !== req.params.idu)
    fs.writeFileSync(pathJoin, JSON.stringify(filteredUsersArray))

    res.send(filteredUsersArray)
})