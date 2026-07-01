const ITEMS = [
  'Edible Salt',
  'Animal Lick Salt',
  'Bath and Spa Salt',
  'Salt Décor and Lamps',
  'Bulk Export',
  'ISO Certified',
  'Halal Certified',
  'Worldwide Shipping',
  'Custom Packaging',
  'Private Label',
]

export default function HomeTicker() {
  // Duplicate for seamless loop
  const all = [...ITEMS, ...ITEMS]
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((item, i) => (
          <span className="ticker-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}
