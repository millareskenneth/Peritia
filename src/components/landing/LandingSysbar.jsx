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
          <span className={classes.sysKey}>Project</span>{' '}
          <span className={classes.sysVal}>PeritiaOS</span>
        </span>
        <span>
          <span className={classes.sysKey}>Theme</span>{' '}
          <span className={classes.sysVal}>{language.name}</span>
        </span>
      </div>
      <div className={classes.sysbarCenter}>Developer Operating System</div>
      <div className={classes.sysbarRight}>
        <span>
          <span className={classes.sysKey}>Date</span>{' '}
          <span className={classes.sysVal}>{stamp.date}</span>
        </span>
        <span>
          <span className={classes.sysKey}>Time</span>{' '}
          <span className={classes.sysVal}>{stamp.time}</span>
        </span>
      </div>
    </div>
  );
}
