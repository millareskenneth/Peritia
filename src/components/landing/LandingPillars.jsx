'use client';

import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

const PILLARS = [
  {
    code: 'PLC-A',
    name: 'PARITY',
    copy: 'Same machine shape from laptop to CI to production.',
  },
  {
    code: 'PLC-B',
    name: 'PERFORMANCE',
    copy: 'FS, cgroups, and resolver tuned for compile / container I/O.',
  },
  {
    code: 'PLC-C',
    name: 'CLARITY',
    copy: 'Specs and tooling share one map under audit.',
  },
];

export function LandingPillars() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <section id="pillars" className={classes.panel}>
      <div className={classes.panelHead}>
        <span>{t.pillarsKicker.toUpperCase()}</span>
        <span className={classes.panelHeadId}>{t.batch}</span>
      </div>
      <div className={classes.panelBody}>
        <div className={classes.sectionIntro}>
          <p className={classes.sectionKicker}>{t.pillarsKicker}</p>
          <h2 className={classes.sectionTitle}>{t.pillarsTitle}</h2>
          <p className={classes.sectionLead}>Non-negotiables in the voice of {language.name}.</p>
        </div>

        <div className={classes.pillarGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.code} className={classes.pillarCell}>
              <div className={classes.pillarCode}>
                {pillar.code} · {t.complete}
              </div>
              <h3 className={classes.pillarName}>{pillar.name}</h3>
              <p className={classes.pillarCopy}>{pillar.copy}</p>
              <div className={classes.pillarMeta}>
                {t.status} {t.complete}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
