import { useEffect, useState } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div id="loader" className={hidden ? 'hide' : ''}>
      <div className="loader-logo">Bin Aouf</div>
      <div className="loader-sub">Premium Himalayan Salt</div>
      <div className="loader-bar"><div className="loader-fill"></div></div>
    </div>
  )
}
