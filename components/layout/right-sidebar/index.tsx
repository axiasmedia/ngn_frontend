import { ScrollArea } from "@/components/ui/scroll-area"
import { ArticlePreview } from "./article-preview"

export function RightSidebar() {
  return (
    <aside className="hidden lg:block w-64 border-l bg-white">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Recent Articles</h2>
          <div className="space-y-4">
            <ArticlePreview title="New Equipment Request Process" updatedAt="Updated 2 days ago" />
            <ArticlePreview title="IT Security Best Practices" updatedAt="Updated 1 week ago" />
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

