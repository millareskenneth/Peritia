'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
      className="app-layout"
      style={{
        background: 'var(--bg-primary)',
        minHeight: '100vh',
      }}
    >
      <AppShell
        layout="alt"
        header={{ height: HEADER_HEIGHT }}
        navbar={{
          width: navbarWidth,
          breakpoint: 'md',
          collapsed: { mobile: !mobileNavOpened, desktop: false },
        }}
        padding={0}
        styles={{
          main: {
            background: 'transparent',
            minHeight: '100vh',
          },
          navbar: {
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-strong)',
            transition: 'width 200ms ease',
            top: 0,
            height: '100dvh',
          },
          header: {
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
          },
        }}
      >
        <AppShell.Header>
          <Header
            activeDoc={activeDoc}
            links={navLinks}
            showBurger={Boolean(isMobile)}
            burgerOpened={mobileNavOpened}
            onBurgerClick={toggleMobileNav}
          />
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
          <main className="main-content">
            <DocViewer doc={activeDoc} setTocItems={setTocItems} />
            <Footer />
          </main>
        </AppShell.Main>
      </AppShell>
    </Box>
  );
}
