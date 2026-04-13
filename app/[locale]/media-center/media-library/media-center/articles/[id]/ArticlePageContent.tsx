'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import LayoutWrapper from '@/components/atoms/LayoutWrapper';
import { Button } from '@/components/atoms/Button';
import { ChevronIcon } from '@/components/icons';
import { submitArticleComment } from '@/app/actions/webform';
import { Comment } from '../../data/comments.data';
import type { Article } from '@/lib/drupal/services/articles.service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ArticlePageContentProps {
  article: Article;
  comments: Comment[];
  dir: 'ltr' | 'rtl';
  breadcrumbs: Array<{ label: string; href?: string }>;
  strings: {
    backLabel: string;
    publicationDate: string;
    commentsTitle: string;
    addCommentTitle: string;
    seeMore: string;
    authorFallback: string;
    form: {
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phoneNumber: string;
      phoneNumberPlaceholder: string;
      comment: string;
      commentPlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
}

export default function ArticlePageContent({
  article,
  comments,
  dir,
  breadcrumbs,
  strings,
}: ArticlePageContentProps) {
  const router = useRouter();
  const isRtl = dir === 'rtl';

  const [showAllComments, setShowAllComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  const handleCommentSubmit = async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    comment: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const result = await submitArticleComment({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        comment: data.comment,
        articleId: article.id,
        articleTitle: article.title,
        pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      });

      if (result.success) {
        setSubmitSuccess(true);
        router.refresh();
      } else {
        setSubmitError(result.message || strings.form.error);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : strings.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <section className="bg-primary-25 h-[520px]">
        <LayoutWrapper className="h-full py-10">
          <div className="flex h-full flex-col gap-8">
            <Breadcrumbs items={breadcrumbs} variant="subpage" />
            <Button
              intent="neutral"
              outline
              className="h-8 w-fit gap-2 rounded-[4px] px-3 py-0 text-sm"
              href="/media-center/media-library/media-center?tab=articles"
              ariaLabel={strings.backLabel}
            >
              <ChevronIcon className={`h-4 w-4 ${isRtl ? 'rotate-270' : 'rotate-90'}`} />
              <span>{strings.backLabel}</span>
            </Button>
            <div className="max-w-[954px] space-y-4">
              <h1 className="text-[36px] leading-[44px] md:text-[48px] md:leading-[60px] font-medium tracking-[-0.96px] text-[#161616]">
                {article.title}
              </h1>
              <p className="text-sm leading-5 text-[#6C737F]">
                {strings.publicationDate}: {article.publishDate}
              </p>
              {article.categories?.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {article.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex h-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-0 text-[16px] leading-6 font-medium text-[#1F2A37]"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </LayoutWrapper>
      </section>

      <section className="bg-white">
        <LayoutWrapper className="py-16">
          <div className="mx-auto flex w-full max-w-[845px] flex-col gap-8">
            <div className="relative h-[320px] w-full overflow-hidden rounded-[24px] md:h-[549px]">
              <Image
                src={article.image || '/images/photo-container.png'}
                alt={article.imageAlt || article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="mx-auto w-full max-w-[628px]">
              <div
                className="space-y-4 text-base leading-6 text-[#384250] [&_h3]:mt-8 [&_h3]:text-[20px] [&_h3]:leading-[30px] [&_h3]:font-medium [&_h3]:text-[#161616] [&_p]:text-base [&_p]:leading-6"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
              <div className="mt-6 rounded-[8px] bg-primary-50 px-4 py-4 text-sm leading-5 text-[#161616]">
                Source: SAIP
              </div>
            </div>
          </div>
        </LayoutWrapper>
      </section>

      <section className="bg-neutral-50">
        <LayoutWrapper className="py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-medium text-neutral-900">{strings.commentsTitle}</h2>
              <div className="space-y-4">
                {visibleComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm text-neutral-500">
                      {strings.publicationDate}: {comment.publicationDate}
                    </p>
                    <p className="mt-2 text-lg font-medium text-neutral-900">{comment.author}</p>
                    <p className="mt-3 text-base text-neutral-700 leading-7">{comment.content}</p>
                  </div>
                ))}
              </div>
              {comments.length > 2 && (
                <Button
                  intent="neutral"
                  outline
                  className="h-10 px-6"
                  onClick={() => setShowAllComments((prev) => !prev)}
                  ariaLabel={strings.seeMore}
                >
                  {strings.seeMore}
                </Button>
              )}
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-medium text-neutral-900">{strings.addCommentTitle}</h2>
              <ArticleCommentForm
                onSubmit={handleCommentSubmit}
                isSubmitting={isSubmitting}
                submitSuccess={submitSuccess}
                submitError={submitError}
                dir={dir}
                strings={strings.form}
              />
            </div>
          </div>
        </LayoutWrapper>
      </section>
    </div>
  );
}

function ArticleCommentForm({
  onSubmit,
  isSubmitting,
  submitSuccess,
  submitError,
  dir,
  strings,
}: {
  onSubmit: (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    comment: string;
  }) => void;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  dir: 'ltr' | 'rtl';
  strings: {
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phoneNumber: string;
    phoneNumberPlaceholder: string;
    comment: string;
    commentPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
}) {
  const isRtl = dir === 'rtl';
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    comment: '',
  });

  const handleChange = (field: keyof typeof formValues) => (value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm text-neutral-900" htmlFor="full-name">
          {strings.fullName}
        </label>
        <input
          id="full-name"
          type="text"
          value={formValues.fullName}
          onChange={(e) => handleChange('fullName')(e.target.value)}
          placeholder={strings.fullNamePlaceholder}
          dir={dir}
          className={`h-10 w-full rounded-md border border-neutral-300 px-3 text-base text-neutral-700 outline-none focus:border-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-900" htmlFor="email">
          {strings.email}
        </label>
        <input
          id="email"
          type="email"
          value={formValues.email}
          onChange={(e) => handleChange('email')(e.target.value)}
          placeholder={strings.emailPlaceholder}
          dir={dir}
          className={`h-10 w-full rounded-md border border-neutral-300 px-3 text-base text-neutral-700 outline-none focus:border-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-900" htmlFor="phone-number">
          {strings.phoneNumber}
        </label>
        <div
          className={`flex h-10 w-full overflow-hidden rounded-md border border-neutral-300 bg-white ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`flex items-center gap-2 bg-neutral-100 px-4 text-base text-neutral-900 ${
              isRtl ? 'border-s border-neutral-200' : 'border-e border-neutral-200'
            }`}
          >
            +966
            <span className="text-neutral-500">▾</span>
          </div>
          <input
            id="phone-number"
            type="tel"
            value={formValues.phoneNumber}
            onChange={(e) => handleChange('phoneNumber')(e.target.value)}
            placeholder={strings.phoneNumberPlaceholder}
            dir={dir}
            className={`flex-1 px-3 text-base text-neutral-700 outline-none ${isRtl ? 'text-right' : 'text-left'}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-900" htmlFor="comment">
          {strings.comment}
        </label>
        <textarea
          id="comment"
          value={formValues.comment}
          onChange={(e) => handleChange('comment')(e.target.value)}
          placeholder={strings.commentPlaceholder}
          dir={dir}
          className={`min-h-[96px] w-full rounded-md border border-neutral-300 px-3 py-3 text-base text-neutral-700 outline-none focus:border-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}
        />
      </div>

      {submitSuccess && <p className="text-sm text-primary-700">{strings.success}</p>}
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <Button
        intent="primary"
        className="h-10 px-6"
        ariaLabel={strings.submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? strings.submitting : strings.submit}
      </Button>
    </form>
  );
}
