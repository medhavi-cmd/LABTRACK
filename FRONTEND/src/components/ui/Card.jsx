export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
      rounded-lg
      border
      border-border
      bg-surface
      shadow-card
      ${className}
      `}
    >
      {children}
    </div>
  )
}