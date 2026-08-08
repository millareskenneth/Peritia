'use client';

import Link from 'next/link';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

export function LandingNav() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <div className={classes.menubar}>
      <Link href="/" className={classes.brandCell}>
        <img src="/peritia.svg" alt="" width={26} height={26} />
        <span>
          <span className={classes.brandName}>PERITIAOS</span>
          <span className={classes.brandSub}>{language.tagline}</span>
        </span>
      </Link>

      <nav className={classes.menuLinks} aria-label="Primary">
        {t.menu.map((link) => (
          <a key={link.pf + link.label} href={link.href} className={classes.menuLink}>
            <span className={classes.menuPf}>{link.pf}</span>
            {link.label}
          </a>
        ))}
      </nav>

      <Link href="/docs" className={classes.menuCta}>
        {t.openDocs}
      </Link>
    </div>
  );
}
