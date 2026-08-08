import { LandingSysbar } from '../components/landing/LandingSysbar';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingLeftFill } from '../components/landing/LandingLeftFill';
import { LandingSystemSpine } from '../components/landing/LandingSystemSpine';
import { LandingPillars } from '../components/landing/LandingPillars';
import { LandingEnter } from '../components/landing/LandingEnter';
import { LandingClose } from '../components/landing/LandingClose';
import { LandingFooter } from '../components/landing/LandingFooter';
import classes from '../components/landing/landing.module.css';

export const metadata = {
  title: 'PeritiaOS — Developer Operating System',
  description:
    'PeritiaOS is a developer-first Linux distribution with the discipline of enterprise mainframe systems — modernized for todays engineers.',
};

/**
 * Desktop: one viewport stage (no scroll) + footer below the fold.
 * Left = hugging cards + fill panel · Right = spine/pillars/enter · Bottom = activity
 */
export default function LandingPage() {
  return (
    <div className={`${classes.page} ${classes.foldPacked}`}>
      <div className={classes.viewportStage}>
        <LandingSysbar />
        <LandingNav />
        <div className={classes.foldMain}>
          <div className={classes.foldLeft}>
            <LandingHero />
            <LandingLeftFill />
          </div>
          <div className={classes.foldRight}>
            <LandingSystemSpine />
            <LandingPillars />
            <LandingEnter />
          </div>
        </div>
        <LandingClose />
      </div>

      <div className={classes.footerBand}>
        <LandingFooter />
      </div>
    </div>
  );
}
