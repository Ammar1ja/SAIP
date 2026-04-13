import { PageProps } from '@/app/[locale]/types';
import { getContactSupportPageData } from '@/lib/drupal/services/contact-support.service';
import ContactAndSupportClient from './ContactAndSupportClient';

export default async function ContactAndSupport({ params }: PageProps) {
  const { locale } = await params;
  const data = await getContactSupportPageData(locale);

  return <ContactAndSupportClient data={data} />;
}
