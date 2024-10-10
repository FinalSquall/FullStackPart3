const mongoose = require('mongoose')
require('dotenv').config()

const Person = require('./model/person')

const name = process.argv[2]
const num = process.argv[3]

mongoose.set('strictQuery',false)


if (process.argv.length<3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} else {
    const person = new Person({
        name: `${name}`,
        number: `${num}`,
    })

    person.save().then(result => {
    console.log(`Added ${person.name} with the number ${person.number} to the phonebook`)
    mongoose.connection.close()
    })
}




