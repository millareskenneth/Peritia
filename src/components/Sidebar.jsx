'use client';

import React from 'react';
import { Cpu, GraduationCap, BookOpen, ChevronRight, CheckSquare, List, Library } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen
};

export function Sidebar({ docs, activeDocId, onSelectDoc, tocItems, activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Library size={14} />
          <span>Documentation Library</span>
        </div>

        {docs.map((doc) => {
          const IconComponent = iconMap[doc.icon] || BookOpen;
          const isActive = activeTab === 'docs' && activeDocId === doc.id;
          return (
            <div
              key={doc.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('docs');
                onSelectDoc(doc.id);
              }}
            >
              <IconComponent size={18} />
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.title}
              </div>
              <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.4 }} />
            </div>
          );
        })}
      </div>

      {/* Bootcamp Progress Tracker Button */}
      <div
        className={`sidebar-nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
        style={{ marginTop: '8px', background: activeTab === 'tracker' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        onClick={() => setActiveTab('tracker')}
      >
        <CheckSquare size={18} style={{ color: 'var(--accent-violet)' }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Progress Tracker</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 Months & Readiness</div>
        </div>
      </div>

      {/* Table of Contents Section */}
      {activeTab === 'docs' && tocItems.length > 0 && (
        <div className="toc-container">
          <div className="toc-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <List size={14} />
            <span>On This Page</span>
          </div>
          {tocItems.map((item, idx) => (
            <a
              key={idx}
              href={`#${item.id}`}
              className="toc-item"
              style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
            >
              {item.text}
            </a>
          ))}
        </div>
      )}
    </aside>
  );
}

