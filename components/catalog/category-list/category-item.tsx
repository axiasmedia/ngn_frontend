import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

interface CategoryItemProps {
  name: string
  items: string[]
}

export function CategoryItem({ name, items }: CategoryItemProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center w-full hover:bg-accent rounded-lg p-2">
        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
        <span className="ml-2">{name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6">
        <ul className="py-2 space-y-1">
          {items.map((item) => (
            <li key={item} className="hover:bg-accent rounded-lg p-2 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

