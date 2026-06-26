import { createHmac } from 'crypto'

const WOMPI_API_URL =
  process.env.WOMPI_SANDBOX === 'true' ? 'https://sandbox.wompi.co/v1' : 'https://api.wompi.co/v1'

function authHeaders() {
  const key = process.env.WOMPI_PRIVATE_KEY
  if (!key) throw new Error('WOMPI_PRIVATE_KEY no configurada')
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

export interface WompiTransactionResult {
  id: string
  amountInCents: number
  reference: string
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED'
}

export async function getAcceptanceToken(): Promise<string> {
  const pubKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
  if (!pubKey) throw new Error('NEXT_PUBLIC_WOMPI_PUBLIC_KEY no configurada')

  const res = await fetch(`${WOMPI_API_URL}/merchants/${pubKey}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Wompi merchant error ${res.status}: ${text}`)
  }

  const json = await res.json()
  return json.data.presigned_acceptance.acceptance_token
}

export async function createTransaction(params: {
  amountInCents: number
  reference: string
  customerEmail: string
  redirectUrl: string
  webhookUrl: string
  acceptanceToken: string
}): Promise<{ id: string; url: string }> {
  const body = {
    amount_in_cents: params.amountInCents,
    currency: 'COP',
    reference: params.reference,
    customer_email: params.customerEmail,
    redirect_url: params.redirectUrl,
    webhook_url: params.webhookUrl,
    acceptance_token: params.acceptanceToken,
  }

  const res = await fetch(`${WOMPI_API_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Wompi transaction error ${res.status}: ${text}`)
  }

  const json = await res.json()
  return { id: json.data.id, url: json.data.url }
}

export async function getTransaction(id: string): Promise<WompiTransactionResult> {
  const res = await fetch(`${WOMPI_API_URL}/transactions/${id}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Wompi get error ${res.status}: ${text}`)
  }

  const json = await res.json()
  const d = json.data
  return {
    id: d.id,
    amountInCents: d.amount_in_cents,
    reference: d.reference,
    status: d.status,
  }
}

export function verifyWebhookSignature(body: string, signatureHeader: string): boolean {
  const parts = signatureHeader.split('=')
  if (parts.length !== 2 || parts[0] !== 'sha256') return false

  const secret = process.env.WOMPI_EVENTOS_SECRET
  if (!secret) return false

  const expected = createHmac('sha256', secret).update(body).digest('hex')
  return expected === parts[1]
}

export function generateReference(eventoId: string, usuarioId: string): string {
  return `OP-${eventoId}-${usuarioId}-${Date.now()}`
}
