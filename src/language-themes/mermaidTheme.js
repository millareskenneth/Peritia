/**
 * Mermaid config + palette applicator for LANGUAGE MODES.
 * Mermaid 11 injects ID-scoped `!important` styles inside the SVG, so
 * page CSS cannot win — we restyle the SVG after render.
 */

function readVar(name, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * @param {'light' | 'dark'} scheme
 */
export function readMermaidTokens(scheme = 'light') {
  const isLight = scheme === 'light';
  return {
    canvas: readVar('--mermaid-canvas', isLight ? '#ede6d6' : '#121417'),
    node: readVar('--mermaid-node', isLight ? '#f7f2e6' : '#1a1e23'),
    nodeAlt: readVar('--mermaid-node-alt', isLight ? '#e2d9c4' : '#242a31'),
    ink: readVar('--mermaid-ink', isLight ? '#1f1a14' : '#e8e6e3'),
    mute: readVar('--mermaid-mute', isLight ? '#3d3428' : '#c2c0bb'),
    edge: readVar('--mermaid-edge', isLight ? '#4a6b4a' : '#5f8f6b'),
    cluster: readVar(
      '--mermaid-cluster',
      isLight ? 'rgba(226, 217, 196, 0.9)' : 'rgba(17, 23, 38, 0.88)',
    ),
    clusterBorder: readVar(
      '--mermaid-cluster-border',
      isLight ? 'rgba(74, 107, 74, 0.45)' : 'rgba(95, 143, 107, 0.45)',
    ),
    fontFamily:
      readVar('--font-body') ||
      'var(--font-ibm-plex-sans), "IBM Plex Sans", system-ui, sans-serif',
  };
}

/**
 * @param {'light' | 'dark'} scheme
 */
export function buildMermaidConfig(scheme = 'light') {
  const isLight = scheme === 'light';
  const t = readMermaidTokens(scheme);

  return {
    startOnLoad: false,
    theme: isLight ? 'base' : 'dark',
    look: 'classic',
    securityLevel: 'loose',
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 12,
    },
    themeVariables: {
      darkMode: !isLight,
      fontFamily: t.fontFamily,
      background: t.canvas,
      mainBkg: t.node,
      primaryColor: t.node,
      primaryTextColor: t.ink,
      primaryBorderColor: t.edge,
      secondaryColor: t.nodeAlt,
      secondaryTextColor: t.ink,
      secondaryBorderColor: t.edge,
      tertiaryColor: t.canvas,
      tertiaryTextColor: t.mute,
      tertiaryBorderColor: t.edge,
      lineColor: t.edge,
      textColor: t.ink,
      titleColor: t.ink,
      nodeBorder: t.edge,
      clusterBkg: t.cluster,
      clusterBorder: t.clusterBorder,
      edgeLabelBackground: t.canvas,
      actorBkg: t.node,
      actorBorder: t.edge,
      actorTextColor: t.ink,
      labelBoxBkgColor: t.node,
      labelTextColor: t.ink,
      labelBoxBorderColor: t.edge,
      noteBkgColor: t.nodeAlt,
      noteTextColor: t.ink,
      noteBorderColor: t.edge,
    },
  };
}

function paintShape(el, fill, stroke) {
  if (!el) return;
  el.setAttribute('fill', fill);
  el.setAttribute('stroke', stroke);
  el.style.setProperty('fill', fill, 'important');
  el.style.setProperty('stroke', stroke, 'important');
}

function paintInk(el, ink) {
  if (!el) return;
  el.setAttribute('fill', ink);
  el.style.setProperty('fill', ink, 'important');
  el.style.setProperty('color', ink, 'important');
}

/**
 * Force LANGUAGE MODE palette onto a rendered Mermaid SVG.
 * @param {ParentNode | null | undefined} root
 * @param {'light' | 'dark'} scheme
 */
