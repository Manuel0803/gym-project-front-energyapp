import { useId } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  registration?: UseFormRegisterReturn;
  error?: string;
}

export function TextareaField({
  label,
  registration,
  error,
  className = '',
  id,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label 
        htmlFor={textareaId}
        className="text-xs font-semibold text-text-muted tracking-wide"
      >
        {label}
      </label>
      
      <textarea
        id={textareaId}
        {...registration}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full bg-background border ${
          error ? 'border-danger-main' : 'border-border-primary'
        } rounded px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-brand-main transition-colors disabled:opacity-50 min-h-25 resize-y`}
      />
      
      {error && (
        <p id={errorId} className="text-xs text-danger-main" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
