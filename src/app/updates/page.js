import Link from 'next/link';
import { DevFeedList } from '../../components/dev-feed/DevFeedList';
import { LandingSysbar } from '../../components/landing/LandingSysbar';
import { getDevFeed, formatFeedTime } from '../../lib/devFeed';
import classes from './updates.module.css';

export const metadata = {
  title: 'Development Updates — PeritiaOS',
  description:
    'Live development activity for PeritiaOS — every push summarized for visitors.',
};

export default function UpdatesPage() {
  const feed = getDevFeed();

  return (
    <div className={classes.page}>
      <div className={classes.shell}>
        <LandingSysbar />

        <header className={classes.header}>
          <div>
            <div className={classes.kicker}>DEVELOPMENT FEED</div>
            <h1 className={classes.title}>Project updates</h1>
            <p className={classes.lead}>
              Every development push is summarized here automatically — so visitors can see what
              landed without needing repo access.
            </p>
          </div>
          <div className={classes.actions}>
            <Link href="/" className={classes.btnGhost}>
              ← HOME
            </Link>
            <Link href="/docs" className={classes.btnSolid}>
              READ DOCS
            </Link>
          </div>
        </header>

        <div className={classes.metaRow}>
          <span>{feed.entries.length} posts</span>
          <span>Last sync {formatFeedTime(feed.updatedAt)}</span>
        </div>

        <DevFeedList entries={feed.entries} variant="full" />
      </div>
    </div>
  );
}
