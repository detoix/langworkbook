interface IdCarrier {
  id: any
}

interface ExerciseData {
  content: Phrase[]
  answer: string[]
}

interface NewExercise {
  author: any,
  tags: string[]
  data: ExerciseData
}

interface Excercise extends IdCarrier, NewExercise {
  attempts?: number
}

interface ExerciseSolution extends IdCarrier {
  answer: string[]
}

interface Phrase {
  text?: string
  options?: string[]
  letters?: string
}

export type {
  IdCarrier,
  NewExercise, 
  Excercise,
  ExerciseSolution
}