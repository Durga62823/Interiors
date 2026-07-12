import React, { useState } from 'react';

export default function DropdownMenu({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(v => !v)}>{trigger}</button>
      {open && <div className="absolute right-0 mt-2 rounded bg-card p-2 shadow">{children}</div>}
    </div>
  );
}