'use client';

import Link from 'next/link';
import { SYSTEM_COPY } from '../../language-themes/catalog';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

export function LandingFooter() {
  const year = new Date().getFullYear();
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <footer className={classes.siteFooter}>
      <div className={classes.siteFooterInner}>
        <div>
          <div className={classes.footerBrand}>{t.footerBrand}</div>
          <p className={classes.footerMute}>{SYSTEM_COPY.description}</p>
        </div>
        <div>
          <div className={classes.footerColTitle}>{t.batch}</div>
          <Link href="/docs" className={classes.footerLink}>
            {t.docsRegion}
          </Link>
          <a href="#system" className={classes.footerLink}>
            {t.spineKicker.toUpperCase()}
          </a>
          <a href="#enter" className={classes.footerLink}>
            {t.enterKicker.toUpperCase()}
          </a>
        </div>
        <div>
          <div className={classes.footerColTitle}>{t.status}</div>
          <a
            href="https://github.com/millareskenneth/"
            className={classes.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            OPERATOR GITHUB
          </a>
          <span className={classes.footerLink} style={{ cursor: 'default' }}>
            LICENSE · AGPLv3
          </span>
          <span className={classes.footerLink} style={{ cursor: 'default' }}>
            MODE · {language.name}
          </span>
        </div>
      </div>
      <div className={classes.footerBar}>
        <span>
          COPYRIGHT {year} © PERITIAOS PROJECT · ALL RIGHTS RESERVED
        </span>
        <span>{t.eoj}</span>
      </div>
    </footer>
  );
}
