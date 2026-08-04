'use client';

import React from 'react';
import { Cpu, GraduationCap, BookOpen, ChevronRight, CheckSquare, List, Library, PanelLeft } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen
};

export function Sidebar({ docs, activeDocId, onSelectDoc, tocItems, activeTab, setActiveTab, isSidebarOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
      {/* Top Brand & Toggle Header Area inside Sidebar */}
      <div className="sidebar-top-brand">
        <a
          href="#"
          className="header-brand"
          style={{ textDecoration: 'none' }}
          onClick={(e) => { e.preventDefault(); setActiveTab('docs'); }}
          title="PeritiaOS"
        >
          <img
            src="/peritia.svg"
            alt="PeritiaOS Icon"
            width="34"
            height="34"
            style={{
              display: 'block',
              filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.45))',
              flexShrink: 0
            }}
          />
          {isSidebarOpen && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Peritia</span>
                <span className="brand-badge" style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: '1.1rem'
                }}>OS</span>
              </div>
              <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-4px' }}>
                Developer OS Portal
              </span>
            </div>
          )}
        </a>

        {/* Sidebar Toggle Button (Below system icon when closed, or top right when open) */}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse Sidebar (Ctrl+B)" : "Expand Sidebar (Ctrl+B)"}
          aria-label="Toggle Sidebar"
        >
          <PanelLeft size={19} />
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {isSidebarOpen ? (
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            paddingLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Library size={14} />
            <span>Documentation Library</span>
          </div>
        ) : (
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />
        )}

        {docs.map((doc) => {
          const IconComponent = iconMap[doc.icon] || BookOpen;
          const isActive = activeTab === 'docs' && activeDocId === doc.id;
          return (
            <div
              key={doc.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={doc.title}
              onClick={() => {
                setActiveTab('docs');
                onSelectDoc(doc.id);
              }}
            >
              <IconComponent size={18} style={{ flexShrink: 0 }} />
              {isSidebarOpen && (
                <>
                  <div style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.45 }}>
                    {doc.title}
                  </div>
                  <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.4, flexShrink: 0 }} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bootcamp Progress Tracker Button */}
      <div
        className={`sidebar-nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
        title="Bootcamp Progress Tracker"
        style={{
          marginTop: '8px',
          background: activeTab === 'tracker' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)'
        }}
        onClick={() => setActiveTab('tracker')}
      >
        <CheckSquare size={18} style={{ color: 'var(--accent-violet)', flexShrink: 0 }} />
        {isSidebarOpen && (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Progress Tracker</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 Months & Readiness</div>
          </div>
        )}
      </div>

      {/* Table of Contents Section (Shown only when open) */}
      {isSidebarOpen && activeTab === 'docs' && tocItems.length > 0 && (
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
