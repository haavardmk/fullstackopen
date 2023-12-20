const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

console.log('password', password)

// const url =
//    `mongodb+srv://xept:${password}@fsodb.3hekfuf.mongodb.net/noteApp?retryWrites=true&w=majority`
const url_test =
   `mongodb+srv://xept:${password}@fsodb.3hekfuf.mongodb.net/testNoteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url_test)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Test Database entry 2',
  date: new Date(),
  important: true,
})


note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})


Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
