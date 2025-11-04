require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use((req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :res[content-length] - :response-time ms - :body')(req, res, next)
  } else {
    morgan('tiny')(req, res, next)
  }
})

/* app.get('/info', (request, response) => {
  const requestTime = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestTime}</p>
  `)
}) */

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

/*   const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedNote => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  
  if (!persons.find(person => person.id === id)) {
    return response.status(404).json({
      error: 'person not found'
    })
  }

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})