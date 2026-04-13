'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, Suspense } from 'react';
import type { ProjectData } from '@/lib/drupal/services/projects.service';

interface ProjectModalClientProps {
  project: ProjectData;
}

export default function ProjectModalClient({ project }: ProjectModalClientProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlayRef}
      onClick={onClick}
      className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
    >
      <div className="absolute left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform px-4">
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <Suspense fallback={<div>Loading...</div>}>
            <article className="max-h-[80vh] overflow-y-auto">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={project.image?.url || '/images/projects/hero.jpg'}
                  alt={project.image?.alt || project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="mt-6 text-2xl font-bold">{project.title}</h1>
              <p className="mt-4 text-gray-600">{project.description}</p>
            </article>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
