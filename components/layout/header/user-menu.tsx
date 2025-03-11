"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Wrench } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useUser } from "@/hooks/useUser"

export function UserMenu() {
  const { userRole, logout } = useAuth()
  const { user, loading } = useUser()

  // Generate avatar text from user name or use fallback
  const getAvatarText = () => {
    if (loading || !user?.name) {
      return userRole === "User" ? "U" : "T"
    }

    const nameParts = user.name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`
    }
    return nameParts[0].substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">{getAvatarText()}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium">
            {loading ? "Loading..." : user?.name || (userRole === "User" ? "User" : "Technician")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@chrysalishealth.org"}</p>
            {user?.username && (
              <p className="text-xs leading-none text-muted-foreground mt-1">Username: {user.username}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {userRole !== "User" && (
            <DropdownMenuItem>
              <Wrench className="mr-2 h-4 w-4" />
              <span>Technician Tools</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

