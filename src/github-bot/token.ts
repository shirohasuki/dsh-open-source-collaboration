import { readFileSync } from 'node:fs'
import { createSign } from 'node:crypto'

export interface InstallationTokenConfig {
  appId: number
  installationId: number
  privateKeyFile: string
  apiBaseUrl?: string
}

export interface InstallationToken {
  token: string
  expiresAt: string
}

export function readPrivateKey(path: string): string {
  if (!path) throw new Error('github-bot: privateKeyFile is required')
  try {
    const pem = readFileSync(path, 'utf8')
    if (!pem) throw new Error('private key file is empty')
    return pem
  } catch (error) {
    throw new Error(`github-bot: cannot read private key file ${path}`, { cause: error })
  }
}

export function createAppJwt(appId: number, pem: string): string {
  const now = Math.floor(Date.now() / 1000)
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const header = encode({ alg: 'RS256', typ: 'JWT' })
  const payload = encode({ iat: now - 60, exp: now + 540, iss: appId })
  const signingInput = `${header}.${payload}`
  const signature = createSign('RSA-SHA256').update(signingInput).end().sign(pem).toString('base64url')
  return `${signingInput}.${signature}`
}

export async function createInstallationToken(config: InstallationTokenConfig): Promise<InstallationToken> {
  const jwt = createAppJwt(config.appId, readPrivateKey(config.privateKeyFile))
  const response = await fetch(
    `${config.apiBaseUrl ?? 'https://api.github.com'}/app/installations/${config.installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${jwt}`,
        'x-github-api-version': '2022-11-28',
      },
    },
  )
  const body = await response.text()
  if (!response.ok) throw new Error(`github-bot: GitHub API ${response.status}: ${body}`)
  const result = JSON.parse(body) as { token: string; expires_at: string }
  return { token: result.token, expiresAt: result.expires_at }
}
