"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ArticlePreview } from "./article-preview"
import { TicketEmails } from "./ticket-emails"
import { useParams } from "next/navigation"

export function RightSidebar() {
  const params = useParams()
  const ticketId = params?.id as string

  return (
    <aside className="hidden lg:block w-64 border-l bg-white">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4 pb-2">
          <h2 className="font-semibold mb-2 text-sm uppercase text-muted-foreground tracking-wider">
            {ticketId ? "Email Notifications" : "Recent Articles"}
          </h2>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-hidden">
          {ticketId ? (
            <TicketEmails ticketId={ticketId} />
          ) : (
            <ScrollArea className="h-full pr-3 -mr-3">
              <div className="space-y-4">
                <ArticlePreview title="New Equipment Request Process" updatedAt="Updated 2 days ago" />
                <ArticlePreview title="IT Security Best Practices" updatedAt="Updated 1 week ago" />
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </aside>
  )
}

