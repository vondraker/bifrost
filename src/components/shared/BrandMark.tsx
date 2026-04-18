interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    icon: 'h-7 w-7',
    wordmark: 'text-[1.6rem]',
  },
  md: {
    icon: 'h-8 w-8',
    wordmark: 'text-[1.8rem]',
  },
  lg: {
    icon: 'h-9 w-9',
    wordmark: 'text-[2rem]',
  },
} as const;

export default function BrandMark({
  size = 'md',
  interactive = false,
  className,
}: BrandMarkProps) {
  const selectedSize = sizeClasses[size];
  const iconClassName = `${selectedSize.icon}${interactive ? ' transition-transform duration-200 group-hover:scale-110' : ''}`;
  const wordmarkClassName = `logo-wordmark leading-none ${selectedSize.wordmark}${interactive ? ' transition-transform duration-200 group-hover:scale-105' : ''}`;

  return (
    <span className={`inline-flex items-center gap-2${className ? ` ${className}` : ''}`}>
      <span className={iconClassName}>
        <img
          src="/tree-icon.png"
          alt="Bifrost"
          className="h-full w-full object-contain"
        />
      </span>
      <span className={wordmarkClassName}>BIFRÖST</span>
    </span>
  );
}
