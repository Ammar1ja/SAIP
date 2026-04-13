'use client';

import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { Article } from '../../data/articles.data';
import { AuthorBlock } from '@/components/molecules/AuthorBlock';
import { ArticleContentBlock } from '@/components/molecules/ArticleContentBlock';
import { CommentsSection } from '@/components/organisms/CommentsSection';
import { AddCommentSection } from '@/components/sections/AddCommentSection';
import { CommentFormData } from '@/components/organisms/CommentForm';
import { comments } from '../../data/comments.data';

interface ArticleDetailProps {
  article: Article;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const handleShare = () => {
    console.log('Share article:', article.title);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log('Download article:', article.title);
  };

  const handleCommentSubmit = (data: CommentFormData) => {
    console.log('New comment submitted:', data);
  };

  return (
    <LayoutWrapper className="py-8">
      <div className="max-w-7xl ">
        <div className="flex flex-col justify-between mt-16 lg:flex-row gap-8">
          <AuthorBlock
            author={article.author}
            image={article.image}
            onShare={handleShare}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
          <ArticleContentBlock content={article.content} />
        </div>
      </div>

      <div className="mt-16">
        <CommentsSection comments={comments} />
      </div>

      <AddCommentSection onSubmit={handleCommentSubmit} />
    </LayoutWrapper>
  );
}
