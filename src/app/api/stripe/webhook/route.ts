import { NextResponse } from 'next/server'

export async function POST() {
  console.log('Webhook recibido')

  return NextResponse.json({
    received: true,
  })
}
