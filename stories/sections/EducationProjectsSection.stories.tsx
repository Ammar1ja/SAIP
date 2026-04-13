import type { Meta, StoryObj } from '@storybook/nextjs';
import EducationProjectsSection from '@/components/sections/EducationProjectsSection';
import { MOCK_EDUCATION_PROJECTS } from '@/components/sections/EducationProjectsSection/EducationProjectsSection.data';

const meta: Meta<typeof EducationProjectsSection> = {
  title: 'Sections/EducationProjectsSection',
  component: EducationProjectsSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projects: MOCK_EDUCATION_PROJECTS,
  },
};

export const WithCustomData: Story = {
  args: {
    projects: [
      {
        id: 'custom-1',
        title: 'STEM Education Initiative',
        description:
          'A comprehensive program focused on Science, Technology, Engineering, and Mathematics education for young learners.',
        category: 'General education',
        detailsUrl: '/education/projects/stem-initiative',
        fileUrl: '/files/stem-initiative.pdf',
      },
      {
        id: 'custom-2',
        title: 'Teacher Digital Skills Workshop',
        description:
          'Professional development program to enhance digital literacy among educators.',
        category: 'Teacher training',
        detailsUrl: '/education/projects/digital-skills',
        fileUrl: '/files/digital-skills.pdf',
      },
      {
        id: 'custom-3',
        title: 'University Research Partnership',
        description:
          'Collaborative research project between educational institutions and industry partners.',
        category: 'Higher education',
        detailsUrl: '/education/projects/research-partnership',
        fileUrl: '/files/research-partnership.pdf',
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    projects: [],
  },
};
