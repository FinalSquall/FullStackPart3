const Notification = ({message}) => {
    if (!message) {
        return null
      }
    const msgLvl = message.level === 'notify' ? 'notification' : 'error'
    console.log('msgLevel',msgLvl)
    return (
    <div className={msgLvl}>
        {message.text}
    </div>
    )
}

export default Notification