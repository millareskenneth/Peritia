/**
 * Build a folder-oriented tree from flat docsData entries.
 * Folder name = doc.category (fallback "General").
 *
 * @typedef {{ id: string, title: string, category?: string, badge?: string, icon?: string, summary?: string, content: string }} DocEntry
 * @typedef {{ id: string, name: string, docs: DocEntry[] }} DocsFolder
 */

/** @param {DocEntry[]} docs */
export function buildDocsTree(docs = []) {
  /** @type {Map<string, DocsFolder>} */
  const map = new Map();

  for (const doc of docs) {
    const name = (doc.category || 'General').trim() || 'General';
    const id = slugFolder(name);
    if (!map.has(id)) {
      map.set(id, { id, name, docs: [] });
    }
    map.get(id).docs.push(doc);
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** @param {string} name */
export function slugFolder(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'general';
}

/** Display filename for a doc entry */
export function docFileName(doc) {
  if (!doc) return 'untitled.md';
  return `${doc.id || slugFolder(doc.title)}.md`;
}

/**
 * @param {DocsFolder[]} folders
 * @param {string} docId
 */
export function findFolderForDoc(folders, docId) {
  return folders.find((f) => f.docs.some((d) => d.id === docId)) || null;
}

/**
 * @param {DocEntry | null | undefined} doc
 * @param {DocsFolder | null | undefined} folder
 */
export function buildBreadcrumb(doc, folder) {
  const crumbs = [{ id: 'root', label: 'docs', kind: 'root' }];
  if (folder) {
    crumbs.push({ id: folder.id, label: folder.name, kind: 'folder' });
  }
  if (doc) {
    crumbs.push({ id: doc.id, label: docFileName(doc), kind: 'file' });
  }
  return crumbs;
}
