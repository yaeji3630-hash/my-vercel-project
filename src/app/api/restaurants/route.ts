import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const restaurants = await db.restaurant.findMany({
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });
    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants.' }, { status: 500 });
  }
}
