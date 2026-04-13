import { getProjectDetail } from '@/lib/drupal/services/projects.service';
import { notFound } from 'next/navigation';
import ProjectModalClient from './ProjectModalClient';

export default async function ProjectModal({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const project = await getProjectDetail(slug, locale);

  if (!project) {
    notFound();
  }

  return <ProjectModalClient project={project} />;
}
