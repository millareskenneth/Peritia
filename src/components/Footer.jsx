'use client';

import React from 'react';
import { Shield, User, ExternalLink, Terminal, GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-container">
      {/* Divider between document contents and floating footer */}
      <div className="content-divider" style={{ margin: '2rem 0 1.5rem 0' }} />

      <div className="footer-top-row">
        {/* Left Column: Brand Logo, Tagline & Purpose */}
        <div className="footer-left-col">
          <div className="footer-logo-row">
            <img src="/peritia.svg" alt="PeritiaOS Logo" width="36" height="36" />
            <span className="footer-logo-title">
              Peritia<span className="text-malachite">OS</span>
            </span>
          </div>

          <p className="footer-tagline-text">
            Build the System. Become the Architect.
          </p>

          <p className="footer-purpose-text">
            An open-source Linux distribution designed to teach software engineering through real-world system design, AI-assisted development, and continuous improvement.
          </p>

          <div className="footer-pills-row">
            <span className="footer-pill">
              <Terminal size={13} style={{ color: '#16db65' }} /> Linux Hardened
            </span>
            <span className="footer-pill">
              <GitBranch size={13} style={{ color: '#16db65' }} /> Release v1.0
            </span>
          </div>
        </div>

        {/* Right Columns: Open Source License & Creator */}
        <div className="footer-right-col">
          <div>
            <h2 className="footer-section-title">
              <Shield size={16} style={{ color: '#16db65', display: 'inline', marginRight: '6px' }} />
              Open Source License
            </h2>
            <div className="footer-section-content">
              <span className="license-badge">GNU AGPLv3</span>
              <p style={{ marginTop: '8px', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55 }}>
                Full code transparency & community freedom. Protected against proprietary closed-source cloning.
              </p>
            </div>
          </div>

          <div>
            <h2 className="footer-section-title">
              <User size={16} style={{ color: '#16db65', display: 'inline', marginRight: '6px' }} />
              The Creator
            </h2>
            <div className="footer-section-content">
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', fontWeight: 600 }}>
                Kenneth Millares
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 10px 0' }}>
                Fullstack Developer
              </p>
              <a
                href="https://github.com/millareskenneth/"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-link"
              >
                <span>View Github</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Row */}
      <p className="footer-copyright">
        Copyright {new Date().getFullYear()} © <span style={{ color: '#f8fafc', fontWeight: 600 }}>PeritiaOS Project</span>. All Rights Reserved.
      </p>
    </footer>
  );
}
