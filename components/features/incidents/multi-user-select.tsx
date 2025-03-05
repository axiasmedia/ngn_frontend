"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
}

interface MultiUserSelectProps {
  users: User[]
  selectedUsers: User[]
  onUserSelect: (users: User[]) => void
}

export function MultiUserSelect({ users, selectedUsers, onUserSelect }: MultiUserSelectProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  const handleAddUser = () => {
    if (!selectedUserId) return

    const userToAdd = users.find((user) => user.id === selectedUserId)
    if (userToAdd && !selectedUsers.some((user) => user.id === userToAdd.id)) {
      onUserSelect([...selectedUsers, userToAdd])
    }

    setSelectedUserId("")
  }

  const handleRemoveUser = (userId: string) => {
    onUserSelect(selectedUsers.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select user from directory" />
          </SelectTrigger>
          <SelectContent>
            {users
              .filter((user) => !selectedUsers.some((selected) => selected.id === user.id))
              .map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="icon" onClick={handleAddUser} disabled={!selectedUserId}>
          <Plus className="h-4 w-4" />
        </Button>
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
    </div>
  )
}

