import Person from "./Person"

const PersonList = ({filter,persons,handleDeleteButtonPress}) => {
    
    console.log('person data',persons)
    return (
        <div>
        {
            filter ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).map(p => <Person key={p.name} person={p} handleDeleteButtonPress={() => handleDeleteButtonPress(p.id)}/>)
             : persons.map(p => <Person key={p.name} person={p} handleDeleteButtonPress={() => handleDeleteButtonPress(p.id)}/>)
        }
        </div>
    )
}

export default PersonList