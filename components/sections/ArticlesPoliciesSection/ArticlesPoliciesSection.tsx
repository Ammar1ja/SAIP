import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import Paragraph from '@/components/atoms/Paragraph';

interface ArticlesPoliciesSectionProps {
  title: string;
  description: string;
  publishingGuidelines: string[];
  submissionInstructions: string[];
  contactEmail: string;
}

export function ArticlesPoliciesSection({
  title,
  description,
  publishingGuidelines,
  submissionInstructions,
  contactEmail,
}: ArticlesPoliciesSectionProps) {
  return (
    <LayoutWrapper className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

          <Paragraph className="text-gray-700 mb-8">{description}</Paragraph>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Publishing Guidelines:</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {publishingGuidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Submit Articles:</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {submissionInstructions.map((instruction, index) => (
                  <li key={index}>
                    {instruction.includes(contactEmail) ? (
                      <>
                        {instruction.split(contactEmail)[0]}
                        <span className="font-semibold text-primary-600">{contactEmail}</span>
                        {instruction.split(contactEmail)[1]}
                      </>
                    ) : (
                      instruction
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
