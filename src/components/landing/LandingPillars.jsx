'use client';

import { LANDING_COPY } from '../../data/landingCopy';
import classes from './landing.module.css';

export function LandingPillars() {
  const c = LANDING_COPY;

  return (
    <section id="pillars" className={`${classes.panel} ${classes.topFill}`}>
      <div className={classes.panelHead}>
        <span>{c.pillarsKicker}</span>
        <span className={classes.panelHeadId}>3 promises</span>
      </div>
      <div className={`${classes.panelBody} ${classes.topFillBody}`}>
        <div className={classes.sectionIntro}>
          <p className={classes.sectionKicker}>{c.pillarsKicker}</p>
          <h2 className={classes.sectionTitle}>{c.pillarsTitle}</h2>
          <p className={classes.sectionLead}>{c.pillarsLead}</p>
        </div>

        <div className={classes.pillarGrid}>
          {c.pillars.map((pillar, i) => (
            <div key={pillar.name} className={classes.pillarCell}>
              <div className={classes.pillarCode}>0{i + 1}</div>
              <h3 className={classes.pillarName}>{pillar.name}</h3>
              <p className={classes.pillarCopy}>{pillar.copy}</p>
              {pillar.points?.length ? (
                <ul className={classes.pillarPoints}>
                  {pillar.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div className={classes.scopeRail}>
          <div className={classes.scopeHead}>{c.scopeTitle}</div>
          <ul className={classes.scopeGrid}>
            {c.scope.map((item) => (
              <li key={item.label} className={classes.scopeItem}>
                <span className={classes.scopeLabel}>{item.label}</span>
                <span className={classes.scopeDetail}>{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
