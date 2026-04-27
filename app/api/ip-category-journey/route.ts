import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getPatentsPageData } from '@/lib/drupal/services/patents.service';
import { getTrademarksPageData } from '@/lib/drupal/services/trademarks.service';
import { getCopyrightsPageData } from '@/lib/drupal/services/copyrights.service';
import { getDesignsPageData } from '@/lib/drupal/services/designs.service';
import { getPlantVarietiesPageData } from '@/lib/drupal/services/plant-varieties.service';
import { getTopographicDesignsPageData } from '@/lib/drupal/services/topographic-designs.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Journey content is editorial and must reflect newly published sections
  // immediately. fetchDrupal tags every Drupal GET with 'drupal:global', so
  // invalidating it here forces fresh data without waiting for the data-cache
  // window or a pod restart.
  revalidateTag('drupal:global');

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

    // This route only returns data.journey, never data.overview.statistics —
    // skip the statistics paragraph fallback to save one Drupal round-trip.
    const fetchOptions = { includeJourney: true, includeStatistics: false };

    switch (category) {
      case 'patents':
        data = await getPatentsPageData(locale, fetchOptions);
        break;
      case 'trademarks':
        data = await getTrademarksPageData(locale, fetchOptions);
        break;
      case 'copyrights':
        data = await getCopyrightsPageData(locale, fetchOptions);
        break;
      case 'designs':
        data = await getDesignsPageData(locale, fetchOptions);
        break;
      case 'plant-varieties':
        data = await getPlantVarietiesPageData(locale, fetchOptions);
        break;
      case 'topographic':
        data = await getTopographicDesignsPageData(locale, fetchOptions);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported category' }, { status: 400 });
    }

    return NextResponse.json(
      { journey: data.journey },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('[ip-category-journey] failed to load:', {
      category,
      locale,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: 'Failed to load journey data',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
