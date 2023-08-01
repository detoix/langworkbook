const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const multer = require('multer')
const Tesseract = require('tesseract.js')
const { dueForRepetition } = require("./behaviors")
const { createPool } = require("./dbclient")

const connectionString = process.argv[2] || process.env.DATABASE_URL //dodac do dockerfile kopiowanie traineddata
const upload = multer({ storage: multer.memoryStorage() })
const app = express()
// const pool = createPool(connectionString)
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())

//TODO: puścić równolegle wiele języków, potem użyć languagedetect/franc zeby ocenic który i zwrócić tag
app.post('*', upload.single('image'), (req, res) => {
  console.log('x')
  Tesseract.recognize(req.file.buffer, 'eng+deu', { logger: info => console.log(info) }).then(({ data: { text } }) => {
    console.log('y')  
    res.json({ text })
    }).catch(error => {
      console.log('z')
      res.status(500).json({ error: 'OCR processing failed.' })
    })
})

var server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

server.setTimeout(12000)