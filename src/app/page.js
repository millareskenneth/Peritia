'use client';

import React, { useState, useEffect } from 'react';
import { docsData } from '../data/docsData';
import { Sidebar } from '../components/Sidebar';
import { DocViewer } from '../components/DocViewer';
import { Footer } from '../components/Footer';
import { PanelLeft } from 'lucide-react';

export default function Home() {
  const [activeDocId, setActiveDocId] = useState('system-architecture');
  const [tocItems, setTocItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSelectDoc = (id) => {
    setActiveDocId(id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // Instant scroll to top when switching documents
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Keyboard shortcut (Ctrl+B or Cmd+B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeDoc = docsData.find(d => d.id === activeDocId) || docsData[0];

  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobile && (
        <div
          className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close Mobile Sidebar"
        />
      )}

      {/* Navigation Sidebar (Sticky Desktop / Off-Canvas Drawer Mobile) */}
      <Sidebar
        docs={docsData}
        activeDocId={activeDocId}
        onSelectDoc={handleSelectDoc}
        tocItems={tocItems}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="app-main-wrapper">
        {/* Mobile Navigation Header Bar */}
        {isMobile && (
          <header className="mobile-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className="mobile-menu-btn"
                onClick={toggleSidebar}
                aria-label="Open Navigation Menu"
              >
                <PanelLeft size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img
                  src="/peritia.svg"
                  alt="PeritiaOS Logo"
                  width="26"
                  height="26"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(22, 219, 101, 0.45))' }}
                />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Peritia</span>
                <span className="brand-badge" style={{ fontWeight: 800, fontSize: '0.95rem' }}>OS</span>
              </div>
            </div>

            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              maxWidth: '140px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {activeDoc.title}
            </span>
          </header>
        )}

        <main className="main-content">
          <DocViewer
            doc={activeDoc}
            setTocItems={setTocItems}
          />
          <Footer />
        </main>
      </div>
    </div>
  );
}
