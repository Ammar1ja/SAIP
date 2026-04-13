'use client';

import { DocumentData } from '@/lib/drupal/services/ip-general-secretariat.service';
import Section from '@/components/atoms/Section';
import Heading from '@/components/atoms/Heading';

interface GeneralSecretariatDocumentsDecisionsProps {
  documents: DocumentData[];
  title: string;
  noDocumentsText: string;
  viewDocumentText: string;
}

export function GeneralSecretariatDocumentsDecisions({
  documents,
  title,
  noDocumentsText,
  viewDocumentText,
}: GeneralSecretariatDocumentsDecisionsProps) {
  return (
    <Section background="white" padding="default">
      <Heading as="h2" size="h2" className="mb-6">
        {title}
      </Heading>
      {documents.length === 0 ? (
        <p className="text-gray-600">{noDocumentsText}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{doc.name}</h3>
              <p className="text-sm text-neutral-600 mb-2">{doc.committeeType}</p>
              <div className="flex gap-4 text-xs text-neutral-500 mb-4">
                <span>{doc.date}</span>
                <span>{doc.hijriDate}</span>
              </div>
              <a
                href={doc.fileUrl}
                className="text-primary-700 hover:text-primary-900 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {viewDocumentText} →
              </a>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
