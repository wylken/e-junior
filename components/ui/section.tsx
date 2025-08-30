import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 lg:py-24', className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}