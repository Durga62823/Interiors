import React from 'react';

export default function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" {...props} className={`h-4 w-4 ${props.className ?? ''}`} />;
}