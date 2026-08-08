'use client';

import { useEffect, useState } from 'react';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatStamp(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return {
    date: `${y}-${m}-${d}`,
    time: `${hh}:${mm}:${ss}`,
  };
}

const PLACEHOLDER = { date: '----.--.--', time: '--:--:--' };

export function LandingSysbar() {
  const { language } = useLanguageTheme();
  const t = language.terms;
  const [stamp, setStamp] = useState(PLACEHOLDER);

  useEffect(() => {
    const tick = () => setStamp(formatStamp(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={classes.sysbar} role="status" aria-live="polite">
      <div className={classes.sysbarLeft}>
        <span>
          <span className={classes.sysKey}>{t.sysId}</span>{' '}
          <span className={classes.sysVal}>PRT-OS-001</span>
        </span>
        <span>
          <span className={classes.sysKey}>{t.env}</span>{' '}
          <span className={classes.sysVal}>PROD</span>
        </span>
        <span>
          <span className={classes.sysKey}>{t.txn}</span>{' '}
          <span className={classes.sysVal}>00038421</span>
        </span>
      </div>
      <div className={classes.sysbarCenter}>PERITIAOS · {t.region}</div>
      <div className={classes.sysbarRight}>
        <span>
          <span className={classes.sysKey}>DATE</span>{' '}
          <span className={classes.sysVal}>{stamp.date}</span>
        </span>
        <span>
          <span className={classes.sysKey}>TIME</span>{' '}
          <span className={classes.sysVal}>{stamp.time}</span>
        </span>
        <span className={classes.statusReady}>{t.ready}</span>
      </div>
    </div>
  );
}
