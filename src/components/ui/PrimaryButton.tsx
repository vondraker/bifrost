import type { MouseEventHandler, ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function PrimaryButton({
  children,
  type = 'button',
  disabled,
  className,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  );
}
