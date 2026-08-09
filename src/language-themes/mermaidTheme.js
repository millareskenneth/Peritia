/**
 * Mermaid config derived from LANGUAGE MODES CSS tokens on <html>.
 */

function readVar(name, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * @param {'light' | 'dark'} scheme
 */
export function buildMermaidConfig(scheme = 'light') {
  const isLight = scheme === 'light';

  const canvas = readVar('--mermaid-canvas', isLight ? '#ede6d6' : '#121417');
  const node = readVar('--mermaid-node', isLight ? '#f7f2e6' : '#1a1e23');
  const nodeAlt = readVar('--mermaid-node-alt', isLight ? '#e2d9c4' : '#242a31');
  const ink = readVar('--mermaid-ink', isLight ? '#1f1a14' : '#e8e6e3');
  const mute = readVar('--mermaid-mute', isLight ? '#3d3428' : '#c2c0bb');
  const edge = readVar('--mermaid-edge', isLight ? '#4a6b4a' : '#5f8f6b');
  const cluster = readVar('--mermaid-cluster', isLight ? 'rgba(226, 217, 196, 0.85)' : 'rgba(17, 23, 38, 0.85)');
  const clusterBorder = readVar('--mermaid-cluster-border', isLight ? 'rgba(74, 107, 74, 0.45)' : 'rgba(95, 143, 107, 0.45)');
  const fontFamily =
    readVar('--font-body') || 'var(--font-ibm-plex-sans), "IBM Plex Sans", system-ui, sans-serif';

  return {
    startOnLoad: false,
    theme: isLight ? 'base' : 'dark',
    securityLevel: 'loose',
    themeVariables: {
      fontFamily,
      background: canvas,
      mainBkg: node,
      primaryColor: node,
      primaryTextColor: ink,
      primaryBorderColor: edge,
      secondaryColor: nodeAlt,
      secondaryTextColor: ink,
      secondaryBorderColor: edge,
      tertiaryColor: canvas,
      tertiaryTextColor: mute,
      tertiaryBorderColor: edge,
      lineColor: edge,
      textColor: ink,
      titleColor: ink,
      nodeBorder: edge,
      clusterBkg: cluster,
      clusterBorder: clusterBorder,
      edgeLabelBackground: canvas,
      actorBkg: node,
      actorBorder: edge,
      actorTextColor: ink,
      labelBoxBkgColor: node,
      labelTextColor: ink,
      labelBoxBorderColor: edge,
      noteBkgColor: nodeAlt,
      noteTextColor: ink,
      noteBorderColor: edge,
    },
  };
}
