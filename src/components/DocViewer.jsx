'use client';

import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Cpu, GraduationCap, BookOpen, Tag } from 'lucide-react';

const iconMap = {
  Cpu,
  GraduationCap,
  BookOpen
};

const lucideSvgs = {
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`
};

export function DocViewer({ doc, searchQuery, setTocItems }) {
  const contentRef = useRef(null);
  const CategoryIcon = (doc && iconMap[doc.icon]) || Tag;

  useEffect(() => {
    if (!doc) return;

    // Custom marked renderer for headings and alert boxes
    const renderer = new marked.Renderer();

    renderer.heading = (arg1, arg2) => {
      let headingText = '';
      let depth = 1;
      if (typeof arg1 === 'string') {
        headingText = arg1;
        depth = arg2 || 1;
      } else if (arg1 && typeof arg1 === 'object') {
        headingText = arg1.text || '';
        depth = arg1.depth || arg2 || 1;
      }
      const plainText = headingText.replace(/<[^>]*>?/gm, '');
      const slug = plainText.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${depth} id="${slug}">${headingText}</h${depth}>`;
    };

    renderer.blockquote = (arg1) => {
      let quote = typeof arg1 === 'string' ? arg1 : (arg1 && arg1.text ? arg1.text : '');
      let alertClass = 'alert-note';
      let title = 'NOTE';
      let iconSvg = lucideSvgs.info;

      if (quote.includes('[!TIP]')) {
        alertClass = 'alert-tip';
        title = 'TIP';
        iconSvg = lucideSvgs.lightbulb;
        quote = quote.replace('[!TIP]', '');
      } else if (quote.includes('[!IMPORTANT]')) {
        alertClass = 'alert-important';
        title = 'IMPORTANT';
        iconSvg = lucideSvgs.alertCircle;
        quote = quote.replace('[!IMPORTANT]', '');
      } else if (quote.includes('[!WARNING]')) {
        alertClass = 'alert-warning';
        title = 'WARNING';
        iconSvg = lucideSvgs.alertTriangle;
        quote = quote.replace('[!WARNING]', '');
      } else if (quote.includes('[!NOTE]')) {
        alertClass = 'alert-note';
        title = 'NOTE';
        iconSvg = lucideSvgs.info;
        quote = quote.replace('[!NOTE]', '');
      }

      return `<div class="alert-box ${alertClass}">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; opacity: 0.9;">
          ${iconSvg}
          <span>${title}</span>
        </div>
        <div>${quote}</div>
      </div>`;
    };

    marked.setOptions({
      renderer: renderer,
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
      gfm: true,
      breaks: true
    });

    const parsedHtml = marked.parse(doc.content);

    if (contentRef.current) {
      contentRef.current.innerHTML = parsedHtml;

      // Highlight syntax inside pre elements
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });

      // Attach copy buttons to code blocks
      contentRef.current.querySelectorAll('pre').forEach((pre) => {
        if (pre.parentNode.classList.contains('code-block-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);

        const header = document.createElement('div');
        header.className = 'code-block-header';
        
        const codeLang = pre.querySelector('code')?.className.replace('hljs language-', '').replace('hljs', '') || 'code';
        header.innerHTML = `<span>${codeLang.toUpperCase()}</span>`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `${lucideSvgs.copy} <span>Copy</span>`;
        copyBtn.onclick = () => {
          const codeText = pre.innerText;
          navigator.clipboard.writeText(codeText);
          copyBtn.innerHTML = `${lucideSvgs.check} <span>Copied!</span>`;
          setTimeout(() => { copyBtn.innerHTML = `${lucideSvgs.copy} <span>Copy</span>`; }, 2000);
        };

        header.appendChild(copyBtn);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });

      // Extract TOC headings
      const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3')).map(h => ({
        id: h.id,
        text: h.innerText,
        level: parseInt(h.tagName.replace('H', ''), 10)
      }));
      setTocItems(headings);
    }
  }, [doc]);

  if (!doc) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Category Badge Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{
          background: 'rgba(56, 189, 248, 0.15)',
          color: 'var(--accent-cyan)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CategoryIcon size={14} />
          {doc.category}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {doc.badge}
        </span>
      </div>

      {/* Rendered Document */}
      <div ref={contentRef} className="markdown-body" />
    </div>
  );
}
