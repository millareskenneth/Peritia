'use client';

import { docsData } from '../../data/docsData';
import { DocsExplorer } from '../../components/docs-explorer/DocsExplorer';

export default function DocsPortalPage() {
  return <DocsExplorer docs={docsData} />;
}
