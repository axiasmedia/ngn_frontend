import { PopularItem } from "./popular-item"

const popularItems = [
  "Request User Account",
  "Shared Mailbox",
  "Order VoIP line",
  "Request Basic Items",
  "Request Room Meeting",
  "Order printer",
]

export function PopularItems() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Popular Items</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {popularItems.map((item) => (
          <PopularItem key={item} title={item} />
        ))}
      </div>
    </div>
  )
}

