import axios from "axios"
import { Excercise, NewExercise } from "../models/excercise"

const url = "http://localhost:8080"

const getExercises = async () => {
  const res = await axios.get<Excercise[]>(url + "/exercises")
  return res.data
}

const getTags = async () => {
  const res = await axios.get<string[]>(url + "/tags")
  return res.data
}

const getMyExercises = async (props: any) => {
  const res = await axios.get<Excercise[]>(url + "/students/" + props.id + "/exercises")
  return res.data
}

const getExercise = async (props: any) => {
  const res = await axios.get<Excercise>(url + "/exercises/" + props.id)
  return res.data
}

const solveExcercise = async (student: any, exercise: any) => {
  const res = await axios.post(url + "/students/" + student.id + "/exercises/" + exercise.id, exercise)
  return res.data
}

const createExercise = async (exercise: NewExercise) => {
  const res = await axios.post(url + "/exercises", exercise)
  return res.data
}

export {
  getMyExercises,
  getExercise,
  getExercises,
  solveExcercise,
  getTags,
  createExercise
}