"use client"

import { useTicketEmails } from "@/hooks/useTicketEmails"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TicketEmailsProps {
  ticketId: string
}

export function TicketEmails({ ticketId }: TicketEmailsProps) {
  const { emails, loading, error } = useTicketEmails(ticketId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading emails...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-4">
        <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">No email notifications found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <ScrollArea className="h-[calc(100vh-10rem)] pr-3 -mr-3">
        <div className="space-y-3">
          {emails.map((email, index) => (
            <Card key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-3">
                <h3 className="font-medium text-sm mb-1">{email.subject}</h3>
                <Separator className="my-2" />
                <div
                  className="text-xs prose prose-sm max-w-none text-muted-foreground email-content"
                  dangerouslySetInnerHTML={{ __html: email.body }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

