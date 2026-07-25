const IconEmptyBox = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
    <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" fill="currentColor" opacity="0.14" />
    <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M3 8.5v7L12 20l9-4.5v-7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 13v7" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

function EmptyState({ message }) {
  return (
    <div className="empty-container">
      <IconEmptyBox />
      <p>{message}</p>
    </div>
  )
}

export default EmptyState