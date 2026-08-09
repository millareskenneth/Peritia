/**
 * Plain-language landing copy.
 * Fixed across LANGUAGE MODES — themes only change colors/fonts, not this message.
 */

export const LANDING_COPY = {
  eyebrow: 'Developer Operating System',
  name: 'PeritiaOS',
  headline: 'A Linux setup built for writing software',
  lead:
    'Open-source Linux for developers — less setup friction, consistent machines, clearer visibility into slow builds.',
  support: 'Same idea on your laptop, in CI, and closer to production.',

  heroFacts: [
    { label: 'Kernel', value: 'Linux' },
    { label: 'Audience', value: 'Developers' },
    { label: 'Config', value: '.peritia.yaml' },
    { label: 'License', value: 'AGPLv3' },
  ],
  heroNotesTitle: 'Built around',
  heroNotes: [
    'Wizard-led setup instead of a generic desktop install',
    'Rootless containers for safer local builds and tests',
    'Storage tuned for compile / CI wait time, not office apps',
    'Same environment shape from laptop → CI → closer to prod',
  ],

  glanceTitle: 'At a glance',
  glance: [
    { label: 'What it is', value: 'Linux for developers' },
    { label: 'Goal', value: 'Faster setup, fewer “works on my machine” bugs' },
    { label: 'License', value: 'GNU AGPLv3' },
    { label: 'Status', value: 'Early · Spec & site live' },
    { label: 'Start here', value: 'Docs · Updates' },
  ],
  glanceNotesTitle: 'Right now',
  glanceNotes: [
    { label: 'Live', value: 'Site, docs, updates' },
    { label: 'Building', value: 'OS image' },
    { label: 'UI only', value: 'LANGUAGE MODES' },
    { label: 'Private', value: 'Source · summaries here' },
  ],

  pillarsKicker: 'Why it exists',
  pillarsTitle: 'Three promises',
  pillarsLead: 'Everything in the plan maps back to these.',
  pillars: [
    {
      name: 'Same everywhere',
      copy: 'Your tools and environment match from laptop to CI to servers — fewer surprise breaks.',
      points: ['Shared toolchains', 'CI mirrors laptop', 'Fewer env bugs'],
    },
    {
      name: 'Faster day-to-day work',
      copy: 'Storage and containers are tuned for builds and tests, so waiting on the machine costs less.',
      points: ['Build-focused storage', 'Rootless containers', 'Less idle wait'],
    },
    {
      name: 'Easy to understand',
      copy: 'Clear docs and live update posts so you can follow what we’re building without digging through commits.',
      points: ['Plain-language docs', 'Auto update posts', 'No commit archaeology'],
    },
  ],
  scopeTitle: 'On the roadmap',
  scope: [
    { label: 'Setup wizard', detail: 'Guided first boot' },
    { label: 'Btrfs / tmpfs', detail: 'Fast workspaces' },
    { label: 'eBPF TUI', detail: 'See what’s slow' },
    { label: 'Time machine', detail: 'Roll back mistakes' },
  ],

  startKicker: 'Get started',
  startTitle: 'What you can do now',
  startLead: 'OS build in progress — read the plan and follow updates as we ship.',
  start: [
    {
      href: '/docs',
      title: 'Read the plan',
      copy: 'Architecture, features, and how it differs from desktop Linux.',
      action: 'Open docs',
      code: '01',
    },
    {
      href: '/updates',
      title: 'Follow development',
      copy: 'Push summaries land here so you can track progress.',
      action: 'View updates',
      code: '02',
    },
  ],
  startStatusTitle: 'Track',
  startStatus: [
    { label: 'Site & docs', state: 'ready', detail: 'Open now' },
    { label: 'Dev updates feed', state: 'ready', detail: 'Auto on push' },
    { label: 'Installable image', state: 'build', detail: 'In progress' },
    { label: 'First package set', state: 'next', detail: 'Up next' },
  ],
  startTip: 'Best path today: skim the docs, then check Updates after each push.',

  feedTitle: 'Latest development updates',
  feedId: 'Auto-posted on every push',
  feedSignalTitle: 'Signal',
  feedSignalHint: 'how posts show up',
  feedSignal: [
    { label: 'Push lands', detail: 'Action writes a short visitor summary' },
    { label: 'Landing strip', detail: 'Latest post surfaces here first' },
    { label: 'Full log', detail: 'Older posts stay on /updates' },
    { label: 'Source', detail: 'Repo stays private — summaries only' },
  ],

  menu: [
    { label: 'Overview', href: '#overview' },
    { label: 'Why', href: '#pillars' },
    { label: 'Start', href: '#start' },
    { label: 'Updates', href: '#activity' },
  ],

  ctaDocs: 'Read the docs',
  ctaStart: 'Get started',
};
