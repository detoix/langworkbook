interface Excercise {
  id: string
  tags: string[]
  data: {
    content: Phrase[]
  }
  count?: number
}

interface Phrase {
  text?: string
  options?: string[]
  letters?: string
}

export type { Excercise }