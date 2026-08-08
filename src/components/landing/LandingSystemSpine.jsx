'use client';

import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

const ROWS = [
  {
    id: 'SPN-01',
    module: 'KERNEL CONTRACT',
    detail: 'Hardened base, declared toolchains, environment parity from first boot.',
    statusKey: 'ready',
  },
  {
    id: 'SPN-02',
    module: 'OBSERVABILITY',
    detail: 'eBPF-first telemetry — low tax, high signal.',
    statusKey: 'ready',
  },
  {
    id: 'SPN-03',
    module: 'CONTAINER PLANE',
    detail: 'Rootless engines + overlay I/O for compile-heavy work.',
    statusKey: 'ready',
  },
  {
    id: 'SPN-04',
    module: 'PACKAGE RESOLVER',
    detail: 'SAT SemVer resolution — deterministic, auditable.',
    statusKey: 'processing',
  },
];

export function LandingSystemSpine() {
  const { language } = useLanguageTheme();
  const t = language.terms;
  const headers = t.spineHeaders;

  return (
    <section id="system" className={`${classes.panel} ${classes.foldGrow}`}>
      <div className={classes.panelHead}>
        <span>{t.spineKicker.toUpperCase()} · FILE</span>
        <span className={classes.panelHeadId}>KEYS SPN-01…SPN-04</span>
      </div>
      <div className={classes.panelBody}>
        <div className={classes.sectionIntro}>
          <p className={classes.sectionKicker}>{t.spineKicker}</p>
          <h2 className={classes.sectionTitle}>{t.spineTitle}</h2>
          <p className={classes.sectionLead}>
            Fixed modules the region refuses to imply — {language.name} voice, same records.
          </p>
        </div>

        <div className={classes.tableScroll}>
          <table className={classes.dataTable}>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.id}>
                  <td className={classes.colId}>{row.id}</td>
                  <td>{row.module}</td>
                  <td>{row.detail}</td>
                  <td className={classes.colStatus}>{t[row.statusKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
