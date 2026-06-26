function ErrorState({ message }) {
  return (
    <div className="error-container">
      <h2>Ups...</h2>
      <p>{message}</p>
    </div>
  )
}

export default ErrorState