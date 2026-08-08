'use client';

import Link from 'next/link';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

const NOTES = [
  { code: 'N01', text: 'Docs portal mounted at /docs' },
  { code: 'N02', text: 'LANGUAGE MODES remaps personality only' },
  { code: 'N03', text: 'AGPLv3 license · release channel V1.0' },
  { code: 'N04', text: 'Operator surface: architecture dataset' },
];

/**
 * Fills leftover left-column height after program + account hug their content.
 */
export function LandingLeftFill() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <section className={`${classes.panel} ${classes.leftFill}`} aria-label="Session notes">
      <div className={classes.panelHead}>
        <span>{t.message} · NOTES</span>
        <span className={classes.panelHeadId}>{language.name} · {t.ready}</span>
      </div>
      <div className={classes.panelBody}>
        <div className={classes.fillStats}>
          <div className={classes.fillStat}>
            <span className={classes.fillStatKey}>{t.env}</span>
            <span className={classes.fillStatVal}>PROD</span>
          </div>
          <div className={classes.fillStat}>
            <span className={classes.fillStatKey}>{t.txn}</span>
            <span className={classes.fillStatVal}>00038421</span>
          </div>
          <div className={classes.fillStat}>
            <span className={classes.fillStatKey}>MODE</span>
            <span className={classes.fillStatVal}>{language.preview.motif}</span>
          </div>
          <div className={classes.fillStat}>
            <span className={classes.fillStatKey}>{t.status}</span>
            <span className={`${classes.badge} ${classes.badgeReady}`}>{t.ready}</span>
          </div>
        </div>

        <ul className={classes.fillNotes}>
          {NOTES.map((note) => (
            <li key={note.code}>
              <span className={classes.fillNoteCode}>{note.code}</span>
              <span>{note.text}</span>
            </li>
          ))}
        </ul>

        <div className={classes.fillFooter}>
          <span className={classes.fillHint}>{t.command} {t.openDocs}</span>
          <Link href="/docs" className={classes.btnPrimary}>
            {t.enterDocs}
          </Link>
        </div>
      </div>
    </section>
  );
}
