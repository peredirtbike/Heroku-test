const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('tiny'))

app.use(express.json())

morgan.token("post", function (req, res) {
    if (req.body.name) {
      return JSON.stringify(req.body);
    } else {
      return null;
    }
  });

app.use(
    morgan(
      ":method :url status-:status (:res[content-length]-:response-time ms) :post :user-agent"
    )
  );

let persons =[
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
        const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
        return maxId + 1
    }


    app.post('/api/persons', (req, res) => {
        let person = req.body
        person.id = generateId()

        if (!person.name || !person.number){
            return res.status(400).json({
                error: 'content missing'
            })
        }

        persons = persons.concat(person)
        res.json(person)
    })

    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
    })
    
    app.get('/api/persons', (req, res) => {
        res.json(persons)
    })

    app.get('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        const person = persons.find(person => person.id === id)

        if (person){
        res.json(person)
        }else{
        res.status(404).end()
        }
    
    })

    app.delete('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => person.id !== id)
    
        res.status(204).end()
    })

    app.get('/info', (req, res) => {
        res.send('Phonebook has info for' + " " + persons.length + " " + 'persons' + "<p>"+ Date() + "</p>" )
    })


    
    const PORT = 3001
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })