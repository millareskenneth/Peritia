'use client';

import { useEffect, useId, useState } from 'react';
import { PREVIEW_TOKENS } from './previewTokens';
import { LANGUAGE_ORDER, LANGUAGE_THEMES } from './catalog';
import { useLanguageTheme } from './LanguageThemeProvider';
import classes from './LanguageModes.module.css';

export function LanguageModes() {
  const { langId, language, setLangId, isPending } = useLanguageTheme();
  const [open, setOpen] = useState(false);
  const [previewId, setPreviewId] = useState(langId);
  const titleId = useId();

  useEffect(() => {
    if (open) setPreviewId(langId);
  }, [open, langId]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const preview = LANGUAGE_THEMES[previewId] || language;

  return (
    <>
      <button
        type="button"
        className={classes.fab}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
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
                  Switch the visual identity of PeritiaOS. Function stays put — personality changes.
                  Hover a mode to refresh the docked preview.
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
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`${classes.card} ${active ? classes.cardActive : ''}`}
                      onMouseEnter={() => setPreviewId(id)}
                      onFocus={() => setPreviewId(id)}
                      onClick={() => {
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
                        <span>{active ? (isPending ? 'APPLYING…' : 'ACTIVE') : 'SELECT ›'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={classes.previewDock}
              data-preview={preview.id}
              style={PREVIEW_TOKENS[preview.id]}
            >
              <div className={classes.previewPane}>
                <div className={classes.previewBar}>
                  <span>
                    PREVIEW · {preview.name} · {preview.tagline}
                  </span>
                  <span>{preview.terms.ready}</span>
                </div>
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
