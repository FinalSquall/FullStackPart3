import personsService from '../services/persons'

const Person = ({person,handleDeleteButtonPress}) => {

    return (
        <p>
            {person.name} {person.number} <button onClick={handleDeleteButtonPress}>delete</button>
        </p>
    )
  }

export default Person