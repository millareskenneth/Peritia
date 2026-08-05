'use client';

import React, { useState } from 'react';
import { Cpu, GraduationCap, BookOpen, ChevronRight, Library, PanelLeft, X } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen
};

export function Sidebar({ docs, activeDocId, onSelectDoc, tocItems, isSidebarOpen, toggleSidebar, isMobile, onCloseMobile }) {
  const [collapsedDocs, setCollapsedDocs] = useState({});

  const handleDocClick = (docId) => {
    if (activeDocId === docId) {
      // Toggle collapse/expand for active document
      setCollapsedDocs(prev => ({
        ...prev,
        [docId]: !prev[docId]
      }));
    } else {
      // Switch to new document and ensure it is expanded
      onSelectDoc(docId);
      setCollapsedDocs(prev => ({
        ...prev,
        [docId]: false
      }));
    }
  };

  const handleTocClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarClass = isMobile
    ? `sidebar mobile-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`
    : `sidebar ${isSidebarOpen ? '' : 'collapsed'}`;

  const showFullContent = isMobile ? true : isSidebarOpen;

  return (
    <aside className={sidebarClass}>
      {/* Top Brand & Toggle Header Area inside Sidebar */}
      <div className="sidebar-top-brand">
        <a
          href="#"
          className="header-brand"
          style={{ textDecoration: 'none' }}
          onClick={(e) => { e.preventDefault(); }}
          title="PeritiaOS"
        >
          <img
            src="/peritia.svg"
            alt="PeritiaOS Icon"
            width="34"
            height="34"
            style={{
              display: 'block',
              filter: 'drop-shadow(0 0 8px rgba(22, 219, 101, 0.45))',
              flexShrink: 0
            }}
          />
          {showFullContent && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Peritia</span>
                <span className="brand-badge" style={{
                  background: 'linear-gradient(135deg, var(--malachite), var(--sea-green))',
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

        {/* Sidebar Toggle / Close Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={isMobile ? onCloseMobile : toggleSidebar}
          title={isMobile ? "Close Navigation Menu" : (isSidebarOpen ? "Collapse Sidebar (Ctrl+B)" : "Expand Sidebar (Ctrl+B)")}
          aria-label="Toggle Sidebar"
        >
          {isMobile ? <X size={19} /> : <PanelLeft size={19} />}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {showFullContent ? (
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

        {/* Document Links with Collapsible Nested TOC Tree */}
        {docs.map((doc) => {
          const IconComponent = iconMap[doc.icon] || BookOpen;
          const isActive = activeDocId === doc.id;
          const isTocCollapsed = collapsedDocs[doc.id] === true;
          const isTocVisible = showFullContent && isActive && !isTocCollapsed && tocItems.length > 0;

          return (
            <React.Fragment key={doc.id}>
              <div
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={doc.title}
                onClick={() => handleDocClick(doc.id)}
              >
                <IconComponent size={18} style={{ flexShrink: 0 }} />
                {showFullContent && (
                  <>
                    <div style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.45 }}>
                      {doc.title}
                    </div>
                    <ChevronRight
                      size={14}
                      style={{
                        opacity: isActive ? 1 : 0.4,
                        flexShrink: 0,
                        transform: isActive && !isTocCollapsed ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </>
                )}
              </div>

              {/* Inline Nested Section TOC directly underneath the selected document */}
              {isTocVisible && (
                <div style={{
                  paddingLeft: '24px',
                  marginBottom: '12px',
                  borderLeft: '2px solid rgba(22, 219, 101, 0.4)',
                  marginLeft: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  {tocItems.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className="toc-item"
                      onClick={handleTocClick}
                      style={{
                        paddingLeft: `${(item.level - 1) * 8 + 6}px`,
                        fontSize: '0.82rem'
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
