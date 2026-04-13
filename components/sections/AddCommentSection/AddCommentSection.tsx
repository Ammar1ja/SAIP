import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { CommentForm, CommentFormData } from '@/components/organisms/CommentForm';

interface AddCommentSectionProps {
  onSubmit: (data: CommentFormData) => void;
  className?: string;
}

export function AddCommentSection({ onSubmit, className }: AddCommentSectionProps) {
  return (
    <LayoutWrapper className={`py-8 ${className || ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="h-fit">
              <h2 className="text-4xl font-bold text-gray-900">Add comment</h2>
            </div>
          </div>

          <div className="lg:w-2/3">
            <CommentForm onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
