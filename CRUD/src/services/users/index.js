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




// 1. GET all:
router.get("/", (req, res) =>{
    const usersDB = readFile("users.json")
    
    res.send(usersDB)
})


// 2. GET only one
router.get("/:idu", (req, res) => {
    const usersDB = readFile("users.json")

    const theUser = usersDB.filter( user => user.ID === req.params.idu)
    res.send(theUser)
})

// 3. POST
router.post("/", (req, res) =>{
    const usersDB = readFile("users.json")
    const newUser = { ...req.body, ID: uniqid()}
    usersDB.push(newUser)

    fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(usersDB))
    res.send(usersDB)
})
module.exports = router

// 4. PUT 
router.put("/:idu", (req, res) => {
    const usersDB = readFile("users.json")
    const newDB = usersDB.filter((user) => user.ID !== req.params.idu)
    const modifiedUser = {...req.body, ID: req.params.idu}
    newDB.push(modifiedUser)
    fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(newDB))
  
    res.send(newDB)
  
  })

//5. DELETE

router.delete("/:idu", (req, res) => {
    const filteredUsersArray = usersDB.filter(user => user.id !== req.params.idu)
    fs.writeFileSync(path.join(__dirname, "users.json"), JSON.stringify(filteredUsersArray))

    res.send(filteredUsersArray)
})