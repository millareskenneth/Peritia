'use client';

import { ActionIcon, Anchor, Badge, Container, Group, Text, Title } from '@mantine/core';
import { ExternalLink, GitBranch, Shield, Terminal, User } from 'lucide-react';
import classes from './Footer.module.css';

const data = [
  {
    title: 'Open Source',
    icon: Shield,
    links: [
      { label: 'GNU AGPLv3 License', link: 'https://www.gnu.org/licenses/agpl-3.0.html' },
      { label: 'Full code transparency', link: '#' },
      { label: 'Community freedom', link: '#' },
      { label: 'Anti closed-source clone', link: '#' },
    ],
  },
  {
    title: 'The Creator',
    icon: User,
    links: [
      { label: 'Kenneth Millares', link: 'https://github.com/millareskenneth/' },
      { label: 'Fullstack Developer', link: '#' },
      { label: 'View Github', link: 'https://github.com/millareskenneth/' },
    ],
  },
  {
    title: 'Project',
    icon: GitBranch,
    links: [
      { label: 'System Architecture', link: '/docs' },
      { label: 'Release v1.0', link: '#' },
    ],
  },
];

/**
 * Adapted from Mantine UI — Footer with links
 * @see https://ui.mantine.dev/component/footer-links
 */
export function Footer() {
  const groups = data.map((group) => {
    const Icon = group.icon;
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        target={link.link.startsWith('http') ? '_blank' : undefined}
        rel={link.link.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={link.link === '#' ? (event) => event.preventDefault() : undefined}
      >
        {link.label}
        {link.link.startsWith('http') ? (
          <ExternalLink size={12} style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} />
        ) : null}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Title order={4} className={classes.title}>
          <Icon size={16} color="#4A6B4A" />
          {group.title}
        </Title>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container size="xl" px={0}>
        <div className={classes.inner}>
          <div className={classes.logo}>
            <div className={classes.brandRow}>
              <img src="/peritia.svg" alt="PeritiaOS Logo" width={36} height={36} />
              <span className={classes.brandTitle}>
                Peritia<span className={classes.brandAccent}>OS</span>
              </span>
            </div>

            <Text size="sm" c="dimmed" className={classes.description} fw={600}>
              Build the System. Become the Architect.
            </Text>

            <Text size="sm" c="dimmed" className={classes.description} mt="xs">
              An open-source Linux distribution designed to teach software engineering through
              real-world system design, AI-assisted development, and continuous improvement.
            </Text>

            <div className={classes.pillRow}>
              <span className={classes.pill}>
                <Terminal size={13} color="#4A6B4A" /> LINUX HARDENED
              </span>
              <span className={classes.pill}>
                <GitBranch size={13} color="#4A6B4A" /> RELEASE V1.0
              </span>
              <Badge color="olive" variant="light" radius="xs">
                AGPLv3
              </Badge>
            </div>
          </div>

          <div className={classes.groups}>{groups}</div>
        </div>

        <div className={classes.afterFooter}>
          <Text c="dimmed" size="xs" ff="monospace">
            COPYRIGHT {new Date().getFullYear()} ©{' '}
            <Text span fw={600} c="dark">
              PERITIAOS PROJECT
            </Text>
            . ALL RIGHTS RESERVED.
          </Text>

          <Group gap="xs" justify="flex-end" wrap="nowrap">
            <ActionIcon
              size="lg"
              color="steel"
              variant="subtle"
              component="a"
              href="https://github.com/millareskenneth/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.97 3.22 9.18 7.69 10.66.56.1.77-.24.77-.54v-1.93c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.78 1.69 2.8 1.2.1-.73.4-1.23.72-1.51-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.1 1.15a10.7 10.7 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.54.23 2.68.11 2.96.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.41.35.77 1.04.77 2.1v3.11c0 .3.21.65.78.54 4.46-1.48 7.68-5.69 7.68-10.66C23.25 5.48 18.27.5 12 .5z" />
              </svg>
            </ActionIcon>
            <Anchor
              href="https://github.com/millareskenneth/"
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="olive"
              ff="monospace"
            >
              millareskenneth
            </Anchor>
          </Group>
        </div>
      </Container>
    </footer>
  );
}
