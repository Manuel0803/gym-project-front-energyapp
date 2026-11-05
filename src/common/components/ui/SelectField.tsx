import { useId } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  registration?: UseFormRegisterReturn;
  error?: string;
  children: React.ReactNode;
}

export function SelectField({
  label,
  registration,
  error,
  children,
  className = '',
  id,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label 
        htmlFor={selectId}
        className="text-xs font-semibold text-text-muted tracking-wide"
      >
        {label}
      </label>
      
      <select
        id={selectId}
        {...registration}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full bg-background border ${
          error ? 'border-danger-main' : 'border-border-primary'
        } rounded px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-main transition-colors disabled:opacity-50 cursor-pointer`}
      >
        {children}
      </select>
      
      {error && (
        <p id={errorId} className="text-xs text-danger-main" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
