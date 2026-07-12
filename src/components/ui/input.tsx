import React from 'react';

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold ${props.className ?? ''}`}
    />
  );
}