export function applyMermaidPalette(root, scheme = 'light') {
  if (!root) return;
  const t = readMermaidTokens(scheme);
  const svgs = root.querySelectorAll ? root.querySelectorAll('svg') : [];

  svgs.forEach((svg) => {
    if (!(svg instanceof SVGElement)) return;

    // Neutralize Mermaid's embedded !important theme block, then inject ours.
    svg.querySelectorAll('style').forEach((styleEl) => {
      if (styleEl.getAttribute('data-lang-mermaid') === 'true') return;
      // Keep non-color layout bits if present; strip fill/stroke/color wars.
      styleEl.textContent = (styleEl.textContent || '')
        .replace(/fill\s*:[^;!}]+[!important\s]*;?/gi, '')
        .replace(/stroke\s*:[^;!}]+[!important\s]*;?/gi, '')
        .replace(/color\s*:[^;!}]+[!important\s]*;?/gi, '');
    });

    let style = svg.querySelector('style[data-lang-mermaid]');
    if (!style) {
      style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.setAttribute('data-lang-mermaid', 'true');
      svg.insertBefore(style, svg.firstChild);
    }

    const svgId = svg.id ? `#${CSS.escape(svg.id)}` : '';
    style.textContent = `
      ${svgId} .node rect,
      ${svgId} .node circle,
      ${svgId} .node ellipse,
      ${svgId} .node polygon,
      ${svgId} .node path,
      ${svgId} .node .label-container,
      ${svgId} .node .basic,
      ${svgId} rect.basic,
      ${svgId} .label-container {
        fill: ${t.node} !important;
        stroke: ${t.edge} !important;
      }
      ${svgId} .cluster rect {
        fill: ${t.cluster} !important;
        stroke: ${t.clusterBorder} !important;
      }
      ${svgId} .edgePath .path,
      ${svgId} .flowchart-link,
      ${svgId} .edge path,
      ${svgId} path.path {
        stroke: ${t.edge} !important;
        fill: none !important;
      }
      ${svgId} .marker,
      ${svgId} .arrowheadPath,
      ${svgId} defs marker path {
        fill: ${t.edge} !important;
        stroke: ${t.edge} !important;
      }
      ${svgId} .nodeLabel,
      ${svgId} .edgeLabel,
      ${svgId} .label,
      ${svgId} .cluster-label,
      ${svgId} .nodeLabel *,
      ${svgId} .edgeLabel *,
      ${svgId} .label *,
      ${svgId} .cluster-label *,
      ${svgId} foreignObject,
      ${svgId} foreignObject *,
      ${svgId} text,
      ${svgId} tspan {
        color: ${t.ink} !important;
        fill: ${t.ink} !important;
      }
    `;

    svg
      .querySelectorAll(
        '.node rect, .node circle, .node ellipse, .node polygon, .node .label-container, .node .basic, rect.basic, .label-container',
      )
      .forEach((el) => paintShape(el, t.node, t.edge));

    // Path-shaped nodes (not edge paths)
    svg.querySelectorAll('.node > path, .node path.basic').forEach((el) => {
      paintShape(el, t.node, t.edge);
    });

    svg.querySelectorAll('.cluster rect').forEach((el) => {
      paintShape(el, t.cluster, t.clusterBorder);
    });

    svg
      .querySelectorAll('.edgePath .path, .flowchart-link, .edge path, path.path')
      .forEach((el) => {
        el.setAttribute('stroke', t.edge);
        el.style.setProperty('stroke', t.edge, 'important');
        el.style.setProperty('fill', 'none', 'important');
      });

    svg.querySelectorAll('defs marker path, .arrowheadPath, .marker').forEach((el) => {
      paintShape(el, t.edge, t.edge);
    });

    svg
      .querySelectorAll(
        '.nodeLabel, .edgeLabel, .label, .cluster-label, .nodeLabel *, .edgeLabel *, foreignObject, foreignObject div, foreignObject span, foreignObject p, text, tspan',
      )
      .forEach((el) => paintInk(el, t.ink));
  });
}
