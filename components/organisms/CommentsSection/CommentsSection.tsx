import React from 'react';
import AdvisoryBoardCarouselClient from '@/app/[locale]/saip/organisational-structure/AdvisoryBoardCarouselClient';
import { Comment } from '@/app/[locale]/media-center/media-library/media-center/data/comments.data';

interface CommentsSectionProps {
  comments: Comment[];
  title?: string;
}

export function CommentsSection({ comments, title = 'Comments' }: CommentsSectionProps) {
  return <AdvisoryBoardCarouselClient heading={title} variant="comments" comments={comments} />;
}
