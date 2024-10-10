import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter,setFilter] = useState('')
  const [message, setMessage] = useState(null)

  const addNewPerson = (event) => {
    event.preventDefault()
    const personFound = persons.find(p => p.name === newName)
    if (personFound) {
      console.log('person found',personFound)
      if (window.confirm((`${newName} has already been added to the phonebook, overwrite phone number?`))) {
        const updPerson = {...personFound, number:newNumber}
        personsService.update(personFound.id,updPerson)
        .then(updatedPerson => {
          console.log('update response',updatedPerson)
          setPersons(persons.map(p => p.id === personFound.id ? updatedPerson : p))
        })
        .catch(error => {
          setMessage({ /* Not sure if we need to edit a copy of the message in this case, I have made it an object, but it will always be null when set any way) */
           text: `Phone number for '${personFound.name}' was already deleted from server`,
           level:'error'
          })
          setPersons(persons.filter(p => p.id !== personFound.id))
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
    } else {
      const personOb = {
        name:newName,
        number:newNumber
      }

      personsService.create(personOb)
      .then(personData => {
        console.log('post response',personData)
        setPersons(persons.concat(personData))
        setNewName('')
        setNewNumber('')

        setMessage(
          {
            text:`${personData.name} was added to the phonebook`,
            level:'notify'
          }
          
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)

      })
    }
  }

  useEffect(() => {
    personsService.getAll()
    .then(persons => {
      console.log('promise success')
      setPersons(persons)
    })
  },[])/* Specifies frequency. In this case [] = run on first render only */

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    console.log('ev_info',event.target.value)
    setFilter(event.target.value)
  }

  const handleDeleteButtonPress = (id) => {
    if (window.confirm()) {
        console.log('confirmed')
        personsService.deletePerson(id)
        .then(res => {
          console.log('success',res)
          setPersons(persons.filter(p => p.id != id))
        })
    }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter text={filter} handler={handleNameFilterChange}/>
      <h3>Add a New Person</h3>
      <PersonForm addNewPerson={addNewPerson} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber}/>
      <h2>Numbers</h2>
      <PersonList filter={filter} persons={persons} handleDeleteButtonPress={handleDeleteButtonPress}/>
    </div>
  )
}

export default App