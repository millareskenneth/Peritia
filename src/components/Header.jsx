'use client';

import React from 'react';
import { Search, BookOpen, CheckSquare } from 'lucide-react';

export function Header({ searchQuery, setSearchQuery, activeTab, setActiveTab, activeDocTitle }) {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="#" className="header-brand" onClick={(e) => { e.preventDefault(); setActiveTab('docs'); }}>
          <img
            src="/peritia.svg"
            alt="PeritiaOS Icon"
            width="36"
            height="36"
            style={{
              display: 'block',
              filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))'
            }}
          />
          <div>
            Peritia<span className="brand-badge">OS</span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-4px' }}>
              Developer OS Portal
            </span>
          </div>
        </a>
      </div>

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
