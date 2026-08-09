import Link from 'next/link';
import { LANDING_COPY } from '../../data/landingCopy';
import { formatFeedTime } from '../../lib/devFeed';
import classes from './DevFeed.module.css';

/**
 * @param {{
 *   entries: import('../../lib/devFeed').DevFeedEntry[],
 *   variant?: 'strip' | 'featured' | 'full',
 *   showViewAll?: boolean,
 *   repo?: string,
 *   updatedAt?: string,
 *   showRepoLinks?: boolean,
 * }} props
 */
export function DevFeedList({
  entries = [],
  variant = 'full',
  showViewAll = false,
  repo = 'millareskenneth/Peritia',
  updatedAt,
  showRepoLinks = false,
}) {
  if (!entries.length) {
    return (
      <p className={classes.empty}>
        No updates posted yet. New development posts will show up here automatically.
      </p>
    );
  }

  if (variant === 'strip') {
    return (
      <div className={classes.stripWrap}>
        <ul className={classes.strip}>
          {entries.map((entry) => (
            <li key={entry.id} className={classes.stripItem}>
              <div className={classes.stripLink}>
                <span className={classes.stripBranch}>{entry.branch}</span>
                <span className={classes.stripTitle}>{entry.title}</span>
                <span className={classes.stripMeta}>
                  {entry.sha} · {entry.author}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {showViewAll ? (
          <div className={classes.stripFoot}>
            <Link href="/updates" className={classes.viewAll}>
              VIEW ALL UPDATES ›
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  if (variant === 'featured') {
    const [latest, ...rest] = entries;
    const syncStamp = formatFeedTime(updatedAt || latest.createdAt);
    const branchSet = [...new Set(entries.map((e) => e.branch).filter(Boolean))];
    const c = LANDING_COPY;
    const visibleCommits = (latest.commits || []).filter(
      (commit) => commit?.message && !/^merge\b/i.test(commit.message),
    );

    return (
      <div className={classes.featuredWrap}>
        <div className={classes.pulseBar} aria-label="Feed status">
          <span className={classes.pulseAlive}>LIVE</span>
          <span className={classes.pulseSep}>·</span>
          <span>SYNC {syncStamp}</span>
          <span className={classes.pulseSep}>·</span>
          <span>
            {entries.length} POST{entries.length === 1 ? '' : 'S'}
          </span>
          {branchSet.length ? (
            <>
              <span className={classes.pulseSep}>·</span>
              <span className={classes.pulseBranch}>{branchSet[0]}</span>
            </>
          ) : null}
        </div>

        <article className={classes.featured} aria-labelledby={`feed-feat-${latest.id}`}>
          <header className={classes.featuredHead}>
            <div className={classes.featuredMeta}>
              <span className={classes.featuredTag}>LATEST</span>
              <span className={classes.stripBranch}>{latest.branch}</span>
              <span className={classes.stripMeta}>
                {latest.sha} · {latest.author}
              </span>
            </div>
            <time className={classes.featuredTime} dateTime={latest.createdAt}>
              {formatFeedTime(latest.createdAt)}
            </time>
          </header>

          <h3 id={`feed-feat-${latest.id}`} className={classes.featuredTitle}>
            {latest.title}
          </h3>
          {latest.summary ? <p className={classes.featuredSummary}>{latest.summary}</p> : null}

          {latest.bullets?.length ? (
            <ul className={classes.featuredBullets}>
              {latest.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}

          {visibleCommits.length ? (
            <ul className={classes.featuredCommits}>
              {visibleCommits.slice(0, 4).map((commit) => (
                <li key={commit.sha + commit.message}>
                  <code>{commit.sha}</code>
                  <span>{commit.message}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        {rest.length ? (
          <div className={classes.queueBlock}>
            <div className={classes.queueHead}>EARLIER</div>
            <ul className={classes.queueList}>
              {rest.map((entry) => (
                <li key={entry.id} className={classes.queueItem}>
                  <div className={classes.queueMain}>
                    <span className={classes.queueTitle}>{entry.title}</span>
                    {entry.summary ? (
                      <span className={classes.queueSummary}>{entry.summary}</span>
                    ) : null}
                    <span className={classes.queueMeta}>
                      {entry.branch} · {entry.sha}
                    </span>
                  </div>
                  <time className={classes.queueTime} dateTime={entry.createdAt}>
                    {formatFeedTime(entry.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={classes.signalRail}>
          <div className={classes.signalHead}>
            <span>{c.feedSignalTitle}</span>
            <span className={classes.signalHint}>{c.feedSignalHint}</span>
          </div>
          <ul className={classes.signalGrid}>
            {c.feedSignal.map((row) => (
              <li key={row.label} className={classes.signalItem}>
                <span className={classes.signalLabel}>{row.label}</span>
                <span className={classes.signalDetail}>{row.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {showViewAll ? (
          <div className={classes.stripFoot}>
            <span className={classes.footNote}>{repo.split('/')[1] || 'Peritia'} feed</span>
            <Link href="/updates" className={classes.viewAll}>
              VIEW ALL UPDATES ›
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ol className={classes.timeline}>
      {entries.map((entry) => (
        <li key={entry.id} className={classes.card}>
          <div className={classes.cardTop}>
            <div>
              <div className={classes.kicker}>
                UPDATE · {entry.branch} · {entry.sha}
              </div>
              <h2 className={classes.cardTitle}>{entry.title}</h2>
              <p className={classes.cardSummary}>{entry.summary}</p>
            </div>
            <time className={classes.time} dateTime={entry.createdAt}>
              {formatFeedTime(entry.createdAt)}
            </time>
          </div>

          {entry.bullets?.length ? (
            <ul className={classes.bullets}>
              {entry.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}

          {entry.commits?.length ? (
            <div className={classes.commitBlock}>
              <div className={classes.commitHead}>CHANGES</div>
              <ul className={classes.commits}>
                {entry.commits.map((commit) => (
                  <li key={commit.sha + commit.message}>
                    <span className={classes.commitRow}>
                      <code>{commit.sha}</code>
                      <span>{commit.message}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={classes.cardFoot}>
            <span>by {entry.author}</span>
            {showRepoLinks ? (
              <a href={entry.url} target="_blank" rel="noreferrer">
                Open on GitHub ›
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
