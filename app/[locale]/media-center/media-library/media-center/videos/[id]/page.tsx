import { notFound } from 'next/navigation';
import { fetchVideoById } from '@/lib/drupal/services/videos.service';
import { getMessages } from 'next-intl/server';
import { ROUTES } from '@/lib/routes';

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const video = await fetchVideoById(id, locale);

  if (!video) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const t = messages.breadcrumbs as Record<string, string>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href={ROUTES.HOME} className="text-green-700 hover:underline">
                {t?.home || 'Home'}
              </a>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <a
                href={ROUTES.MEDIA_CENTER.MEDIA_LIBRARY.MEDIA_CENTER.ROOT}
                className="text-green-700 hover:underline"
              >
                {t?.mediaCenter || 'Media Center'}
              </a>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">{video.title}</li>
          </ol>
        </nav>

        {/* Video Content */}
        <article className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{video.title}</h1>

          {/* Publication Date */}
          {video.publishDate && (
            <p className="text-sm text-neutral-600 mb-6">
              {(messages.common?.labels as any)?.publicationDate || 'Publication date'}:{' '}
              {video.publishDate}
            </p>
          )}

          {/* Categories */}
          {video.categories && video.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {video.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Video Player */}
          {video.videoUrl && (
            <div className="mb-8">
              {video.videoType === 'remote' ? (
                <div className="aspect-video">
                  <iframe
                    src={video.videoUrl}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              ) : (
                <video
                  src={video.videoUrl}
                  controls
                  poster={video.image}
                  className="w-full rounded-lg"
                >
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Excerpt */}
          {video.excerpt && <p className="text-lg text-neutral-700 mb-4">{video.excerpt}</p>}

          {/* Body */}
          {video.body && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: video.body }}
            />
          )}
        </article>
      </div>
    </div>
  );
}
