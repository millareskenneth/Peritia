'use client';

import { useEffect, useId, useState } from 'react';
import { PREVIEW_TOKENS } from './previewTokens';
import { LANGUAGE_ORDER, LANGUAGE_THEMES } from './catalog';
import { useLanguageTheme } from './LanguageThemeProvider';
import classes from './LanguageModes.module.css';

function useIsCompact() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return compact;
}

export function LanguageModes() {
  const { langId, language, setLangId, isPending } = useLanguageTheme();
  const [open, setOpen] = useState(false);
  const [previewId, setPreviewId] = useState(langId);
  const [previewOpen, setPreviewOpen] = useState(true);
  const titleId = useId();
  const compact = useIsCompact();

  useEffect(() => {
    if (open) {
      setPreviewId(langId);
      // On phones keep the preview dock collapsed so the sticky APPLY bar stays in view.
      setPreviewOpen(!compact);
    }
  }, [open, langId, compact]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const preview = LANGUAGE_THEMES[previewId] || language;
  const isCurrent = preview.id === langId;

  const applyPreview = () => {
    setLangId(preview.id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={classes.fab}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        hidden={open}
      >
        <span className={classes.fabMotif}>{language.preview.motif}</span>
        LANGUAGE MODES
      </button>

      {open ? (
        <div
          className={classes.backdrop}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className={classes.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className={classes.sheetHead}>
              <div>
                <div className={classes.sheetKicker}>One application · Seven cultures</div>
                <h2 id={titleId} className={classes.sheetTitle}>
                  LANGUAGE MODES
                </h2>
                <p className={classes.sheetLead}>
                  {compact
                    ? 'Tap a mode, then hit APPLY below — no scrolling needed.'
                    : 'Switch the visual identity of PeritiaOS. Function stays put — personality changes.'}
                </p>
              </div>
              <button type="button" className={classes.closeBtn} onClick={() => setOpen(false)}>
                CLOSE
              </button>
            </div>

            <div className={classes.scrollRegion}>
              <div className={classes.grid}>
                {LANGUAGE_ORDER.map((id) => {
                  const item = LANGUAGE_THEMES[id];
                  const active = id === langId;
                  const selected = previewId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`${classes.card} ${active ? classes.cardActive : ''} ${
                        selected ? classes.cardPreviewing : ''
                      }`}
                      onMouseEnter={() => {
                        if (!compact) setPreviewId(id);
                      }}
                      onFocus={() => setPreviewId(id)}
                      onClick={() => {
                        setPreviewId(id);
                        if (compact) {
                          // Select for sticky APPLY — do not bury the button under a tall preview.
                          setPreviewOpen(false);
                          return;
                        }
                        setLangId(id);
                        setOpen(false);
                      }}
                    >
                      <div className={classes.cardTop}>
                        <span className={classes.cardName}>{item.name}</span>
                        <span className={classes.cardEra}>{item.era}</span>
                      </div>
                      <div className={classes.cardTag}>{item.tagline}</div>
                      <p className={classes.cardPersona}>{item.personality}</p>
                      <div className={classes.swatches} aria-hidden>
                        {item.preview.swatches.map((color) => (
                          <span
                            key={color}
                            className={classes.swatch}
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                      <div className={classes.cardFoot}>
                        <span>{item.preview.motif}</span>
                        <span>
                          {active
                            ? isPending
                              ? 'APPLYING…'
                              : 'ACTIVE'
                            : compact
                              ? selected
                                ? 'SELECTED'
                                : 'TAP TO SELECT'
                              : 'SELECT ›'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`${classes.previewDock} ${previewOpen ? '' : classes.previewDockCollapsed}`}
              data-preview={preview.id}
              style={PREVIEW_TOKENS[preview.id]}
            >
              <button
                type="button"
                className={classes.previewToggle}
                onClick={() => setPreviewOpen((v) => !v)}
                aria-expanded={previewOpen}
              >
                <span>
                  PREVIEW · {preview.name} · {preview.tagline}
                </span>
                <span>{previewOpen ? 'HIDE ▾' : 'SHOW ▴'}</span>
              </button>

              {previewOpen ? (
                <div className={classes.previewPane}>
                  <div className={classes.previewBody}>
                    <div className={classes.previewBlock}>
                      <div className={classes.previewTitle}>{preview.terms.programId}</div>
                      <div className={classes.previewLine}>{preview.terms.region}</div>
                      <div className={classes.previewLine}>
                        {preview.terms.status}: {preview.terms.ready}
                      </div>
                      <div className={classes.previewLine}>{preview.personality}</div>
                    </div>
                    <div className={classes.previewBlock}>
                      <div className={classes.previewTitle}>{preview.terms.account}</div>
                      <div className={classes.previewLine}>
                        {preview.terms.sysId} · {preview.preview.motif}
                      </div>
                      <div className={classes.previewLine}>
                        {preview.terms.command} {preview.terms.openDocs}
                      </div>
                      <div className={classes.previewLine}>{preview.terms.eoj}</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Always pinned — never buried inside a scroll region */}
            <div
              className={classes.applyBar}
              data-preview={preview.id}
              style={PREVIEW_TOKENS[preview.id]}
            >
              <div className={classes.applyMeta}>
                <span className={classes.applyMotif} aria-hidden>
                  {preview.preview.motif}
                </span>
                <div className={classes.applyCopy}>
                  <span className={classes.applyLabel}>
                    {isCurrent ? 'CURRENT MODE' : 'READY TO APPLY'}
                  </span>
                  <span className={classes.applyName}>
                    {preview.name} · {preview.tagline}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={classes.applyBtn}
                onClick={applyPreview}
                disabled={isPending}
              >
                {isPending
                  ? 'APPLYING…'
                  : isCurrent
                    ? 'KEEP ACTIVE'
                    : `APPLY ${preview.name}`}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
