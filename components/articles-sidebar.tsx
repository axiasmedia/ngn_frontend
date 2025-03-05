import { ArticleCard } from "@/components/article-card"

export function ArticlesSidebar() {
  return (
    <div className="p-4">
      <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Articles</h2>
      <div className="space-y-4">
        <ArticleCard title="Article 1" />
        <ArticleCard title="Article 2" />
      </div>
    </div>
  )
}

