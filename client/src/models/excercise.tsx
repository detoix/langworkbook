interface Excercise {
  id: string
  tags: string[]
  content: Phrase[]
}

interface Phrase {
  text?: string
  options?: string[]
  letters?: string
}

export type { Excercise }