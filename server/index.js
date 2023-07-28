const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const multer = require('multer')
const Tesseract = require('tesseract.js')
const { dueForRepetition } = require("./behaviors")
const { createPool } = require("./dbclient")

const connectionString = process.argv[2] || process.env.DATABASE_URL
const upload = multer({ storage: multer.memoryStorage() })
const app = express()
const pool = createPool(connectionString)
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/exercises", (req, res) => {
  let tags = req.query.tags && req.query.tags.split(",").length
    ? req.query.tags.split(",")
    : []

  pool.getExercises(
    req.query.limit || 10,
    req.query.offset || 0,
    tags).then(payload => 
  {
    res.send(payload)
  })
})

app.get("/tags", (req, res) => {
  pool.getTags().then(payload => {
    res.send(payload)
  })
})

app.get("/students/:studentId/exercises", (req, res) => {
  pool.getMyExercises(req.params.studentId)
    .then(exercises => exercises.filter(dueForRepetition))
    .then(projection => res.send(projection))
})

app.get("/exercises/:exerciseId", (req, res) => {
  pool.getExercise(req.params.exerciseId).then(payload => {
    res.send(payload)
  })
})

app.delete("/exercises/:exerciseId", (req, res) => {
  pool.deleteExercise(req.params.exerciseId, req.query.studentId).then(payload => {
    res.send(payload)
  })
})

app.post("/students/:studentId/exercises/:exerciseId", (req, res) => {
  let action = {
    student: req.params.studentId,
    exercise: req.params.exerciseId,
    result: {
      answer: req.body.answer,
    }
  }

  pool.getExercise(req.params.exerciseId)
    .then(exercise => {
      action.result.correctAnswer = exercise.data.answer

      return action
    })
    .then(action => pool.submitAction(action))
    .then(_ => pool.getMyExercises(req.params.studentId))
    .then(exercises => exercises.filter(dueForRepetition))
    .then(projection => {
      let next = projection.shift()

      if (next) {
        action.next = next.id
      }
      
      res.send(action)
    })
})

app.post("/exercises", (req, res) => {
  pool.createExercise(req.body).then(payload => {
    res.send(payload)
  })
})

//TODO: puścić równolegle wiele języków, potem użyć languagedetect/franc zeby ocenic który i zwrócić tag
app.post('/ocr', upload.single('image'), (req, res) => {
  Tesseract.recognize(req.file.buffer, 'eng+deu', { logger: info => console.log(info) }).then(({ data: { text } }) => {
      res.json({ text })
    }).catch(error => {
      res.status(500).json({ error: 'OCR processing failed.' })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}, connected with ${connectionString}`)
})
