import axios from "axios"
import { IdCarrier, Excercise, NewExercise, ExerciseSolution } from "../models/excercise"
import { Query } from "../models/query"

const url = "http://localhost:8080"

const getExercises = async (query: Query) => {
  const searchParams = new URLSearchParams()
  searchParams.set("offset", query.offset.toString())
  searchParams.set("limit", query.limit.toString())
  searchParams.set("tags", query.tags.toString())

  const res = await axios.get<Excercise[]>(url + "/exercises?" + searchParams.toString())
  return res.data
}

const getTags = async () => {
  const res = await axios.get<string[]>(url + "/tags")
  return res.data
}

const getMyExercises = async (props: IdCarrier) => {
  const res = await axios.get<Excercise[]>(url + "/students/" + props.id + "/exercises")
  return res.data
}

const deleteExercise = async (student: IdCarrier, exercise: IdCarrier) => {
  const searchParams = new URLSearchParams()
  searchParams.set("studentId", student.id.toString())

  const res = await axios.delete<Excercise>(url + "/exercises/" + exercise.id + "?" + searchParams.toString())
  return res.data
}

const getExercise = async (props: IdCarrier) => {
  const res = await axios.get<Excercise>(url + "/exercises/" + props.id)
  return res.data
}

const solveExcercise = async (student: IdCarrier, exercise: ExerciseSolution) => {
  const res = await axios.post<any>(url + "/students/" + student.id + "/exercises" + exercise.id, exercise)
  return res.data
}

const createExercise = async (exercise: NewExercise) => {
  const res = await axios.post<any>(url + "/exercises", exercise)
  return res.data
}

export {
  getMyExercises,
  getExercise,
  getExercises,
  getTags,
  solveExcercise,
  createExercise,
  deleteExercise,
}