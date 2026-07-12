import React from 'react';

export default function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={`block text-sm font-medium ${className ?? ''}`}>
      {children}
    </label>
  );
}