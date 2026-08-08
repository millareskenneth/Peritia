'use client';

import { useEffect, useState } from 'react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { ChevronRight } from 'lucide-react';
import classes from './DocLinksGroup.module.css';

/**
 * Adapted from Mantine UI — Navbar links group
 * @see https://ui.mantine.dev/component/navbar-links-group
 */
export function DocLinksGroup({
  icon: Icon,
  label,
  active = false,
  initiallyOpened = false,
  links = [],
  onSelect,
  onLinkClick,
  collapsed = false,
}) {
  const hasLinks = Array.isArray(links) && links.length > 0;
  const [opened, setOpened] = useState(initiallyOpened || active);

  useEffect(() => {
    if (active) setOpened(true);
  }, [active]);

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component="a"
      className={classes.link}
      href={`#${link.id}`}
      key={`${link.id}-${link.text}`}
      onClick={(event) => {
        onLinkClick?.(event, link);
      }}
      style={{ paddingLeft: `${(link.level - 1) * 8 + 12}px` }}
    >
      {link.text}
    </Text>
  ));

  if (collapsed) {
    return (
      <UnstyledButton
        onClick={onSelect}
        className={classes.control}
        data-active={active || undefined}
        title={label}
        style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}
      >
        <ThemeIcon variant="light" size={34} color="olive" radius="xs">
          <Icon size={18} />
        </ThemeIcon>
      </UnstyledButton>
    );
  }

  return (
    <>
      <UnstyledButton
        onClick={() => {
          onSelect?.();
          if (active && hasLinks) {
            setOpened((o) => !o);
          } else {
            setOpened(true);
          }
        }}
        className={classes.control}
        data-active={active || undefined}
      >
        <Group justify="space-between" gap={0} wrap="nowrap">
          <Box style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <ThemeIcon variant="light" size={30} color="olive" radius="xs">
              <Icon size={16} />
            </ThemeIcon>
            <Box style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.45 }}>
              {label}
            </Box>
          </Box>
          {hasLinks && (
            <ChevronRight
              className={classes.chevron}
              size={14}
              style={{
                transform: opened ? 'rotate(90deg)' : 'none',
                flexShrink: 0,
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse expanded={opened && active}>{items}</Collapse> : null}
    </>
  );
}
