'use client';

import { Burger, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLanguageTheme } from '../language-themes/LanguageThemeProvider';
import classes from './Header.module.css';

/**
 * Docs chrome header — active document metadata.
 * Brand lives in the full-height sidebar.
 */
export function Header({
  activeDoc,
  links = [],
  burgerOpened,
  onBurgerClick,
  showBurger = false,
}) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const { language } = useLanguageTheme();
  const t = language.terms;

  const navItems = links.map((link) => (
    <a
      key={link.label}
      href={link.href || '#'}
      className={classes.link}
      data-active={link.active || undefined}
      onClick={(event) => {
        event.preventDefault();
        link.onClick?.(event);
        closeDrawer();
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {showBurger && (
            <Burger
              opened={burgerOpened}
              onClick={onBurgerClick}
              size="sm"
              color="var(--text-muted)"
              aria-label="Toggle navigation"
            />
          )}

          <div className={classes.meta} aria-live="polite">
            <div className={classes.metaTop}>
              <span className={classes.metaKey}>{t.record}</span>
            </div>
            <div className={classes.metaTitle}>{activeDoc?.title || '—'}</div>
            {activeDoc?.summary ? (
              <p className={classes.metaSummary}>{activeDoc.summary}</p>
            ) : null}
          </div>
        </Group>

        <Group gap="xs" wrap="nowrap" visibleFrom="sm" className={classes.metaAside}>
          <div className={classes.links}>{navItems}</div>
        </Group>

        <Burger
          opened={drawerOpened}
          onClick={drawerOpened ? closeDrawer : openDrawer}
          hiddenFrom="sm"
          size="sm"
          color="var(--text-muted)"
          aria-label="Open links menu"
        />
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigate"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <div className={classes.drawerMeta}>
            <div className={classes.metaTitle}>{activeDoc?.title || '—'}</div>
            {activeDoc?.summary ? (
              <p className={classes.metaSummary}>{activeDoc.summary}</p>
            ) : null}
          </div>
          {navItems}
        </ScrollArea>
      </Drawer>
    </header>
  );
}
