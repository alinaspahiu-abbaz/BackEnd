const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const multer = require("multer")

const downloadPath = path.join(__dirname, "./img")

const upload = multer()

const router = express.Router()

router.post("/", upload.single("file"), (req, res) => {
    fs.writeFileSync(path.join(downloadPath, req.file.originalname), req.file.buffer)
    res.send("OK")
})

router.post("/", upload.array("file"), (req, res) => {
    const arrayfoto = req.files.map(foto =>
        fs.writeFileSync(path.join(downloadPath, foto.originalname), foto.buffer)
    )
    Promise.all(arrayfoto)
    res.send('OK')
})


module.exports = router