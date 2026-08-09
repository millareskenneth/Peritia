'use client';

import Link from 'next/link';
import { LANDING_COPY } from '../../data/landingCopy';
import classes from './landing.module.css';

export function LandingNav() {
  const c = LANDING_COPY;

  return (
    <div className={classes.menubar}>
      <Link href="/" className={classes.brandCell}>
        <img src="/peritia.svg" alt="" width={26} height={26} />
        <span>
          <span className={classes.brandName}>PERITIAOS</span>
          <span className={classes.brandSub}>{c.eyebrow}</span>
        </span>
      </Link>

      <nav className={classes.menuLinks} aria-label="Primary">
        {c.menu.map((link) => (
          <a key={link.label} href={link.href} className={classes.menuLink}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className={classes.menuActions}>
        <Link href="/updates" className={classes.menuSecondary}>
          Updates
        </Link>
        <Link href="/docs" className={classes.menuCta}>
          Docs
        </Link>
      </div>
    </div>
  );
}
