import Spinner from '@/components/atoms/Spinner';

export default function ServicesLoading() {
  return (
    <div className="w-full bg-white" aria-live="polite" aria-busy="true">
      <div className="w-full">
        <div className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-7xl flex-col items-center justify-center gap-8 px-4 py-16 md:px-8">
          <Spinner size={56} ariaLabel="Loading services page" className="text-primary-700" />
          <div className="w-full max-w-3xl space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded-md bg-primary-100" />
            <div className="h-4 w-full animate-pulse rounded-md bg-neutral-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
