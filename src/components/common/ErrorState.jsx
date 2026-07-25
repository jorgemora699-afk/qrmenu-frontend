const IconAlert = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 22 20H2z" fill="currentColor" opacity="0.14" />
    <path d="M12 3 22 20H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 9.5v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16.7" r="0.9" fill="currentColor" />
  </svg>
)

function ErrorState({ message }) {
  return (
    <div className="error-container">
      <IconAlert />
      <h2>Ups...</h2>
      <p>{message}</p>
    </div>
  )
}

export default ErrorState