import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const baseStyles = 'block w-full rounded-lg border-zinc-200 shadow-sm focus:border-zinc-400 focus:ring focus:ring-zinc-100 focus:ring-opacity-50 transition-colors duration-200 disabled:bg-zinc-50 disabled:text-zinc-500';
    const errorStyles = 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-zinc-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={`${baseStyles} ${error ? errorStyles : ''}`}
            ref={ref}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 animate-fade-in-up">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
