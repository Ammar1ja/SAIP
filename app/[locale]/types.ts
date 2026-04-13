import { Metadata } from 'next';

export interface PageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
  modal: React.ReactNode;
}

export interface GenerateMetadataProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export type GenerateMetadata = (props: GenerateMetadataProps) => Promise<Metadata>;
