'use client';

import { JourneyCategoryCardsProps } from './JourneyCategoryCards.types';

/**
 * JourneyCategoryCards Component
 *
 * Renders a list of category cards with title and description.
 * Used for "Not patentable categories" section in Patents Journey.
 *
 * Design: Cards with gray background, border, and rounded corners.
 */
const JourneyCategoryCards = ({ items, className = '' }: JourneyCategoryCardsProps) => {
  // Helper to render description with proper numbered lists
  const renderDescription = (description?: string) => {
    if (!description) return null;

    const lines = description.split('\n').filter((line) => line.trim());

    // Check if content is a numbered list
    const isNumberedList = lines.every((line) => /^\d+\.\s/.test(line.trim()));

    if (isNumberedList) {
      return (
        <ol className="list-decimal ms-5 space-y-4">
          {lines.map((line, idx) => {
            const text = line.trim().replace(/^\d+\.\s*/, '');

            // Check if line has bold label (e.g., "Business models: description")
            const colonIndex = text.indexOf(':');
            if (colonIndex > 0 && colonIndex < 50) {
              const label = text.substring(0, colonIndex);
              const content = text.substring(colonIndex + 1).trim();

              return (
                <li key={idx} className="text-base text-neutral-700 leading-6 ps-1">
                  <strong className="font-semibold">{label}:</strong> {content}
                </li>
              );
            }

            return (
              <li key={idx} className="text-base text-neutral-700 leading-6 ps-1">
                {text}
              </li>
            );
          })}
        </ol>
      );
    }

    // Fallback: render as plain text
    return (
      <p className="text-base text-neutral-700 leading-6 whitespace-pre-line">{description}</p>
    );
  };

  return (
    <div className={`mt-6 flex flex-col gap-6 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="
            bg-neutral-50 
            rounded-lg 
            p-6 
            transition-all 
            duration-200
          "
        >
          {/* Header */}
          <h4 className="text-lg font-semibold text-default mb-4 leading-7">{item.title}</h4>

          {/* Description with proper list rendering */}
          {renderDescription(item.description)}
        </div>
      ))}
    </div>
  );
};

export default JourneyCategoryCards;
