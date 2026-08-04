'use client';

import React from 'react';
import { Search, BookOpen, CheckSquare } from 'lucide-react';

export function Header({ searchQuery, setSearchQuery, activeTab, setActiveTab, activeDocTitle }) {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Bar */}
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search documentation & concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* View Switcher */}
        <button
          className={`sidebar-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
          style={{ marginBottom: 0, padding: '8px 14px' }}
          onClick={() => setActiveTab('docs')}
        >
          <BookOpen size={16} />
          Documentation
        </button>

        <button
          className={`sidebar-nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
          style={{ marginBottom: 0, padding: '8px 14px' }}
          onClick={() => setActiveTab('tracker')}
        >
          <CheckSquare size={16} />
          Bootcamp Tracker
        </button>
      </div>
    </header>
  );
}
