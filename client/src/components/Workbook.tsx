import Async from "react-async"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { getExercises } from "../services/client"
import { redirectWith } from "../services/redirect"
import { Excercise } from "../models/excercise"

const Exercises = () => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = {
    offset: Number(searchParams.get("offset")),
    limit: Number(searchParams.get("limit"))
  }

  return (
    <Async promiseFn={() => getExercises(query)}>
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(exercises: Excercise[]) => (
          <div>
            {exercises.map(exercise => 
              <p key={exercise.id}>
                {exercise.id}. {exercise.tags.map(tag => <a href="/workbook">#{tag}</a>)} {exercise.data.content.map(phrase => phrase.text).join("_")} <Link to={"/exercises/" + exercise.id}>[take]</Link>
              </p>
            )}

            <button onClick={event => {
              event.preventDefault()
              redirectWith(searchParams, setSearchParams, navigate, {offset: Math.max(query.offset - query.limit, 0), limit: query.limit})
            }}>prev</button>
            <select defaultValue={query.limit} onChange={event => redirectWith(searchParams, setSearchParams, navigate, {offset: query.offset, limit: Number(event.target.value)})}>
              <option>1</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <button onClick={event => {
              event.preventDefault()
              redirectWith(searchParams, setSearchParams, navigate, {offset: query.offset + query.limit, limit: query.limit})
            }}>next</button>

          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercises