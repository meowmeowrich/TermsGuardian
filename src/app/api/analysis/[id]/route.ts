import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysis = await prisma.analysis.findUnique({
      where: { id }
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    if (!analysis.fullResponse) {
      return NextResponse.json({ error: 'Full response missing' }, { status: 404 });
    }

    const parsedData = JSON.parse(analysis.fullResponse);
    return NextResponse.json({ ...parsedData, id: analysis.id });
  } catch (error: any) {
    console.error('Fetch analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}
