export interface ApiClient {
    IDClient: number
    ClientName: string
    ClientType: number
    MSTenantID: string | null
    ClientID: string | null
    Address1: string | null
    Address2: string | null
    City: string | null
    State: string | null
    Zip: string | null
    CountryCode: number | null
    StatesCode: string | null
    CityCode: string | null
    Language: string | null
    Currency: string | null
    Phone: string | null
    Fax: string | null
    WebSite: string | null
    ContactLastName: string | null
    ContactFirstName: string | null
    ContactEmail: string | null
    ContactPhone: string | null
    ClientLogo: string | null
    Status: string
    Comments: string | null
    MainDomain: string
    Cancelled: boolean
    CreatedDatetime: string
  }
  
  export interface Client {
    id: number
    name: string
  }
  
  export type ClientResponse = ApiClient[]
  
  