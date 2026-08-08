'use client';

import Link from 'next/link';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

export function LandingHero() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <div className={`${classes.heroGrid} ${classes.heroStack}`}>
      <section className={`${classes.panel} ${classes.crtBezel} ${classes.cardHug}`} aria-label="Program entry">
        <div className={classes.panelHead}>
          <span>
            {t.programId} · PERITIAOS
          </span>
          <span className={classes.panelHeadId}>REC 0001 · {t.workingStorage}</span>
        </div>
        <div className={classes.panelBody}>
          <p className={classes.sectionKicker}>{language.name} · {language.tagline}</p>
          <h1 className={classes.programTitle}>
            PERITIA<span>OS</span>
          </h1>
          <p className={classes.heroLead}>{language.personality}</p>
          <p className={classes.heroSupport}>
            MSG-001 {t.ready} — LANGUAGE MODES change personality, not function.
          </p>
          <div className={classes.ctaRow}>
            <Link href="/docs" className={classes.btnPrimary}>
              {t.enterDocs}
            </Link>
            <a href="#system" className={classes.btnSecondary}>
              {t.viewSpine}
            </a>
          </div>
        </div>
      </section>

      <aside className={`${classes.panel} ${classes.cardHug}`} aria-label="Account record">
        <div className={classes.panelHead}>
          <span>{t.account}</span>
          <span className={classes.panelHeadId}>ACCT-PRT-7781</span>
        </div>
        <div className={`${classes.panelBody} ${classes.recordBody}`}>
          <table className={classes.recordTable}>
            <tbody>
              <tr>
                <th>{t.status}</th>
                <td>
                  <span className={`${classes.badge} ${classes.badgeReady}`}>{t.ready}</span>
                </td>
              </tr>
              <tr>
                <th>CLASS</th>
                <td>DEVELOPER OPERATING SYSTEM</td>
              </tr>
              <tr>
                <th>LICENSE</th>
                <td>GNU AGPLv3</td>
              </tr>
              <tr>
                <th>RELEASE</th>
                <td>
                  <span className={`${classes.badge} ${classes.badgeAmber}`}>V1.0</span>
                </td>
              </tr>
              <tr>
                <th>BASE</th>
                <td>LINUX · CGROUPS V2 · eBPF</td>
              </tr>
              <tr>
                <th>MODE</th>
                <td>
                  <span className={`${classes.badge} ${classes.badgeSteel}`}>{language.name}</span>
                </td>
              </tr>
              <tr>
                <th>REGION</th>
                <td>OPEN SOURCE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  );
}
