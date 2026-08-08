'use client';

import { Burger, Group } from '@mantine/core';
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
      </div>
    </header>
  );
}
