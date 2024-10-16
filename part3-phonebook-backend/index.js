const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./model/person')

let phonebook = []

/*
  PRE ROUTE MIDDLEWARE
*/

morgan.token('contentToken', function (req) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contentToken', {
  skip: function (req) { return req.method !== 'POST' }
}))

app.use(morgan('tiny', {
  skip: function (req) { return req.method === 'POST' }
}))

app.use(express.static('dist'))

app.use(express.json())

app.use(cors())

/*
  END of PRE-ROUTE MIDDLEWARE
*/

//Careful of order of these as can lead to undefined. Paticularly express.json if in the wrong place can cause undefined response bodies

/*
    ROUTES
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(phonebook => response.json(phonebook))
})

app.get('/info', (request, response,next) => {
  Person.countDocuments().then(p => {
    console.log('GO_TEST',p)
    response.send(`<div><p>The phonebook contains ${p} entries</p><p>${new Date()}</p></div>`)
  })
    .catch(er => next(er))
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {next(error)})
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (body.name === undefined) { //Was busy with other things and return to the course after some time. I am going to assume empty number was valid (cant remember)
    return response.status(400).json({ error:'Request data missing.' })
  }

  validateBody(body)

  const person = new Person({
    name:body.name,
    number:body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(er => next(er))
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(er => next(er))
})

app.put('/api/persons/:id',(request,response,next) => {
  const body = request.body

  const person = { //Note, regular JS object in this case
    name:body.name,
    number:body.number
  }

  Person.findByIdAndUpdate(request.params.id,person,{ new:true, runValidators:true, context:'query' })
    .then(update => {
      response.json(update)
    })
    .catch(er => next(er))
})

/*
    END ROUTES
*/

/*
  POST ROUTE MIDDLEWARE
*/

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => { //If the next function is called with an argument, then the execution will continue to the error handler middleware. We called next with an arg from the route
  console.log('error_handler_middleware_call ',error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error:error.message })
  }

  next(error)
}

app.use(errorHandler)

/*
  END OF POST ROUTE MIDDLEWARE
*/

const validateBody = (body) => {
  if (!body.name) {
    return { error: 'Phonebook user must have a name' }
  }

  if (!body.number) {
    return { error:'Phonebook user must have a number' }
  }

  if (phonebook.find(person => person.name === body.name)) {
    return { error:'Cannot add a user with the same name' }
  }
  return { success:true }
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

