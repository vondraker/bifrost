import type { ReactNode } from 'react';

interface InlineAlertProps {
  children: ReactNode;
  className?: string;
}

export default function InlineAlert({ children, className }: InlineAlertProps) {
  return (
    <div
      role="alert"
      aria-atomic="true"
      className={`rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
