const Filter = ({text, handler}) => {
    return (
        <div>
            <input value={text} onChange={handler}/>
        </div>

    )
}

export default Filter