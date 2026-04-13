import { Comment } from '@/app/[locale]/media-center/media-library/media-center/data/comments.data';

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Publication Date: {comment.publicationDate}</p>
        <h4 className="text-lg font-semibold text-gray-900">{comment.author}</h4>
      </div>

      <div className="text-gray-700 leading-relaxed">
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
