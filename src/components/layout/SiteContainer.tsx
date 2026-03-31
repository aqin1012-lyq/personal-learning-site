import { cn } from '@/lib/utils';

export function SiteContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[min(1760px,calc(100vw-24px))] px-4 sm:max-w-[min(1760px,calc(100vw-32px))] sm:px-6 lg:max-w-[min(1760px,calc(100vw-48px))] lg:px-8 xl:px-10 2xl:px-12',
        className
      )}
    >
      {children}
    </div>
  );
}
