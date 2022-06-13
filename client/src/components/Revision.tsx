import Async from "react-async"
import { useParams, Link } from "react-router-dom"
import { getMyExercises } from "../services/client"
import { Excercise } from "../models/excercise"

const Revision = () => {
  const { id } = useParams()

  return (
    <Async promiseFn={props => getMyExercises({id: props.id})} id={id}> {/* explicit syntax because otherwise component won't reload */}
      <Async.Pending>Loading...</Async.Pending>
      <Async.Fulfilled>
        {(exercises: Excercise[]) => (
          <div>
            {exercises.map(exercise => 
              <p>
                {exercise.id} {exercise.attempts} {exercise.data.content.map(phrase => phrase.text).join("_")} <Link to={"/exercises/" + exercise.id}>[take]</Link>
              </p>
            )}
          </div>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Revision