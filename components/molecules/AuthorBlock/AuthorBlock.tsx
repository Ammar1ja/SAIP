import Image from 'next/image';
import { ActionIcons } from '@/components/molecules/ActionIcons';

interface AuthorBlockProps {
  author?: string;
  image?: string;
  onShare?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

export function AuthorBlock({ author, image, onShare, onPrint, onDownload }: AuthorBlockProps) {
  return (
    <div className="max-w-[300px] lg:w-1/3">
      <div className="text-center">
        <div className="relative w-full h-76 mx-auto mb-6 rounded-lg">
          <Image
            src={image || '/images/photo-container.png'}
            alt={author || 'Author'}
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {author || 'A. Hamed bin Mohammed Fayez'}
        </h3>

        <ActionIcons onShare={onShare} onPrint={onPrint} onDownload={onDownload} size="md" />
      </div>
    </div>
  );
}
