import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  index?: number;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md', index = 0 }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const delayStyle = { animationDelay: `${index * 100}ms` };

  return (
    <div
      style={delayStyle}
      className={`bg-white/90 backdrop-blur-sm rounded-xl border border-zinc-200/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] 
        hover:border-zinc-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1
        transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) animate-slide-up-fade opacity-0
        ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
