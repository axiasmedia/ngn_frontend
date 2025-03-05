import { CategoryItem } from "./category-item"

const categories = [
  {
    name: "Hardware",
    items: ["Laptops", "Desktops", "Monitors", "Accessories"],
  },
  {
    name: "Software",
    items: ["Operating Systems", "Office Suite", "Security Software"],
  },
  {
    name: "Networks and Infra",
    items: ["Network Equipment", "Servers", "Storage"],
  },
  {
    name: "Printers",
    items: ["Laser Printers", "Inkjet Printers", "3D Printers"],
  },
  {
    name: "Telephony",
    items: ["Desk Phones", "Mobile Phones", "Conference Systems"],
  },
  {
    name: "Email/Mailbox manage",
    items: ["Email Accounts", "Distribution Lists", "Storage Management"],
  },
  {
    name: "User access",
    items: ["Account Creation", "Password Reset", "Access Management"],
  },
  {
    name: "Other services",
    items: ["Training", "Consulting", "Support"],
  },
]

export function CategoryList() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem key={category.name} name={category.name} items={category.items} />
        ))}
      </div>
    </div>
  )
}

