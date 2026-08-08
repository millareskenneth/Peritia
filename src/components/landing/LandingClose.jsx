'use client';

import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

const LOG = [
  { time: '00:00:01', code: 'SYS001', msg: 'CONTROL REGION INITIALIZED' },
  { time: '00:00:02', code: 'SYS014', msg: 'POLICY TABLE PLC LOADED — 3 RULES' },
  { time: '00:00:03', code: 'NET022', msg: 'DOCS PORTAL ENDPOINT REGISTERED /docs' },
  { time: '00:00:04', code: 'SEC007', msg: 'LICENSE CHECK AGPLv3 — COMPLETE' },
  { time: '00:00:05', code: 'OPS000', msg: 'OPERATOR SESSION READY FOR INPUT' },
];

/** Compact activity strip for the above-the-fold stage */
export function LandingClose() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <section id="activity" className={`${classes.panel} ${classes.closeStrip}`}>
      <div className={classes.panelHead}>
        <span>{t.logPrefix}</span>
        <span className={classes.panelHeadId}>JOB-PRTOS-INIT · {t.ready}</span>
      </div>
      <ul className={`${classes.logList} ${classes.logStrip}`}>
        {LOG.map((entry) => (
          <li key={entry.code + entry.time}>
            <span className={classes.logTime}>{entry.time}</span>
            <span className={classes.logCode}>{entry.code}</span>
            <span className={classes.logMsg}>{entry.msg}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
