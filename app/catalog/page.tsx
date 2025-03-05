import { CategoryList } from "@/components/features/catalog/category-list"
import { PopularItems } from "@/components/features/catalog/popular-items"

export default function CatalogPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Chrysalis Health: Product catalogue</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryList />
        <PopularItems />
      </div>
    </div>
  )
}

