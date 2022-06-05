const getStudents = () => 
[
  {
    id: 0,
    exercises:
    [
      {
        id: 0,
        history: [
          {
            datetime: '2002-12-12',
            answer: ['encontre', 'iba'],
            correct: 1
          },
          {
            datetime: '2002-12-10',
            answer: ['encontre', 'fue'],
            correct: 0.5
          }
        ]
      }
    ]
  },
  {
    id: 1,
    exercises:
    [
      {
        id: 0,
        history: [
          {
            datetime: '2002-12-12',
            answer: ['encontre', 'iba'],
            correct: 1
          },
          {
            datetime: '2002-12-09',
            answer: ['encontre', 'fue'],
            correct: 0.5
          }
        ]
      },
      {
        id: 1,
        history: [
          {
            datetime: '2002-12-13',
            answer: ['Singl'],
            correct: 0
          },
          {
            datetime: '2002-12-08',
            answer: [''],
            correct: 0
          }
        ]
      }
    ]
  }
]

const getExercises = () =>
[
  {
    id: 0,
    takenBy: [0, 0, 1, 1], //ids of users added every time
    tags:
    [
      'es',
      'c1',
      'preterito indefinido'
    ],
    content: [{text:'El otro dia me '}, {options: ['encontre, encontraba']}, {text:' con Mariano cuando '}, {options: ['iba, fue']}, {text:' a clase de Musica.'}],
    answer: ['encontre', 'iba']
  },
  {
    id: 1,
    takenBy: [1, 1], //ids of users added every time
    tags:
    [
      'de',
      'c1',
      'fill the gap'
    ],
    content: [{text:'Florian is seit drei Monaten wieder '}, {letters: 'INGSLE'}],
    answer: ['Single']
  }
]

module.exports = {
  getStudents,
  getExercises
}