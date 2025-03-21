// API response structure for user
export interface ApiUser {
  ID: number;
  ClientID: number;
  MSID: string | null;
  UsersNum: string | null;
  LastName: string | null;
  FirstName: string | null;
  Fax: string | null;
  DisplayName: string | null;
  Username: string;
  Password: string;
  Position: string | null;
  Location: string | null;
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  CountryCode: string | null;
  Zip: string | null;
  Phone: string | null;
  OfficeNumber: string | null;
  Mobile: string | null;
  Email: string;
  StartDate: string;
  EndDate: string | null;
  Status: string;
  Comments: string | null;
  UserType: number;
  Department: string | null;
  Job: string | null;
  Role: string;
  Credentials: string | null;
  PersonalEmail: string | undefined;
  SupervisorEmail: string | null;
  SupervisorID: string | null;
  Cancelled: boolean;
  CreatedDatetime: string;
  CreatedUser: string;
}

// Our application's user model (simplified for our needs)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  clientId: number;
  avatar?: string;
  username?: string;
  personalEmail?: string;
  status?: string;
}

// The API returns an array of users
export type UserResponse = ApiUser;
