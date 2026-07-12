import React from 'react';

export default function Tooltip({ children, content, className }: { children: React.ReactNode; content?: string; className?: string }) {
  return (
    <span className={className} title={content}>
      {children}
    </span>
  );
}