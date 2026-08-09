'use client';

import Link from 'next/link';
import { LANDING_COPY } from '../../data/landingCopy';
import { SYSTEM_COPY } from '../../language-themes/catalog';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

export function LandingFooter() {
  const year = new Date().getFullYear();
  const { language } = useLanguageTheme();
  const c = LANDING_COPY;

  return (
    <footer className={classes.siteFooter}>
      <div className={classes.siteFooterInner}>
        <div>
          <div className={classes.footerBrand}>PeritiaOS</div>
          <p className={classes.footerMute}>{SYSTEM_COPY.description}</p>
        </div>
        <div>
          <div className={classes.footerColTitle}>Explore</div>
          <Link href="/docs" className={classes.footerLink}>
            Docs
          </Link>
          <Link href="/updates" className={classes.footerLink}>
            Updates
          </Link>
          <a href="#start" className={classes.footerLink}>
            Get started
          </a>
        </div>
        <div>
          <div className={classes.footerColTitle}>Project</div>
          <span className={classes.footerLink} style={{ cursor: 'default' }}>
            License · AGPLv3
          </span>
          <span className={classes.footerLink} style={{ cursor: 'default' }}>
            Theme · {language.name}
          </span>
          <span className={classes.footerLink} style={{ cursor: 'default' }}>
            Source · private
          </span>
        </div>
      </div>
      <div className={classes.footerBar}>
        <span>© {year} PeritiaOS project</span>
        <span>{c.eyebrow}</span>
      </div>
    </footer>
  );
}
