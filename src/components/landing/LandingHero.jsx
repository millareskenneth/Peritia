'use client';

import Link from 'next/link';
import { LANDING_COPY } from '../../data/landingCopy';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

export function LandingHero() {
  const { language } = useLanguageTheme();
  const c = LANDING_COPY;

  return (
    <div id="overview" className={`${classes.heroGrid} ${classes.heroStack}`}>
      <section className={`${classes.panel} ${classes.crtBezel} ${classes.topFill}`} aria-label="Product overview">
        <div className={classes.panelHead}>
          <span>PeritiaOS</span>
          <span className={classes.panelHeadId}>{c.eyebrow}</span>
        </div>
        <div className={`${classes.panelBody} ${classes.topFillBody}`}>
          <div className={classes.heroLeadBlock}>
            <p className={classes.sectionKicker}>{c.eyebrow}</p>
            <h1 className={classes.programTitle}>
              PERITIA<span>OS</span>
            </h1>
            <p className={classes.heroLead}>{c.headline}</p>
            <p className={classes.heroSupport}>{c.lead}</p>
            <p className={classes.heroSupportQuiet}>{c.support}</p>
            <div className={classes.ctaRow}>
              <Link href="/docs" className={classes.btnPrimary}>
                {c.ctaDocs}
              </Link>
              <a href="#start" className={classes.btnSecondary}>
                {c.ctaStart}
              </a>
            </div>
          </div>

          <div className={classes.heroFactStrip} aria-label="Key facts">
            {c.heroFacts.map((fact) => (
              <div key={fact.label} className={classes.heroFact}>
                <span className={classes.heroFactLabel}>{fact.label}</span>
                <span className={classes.heroFactValue}>{fact.value}</span>
              </div>
            ))}
          </div>

          <div className={classes.heroNotes}>
            <div className={classes.heroNotesHead}>{c.heroNotesTitle}</div>
            <ul className={classes.heroNotesList}>
              {c.heroNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <aside className={`${classes.panel} ${classes.topFill}`} aria-label={c.glanceTitle}>
        <div className={classes.panelHead}>
          <span>{c.glanceTitle}</span>
          <span className={classes.panelHeadId}>Theme · {language.name}</span>
        </div>
        <div className={`${classes.panelBody} ${classes.topFillBody} ${classes.recordBody}`}>
          <div className={classes.recordScroll}>
            <table className={classes.recordTable}>
              <tbody>
                {c.glance.map((row) => (
                  <tr key={row.label}>
                    <th>{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={classes.glanceNotes}>
            <div className={classes.glanceNotesHead}>{c.glanceNotesTitle}</div>
            <ul className={classes.glanceNotesList}>
              {c.glanceNotes.map((row) => (
                <li key={row.label}>
                  <span className={classes.glanceNoteLabel}>{row.label}</span>
                  <span className={classes.glanceNoteValue}>{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
