'use client';

import React, { useState, useEffect } from 'react';
import { docsData } from '../data/docsData';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DocViewer } from '../components/DocViewer';
import { InteractiveTracker } from '../components/InteractiveTracker';

export default function Home() {
  const [activeTab, setActiveTab] = useState('docs');
  const [activeDocId, setActiveDocId] = useState('system-architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [tocItems, setTocItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
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
        onSelectDoc={(id) => {
          setActiveDocId(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        tocItems={tocItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main App Container (Header + Content) */}
      <div className="app-main-wrapper">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeDocTitle={activeDoc.title}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="main-content">
          {activeTab === 'docs' ? (
            <DocViewer
              doc={activeDoc}
              searchQuery={searchQuery}
              setTocItems={setTocItems}
            />
          ) : (
            <InteractiveTracker />
          )}
        </main>
      </div>
    </div>
  );
}
