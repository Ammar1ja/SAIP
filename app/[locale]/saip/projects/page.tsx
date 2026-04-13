import { PageProps, GenerateMetadata } from '../../types';
import { getMessages } from 'next-intl/server';
import { ProjectsContent } from './ProjectsContent';

export const generateMetadata: GenerateMetadata = async ({ params }) => {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: messages.projects?.pageTitle || 'Projects',
    description:
      messages.projects?.pageDescription || 'Learn more about our projects and initiatives',
    openGraph: {
      title: messages.projects?.pageTitle || 'Projects',
      description:
        messages.projects?.pageDescription || 'Learn more about our projects and initiatives',
      images: [
        {
          url: '/images/projects/hero.jpg',
          width: 1200,
          height: 630,
          alt: 'Projects',
        },
      ],
    },
  };
};

export default function ProjectsPage({ params }: PageProps) {
  return <ProjectsContent />;
}
