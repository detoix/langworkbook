import Async from "react-async"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { getExercises } from "../services/client"
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
              let params = new URLSearchParams(searchParams.toString());
              params.set('offset', Math.max(query.offset - query.limit, 0).toString());
              setSearchParams(params.toString());
              navigate('/workbook?'+params.toString())
              }}>prev</button>

            <select defaultValue={query.limit} onChange={event => { 
              let params = new URLSearchParams(searchParams.toString());
              params.set('limit', event.target.value);
              setSearchParams(params.toString());
              navigate('/workbook?'+params.toString())
              }}
            >
              <option>1</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>

            <button onClick={event => { 
              event.preventDefault()
              let params = new URLSearchParams(searchParams.toString());
              params.set('offset', (query.offset + query.limit).toString());
              setSearchParams(params.toString());
              navigate('/workbook?'+params.toString())
              }}>next</button>

          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercises