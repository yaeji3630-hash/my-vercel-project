import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const restaurant = await db.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
    }

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('Failed to fetch restaurant detail:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant detail.' }, { status: 500 });
  }
}
