import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import Image from '@/components/atoms/Image';
import { notFound } from 'next/navigation';
import { getProjectDetail } from '@/lib/drupal/services/projects.service';

interface GenerateMetadataProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale, slug } = params;
  const messages = await getMessages({ locale });
  const project = await getProjectDetail(slug, locale);

  return {
    title: project?.title || `${messages.projects?.project || 'Project'}: ${slug}`,
    description:
      project?.description ||
      messages.projects?.projectDescription ||
      'Detailed information about the SAIP project',
    openGraph: {
      title: project?.title || `${messages.projects?.project || 'Project'}: ${slug}`,
      description:
        project?.description ||
        messages.projects?.projectDescription ||
        'Detailed information about the SAIP project',
      type: 'article',
      images: [
        {
          url: project?.image?.url || `/images/projects/${slug}/hero.jpg`,
          width: 1200,
          height: 630,
          alt: project?.image?.alt || `Project: ${slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project?.title || `${messages.projects?.project || 'Project'}: ${slug}`,
      description:
        project?.description ||
        messages.projects?.projectDescription ||
        'Detailed information about the SAIP project',
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const project = await getProjectDetail(slug, locale);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={project.image?.url || '/images/projects/hero.jpg'}
          alt={project.image?.alt || project.title}
          className="h-full w-full"
          objectFit="cover"
        />
      </div>
      <h1 className="mt-8 text-3xl font-bold">{project.title}</h1>
      <p className="mt-4 text-gray-600">{project.description}</p>
    </article>
  );
}
