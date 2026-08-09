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

/** @param {string | undefined} sha */
function shortSha(sha) {
  return String(sha || '')
    .trim()
    .slice(0, 7)
    .toLowerCase();
}

/**
 * Drop later posts whose commits were already shown in a newer post
 * (e.g. same squash/cherry-pick/merge on another branch).
 * @param {DevFeedEntry[]} entries
 */
export function dedupeFeedEntries(entries = []) {
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {DevFeedEntry[]} */
  const out = [];

  for (const entry of entries) {
    if (!entry) continue;

    const commitShas = (entry.commits || [])
      .map((c) => shortSha(c?.sha))
      .filter(Boolean);
    const head = shortSha(entry.sha);
    const keys = commitShas.length ? commitShas : head ? [head] : [];

    if (!keys.length) {
      out.push(entry);
      continue;
    }

    // Entire payload already shown → skip this post
    if (keys.every((k) => seen.has(k))) continue;

    for (const k of keys) seen.add(k);
    if (head) seen.add(head);
    out.push(entry);
  }

  return out;
}

/** @returns {{ repo: string, updatedAt: string, entries: DevFeedEntry[] }} */
export function getDevFeed() {
  const entries = dedupeFeedEntries(Array.isArray(feedData.entries) ? feedData.entries : []);
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
