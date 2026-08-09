'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AppShell, Box } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { docsData } from '../../data/docsData';
import { Sidebar } from '../../components/Sidebar';
import { DocViewer } from '../../components/DocViewer';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

const SIDEBAR_WIDTH = 350;
const SIDEBAR_COLLAPSED = 72;
const HEADER_HEIGHT = 78;

export default function DocsPortalPage() {
  const [activeDocId, setActiveDocId] = useState('system-architecture');
  const [tocItems, setTocItems] = useState([]);
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] = useDisclosure(false);
  const [desktopCollapsed, { toggle: toggleDesktopCollapsed }] = useDisclosure(false);
  const [shellHeaderHeight, setShellHeaderHeight] = useState(HEADER_HEIGHT);
  const headerMeasureRef = useRef(null);

  const isMobile = useMediaQuery('(max-width: 62em)', false, { getInitialValueInEffect: true });

  const activeDoc = docsData.find((d) => d.id === activeDocId) || docsData[0];

  const handleSelectDoc = useCallback(
    (id) => {
      setActiveDocId(id);
      closeMobileNav();
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    [closeMobileNav],
  );

  const navLinks = useMemo(
    () =>
      docsData.map((doc) => ({
        label: doc.category || doc.title,
        active: doc.id === activeDocId,
        onClick: () => handleSelectDoc(doc.id),
      })),
    [activeDocId, handleSelectDoc],
  );

  // AppShell needs a numeric header height for --app-shell-header-offset.
  // `height: auto` makes padding-top calc() invalid, so the sticky header
  // covers the page H1 (only the last wrapped line stays visible).
  useLayoutEffect(() => {
    const node = headerMeasureRef.current;
    if (!node) return undefined;

    const sync = () => {
      const next = Math.ceil(node.getBoundingClientRect().height);
      if (next > 0) {
        setShellHeaderHeight((prev) => (prev === next ? prev : next));
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [activeDoc?.title, isMobile]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (isMobile) {
          toggleMobileNav();
        } else {
          toggleDesktopCollapsed();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, toggleMobileNav, toggleDesktopCollapsed]);

  const navbarWidth = desktopCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box
      className="app-layout app-layout--docs"
      style={{
        background: 'var(--bg-primary)',
        minHeight: '100vh',
      }}
    >
      <AppShell
        layout="alt"
        header={{ height: shellHeaderHeight }}
        navbar={{
          width: { base: 300, md: navbarWidth },
          breakpoint: 'md',
          collapsed: { mobile: !mobileNavOpened, desktop: false },
        }}
        padding={0}
        styles={{
          root: {
            minHeight: '100vh',
            ...(isMobile
              ? {
                  overflowX: 'clip',
                  '--app-shell-navbar-offset': '0px',
                  '--app-shell-aside-offset': '0px',
                }
              : {
                  overflowX: 'hidden',
                }),
          },
          main: {
            background: 'transparent',
            minHeight: '100vh',
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'clip',
          },
          navbar: {
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-strong)',
            transition: 'width 200ms ease, transform 200ms ease',
            top: 0,
            height: '100dvh',
            overflowX: 'hidden',
            overflowY: 'hidden',
            ...(isMobile
              ? {
                  maxWidth: 'min(300px, 88vw)',
                }
              : {
                  width: navbarWidth,
                  maxWidth: navbarWidth,
                }),
          },
          header: {
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            left: isMobile ? 0 : undefined,
            width: isMobile ? '100%' : undefined,
            maxWidth: '100%',
            overflow: 'hidden',
          },
        }}
      >
        <AppShell.Header>
          <div ref={headerMeasureRef}>
            <Header
              activeDoc={activeDoc}
              links={navLinks}
              showBurger={Boolean(isMobile)}
              burgerOpened={mobileNavOpened}
              onBurgerClick={toggleMobileNav}
            />
          </div>
        </AppShell.Header>

        <AppShell.Navbar p={0}>
          <Sidebar
            docs={docsData}
            activeDocId={activeDocId}
            onSelectDoc={handleSelectDoc}
            tocItems={tocItems}
            isSidebarOpen={!desktopCollapsed}
            toggleSidebar={toggleDesktopCollapsed}
            isMobile={Boolean(isMobile)}
            onCloseMobile={closeMobileNav}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <main className="main-content main-content--docs">
            <DocViewer doc={activeDoc} setTocItems={setTocItems} />
            <Footer />
          </main>
        </AppShell.Main>
      </AppShell>
    </Box>
  );
}
