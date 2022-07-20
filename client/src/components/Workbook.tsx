import Async from "react-async"
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom"
import { getExercises, getMyExercises, deleteExercise } from "../services/client"
import { buildQueryParams } from "../services/buildQueryParams"
import { Excercise } from "../models/excercise"
import { Button, Card, CardActions, CardContent, Stack, TablePagination, Typography } from "@mui/material"

const defaultLimit = 10

const Exercises = () => {
  const studentId = 0
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = {
    offset: Number(searchParams.get("offset")),
    limit: Number(searchParams.get("limit")) || defaultLimit,
    tags: searchParams.get("tags")?.split(",") || [],
    student: id
  }

  return (
    <Async promiseFn={props => id ? getMyExercises({id: props.id}) : getExercises(query)} id={id}> {/* explicit syntax because otherwise component won't reload */}
      <Async.Pending></Async.Pending>
      <Async.Fulfilled>
        {(exercises: Excercise[]) => (
          <Stack spacing={1}>
            {exercises.map(exercise => 
              <Card key={exercise.id} variant="outlined">
                <CardContent>
                    <Stack direction="row" spacing={1}>
                      <Typography color="text.secondary">#{exercise.id}</Typography>
                      {exercise.tags.map((tag, index) => <Typography key={index} color="text.secondary"><Link to={{search: buildQueryParams(searchParams, { tags: [...query.tags].concat(tag) })}}>#{tag}</Link></Typography> )}
                    </Stack>
                  <Typography>
                    {exercise.data.content.map(phrase => phrase.text).join("_")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={"/exercises/" + exercise.id}>Take</Button>
                  {studentId === exercise.author && <Button size="small" onClick={_ => {
                    deleteExercise({ id: studentId }, { id: exercise.id })
                    navigate("#")
                  }}>Delete</Button>}
                </CardActions>
              </Card>
            )}

            <TablePagination
              component="div"
              rowsPerPageOptions={[1, defaultLimit, 25, 50]}
              count={-1}
              page={query.offset / query.limit}
              onPageChange={(event, pageNumber) => navigate({ search: buildQueryParams(searchParams, {offset: pageNumber * query.limit, limit: query.limit}) })}
              rowsPerPage={query.limit}
              onRowsPerPageChange={event => navigate({ search: buildQueryParams(searchParams, {offset: query.offset, limit: Number(event.target.value)}) })}
            />
          </Stack>
        )}
      </Async.Fulfilled>
      <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
    </Async>
  )
}

export default Exercises