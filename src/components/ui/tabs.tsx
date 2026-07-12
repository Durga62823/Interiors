import React, { useState } from 'react';

export default function Tabs({ tabs }: { tabs: { id: string; title: string; panel: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  return (
    <div>
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`px-3 py-1 ${active === t.id ? 'underline' : ''}`}>
            {t.title}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map(t => t.id === active ? <div key={t.id}>{t.panel}</div> : null)}
      </div>
    </div>
  );
}