'use client';

import React, { useState, useEffect } from 'react';
import { docsData } from '../data/docsData';
import { Sidebar } from '../components/Sidebar';
import { DocViewer } from '../components/DocViewer';
import { Footer } from '../components/Footer';

export default function Home() {
  const [activeDocId, setActiveDocId] = useState('system-architecture');
  const [tocItems, setTocItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSelectDoc = (id) => {
    setActiveDocId(id);
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
      {/* Full-Height Navigation Sidebar */}
      <Sidebar
        docs={docsData}
        activeDocId={activeDocId}
        onSelectDoc={handleSelectDoc}
        tocItems={tocItems}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main App Container (DocViewer + Floating Footer) */}
      <div className="app-main-wrapper">
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
