'use client';

import React, { useState } from 'react';
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

  const activeDoc = docsData.find(d => d.id === activeDocId) || docsData[0];

  return (
    <div className="app-layout">
      <div style={{ width: '100%' }}>
        {/* Top Navbar */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeDocTitle={activeDoc.title}
        />

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
          {/* Navigation Sidebar */}
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
          />

          {/* Workspace Area */}
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
    </div>
  );
}
