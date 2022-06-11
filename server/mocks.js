const getActions = () =>
[
  {
    id: 0,
    student: 0,
    exercise: 0,
    result: {
      answer: ["encontre", "iba"],
      correct: 1
    }
  },
  {
    id: 1,
    student: 0,
    exercise: 0,
    result: {
      answer: ["encontre", "fue"],
      correct: 0.5
    }
  },
  {
    id: 2,
    student: 1,
    exercise: 0,
    result: {
      answer: ["encontre", "iba"],
      correct: 1
    }
  },
  {
    id: 3,
    student: 1,
    exercise: 0,
    result: {
      answer: ["encontre", "fue"],
      correct: 0.5
    }
  },
  {
    id: 4,
    student: 1,
    exercise: 1,
    result: {
      answer: ["Singl"],
      correct: 0
    }
  },
  {
    id: 5,
    student: 1,
    exercise: 1,
    result: {
      answer: [""],
      correct: 0
    }
  },
  {
    id: 6,
    student: 1,
    exercise: 1,
    result: {
      answer: ["Single"],
      correct: 1
    }
  }
]

const getExercises = () =>
[
  {
    id: 0,
    tags:
    [
      "es",
      "c1",
      "preterito indefinido",
    ],
    data: {
      content: [{text:"El otro dia me "}, {options: ["encontre, encontraba"]}, {text:" con Mariano cuando "}, {options: ["iba, fue"]}, {text:" a clase de Musica."}],
      answer: ["encontre", "iba"]
    }
  },
  {
    id: 1,
    tags:
    [
      "de",
      "c1",
      "fill the gap",
      "mixed letters"
    ],
    data: {
      content: [{text:"Florian is seit drei Monaten wieder "}, {letters: "INGSLE"}],
      answer: ["Single"]
    }
  }
]

module.exports = {
  getActions,
  getExercises
}