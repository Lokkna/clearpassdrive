import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  return NextResponse.json({ isAdmin: !!admin })
}
