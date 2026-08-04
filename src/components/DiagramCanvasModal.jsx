'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

export function DiagramCanvasModal({ svgContent, title, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Safely update ONLY the top-level <svg> tag without altering inner <rect>/<path> node styles
  const processedSvg = useMemo(() => {
    if (!svgContent) return '';
    return svgContent.replace(/<svg\b[^>]*>/i, (svgTag) => {
      let cleanTag = svgTag.replace(/max-width:\s*[^;"]+;?/gi, '');
      if (cleanTag.includes('style="')) {
        return cleanTag.replace(/style="([^"]*)"/i, (m, s) => `style="${s}; max-width: none !important; min-width: 1100px;"`);
      } else {
        return cleanTag.replace('<svg', '<svg style="max-width: none !important; min-width: 1100px;"');
      }
    });
  }, [svgContent]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Mouse Wheel Zooming up to 15x (1500%)
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom * zoomFactor, 0.2), 15));
  };

  // Mouse Drag Panning Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="diagram-modal-backdrop" onClick={onClose}>
      {/* Floating Canvas Window */}
      <div className="diagram-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header Control Bar */}
        <div className="diagram-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>
            <Maximize2 size={18} style={{ color: '#16db65', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '480px' }}>
              {title || 'Diagram Viewer'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, flexShrink: 0 }}>
              (Click & Drag to Pan • Scroll to Zoom)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div className="zoom-controls">
              <button onClick={() => setZoom(z => Math.max(z - 0.4, 0.2))} title="Zoom Out (-)">
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', padding: '0 8px', color: '#16db65', fontWeight: 600 }}>
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={() => setZoom(z => Math.min(z + 0.4, 15))} title="Zoom In (+)">
                <ZoomIn size={14} />
              </button>
              <button onClick={resetView} title="Reset View (100%)">
                <RotateCcw size={13} style={{ marginRight: '4px' }} /> Reset
              </button>
            </div>

            <button className="modal-close-btn" onClick={onClose} title="Close Canvas (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Interactive Canvas Body */}
        <div
          ref={containerRef}
          className="diagram-modal-body"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            overflow: 'hidden',
            position: 'relative'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Scalable & Pannable Stage */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              display: 'inline-block',
              pointerEvents: 'none'
            }}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
          />
        </div>
      </div>
    </div>
  );
}
