const Notification = ({ message, error }) => {
  if (message !== null) {
    return <div className='message'>{message}</div>
  }

  if (error !== null) {
    return <div className='error'>{error}</div>
  }
}

export default Notification
