import Async from "react-async"
import { useParams, useSearchParams, useNavigate, NavigateFunction, Link } from "react-router-dom"
import { Excercise, ExerciseSolution, IdCarrier } from "../models/excercise"
import { getExercise, solveExcercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, Input, Stack, TextField, Typography } from "@mui/material"

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
          <Card key={exercise.id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} style={{ alignItems: "baseline" }}>

                {Array.from({length: 1}, (_, i) => { 
                  let answerCopy = [...(answer || [])]
                  let correctAnswerCopy = [...(correctAnswer || [])]

                  return exercise.data.content.map((phrase, index) => {
                    if (phrase.text) {
                      return <Typography key={index}>{phrase.text}</Typography>
                    } else if (answer && correctAnswer) {
                      let phraseAnswer = answerCopy.shift()
                      let phraseCorrectAnswer = correctAnswerCopy.shift()
                      let correct = phraseAnswer === phraseCorrectAnswer

                      return (
                        <FormControl focused>
                          <InputLabel variant="standard" color="success" error={!correct}>Your answer</InputLabel>
                          <Input 
                            defaultValue={phraseCorrectAnswer} 
                            error={!correct} 
                            readOnly={true}
                            color="success"
                            startAdornment={correct ? null : <Typography color="error"><del>{phraseAnswer}-</del></Typography>} 
                          />
                        </FormControl>
                      )
                    } else {
                      return <TextField key={index} required={true} variant="standard" label={phrase.letters ?? (phrase.options ?? []).join(" / ")} />
                    }
                  })
                })}
              </Stack>
            </CardContent>
            <CardActions>
              {!answer && !correctAnswer && <Button type="submit">Submit</Button>}
              {next && <Button component={Link} to={"/exercises/" + next}>Next</Button>}
            </CardActions>
          </Card>
        </form>
      )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercise