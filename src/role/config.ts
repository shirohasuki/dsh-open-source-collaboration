export interface Config {
  clientId: string
  repos: string[]
  scopes: string
  apiBaseUrl: string
  oauthBaseUrl: string
}

export type GrantPayload = { accessToken: string }
