"use client"

import { useState } from "react"
import { X, Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCompanyUsers } from "@/hooks/useCompanyUsers"
import type { User } from "@/services/user/types"

interface MultiUserSelectProps {
  selectedUsers: User[]
  onUserSelect: (users: User[]) => void
}

export function MultiUserSelect({ selectedUsers, onUserSelect }: MultiUserSelectProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { users, loading, error } = useCompanyUsers()

  const handleAddUser = () => {
    if (!selectedUserId) return

    const userToAdd = users.find((user) => user.id.toString() === selectedUserId)
    if (userToAdd && !selectedUsers.some((user) => user.id === userToAdd.id)) {
      onUserSelect([...selectedUsers, userToAdd])
    }

    setSelectedUserId("")
  }

  const handleRemoveUser = (userId: number) => {
    onUserSelect(selectedUsers.filter((user) => user.id !== userId))
  }

  // Get display email (use personal email if regular email is empty)
  const getDisplayEmail = (user: User) => {
    return user.email || user.personalEmail || ""
  }

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    const nameLower = user.name.toLowerCase()
    const emailLower = getDisplayEmail(user).toLowerCase()
    const usernameLower = (user.username || "").toLowerCase()

    return (
      !selectedUsers.some((selected) => selected.id === user.id) &&
      (nameLower.includes(searchLower) || emailLower.includes(searchLower) || usernameLower.includes(searchLower))
    )
  })

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-2 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : (
          <>
            <div className="relative flex-1">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {error ? (
                  <div className="p-2 text-sm text-destructive">Error loading users</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} {getDisplayEmail(user) ? `(${getDisplayEmail(user)})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="icon" onClick={handleAddUser} disabled={!selectedUserId}>
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
              {user.name}
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {user.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}

