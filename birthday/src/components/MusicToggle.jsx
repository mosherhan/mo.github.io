import { useState } from 'react'

export default function MusicToggle() {
  const [active, setActive] = useState(false)

  const handleToggle = () => {
    setActive((prev) => !prev)
    // Audio playback can be wired here if a local audio file is added
  }

  return (
    <button
      className={`music-toggle${active ? ' active' : ''}`}
      onClick={handleToggle}
      aria-label={active ? 'Pause music' : 'Play music'}
      data-interactive
    >
      ♪
    </button>
  )
}
