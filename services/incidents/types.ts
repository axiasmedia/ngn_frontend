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
  CreatedDatatime: string 
  DueDatetime: string | null 
  AssignedHWMS: string | null 
  AssignedVendor: string | null
  NeedHardware: number 
  IssueType: string | null
  SubIssueType: string | null
}

// Helper function to convert status number to string
export function getStatusString(status: number): { label: string; value: number } {
  switch (status) {
    case 1:
      return { label: "open", value: 1 }
    case 2:
      return { label: "in-progress", value: 2 }
    case 3:
      return { label: "resolved", value: 3 }
    case 4:
      return { label: "closed", value: 4 }
    case 5:
      return { label: "pending", value: 5 }
    case 6:
      return { label: "cancelled", value: 6 }
    default:
      return { label: "unknown", value: 0 }
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
  DueDatetime: string | null
  AssignedHWMS: number | null
  AssignedVendor: number | null
  NeedHardware: number
  IssueType: string | null
  SubIssueType: string | null
  ClientName: string
  AssignedUserName: string
}

// Add this new interface for ticket statuses
export interface TicketStatus {
  IDStatus: number
  Description: string
}

export interface TicketDetail {
  IDAuton: number
  CodTicket: string
  Comments: string
  Status: number
  CreatedByAgent: number
  CreatedDatetime: string
  CodVendor: string | null
  notes?: TicketNote[]
  createdByName?: string
}

export interface TicketNote {
  id: string
  text: string
  createdAt: string
  createdBy: string
  status?: number
}

// Update the incidents service interface
export interface IncidentsService {
  getIncidents: (userId: number) => Promise<Incident[]>
  getQueueTickets: () => Promise<QueueTicket[]>
  getTicketStatuses: () => Promise<TicketStatus[]>
  // ... other methods
}

