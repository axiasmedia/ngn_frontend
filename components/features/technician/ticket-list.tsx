"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CircleCheck, CircleX, Hourglass } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockTickets = [
  {
    id: "40-29012025",
    title: "Email not working",
    account: "Chrysalis Health",
    contract: "Chrysalis Support",
    owner: "John Smith",
    openDate: "25/01/2025 05:24 PM",
    dueDate: "27/01/2025 05:24 PM",
    createdBy: "Sarah Johnson",
    assignee: "Tech Support Team",
    priority: "High",
    status: "Open",
  },
  {
    id: "39-28012025",
    title: "Printer issues",
    account: "Chrysalis Health",
    contract: "Chrysalis Support",
    owner: "Jane Doe",
    openDate: "24/01/2025 02:15 PM",
    dueDate: "26/01/2025 02:15 PM",
    createdBy: "Mike Wilson",
    assignee: "Tech Support Team",
    priority: "Medium",
    status: "In Progress",
  },
  // Add more mock tickets as needed
]

export function TicketList() {
  const [tickets] = useState(mockTickets)
  const router = useRouter()

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <CircleX className="h-4 w-4" />
      case "in progress":
        return <Hourglass className="h-4 w-4" />
      case "resolved":
        return <CircleCheck className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Open Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.account}</TableCell>
              <TableCell>{ticket.owner}</TableCell>
              <TableCell>{ticket.assignee}</TableCell>
              <TableCell>{ticket.openDate}</TableCell>
              <TableCell>{ticket.dueDate}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
              </TableCell>
              <TableCell className="min-w-[140px]">
                <Badge className={getStatusColor(ticket.status) + " whitespace-nowrap"}>
                  <span className="flex items-center gap-1 truncate">
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => router.push(`/technician/tickets/${ticket.id}`)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

