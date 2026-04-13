import { NextRequest, NextResponse } from 'next/server';
import { runStatisticsQuery } from '@/lib/statistics-api/postgres';

export const runtime = 'nodejs';

const PATENTS_FILING_QUERY = `
  select
    iac_application_category_desc as domain,
    cast(extract(year from iai_filling_date_g) as int) as year,
    count(*)::int as count_of_applications,
    iac_applicant_category_name as applicant_category
  from vw_ip_information_patents
  where iac_application_category_desc is not null
    and iai_filling_date_g is not null
    and ($1::text is null or iac_application_category_desc = $1)
  group by
    iac_application_category_desc,
    cast(extract(year from iai_filling_date_g) as int),
    iac_applicant_category_name
  order by year, domain, applicant_category
`;

const PATENTS_REGISTERED_QUERY = `
  select
    iac_application_category_desc as domain,
    cast(extract(year from ici_certificate_grant_date_g) as int) as year,
    count(*)::int as count_of_applications,
    iac_applicant_category_name as applicant_category
  from vw_ip_information_patents
  where iac_application_category_desc is not null
    and ici_certificate_grant_date_g is not null
    and ($1::text is null or iac_application_category_desc = $1)
  group by
    iac_application_category_desc,
    cast(extract(year from ici_certificate_grant_date_g) as int),
    iac_applicant_category_name
  order by year, domain, applicant_category
`;

const TRADEMARKS_FILING_QUERY = `
  select
    cast(extract(year from fillingdate) as int) as year,
    owner_type,
    count(*)::int as count_of_applications
  from vw_ip_information_trademarks
  where fillingdate is not null
    and extract(year from fillingdate) >= 2019
  group by
    cast(extract(year from fillingdate) as int),
    owner_type
  order by year, owner_type
`;

const TRADEMARKS_REGISTERED_QUERY = `
  select
    cast(extract(year from registrationdate) as int) as year,
    owner_type,
    count(*)::int as count_of_applications
  from vw_ip_information_trademarks
  where registrationdate is not null
    and extract(year from registrationdate) >= 2019
  group by
    cast(extract(year from registrationdate) as int),
    owner_type
  order by year, owner_type
`;

const COPYRIGHTS_FILING_QUERY = `
  select
    cast(extract(year from submission_date) as int) as year,
    claimanttype as applicant_category,
    count(*)::int as count_of_applications
  from vw_ip_information_copyrights
  where submission_date is not null
  group by
    cast(extract(year from submission_date) as int),
    claimanttype
  order by year, applicant_category
`;

const COPYRIGHTS_REGISTERED_QUERY = `
  select
    cast(extract(year from registration_date) as int) as year,
    claimanttype as applicant_category,
    count(*)::int as count_of_applications
  from vw_ip_information_copyrights
  where registration_date is not null
  group by
    cast(extract(year from registration_date) as int),
    claimanttype
  order by year, applicant_category
`;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string; type: string }> },
) {
  const { category, type } = await context.params;
  const domain = request.nextUrl.searchParams.get('domain');

  try {
    if (category === 'patents') {
      const query = type === 'registered' ? PATENTS_REGISTERED_QUERY : PATENTS_FILING_QUERY;
      const rows = await runStatisticsQuery(query, [domain]);
      return NextResponse.json(rows);
    }

    if (category === 'trademarks') {
      const query = type === 'registered' ? TRADEMARKS_REGISTERED_QUERY : TRADEMARKS_FILING_QUERY;
      const rows = await runStatisticsQuery(query);
      return NextResponse.json(rows);
    }

    if (category === 'copyrights') {
      const query = type === 'registered' ? COPYRIGHTS_REGISTERED_QUERY : COPYRIGHTS_FILING_QUERY;
      const rows = await runStatisticsQuery(query);
      return NextResponse.json(rows);
    }

    return NextResponse.json({ error: 'Unknown category' }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
