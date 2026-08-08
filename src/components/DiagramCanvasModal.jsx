'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

export function DiagramCanvasModal({ svgContent, title, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const pinchRef = useRef(null);

  // Keep SVG styles intact; only clear constraining max-width so pan/zoom can work.
  const processedSvg = useMemo(() => {
    if (!svgContent) return '';
    return svgContent.replace(/<svg\b[^>]*>/i, (svgTag) => {
      let cleanTag = svgTag
        .replace(/max-width:\s*[^;"]+;?/gi, '')
        .replace(/\smin-width:\s*[^;"]+;?/gi, '');
      if (cleanTag.includes('style="')) {
        return cleanTag.replace(
          /style="([^"]*)"/i,
          (m, s) => `style="${s}; max-width: none; height: auto;"`,
        );
      }
      return cleanTag.replace('<svg', '<svg style="max-width: none; height: auto;"');
    });
  }, [svgContent]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom * zoomFactor, 0.2), 15));
  };

  const beginDrag = useCallback((clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX - pan.x,
      y: clientY - pan.y,
    };
  }, [pan.x, pan.y]);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    setPan({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y,
    });
  }, [isDragging]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    pinchRef.current = null;
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    beginDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    moveDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      beginDrag(t.clientX, t.clientY);
      return;
    }
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { dist, zoom };
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next = pinchRef.current.zoom * (dist / pinchRef.current.dist);
      setZoom(Math.min(Math.max(next, 0.2), 15));
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="diagram-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="diagram-modal-window"
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Diagram Viewer'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diagram-modal-header">
          <div className="diagram-modal-title">
            <Maximize2 size={18} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            <span className="diagram-modal-title-text">{title || 'Diagram Viewer'}</span>
            <span className="diagram-modal-hint">Drag to pan · Scroll / pinch to zoom</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Close Canvas (Esc)"
            aria-label="Close diagram"
          >
            <X size={18} />
          </button>

          <div className="diagram-modal-actions">
            <div className="zoom-controls">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.4, 0.2))}
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.4, 15))}
                title="Zoom In"
                aria-label="Zoom in"
              >
                <ZoomIn size={14} />
              </button>
              <button type="button" onClick={resetView} title="Reset View (100%)" aria-label="Reset view">
                <RotateCcw size={13} style={{ marginRight: '4px' }} />
                <span className="zoom-reset-label">Reset</span>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="diagram-modal-body"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={endDrag}
          onTouchCancel={endDrag}
        >
          <div
            className="diagram-modal-stage"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
          />
        </div>
      </div>
    </div>
  );
}
