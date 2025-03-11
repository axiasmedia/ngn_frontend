export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface TokenPayload {
  id: number
  email: string
  role: string
  client: number
  iat: number
  exp: number
}

