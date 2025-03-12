"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useIncidentForm } from "@/hooks/useIncidentForm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { MultiUserSelect } from "./multi-user-select"
import { DateTimePicker } from "@/components/ui/date-picker"
import { useAuth } from "@/components/auth/auth-provider"
import { useUsers } from "@/hooks/useUsers"
import { useProducts } from "@/hooks/useProducts"

export function IncidentForm() {
  const { isSubmitting, error, handleSubmit, handleFileChange } = useIncidentForm()
  const [peopleAffected, setPeopleAffected] = useState<string>("individual")
  const [selectedUsers, setSelectedUsers] = useState<Array<{ id: number; name: string }>>([])
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined)
  const [contactMethod, setContactMethod] = useState<string>("")
  const { userInfo } = useAuth() // Get user info from auth context
  const { users, loading: loadingUsers } = useUsers("User")
  const { products, loading: productsLoading, error:
    productsError} = useProducts()
  
  // Update contact method when it changes
  const handleContactMethodChange = (value: string) => {
    setContactMethod(value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Determine the contact method value
    let contactMethodValue = contactMethod
    if (contactMethod === "email" && userInfo?.email) {
      contactMethodValue = userInfo.email
    }

    const payload = {
      Title: formData.get("incident-title") as string,
      Description: formData.get("description") as string,
      ContactMethod: contactMethodValue as string,
      Type: "Tech Support",
      Availability: availabilityDate?.toISOString() || new Date().toISOString(),
      // Ensure numeric values are numbers, not strings
      CreatedBy: userInfo?.id as number,
      Status: 1,
      ClientID: userInfo?.clientId as number,
      AffectedProduct: Number(formData.get("affected-item")),
      AffectedUsers:
        peopleAffected === "individual"
          ? [userInfo?.id as number]
          : selectedUsers.length > 0
            ? selectedUsers.map((user) => user.id)
            : [45, 46, 47],
    }

    // Get the files from the file input
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
    const files = fileInput?.files ? Array.from(fileInput.files) : []

    try {
      console.log("Submitting ticket with payload:", payload)
      console.log("Files:", files)

      // Explicitly pass the files array
      const success = await handleSubmit(payload, files)
      if (success) {
        window.location.href = "/incidents/list"
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-primary">Report a general IT issue</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
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
              <div className="p-3 border rounded-md bg-muted/20">
                <p className="text-sm">You are reporting this issue for yourself</p>
                <p className="text-xs text-muted-foreground mt-1">
                  User ID: {userInfo?.id || "Not available"} • {userInfo?.email || "Unknown email"}
                </p>
              </div>
            ) : (
              <MultiUserSelect
              users={users.map((user) => ({ id: user.id, name: user.name }))}
                selectedUsers={selectedUsers}
                onUserSelect={setSelectedUsers}
                isLoading={loadingUsers}
              />
            )}
          </div>

          {/* What is being affected */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">What is being affected?</h2>
            <Select name="affected-item">
              <SelectTrigger>
              <SelectValue placeholder={productsLoading ? "Loading products..." : "Select affected item"} />
              </SelectTrigger>
              <SelectContent>
              {productsLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading products...</span>
                  </div>
                ) : productsError ? (
                  <div className="text-red-500 p-2 text-sm">Failed to load products. Please try again later.</div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No products available</div>
                )}
              </SelectContent>
            </Select>
            {productsError && (
              <p className="text-sm text-red-500 mt-1">Error loading products. Using default options.</p>
            )}
          </div>

          {/* Incident title */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Incident title</h2>
            <Input name="incident-title" placeholder="Enter a title for your incident" required />
          </div>

          {/* Issue description */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Issue description</h2>
            <Textarea
              name="description"
              placeholder="Describe the issue in detail"
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Contact Method */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Contact Method</h2>
            <Select name="contact-method" value={contactMethod} onValueChange={handleContactMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Your Email ({userInfo?.email || "Not available"})</SelectItem>
              </SelectContent>
            </Select>

            {contactMethod === "email" && userInfo?.email && (
              <p className="text-sm text-muted-foreground mt-1">
                Your email address ({userInfo.email}) will be used as the contact method.
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Availability</h2>
            <DateTimePicker date={availabilityDate} setDate={setAvailabilityDate} />
          </div>

          {/* File attachments */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-primary">Attachments</h2>
            <Input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              className="cursor-pointer"
              accept="image/*,.pdf,.doc,.docx"
            />
            <p className="text-sm text-muted-foreground">Supported file types: Images, PDF, Word documents</p>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

