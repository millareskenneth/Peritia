'use client';

import { ActionIcon, Code, Group, ScrollArea, Text, Tooltip } from '@mantine/core';
import { BookOpen, Cpu, Library, PanelLeft, X } from 'lucide-react';
import { useLanguageTheme } from '../language-themes/LanguageThemeProvider';
import { DocLinksGroup } from './DocLinksGroup';
import classes from './Sidebar.module.css';

const iconMap = {
  Cpu,
  BookOpen,
};

/**
 * Adapted from Mantine UI — Nested navbar + links group
 * @see https://ui.mantine.dev/component/navbar-nested
 * @see https://ui.mantine.dev/component/navbar-links-group
 */
export function Sidebar({
  docs,
  activeDocId,
  onSelectDoc,
  tocItems,
  isSidebarOpen,
  toggleSidebar,
  isMobile,
  onCloseMobile,
}) {
  const showFullContent = isMobile ? true : isSidebarOpen;
  const { language } = useLanguageTheme();
  const t = language.terms;

  return (
    <nav className={`${classes.navbar} ${showFullContent ? '' : classes.navbarCollapsed}`}>
      <div className={`${classes.header} ${showFullContent ? '' : classes.headerCollapsed}`}>
        <a href="/" className={classes.brand} title="PeritiaOS Home">
          <img
            src="/peritia.svg"
            alt="PeritiaOS Icon"
            width={34}
            height={34}
            style={{
              display: 'block',
              filter: 'sepia(0.3) saturate(0.65)',
              flexShrink: 0,
            }}
          />
          {showFullContent && (
            <div>
              <div className={classes.brandTitle}>
                Peritia<span className={classes.brandAccent}>OS</span>
              </div>
              <span className={classes.brandSub}>{t.docsRegion}</span>
            </div>
          )}
        </a>

        <Tooltip
          label={isMobile ? 'Close menu' : isSidebarOpen ? 'Collapse (Ctrl+B)' : 'Expand (Ctrl+B)'}
          position="right"
          withArrow
        >
          <ActionIcon
            variant="default"
            size="lg"
            onClick={isMobile ? onCloseMobile : toggleSidebar}
            aria-label="Toggle Sidebar"
            className={classes.toggle}
            styles={{
              root: {
                background: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              },
            }}
          >
            {isMobile ? <X size={18} /> : <PanelLeft size={18} />}
          </ActionIcon>
        </Tooltip>
      </div>

      <ScrollArea
        className={classes.links}
        type="scroll"
        scrollbars="y"
        offsetScrollbars
        scrollbarSize={8}
      >
        <div className={classes.linksInner}>
          {showFullContent ? (
            <div className={classes.sectionLabel}>
              <Library size={14} />
              <span>{t.datasetLibrary}</span>
            </div>
          ) : null}

          {docs.map((doc) => {
            const IconComponent = iconMap[doc.icon] || BookOpen;
            const isActive = activeDocId === doc.id;

            return (
              <DocLinksGroup
                key={doc.id}
                icon={IconComponent}
                label={doc.title}
                active={isActive}
                initiallyOpened={isActive}
                links={isActive ? tocItems : []}
                collapsed={!showFullContent}
                onSelect={() => onSelectDoc(doc.id)}
                onLinkClick={() => {
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
              />
            );
          })}
        </div>
      </ScrollArea>

      {showFullContent && (
        <div className={classes.footer}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={600} ff="monospace">
              {t.docsRegion}
            </Text>
            <Code fw={700} style={{ background: 'rgba(74, 107, 74, 0.12)', color: '#4A6B4A' }}>
              V1.0
            </Code>
          </Group>
        </div>
      )}
    </nav>
  );
}
