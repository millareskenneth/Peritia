'use client';

import React from 'react';
import { Search } from 'lucide-react';

export function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
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
    </header>
  );
}
