import React from 'react';

export default function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-lg rounded bg-card p-6">{children}</div>
      <button onClick={onClose} className="sr-only">Close</button>
    </div>
  );
}