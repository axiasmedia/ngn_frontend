interface ArticlePreviewProps {
  title: string
  updatedAt: string
}

export function ArticlePreview({ title, updatedAt }: ArticlePreviewProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{updatedAt}</p>
    </div>
  )
}

