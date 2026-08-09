'use client';

import Link from 'next/link';
import { LANDING_COPY } from '../../data/landingCopy';
import classes from './landing.module.css';

const STATE_LABEL = {
  ready: 'READY',
  build: 'BUILD',
  next: 'NEXT',
};

export function LandingEnter() {
  const c = LANDING_COPY;

  return (
    <section id="start" className={`${classes.panel} ${classes.dockBottom}`}>
      <div className={classes.panelHead}>
        <span>{c.startKicker}</span>
        <span className={classes.panelHeadId}>Next steps</span>
      </div>
      <div className={`${classes.panelBody} ${classes.startBody}`}>
        <div className={classes.sectionIntro}>
          <p className={classes.sectionKicker}>{c.startKicker}</p>
          <h2 className={classes.sectionTitle}>{c.startTitle}</h2>
          <p className={classes.sectionLead}>{c.startLead}</p>
        </div>

        <div className={classes.txnGrid}>
          {c.start.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classes.txnCell}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {item.code ? <span className={classes.txnCode}>PATH {item.code}</span> : null}
              <span className={classes.txnTitle}>{item.title}</span>
              <span className={classes.txnCopy}>{item.copy}</span>
              <span className={classes.txnAction}>{item.action} ›</span>
            </Link>
          ))}
        </div>

        <div className={classes.startRail}>
          <div className={classes.startRailHead}>
            <span>{c.startStatusTitle}</span>
            <span className={classes.startRailHint}>now vs next</span>
          </div>
          <ul className={classes.startStatus}>
            {c.startStatus.map((row) => (
              <li key={row.label} className={classes.startStatusItem} data-state={row.state}>
                <span className={classes.startStatusMark}>{STATE_LABEL[row.state] || row.state}</span>
                <span className={classes.startStatusLabel}>{row.label}</span>
                <span className={classes.startStatusDetail}>{row.detail}</span>
              </li>
            ))}
          </ul>
          <p className={classes.startTip}>{c.startTip}</p>
        </div>
      </div>
    </section>
  );
}
