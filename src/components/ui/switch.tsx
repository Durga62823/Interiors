import React from 'react';

export default function Switch({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${checked ? 'bg-gold' : 'bg-border'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );
}