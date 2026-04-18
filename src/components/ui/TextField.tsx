import { useId, type HTMLInputTypeAttribute, type ReactNode } from 'react';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: ReactNode;
  id?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function TextField({
  value,
  onChange,
  label,
  id,
  name,
  type = 'text',
  placeholder,
  required,
  className,
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputClassName = 'h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground outline-none ring-primary/40 focus:ring-2';
  const wrapperClassName = label
    ? `block text-sm${className ? ` ${className}` : ''}`
    : className;

  const inputElement = (
    <input
      id={fieldId}
      name={name}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      aria-required={required || undefined}
      className={inputClassName}
    />
  );

  if (!label) {
    return <div className={wrapperClassName}>{inputElement}</div>;
  }

  return (
    <label htmlFor={fieldId} className={wrapperClassName}>
      {typeof label === 'string' ? (
        <span className="mb-1 block text-muted-foreground">{label}</span>
      ) : (
        label
      )}
      {inputElement}
    </label>
  );
}
