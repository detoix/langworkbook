interface IdCarrier {
  id: number
}

interface NewExercise {
  tags: string[]
  data: {
    content: Phrase[]
    answer: string[]
  }
}

interface Excercise extends NewExercise, IdCarrier {
  attempts?: number
}

interface Phrase {
  text?: string
  options?: string[]
  letters?: string
}

export type {
  NewExercise, 
  Excercise
}