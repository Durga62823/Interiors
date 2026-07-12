import React from 'react';

export default function Skeleton({ className = 'h-4 w-full rounded bg-border/60' }: { className?: string }) {
  return <div className={className} />;
}