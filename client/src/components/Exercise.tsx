import Async from "react-async"
import { useParams, useSearchParams, useNavigate, NavigateFunction, Link } from "react-router-dom"
import { Excercise, ExerciseSolution, IdCarrier } from "../models/excercise"
import { getExercise, solveExcercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material"

const handleSubmit = (student: IdCarrier, exercise: ExerciseSolution, navigate: NavigateFunction) => {
  solveExcercise(student, exercise).then(e => {
    let query = buildQueryParams(new URLSearchParams(), { answer: e.result.answer, correctAnswer: e.result.correctAnswer, next: e.next })
    navigate({search: query})
  })
}

const Exercise = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const answer = searchParams.get("answer")?.split(",")
  const correctAnswer = searchParams.get("correctAnswer")?.split(",")
  const next = searchParams.get("next")

  return (
    <Async promiseFn={props => getExercise({id: props.id})} id={id}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
      {(exercise: Excercise) => (
        <Stack spacing={1}>
          <form onSubmit={event => { 
            event.preventDefault()

            let answer: string[] = []

            for (let index = 0; index < event.currentTarget.elements.length - 1; index++) {

              let input = event.currentTarget.elements[index] as HTMLInputElement

              if (input.value) {
                answer.push(input.value)
              }
            }

            handleSubmit({ id: 0 }, { id: id, answer: answer }, navigate)
          }}>
          <Stack direction="row" spacing={1}>

            {Array.from({length: 1}, (_, i) => { 
              let answerCopy = [...(answer || [])]
              let correctAnswerCopy = [...(correctAnswer || [])]

              return exercise.data.content.map((phrase, index) => {
                if (phrase.text) {
                  return <Typography>{phrase.text}</Typography>
                } else if (answer && correctAnswer) {
                  let phraseAnswer = answerCopy.shift()
                  let phraseCorrectAnswer = correctAnswerCopy.shift()

                  if (phraseAnswer === phraseCorrectAnswer) {
                    return <Typography><b>{phraseCorrectAnswer}</b></Typography>
                  } else {
                    return <Typography><del>{phraseAnswer}</del> {phraseCorrectAnswer}</Typography>
                  }
                } else if (phrase.options) {
                  return <Autocomplete disablePortal options={phrase.options} renderInput={(params) => <TextField {...params} />} />
                } else if (phrase.letters) {
                  return <TextField label={phrase.letters} />
                } else {
                  return null
                }
              })
            })}
            {!answer && !correctAnswer && <Button type="submit">Submit</Button>}
            {next && <Button component={Link} to={"/exercises/" + next}>Next</Button>}

            </Stack>
          </form>
        </Stack>
      )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercise