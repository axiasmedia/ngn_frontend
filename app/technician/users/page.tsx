"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2, Search, Users } from "lucide-react"
import Link from "next/link"
import { clientService } from "@/services/client/client.service"
import { userService } from "@/services/user/user.service"
import { motion } from "framer-motion"
import { UserList } from "@/components/features/technician/user-list"
import type { User } from "@/services/user/types"

export default function TechnicianUsersPage() {
  const [clients, setClients] = useState<{ id: number; name: string }[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingClients, setLoadingClients] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true)
        const clientData = await clientService.getClients()
        setClients(clientData)
      } catch (err) {
        console.error("Error fetching clients:", err)
        setError("Failed to load clients. Please try again.")
      } finally {
        setLoadingClients(false)
      }
    }

    fetchClients()
  }, [])

  // Fetch users when a client is selected
  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedClientId) return

      try {
        setLoadingUsers(true)
        setError(null)
        const userData = await userService.getUsersByCompanyId(Number(selectedClientId))
        setUsers(userData)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users. Please try again.")
        setUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [selectedClientId])

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.personalEmail && user.personalEmail.toLowerCase().includes(query))
    )
  })

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/technician/dashboard">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </motion.div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Select Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {loadingClients ? (
                <div className="flex items-center space-x-2 h-10 px-3 py-2 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading companies...</span>
                </div>
              ) : (
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No companies available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedClientId || loadingUsers}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-red-200 bg-red-50 text-red-800 rounded-md"
        >
          {error}
        </motion.div>
      )}

      {selectedClientId ? (
        <UserList
          users={filteredUsers}
          loading={loadingUsers}
          companyName={clients.find((c) => c.id.toString() === selectedClientId)?.name || "Selected Company"}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a Company</h3>
            <p className="text-muted-foreground text-center">
              Please select a company from the dropdown above to view its users.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

