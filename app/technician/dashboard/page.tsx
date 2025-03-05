"use client"

import { TicketList } from "@/components/features/technician/ticket-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TechnicianDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Tickets</h1>
        <Link href="/technician/tickets/new">
          <Button>Create New Ticket</Button>
        </Link>
      </div>
      <TicketList />
    </div>
  )
}

