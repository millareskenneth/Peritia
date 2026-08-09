import { LandingSysbar } from '../components/landing/LandingSysbar';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingPillars } from '../components/landing/LandingPillars';
import { LandingEnter } from '../components/landing/LandingEnter';
import { LandingClose } from '../components/landing/LandingClose';
import { LandingFooter } from '../components/landing/LandingFooter';
import classes from '../components/landing/landing.module.css';

export const metadata = {
  title: 'PeritiaOS — Developer Operating System',
  description:
    'PeritiaOS is a Linux system built for developers — faster setup, consistent environments, and clear docs as the project grows.',
};

/**
 * Left: overview + updates (bottom-aligned)
 * Right: why + get started (bottom-aligned)
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
            <LandingClose />
          </div>
          <div className={classes.foldRight}>
            <LandingPillars />
            <LandingEnter />
          </div>
        </div>
      </div>

      <div className={classes.footerBand}>
        <LandingFooter />
      </div>
    </div>
  );
}
