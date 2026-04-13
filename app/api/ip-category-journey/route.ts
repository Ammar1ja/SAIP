import { NextRequest, NextResponse } from 'next/server';
import { getPatentsPageData } from '@/lib/drupal/services/patents.service';
import { getTrademarksPageData } from '@/lib/drupal/services/trademarks.service';
import { getCopyrightsPageData } from '@/lib/drupal/services/copyrights.service';
import { getDesignsPageData } from '@/lib/drupal/services/designs.service';
import { getPlantVarietiesPageData } from '@/lib/drupal/services/plant-varieties.service';
import { getTopographicDesignsPageData } from '@/lib/drupal/services/topographic-designs.service';

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const locale = searchParams.get('locale') || 'en';

  if (!category) {
    return NextResponse.json({ error: 'Unsupported category' }, { status: 400 });
  }

  try {
    let data:
      | Awaited<ReturnType<typeof getPatentsPageData>>
      | Awaited<ReturnType<typeof getTrademarksPageData>>
      | Awaited<ReturnType<typeof getCopyrightsPageData>>
      | Awaited<ReturnType<typeof getDesignsPageData>>
      | Awaited<ReturnType<typeof getPlantVarietiesPageData>>
      | Awaited<ReturnType<typeof getTopographicDesignsPageData>>;

    switch (category) {
      case 'patents':
        data = await getPatentsPageData(locale, { includeJourney: true });
        break;
      case 'trademarks':
        data = await getTrademarksPageData(locale, { includeJourney: true });
        break;
      case 'copyrights':
        data = await getCopyrightsPageData(locale, { includeJourney: true });
        break;
      case 'designs':
        data = await getDesignsPageData(locale, { includeJourney: true });
        break;
      case 'plant-varieties':
        data = await getPlantVarietiesPageData(locale, { includeJourney: true });
        break;
      case 'topographic':
        data = await getTopographicDesignsPageData(locale, { includeJourney: true });
        break;
      default:
        return NextResponse.json({ error: 'Unsupported category' }, { status: 400 });
    }

    return NextResponse.json(
      { journey: data.journey },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load journey data' }, { status: 500 });
  }
}
