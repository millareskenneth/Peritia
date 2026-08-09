import { LANDING_COPY } from '../../data/landingCopy';
import { getLatestDevFeed } from '../../lib/devFeed';
import { DevFeedList } from '../dev-feed/DevFeedList';
import classes from './landing.module.css';

/** Live development updates strip for the landing page */
export function LandingClose() {
  const feed = getLatestDevFeed(5);
  const c = LANDING_COPY;

  return (
    <section
      id="activity"
      className={`${classes.panel} ${classes.closeStrip} ${classes.dockBottom}`}
      aria-label="Development updates"
    >
      <div className={classes.panelHead}>
        <span>{c.feedTitle}</span>
        <span className={classes.panelHeadId}>{c.feedId}</span>
      </div>
      <div className={classes.dockFill}>
        <DevFeedList
          entries={feed.entries}
          variant="featured"
          showViewAll
          repo={feed.repo}
          updatedAt={feed.updatedAt}
        />
      </div>
    </section>
  );
}
