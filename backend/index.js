const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
// const morgan = require('morgan')
const Person = require('./models/db')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// morgan.token('req-body', (req) => {
//   if (req.method === 'POST') {
//     return JSON.stringify(req.body);
//   }
//   return '-';
// });

// // Use the custom token in the Morgan format
// app.use(
//   morgan('POST /api/persons :status :res[content-length] - :response-time ms :req-body',
//     {
//       stream: process.stdout, // Log to the console
//     }
//   )
// );


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

  const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    console.log('Generated ID: ', id);
    return id  
  }

  app.get('/', (request, response) => {
    console.log('GET HEADER');
    response.send('<h1>Hello World!</h1>')
  })


  app.get('/info', (request, response) => {
    console.log('GET HEADER');
    Person.find({}).then(persons => {
      const phonebookSize = persons.length;
      const strPhonebook = 'Phonebook has info for ' + String(phonebookSize) + ' people';
      const dateAsString = new Date().toString();
      const infoString = '<h1>' + strPhonebook + '</h1>' + '<p>' + dateAsString + '</p>'
      response.send(infoString)
    })
  })
  
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    console.log(body);
  
    if (!body.name || !body.number) {
      const errStr = (!body.name ? 'Name missing' : '') + ((!body.name && !body.number) ? ' and ' : '') + (!body.number ? 'number missing' : '');
      console.log(errStr);
      return response.status(400).json({ 
        error: errStr 
      })
    }

    // Person.find({name: body.name}).then(persons => {
    //   return response.status(400).json({ 
    //     error: 'name must be unique'
    //   })
    // })
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })
  
  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const updatePerson = request.body
    const updatePersonId = request.params.id
  
    Person.findByIdAndUpdate(updatePersonId, {number: updatePerson.number}, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  app.use(unknownEndpoint)
  app.use(errorHandler)
    

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


  // app.post('/api/persons', (request, response) => {
  //   const body = request.body
  //   console.log('POST: ', body);
  
  //   if (!body.name || !body.number) {
  //     const errStr = (!body.name ? 'Name missing' : '') + ((!body.name && !body.number) ? ' and ' : '') + (!body.number ? 'number missing' : '');
  //     console.log(errStr);
  //     return response.status(400).json({ 
  //       error: errStr 
  //     })
  //   }

  //   if (persons.some(person => String(person.name) === String(body.name))) {
  //     console.log('name must be unique');
  //     return response.status(400).json({ 
  //       error: 'name must be unique'
  //     })
  //   }
  
  //   const person = {
  //     id: body.id ? body.id : generateId(),
  //     name: body.name,
  //     number: body.number ? body.number : false
  //   }
  
  //   persons = persons.concat(person)
  
  //   response.json(person)
  // })

  // app.delete('/api/persons/:id', (request, response) => {
  //   const id = Number(request.params.id)
  //   const user = persons.find(person => person.id === id)
  //   if (persons.some(person => person.id === id)) {
  //     persons = persons.filter(person => person.id !== id)
  //     console.log('DELETE: ' + JSON.stringify(user.name, undefined, 2));
  //     response.status(204).end()
  //   }
  //   else {
  //     response.status(404).end()
  //   }
  // })

  // app.put('/api/persons/:id', (request, response) => {
  //   const body = request.body;
  //   console.log('PUT: ', body);
  
  //   if (!body.name) {
  //     return response.status(400).json({
  //       error: 'Name is required',
  //     });
  //   }
  
  //   const idToUpdate = Number(request.params.id);
  //   const personToUpdate = persons.find((person) => person.id === idToUpdate);
  
  //   if (!personToUpdate) {
  //     return response.status(404).json({
  //       error: 'Person not found',
  //     });
  //   }
  
  //   const updatedPerson = {
  //     ...personToUpdate,
  //     name: body.name,
  //     number: body.number || personToUpdate.number, // Keep the existing number if not provided in the request
  //   };
  
  //   persons = persons.map((person) =>
  //     person.id === idToUpdate ? updatedPerson : person
  //   );
  
  //   response.json(updatedPerson);
  // });
  

  // app.get('/', (request, response) => {
  //   console.log('GET HEADER');
  //   response.send('<h1>Hello World!</h1>')
  // })

  // app.get('/info', (request, response) => {
  //   console.log('GET HEADER');
  //   const phonebookSize = persons.length;
  //   const strPhonebook = 'Phonebook has info for ' + String(phonebookSize) + ' people';
  //   const dateAsString = new Date().toString();
  //   const infoString = '<h1>' + strPhonebook + '</h1>' + '<p>' + dateAsString + '</p>'
  //   response.send(infoString)
  // })
  
  // app.get('/api/persons', (request, response) => {
  //   console.log('GET PERSONS: ' + JSON.stringify(persons,undefined, 2));
  //   response.json(persons)
  // })

  // app.get('/api/persons/:id', (request, response) => {
  //   const id = Number(request.params.id)
  //   const person = persons.find(person => person.id === id)
  //   console.log('GET id: ' + JSON.stringify(person,undefined, 2)); 
  
  //   if (person) {
  //     response.json(person)
  //   } else {
  //     response.status(404).end()
  //   }
  // })

  // app.delete('/api/persons/:id', (request, response) => {
  //   const id = Number(request.params.id)
  //   const user = persons.find(person => person.id === id)
  //   if (persons.some(person => person.id === id)) {
  //     persons = persons.filter(person => person.id !== id)
  //     console.log('DELETE: ' + JSON.stringify(user.name, undefined, 2));
  //     response.status(204).end()
  //   }
  //   else {
  //     response.status(404).end()
  //   }
  // })