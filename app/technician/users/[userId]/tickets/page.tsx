import { Suspense } from "react"
import type { Metadata } from "next"
import { UserTickets } from "@/components/features/technician/user-tickets"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCircle } from "lucide-react"

interface UserTicketsPageProps {
  params: {
    userId: string
  }
}

export const metadata: Metadata = {
  title: "User Tickets",
  description: "View all tickets for this user",
}

export default function UserTicketsPage({ params }: UserTicketsPageProps) {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="space-y-4 max-w-full">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">User Tickets</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            View and manage all support tickets submitted by this user. Filter by status or priority to find specific
            tickets.
          </p>
        </div>

        <Breadcrumb className="text-sm text-muted-foreground">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/technician" className="hover:text-primary">
                Dashboard
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/technician/users" className="hover:text-primary">
                Users
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Tickets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6">
          <Suspense fallback={<TicketsLoading />}>
            <UserTickets userId={params.userId} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function TicketsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
              <div className="space-y-3 text-right">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[150px] ml-auto" />
                  <Skeleton className="h-4 w-[120px] ml-auto" />
                </div>
                <Skeleton className="h-9 w-[120px] ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

