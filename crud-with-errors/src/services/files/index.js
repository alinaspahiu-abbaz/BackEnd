const express = require("express")
const multer = require("multer")
const fs = require("fs-extra")
const {join} = require("path")
const { writeFile, createReadStream } = require("fs-extra")


const routerImg = express.Router()

const upload = multer({})

const studentsFolderPath = join(__dirname, "../../../public/img/products")

// 1. Post one picture:
// http://localhost:3030/files/upload
routerImg.post("/upload", upload.single("avatar"), async(req, res, next) =>{
    //console.log(req.file)
    console.log("originalname: ", req.file.originalname)
    console.log("fieldname: ", req.file.fieldname)
    console.log("encoding: ", req.file.encoding)
    console.log("mimetype: ", req.file.mimetype)
    console.log("size: ", req.file.size)

    try{
        await fs.writeFile(
            join(studentsFolderPath, req.file.originalname), req.file.buffer)
    } catch(error) {}
    res.send("OK")
} )


// 2. POST multiple pictures
// http://localhost:3030/files/uploadMultiple
routerImg.post("/uploadMultiple", upload.array(" ", 3), async(req, res, next) => {
    //req.files <-- here is where we're gonna find the files.
   // console.log(req.files)
    try{
    const arrayOfPromises = req.files.map( (file) => 
    writeFile(join(studentsFolderPath, file.originalname), file.buffer))

    await Promise.all(arrayOfPromises)
    res.send(arrayOfPromises)
    }catch(error){
        console.log(error)
    }
})


// 3. Download
//http://localhost:3031/files/min4.jpg/download
routerImg.get('/:name/download', (req, res, next) => {
    // file as a stream is our source --> response (destination)
    const source = createReadStream(join(studentsFolderPath, `${req.params.name}`))
    
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.name}`
                  //attachment: filename e hap ne browser
                  //attachment; filename - e downloadon direkt
        )
    source.pipe(res)  

    source.on("error", error => {
        next(error)
    })
})

module.exports = routerImg