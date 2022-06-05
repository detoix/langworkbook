interface Excercise {
  id: string
  tags: string[]
  content: Fragment[]
}

interface Fragment {
  text?: string
  options?: string[]
  letters?: string
}

export type { Excercise }