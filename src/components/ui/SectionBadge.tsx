import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionBadgeProps {
  children: ReactNode;
  className?: string;
}

export default function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2',
        className,
      )}
    >
      {children}
    </span>
  );
}
