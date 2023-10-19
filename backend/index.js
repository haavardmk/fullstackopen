const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

// Use the custom token in the Morgan format
app.use(
  morgan('POST /api/persons :status :res[content-length] - :response-time ms :req-body',
    {
      stream: process.stdout, // Log to the console
    }
  )
);

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

  const generateId = () => {
    const id = Math.floor(Math.random() * 10000)
    console.log('Generated ID: ', id);
    return id  
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('POST: ', body);
  
    if (!body.name || !body.number) {
      const errStr = (!body.name ? 'Name missing' : '') + ((!body.name && !body.number) ? ' and ' : '') + (!body.number ? 'number missing' : '');
      console.log(errStr);
      return response.status(400).json({ 
        error: errStr 
      })
    }

    if (persons.some(person => String(person.name) === String(body.name))) {
      console.log('name must be unique');
      return response.status(400).json({ 
        error: 'name must be unique'
      })
    }
  
    const person = {
      id: body.id ? body.id : generateId(),
      name: body.name,
      number: body.number ? body.number : false
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.put('/api/persons:id', (request, response) => {
    const body = request.body
    console.log('PUT: ', body);
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Person not found' 
      })
    }
  
    const updatePerson = {
      name: body.name,
      number: body.number || false,
      id: body.id,
    }

    persons = persons.map(person => person.id === updatePerson.id ? updatePerson : person) 
  
    response.json(persons)
  })

  app.get('/', (request, response) => {
    console.log('GET HEADER');
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/info', (request, response) => {
    console.log('GET HEADER');
    const phonebookSize = persons.length;
    const strPhonebook = 'Phonebook has info for ' + String(phonebookSize) + ' people';
    const dateAsString = new Date().toString();
    const infoString = '<h1>' + strPhonebook + '</h1>' + '<p>' + dateAsString + '</p>'
    response.send(infoString)
  })
  
  app.get('/api/persons', (request, response) => {
    console.log('GET PERSONS: ' + JSON.stringify(persons,undefined, 2));
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    console.log('GET id: ' + JSON.stringify(person,undefined, 2)); 
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (persons.some(person => person.id === id)) {
      persons = persons.filter(person => person.id !== id)
      console.log('DELETE: ' + JSON.stringify(person,undefined, 2));
      response.status(204).end()
    }
    else {
      response.status(404).end()
    }
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })