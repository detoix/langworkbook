import Async from "react-async"
import { useParams, useSearchParams, useNavigate, NavigateFunction, Link } from "react-router-dom"
import { Excercise, ExerciseSolution, IdCarrier } from "../models/excercise"
import { getExercise, solveExcercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"

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
        <div>
          <form onSubmit={event => { 
            event.preventDefault()

            let answer: string[] = []

            for (let index = 0; index < event.currentTarget.elements.length - 1; index++) {
              answer.push((event.currentTarget.elements[index] as HTMLInputElement).value)
            }
            
            handleSubmit({ id: 0 }, { id: id, answer: answer }, navigate)
          }}>
            {Array.from({length: 1}, (_, i) => { 
              let answerCopy = [...(answer || [])]
              let correctAnswerCopy = [...(correctAnswer || [])]

              return exercise.data.content.map((phrase, index) => {
                if (phrase.text) {
                  return phrase.text
                } else if (answer && correctAnswer) {
                  let phraseAnswer = answerCopy.shift()
                  let phraseCorrectAnswer = correctAnswerCopy.shift()

                  if (phraseAnswer === phraseCorrectAnswer) {
                    return <span><b>{phraseCorrectAnswer}</b></span>
                  } else {
                    return <span> <del>{phraseAnswer}</del> {phraseCorrectAnswer} </span>
                  }
                } else {
                  return <div><input type="text" /><label>{JSON.stringify(phrase.options ?? phrase.letters)}</label></div>
                }
              })
            })}
            {!answer && !correctAnswer && <input type="submit" value="Submit" />}
            {next && <Link to={"/exercises/" + next}><button>next</button></Link>}
          </form>
        </div>
      )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercise