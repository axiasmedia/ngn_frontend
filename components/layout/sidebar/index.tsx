import { ScrollArea } from "@/components/ui/scroll-area"
import { MainNav } from "./main-nav"

export function Sidebar() {
  return (
    <aside className="hidden md:block w-64 border-r bg-white">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          <MainNav />
        </div>
      </ScrollArea>
    </aside>
  )
}

