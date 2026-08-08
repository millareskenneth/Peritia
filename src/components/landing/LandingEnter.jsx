'use client';

import Link from 'next/link';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import classes from './landing.module.css';

const TXNS = [
  {
    href: '/docs',
    code: 'TXN-100',
    title: 'ARCHITECTURE PORTAL',
    copy: 'Specs, component map, living system write-up.',
  },
  {
    href: 'https://github.com/millareskenneth/',
    code: 'TXN-200',
    title: 'SOURCE / AGPL CORE',
    copy: 'Fork, audit, improve under GNU AGPLv3.',
  },
];

export function LandingEnter() {
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <section id="enter" className={classes.panel}>
      <div className={classes.panelHead}>
        <span>{t.enterKicker.toUpperCase()}</span>
        <span className={classes.panelHeadId}>MENU-01</span>
      </div>
      <div className={classes.panelBody}>
        <div className={classes.sectionIntro}>
          <p className={classes.sectionKicker}>{t.enterKicker}</p>
          <h2 className={classes.sectionTitle}>{t.enterTitle}</h2>
          <p className={classes.sectionLead}>Authorized doors — {language.name} vocabulary.</p>
        </div>

        <div className={classes.txnGrid}>
          {TXNS.map((txn) => (
            <Link
              key={txn.code}
              href={txn.href}
              className={classes.txnCell}
              target={txn.href.startsWith('http') ? '_blank' : undefined}
              rel={txn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className={classes.txnCode}>{txn.code}</span>
              <span className={classes.txnTitle}>{txn.title}</span>
              <span className={classes.txnCopy}>{txn.copy}</span>
              <span className={classes.txnAction}>{t.processing} ›</span>
            </Link>
          ))}
        </div>

        <div className={classes.commandRow} aria-hidden>
          <span className={classes.commandPrompt}>{t.command}</span>
          <span className={classes.commandInput}>{t.openDocs}</span>
          <span className={classes.commandHint}>{t.commandHint}</span>
        </div>
      </div>
    </section>
  );
}
