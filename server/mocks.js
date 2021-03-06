const getActions = () =>
[
  {
    id: 0,
    student: 0,
    exercise: 0,
    result: {
      answer: ["encontre", "iba"],
      correctAnswer: ["encontre", "iba"],
    }
  },
  {
    id: 1,
    student: 0,
    exercise: 0,
    result: {
      answer: ["encontre", "fue"],
      correctAnswer: ["encontre", "iba"],
    }
  },
  {
    id: 2,
    student: 1,
    exercise: 0,
    result: {
      answer: ["encontre", "iba"],
      correctAnswer: ["encontre", "iba"],
    }
  },
  {
    id: 3,
    student: 1,
    exercise: 0,
    result: {
      answer: ["encontre", "fue"],
      correctAnswer: ["encontre", "iba"],
    }
  },
  {
    id: 4,
    student: 1,
    exercise: 1,
    result: {
      answer: ["Singl"],
      correctAnswer: ["Single"],
    }
  },
  {
    id: 5,
    student: 1,
    exercise: 1,
    result: {
      answer: [""],
      correctAnswer: ["Single"],
    }
  },
  {
    id: 6,
    student: 1,
    exercise: 1,
    result: {
      answer: ["Single"],
      correctAnswer: ["Single"],
    }
  },
  {
    id: 7,
    student: 0,
    exercise: 3,
    result: {
      answer: ["der"],
      correctAnswer: ["red"],
    }
  }
]

const getExercises = () =>
[
  {
    id: 0,
    author: 0,
    tags:
    [
      "es",
      "c1",
      "preterito indefinido",
    ],
    data: {
      content: [{text:"El otro dia me "}, {hint: "encontre / encontraba"}, {text:" con Mariano cuando "}, {hint: "iba / fue"}, {text:" a clase de Musica."}],
      answer: ["encontre", "iba"]
    }
  },
  {
    id: 1,
    author: 0,
    tags:
    [
      "de",
      "c1",
      "fill the gap",
      "mixed letters"
    ],
    data: {
      content: [{text:"Florian is seit drei Monaten wieder "}, {hint: "INGSLE"}],
      answer: ["Single"]
    }
  },
  {
    id: 2,
    author: 0,
    tags:
    [
      "de",
      "c1",
    ],
    data: {
      content: [{text:"Annika ist sehr"}, {}, {text:"."}],
      answer: ["krank"]
    }
  },
  {
    id: 3,
    author: 1,
    tags:
    [
      "en",
      "a1",
    ],
    data: {
      content: [{text:"I have a"}, {hint: "dre"}, {text:"car."}],
      answer: ["red"]
    }
  }
]

module.exports = {
  getActions,
  getExercises
}