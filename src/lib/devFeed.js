import feedData from '../data/dev-feed.json';

/**
 * @typedef {{
 *   id: string,
 *   createdAt: string,
 *   repo: string,
 *   branch: string,
 *   title: string,
 *   summary: string,
 *   bullets: string[],
 *   commits: Array<{ sha: string, message: string, url: string, author?: string }>,
 *   author: string,
 *   url: string,
 *   sha: string,
 * }} DevFeedEntry
 */

/** @returns {{ repo: string, updatedAt: string, entries: DevFeedEntry[] }} */
export function getDevFeed() {
  const entries = Array.isArray(feedData.entries) ? feedData.entries : [];
  return {
    repo: feedData.repo || 'millareskenneth/Peritia',
    updatedAt: feedData.updatedAt || entries[0]?.createdAt || new Date(0).toISOString(),
    entries,
  };
}

/** @param {number} [limit] */
export function getLatestDevFeed(limit = 5) {
  const feed = getDevFeed();
  return {
    ...feed,
    entries: feed.entries.slice(0, limit),
  };
}

/** @param {string} iso */
export function formatFeedTime(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(d) + ' UTC';
  } catch {
    return '—';
  }
}
