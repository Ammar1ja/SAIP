interface ArticleContentBlockProps {
  content: string;
}

export function ArticleContentBlock({ content }: ArticleContentBlockProps) {
  return (
    <div className="lg:w-2/3">
      <div
        className="text-gray-700 leading-relaxed space-y-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
