import { createTheme } from '@mantine/core';

/** Modernized COBOL / IBM mainframe identity */
export const theme = createTheme({
  primaryColor: 'olive',
  fontFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", system-ui, sans-serif',
  fontFamilyMonospace: 'var(--font-ibm-plex-mono), "IBM Plex Mono", monospace',
  headings: {
    fontFamily: 'var(--font-ibm-plex-mono), "IBM Plex Mono", monospace',
    fontWeight: '600',
  },
  defaultRadius: 'xs',
  white: '#F7F2E6',
  black: '#1F1A14',
  colors: {
    olive: [
      '#f2f4ec',
      '#e2e6d4',
      '#c8d0ad',
      '#a8b484',
      '#8a9864',
      '#6B7054',
      '#565a42',
      '#444833',
      '#363a29',
      '#2a2e20',
    ],
    amber: [
      '#fbf4e6',
      '#f3e4c4',
      '#e8cb8a',
      '#d9ac4f',
      '#C4953A',
      '#a67b2c',
      '#866224',
      '#6b4e20',
      '#56401c',
      '#473518',
    ],
    steel: [
      '#eff2f5',
      '#d6dde5',
      '#b0bdcc',
      '#8799af',
      '#6a7f98',
      '#4A5E72',
      '#3e4f60',
      '#34404e',
      '#2c3642',
      '#242c36',
    ],
    paper: [
      '#FBF8F0',
      '#F7F2E6',
      '#F3EFE4',
      '#EDE6D6',
      '#E2D9C4',
      '#CFC3A8',
      '#AFA386',
      '#8A7F68',
      '#6B6154',
      '#3D3428',
    ],
  },
  other: {
    ink: '#1F1A14',
    panel: '#EDE6D6',
    rule: 'rgba(44, 36, 22, 0.18)',
  },
  components: {
    Autocomplete: {
      defaultProps: {
        radius: 'xs',
      },
    },
    Button: {
      defaultProps: {
        radius: 'xs',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'xs',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xs',
      },
    },
  },
});
