import { useState, useEffect } from 'react'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
