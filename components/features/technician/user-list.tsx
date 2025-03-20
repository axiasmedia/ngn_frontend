"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, User, UserCog, ExternalLink, Inbox } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import type { User as UserType } from "@/services/user/types"

interface UserListProps {
  users: UserType[]
  loading: boolean
  companyName: string
}

export function UserList({ users, loading, companyName }: UserListProps) {
  const [sortField, setSortField] = useState<keyof UserType>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Handle sort
  const handleSort = (field: keyof UserType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    const fieldA = a[sortField] || ""
    const fieldB = b[sortField] || ""

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Get status color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading users...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            Users for {companyName} ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <div className="min-w-[800px] w-full">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <Table className="w-full table-fixed sticky-header">
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[20%] font-semibold cursor-pointer" onClick={() => handleSort("name")}>
                          <div className="flex items-center">
                            Name
                            {sortField === "name" && (
                              <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[20%] font-semibold cursor-pointer" onClick={() => handleSort("email")}>
                          <div className="flex items-center">
                            Email
                            {sortField === "email" && (
                              <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="w-[15%] font-semibold cursor-pointer"
                          onClick={() => handleSort("username")}
                        >
                          <div className="flex items-center">
                            Username
                            {sortField === "username" && (
                              <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[15%] font-semibold cursor-pointer" onClick={() => handleSort("role")}>
                          <div className="flex items-center">
                            Role
                            {sortField === "role" && (
                              <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="w-[15%] font-semibold cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            Status
                            {sortField === "status" && (
                              <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-[15%] font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {sortedUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            className="group border-b hover:bg-gray-50 transition-colors"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.15 },
                            }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {user.name || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.email ? (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate" title={user.email}>
                                    {user.email}
                                  </span>
                                </div>
                              ) : user.personalEmail ? (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate" title={`${user.personalEmail} (Personal)`}>
                                    {user.personalEmail} <span className="text-xs">(Personal)</span>
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No email</span>
                              )}
                            </TableCell>
                            <TableCell>{user.username || <span className="text-muted-foreground">N/A</span>}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                {user.role || "User"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.status)}>{user.status || "Unknown"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <UserCog className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Users Found</h3>
              <p className="text-muted-foreground text-center mb-6">
                There are no users available for this company or your search returned no results.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

