import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Erreur lors de la déconnexion' }, { status: 500 })
  }
}