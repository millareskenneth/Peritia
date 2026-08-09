#!/usr/bin/env node
/**
 * Smart-summarize commits from a GitHub push and prepend to src/data/dev-feed.json
 *
 * Env (set by workflow):
 *   GITHUB_REPOSITORY   owner/repo
 *   GITHUB_REF_NAME     branch
 *   GITHUB_SHA          head sha
 *   GITHUB_ACTOR        pusher
 *   GITHUB_EVENT_PATH   push event JSON
 *   BEFORE_SHA          optional before sha
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const feedPath = path.join(root, 'src/data/dev-feed.json');
const MAX_ENTRIES = 60;
const MAX_BULLETS = 6;

function loadEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && fs.existsSync(eventPath)) {
    return JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  }
  return {};
}

function subjectLine(message = '') {
  return String(message)
    .replace(/\\n/g, '\n')
    .split(/\r?\n/)[0]
    .trim();
}

function isNoise(subject) {
  if (!subject) return true;
  return (
    /^merge\b/i.test(subject) ||
    /^merge pull request/i.test(subject) ||
    /\[skip ci\]/i.test(subject) ||
    /^chore:\s*update dev feed/i.test(subject) ||
    /^chore\(dev-feed\)/i.test(subject)
  );
}

function scoreType(subject) {
  const m = subject.match(/^(feat|fix|ui|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?:/i);
  return m ? m[1].toLowerCase() : null;
}

function buildTitle(branch, subjects, typeHits) {
  const n = subjects.length;
  const topType = Object.entries(typeHits).sort((a, b) => b[1] - a[1])[0];
  const typeLabel = {
    feat: 'Features',
    fix: 'Fixes',
    ui: 'UI updates',
    docs: 'Docs',
    refactor: 'Refactors',
    perf: 'Performance',
    chore: 'Chores',
    style: 'Style',
    test: 'Tests',
    build: 'Build',
    ci: 'CI',
    revert: 'Reverts',
  };

  if (topType && topType[1] > 0 && topType[1] >= Math.ceil(n / 2)) {
    const label = typeLabel[topType[0]] || topType[0];
    return `${label} landed on ${branch} (${n} commit${n === 1 ? '' : 's'})`;
  }

  if (n === 1) {
    const cleaned = subjects[0].replace(/^(feat|fix|ui|docs|chore|refactor|perf)(\(.+\))?!?:\s*/i, '');
    return cleaned.slice(0, 96) || `Update on ${branch}`;
  }

  return `${n} changes pushed to ${branch}`;
}

function buildSummary(subjects, typeHits) {
  const parts = [];
  const ordered = Object.entries(typeHits)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, c]) => `${c} ${k}`);

  if (ordered.length) {
    parts.push(ordered.join(', '));
  } else if (subjects[0]) {
    parts.push(subjects[0].replace(/^(feat|fix|ui|docs|chore|refactor|perf)(\(.+\))?!?:\s*/i, ''));
  }

  return parts.join(' · ').slice(0, 180) || 'Repository update';
}

function normalizeBullets(subjects) {
  const seen = new Set();
  const out = [];
  for (const s of subjects) {
    const cleaned = s.replace(/^(feat|fix|ui|docs|chore|refactor|perf|style|test|build|ci)(\(.+\))?!?:\s*/i, '');
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned.slice(0, 140));
    if (out.length >= MAX_BULLETS) break;
  }
  return out;
}

function main() {
  const event = loadEvent();
  const repo = process.env.GITHUB_REPOSITORY || event.repository?.full_name || 'millareskenneth/Peritia';
  const branch =
    process.env.GITHUB_REF_NAME ||
    (event.ref ? String(event.ref).replace(/^refs\/heads\//, '') : 'main');
  const headSha = process.env.GITHUB_SHA || event.after || '';
  const beforeSha = process.env.BEFORE_SHA || event.before || '';
  const actor = process.env.GITHUB_ACTOR || event.pusher?.name || event.sender?.login || 'unknown';

  const rawCommits = Array.isArray(event.commits) ? event.commits : [];
  const commits = rawCommits
    .map((c) => ({
      sha: c.id || c.sha || '',
      message: c.message || '',
      url: c.url || (c.id ? `https://github.com/${repo}/commit/${c.id}` : ''),
      author: c.author?.username || c.author?.name || actor,
    }))
    .filter((c) => c.sha);

  // Head-only fallback when event has no commits array (e.g. force / API)
  if (commits.length === 0 && headSha) {
    commits.push({
      sha: headSha,
      message: event.head_commit?.message || `Push to ${branch}`,
      url: `https://github.com/${repo}/commit/${headSha}`,
      author: actor,
    });
  }

  const subjects = commits.map((c) => subjectLine(c.message)).filter((s) => !isNoise(s));

  if (subjects.length === 0) {
    console.log('No visitor-facing commits to summarize — skipping feed write.');
    process.exit(0);
  }

  const typeHits = {
    feat: 0,
    fix: 0,
    ui: 0,
    docs: 0,
    refactor: 0,
    perf: 0,
    chore: 0,
    style: 0,
    test: 0,
    build: 0,
    ci: 0,
    revert: 0,
  };
  for (const s of subjects) {
    const t = scoreType(s);
    if (t && t in typeHits) typeHits[t] += 1;
  }

  const bullets = normalizeBullets(subjects);
  const short = headSha.slice(0, 7);
  const compareUrl =
    beforeSha && !/^0+$/.test(beforeSha)
      ? `https://github.com/${repo}/compare/${beforeSha.slice(0, 7)}...${short}`
      : `https://github.com/${repo}/commit/${headSha}`;

  const entry = {
    id: `push-${short}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    repo,
    branch,
    title: buildTitle(branch, subjects, typeHits),
    summary: buildSummary(subjects, typeHits),
    bullets,
    commits: commits.slice(0, 12).map((c) => ({
      sha: c.sha.slice(0, 7),
      message: subjectLine(c.message),
      url: c.url,
      author: c.author,
    })),
    author: actor,
    url: compareUrl,
    sha: short,
  };

  let feed = { repo, updatedAt: entry.createdAt, entries: [] };
  if (fs.existsSync(feedPath)) {
    try {
      feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    } catch {
      /* keep default */
    }
  }

  const entries = Array.isArray(feed.entries) ? feed.entries : [];
  // De-dupe same head sha already posted
  if (entries.some((e) => e.sha === short && e.branch === branch)) {
    console.log(`Feed already has ${short} on ${branch} — skipping.`);
    process.exit(0);
  }

  feed.repo = repo;
  feed.updatedAt = entry.createdAt;
  feed.entries = [entry, ...entries].slice(0, MAX_ENTRIES);

  fs.writeFileSync(feedPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
  console.log(`Dev feed updated: ${entry.title}`);
}

main();
