import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_COPYRIGHTS_FILING,
  MOCK_COPYRIGHTS_REGISTERED,
  MOCK_PATENTS_FILING,
  MOCK_PATENTS_REGISTERED,
  MOCK_TRADEMARKS_FILING,
  MOCK_TRADEMARKS_REGISTERED,
} from '@/lib/statistics-api/mock-data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string; type: string }> },
) {
  const { category, type } = await context.params;

  if (category === 'patents') {
    const domain = request.nextUrl.searchParams.get('domain');
    const source = type === 'registered' ? MOCK_PATENTS_REGISTERED : MOCK_PATENTS_FILING;
    const data = domain ? source.filter((row) => row.domain === domain) : source;
    return NextResponse.json(data);
  }

  if (category === 'trademarks') {
    const data = type === 'registered' ? MOCK_TRADEMARKS_REGISTERED : MOCK_TRADEMARKS_FILING;
    return NextResponse.json(data);
  }

  if (category === 'copyrights') {
    const data = type === 'registered' ? MOCK_COPYRIGHTS_REGISTERED : MOCK_COPYRIGHTS_FILING;
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Unknown category' }, { status: 404 });
}
