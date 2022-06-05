import Async from 'react-async'
import { Link } from 'react-router-dom'
import { getExercises } from '../services/client'
import { Excercise } from '../models/excercise'

const Exercises = () => (
  <Async promiseFn={getExercises}>
    <Async.Pending>Loading...</Async.Pending>
    <Async.Fulfilled>
      {(exercises: Excercise[]) => (
        <div>
          {exercises.map((exercise: Excercise) => 
            <p>
              {exercise.id}. {exercise.tags.map(tag => <a href=''>#{tag}</a>)} {exercise.content.map(fragment => fragment.text).join('_')} <Link to={'/workbook/' + exercise.id}>[take]</Link>
            </p>
          )}
        </div>
      )}
    </Async.Fulfilled>
    <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
  </Async>
)

export default Exercises