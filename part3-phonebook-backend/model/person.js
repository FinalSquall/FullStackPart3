const mongoose = require('mongoose')

require('dotenv').config()

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
})
  .catch(() => {
    console.log('Failed to Connect to MongoDB')
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: false,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person',personSchema)