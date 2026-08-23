import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const targetRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let rafId

    const handleMouseMove = (e) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (target.closest('button, a, [data-interactive], canvas')) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const animate = () => {
      const lerp = 0.12
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp

      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`
        cursorRef.current.style.top = `${posRef.current.y}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${hovering ? ' hovering' : ''}`}
      aria-hidden="true"
    />
  )
}
