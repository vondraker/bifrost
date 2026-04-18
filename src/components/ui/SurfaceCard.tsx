import type { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SurfaceCardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export default function SurfaceCard({
  children,
  as: Component = 'div',
  className,
}: SurfaceCardProps) {
  return (
    <Component className={cn('rounded-2xl border border-border bg-card', className)}>
      {children}
    </Component>
  );
}

SurfaceCard.displayName = 'SurfaceCard';
