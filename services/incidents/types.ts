export interface Incident {
  IDTicket: number
  CodTicket: string
  ClientID: number
  Title: string
  Description: string
  Status: number
  Type: string
  AffectedProduct: number
  Priority: string
  CreatedBy: number
  ContactMethod: string
  Location: string | null
  AssignedToUser: string | null
  Availability: string
  CreatedDatatime: string // Updated field name to match API
  ModDatetime: string | null // Updated field name to match API
  AssignedHWMS: string | null // Updated field name to match API
  AssignedVendor: string | null
  NeedHardware: number // Updated field name to match API
  IssueType: string | null
  SubIssueType: string | null
}

// Helper function to convert status number to string
export function getStatusString(status: number): string {
  switch (status) {
    case 1:
      return "open"
    case 2:
      return "in-progress"
    case 3:
      return "resolved"
    default:
      return "unknown"
  }
}

export interface IncidentDetail {
  id: string
  title: string
  description: string
  account: string
  contract: string
  owner: string
  openDate: string
  dueDate: string
  createdBy: string
  assignee: string
  priority: string
  status: string
  requiresChange?: boolean
  assignType?: string
  assignedTo?: string
  notes: IncidentNote[]
  createdAt: string
  updatedAt: string
}

export interface IncidentNote {
  id: string
  text: string
  createdAt: string
  createdBy: string
}

// Update types to match the API requirements
export interface CreateTicketPayload {
  Title: string
  Description: string
  ContactMethod: string
  Type: string
  Availability: string
  CreatedBy: number
  Status: number
  ClientID: number
  AffectedProduct: number
  AffectedUsers: number[]
  attachments?: File[]
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Product {
  id: number
  name: string
  type: string
}

// Add new interface for queue tickets that includes ClientName and AssignedUserName
export interface QueueTicket {
  IDTicket: number
  CodTicket: string
  ClientID: number
  Title: string
  Description: string
  Status: number
  Type: string
  AffectedProduct: number
  Priority: string
  CreatedBy: number
  ContactMethod: string
  Location: string | null
  AssignedToUser: number | null
  Availability: string
  CreatedDatatime: string
  ModDatetime: string | null
  AssignedHWMS: number | null
  AssignedVendor: number | null
  NeedHardware: number
  IssueType: string | null
  SubIssueType: string | null
  ClientName: string
  AssignedUserName: string
}

// Update the incidents service interface
export interface IncidentsService {
  getIncidents: (userId: number) => Promise<Incident[]>
  getQueueTickets: () => Promise<QueueTicket[]>
  // ... other methods
}

// Add this new interface for ticket statuses
export interface TicketStatus {
  IDStatus: number
  Description: string
}

