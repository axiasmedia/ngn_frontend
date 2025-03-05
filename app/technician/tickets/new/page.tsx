"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/features/technician/rich-text-editor"

export default function NewTicketPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In a real app, this would create a new ticket via API
    router.push("/technician/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/technician/dashboard">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tickets
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Ticket</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Duration: 00:01:03</span>
          <Button variant="outline">Cancel</Button>
          <Button type="submit" form="ticket-form">
            Create
          </Button>
        </div>
      </div>

      <form id="ticket-form" onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Add title" required />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select defaultValue="new">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Details *</Label>
                <RichTextEditor />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>
            <div className="space-y-6">
              {/* Assignee and Queue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assignee *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team1">Tech Support Team</SelectItem>
                      <SelectItem value="team2">Network Team</SelectItem>
                      <SelectItem value="team3">Security Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Queue *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select queue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="hardware">Hardware Support</SelectItem>
                      <SelectItem value="software">Software Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Secondary Assignees and CCs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secondary Assignees</Label>
                  <Input placeholder="Select secondary assignees" />
                </div>
                <div className="space-y-2">
                  <Label>CCs</Label>
                  <Input placeholder="Select CCs" />
                </div>
              </div>

              {/* Type and Work Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="request">Service Request</SelectItem>
                      <SelectItem value="problem">Problem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Work Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="break-fix">Break/Fix</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Issue Type and Sub-issue Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-issue Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="printer">Printer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contract and SLA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contract</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard SLA</SelectItem>
                      <SelectItem value="premium">Premium SLA</SelectItem>
                      <SelectItem value="enterprise">Enterprise SLA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SLA</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SLA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4hour">4 Hour Response</SelectItem>
                      <SelectItem value="8hour">8 Hour Response</SelectItem>
                      <SelectItem value="24hour">24 Hour Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="datetime-local" />
              </div>

              {/* Assets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Affected Hardware Asset</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hardware asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop1">Laptop X1</SelectItem>
                      <SelectItem value="desktop1">Desktop D1</SelectItem>
                      <SelectItem value="printer1">Printer P1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Affected Software Asset</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select software asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="windows">Windows 11</SelectItem>
                      <SelectItem value="office">Microsoft Office</SelectItem>
                      <SelectItem value="adobe">Adobe Creative Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Custom Fields</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Field 1</Label>
                <Input placeholder="Custom field 1" />
              </div>
              <div className="space-y-2">
                <Label>Field 2</Label>
                <Input placeholder="Custom field 2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Attachments</h2>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Drop files to attach, or{" "}
                <Button variant="link" className="p-0">
                  browse
                </Button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Max file size 25MB each</p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

