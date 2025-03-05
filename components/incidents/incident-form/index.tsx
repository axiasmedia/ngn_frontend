"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormField } from "./form-field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-picker"
import { MultiUserSelect } from "./multi-user-select"

// Mock users data - in a real app, this would come from an API
const mockUsers = [
  { id: "user1", name: "John Doe" },
  { id: "user2", name: "Jane Smith" },
  { id: "user3", name: "Robert Johnson" },
  { id: "user4", name: "Emily Davis" },
  { id: "user5", name: "Michael Brown" },
]

export function IncidentForm() {
  // Form state
  const [peopleAffected, setPeopleAffected] = useState<string>("individual")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<Array<{ id: string; name: string }>>([])
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined)

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-primary">Report a general IT issue</h1>
        <form className="space-y-6">
          {/* How many people affected */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">How many people is this issue affecting?</h2>
            <RadioGroup value={peopleAffected} onValueChange={setPeopleAffected} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual user</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">Multiple users</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Affected user(s) */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">
              Affected user{peopleAffected === "multiple" ? "s" : ""}
            </h2>

            {peopleAffected === "individual" ? (
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user from directory" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <MultiUserSelect users={mockUsers} selectedUsers={selectedUsers} onUserSelect={setSelectedUsers} />
            )}
          </div>

          {/* What is being affected */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">What is being affected?</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select affected item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="handset">Handset</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="softphone">Softphone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incident title */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Incident title</h2>
            <FormField id="incident-title" label="" placeholder="Enter a title for your incident" />
          </div>

          {/* Issue description */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Issue description</h2>
            <FormField id="description" label="" placeholder="Describe the issue in detail" isTextarea={true} />
          </div>

          {/* Current location */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Current location</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office1">Main Office</SelectItem>
                <SelectItem value="office2">Branch Office</SelectItem>
                <SelectItem value="remote">Remote/Home</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred contact method */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Preferred contact method</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Attachments</h2>
            <FormField
              id="attachments"
              label=""
              type="file"
              placeholder="Upload screenshots or documents"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Availability</h2>
            <DateTimePicker date={availabilityDate} setDate={setAvailabilityDate} />
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

