// app/api/auth/role/route.ts
import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ role: (session.user as any).role });
}
