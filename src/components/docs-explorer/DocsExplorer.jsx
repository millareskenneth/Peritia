'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Folder, Home } from 'lucide-react';
import { buildDocsTree, docFileName, findFolderForDoc } from '../../lib/docsTree';
import { useLanguageTheme } from '../../language-themes/LanguageThemeProvider';
import { DocViewer } from '../DocViewer';
import { Footer } from '../Footer';
import classes from './DocsExplorer.module.css';

/**
 * Icon-grid file manager:
 * docs/ (folders) → folder (files) → file (reader).
 * Each level is a separate view — no combined scroll dump.
 */
export function DocsExplorer({ docs = [], initialDocId }) {
  const tree = useMemo(() => buildDocsTree(docs), [docs]);

  const initialFolder = findFolderForDoc(tree, initialDocId);
  const [view, setView] = useState(/** @type {'root' | 'folder' | 'file'} */ ('root'));
  const [folderId, setFolderId] = useState(initialFolder?.id || tree[0]?.id || null);
  const [docId, setDocId] = useState(null);
  const [, setTocItems] = useState([]);

  const { language } = useLanguageTheme();
  const t = language.terms;

  const folder = tree.find((f) => f.id === folderId) || null;
  const activeDoc = docs.find((d) => d.id === docId) || null;

  const openRoot = () => {
    setView('root');
    setDocId(null);
  };

  const openFolder = (id) => {
    setFolderId(id);
    setDocId(null);
    setView('folder');
    window.scrollTo(0, 0);
  };

  const openFile = (id) => {
    setDocId(id);
    setView('file');
    window.scrollTo(0, 0);
  };

  const crumbs = (() => {
    const list = [{ id: 'root', label: 'docs', kind: 'root' }];
    if (view !== 'root' && folder) {
      list.push({ id: folder.id, label: folder.name, kind: 'folder' });
    }
    if (view === 'file' && activeDoc) {
      list.push({ id: activeDoc.id, label: docFileName(activeDoc), kind: 'file' });
    }
    return list;
  })();

  return (
    <div className={classes.shell}>
      <header className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          {view !== 'root' ? (
            <button
              type="button"
              className={classes.iconBtn}
              onClick={() => {
                if (view === 'file') openFolder(folderId);
                else openRoot();
              }}
              aria-label="Go back"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          ) : null}

          <Link href="/" className={classes.brand} title="PeritiaOS Home">
            <img src="/peritia.svg" alt="" width={26} height={26} className={classes.brandMark} />
            <span className={classes.brandText}>
              Peritia<span>OS</span>
            </span>
          </Link>

          <nav className={classes.crumbs} aria-label="Path">
            {crumbs.map((crumb, i) => (
              <span key={crumb.id + crumb.kind} className={classes.crumbWrap}>
                {i > 0 ? <span className={classes.crumbSep}>/</span> : null}
                <button
                  type="button"
                  className={`${classes.crumb} ${i === crumbs.length - 1 ? classes.crumbActive : ''}`}
                  onClick={() => {
                    if (crumb.kind === 'root') openRoot();
                    else if (crumb.kind === 'folder') openFolder(crumb.id);
                  }}
                >
                  {i === 0 ? <Home size={12} /> : null}
                  {crumb.label}
                </button>
              </span>
            ))}
          </nav>
        </div>

        <div className={classes.toolbarRight}>
          <span className={classes.metaChip}>{t.docsRegion || 'DOCS'}</span>
          <span className={classes.volumeMetaLight}>
            {view === 'root'
              ? `${tree.length} folders`
              : view === 'folder'
                ? `${folder?.docs.length || 0} files`
                : 'reading'}
          </span>
        </div>
      </header>

      {view === 'root' ? (
        <div className={classes.iconStage}>
          <div className={classes.stageBanner}>
            <span className={classes.volumeLabel}>docs/</span>
            <span className={classes.volumeMeta}>Open a folder — each topic lives in its own place</span>
          </div>
          <div className={classes.iconGrid} role="list">
            {tree.map((item) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={classes.iconItem}
                onClick={() => openFolder(item.id)}
                onDoubleClick={() => openFolder(item.id)}
              >
                <span className={classes.folderGlyph} aria-hidden>
                  <Folder size={44} strokeWidth={1.5} />
                </span>
                <span className={classes.iconName}>{item.name}</span>
                <span className={classes.iconMeta}>
                  {item.docs.length} file{item.docs.length === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
          <div className={classes.stageFoot}>
            <Link href="/" className={classes.footLink}>
              ← Home
            </Link>
          </div>
        </div>
      ) : null}

      {view === 'folder' && folder ? (
        <div className={classes.iconStage}>
          <div className={classes.stageBanner}>
            <span className={classes.volumeLabel}>docs/{folder.name}/</span>
            <span className={classes.volumeMeta}>
              {folder.docs.length} file{folder.docs.length === 1 ? '' : 's'} in this folder
            </span>
          </div>
          <div className={classes.iconGrid} role="list">
            <button
              type="button"
              role="listitem"
              className={`${classes.iconItem} ${classes.iconItemNav}`}
              onClick={openRoot}
            >
              <span className={classes.folderGlyph} aria-hidden>
                <Folder size={44} strokeWidth={1.5} />
              </span>
              <span className={classes.iconName}>..</span>
              <span className={classes.iconMeta}>up to docs/</span>
            </button>
            {folder.docs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                role="listitem"
                className={classes.iconItem}
                onClick={() => openFile(doc.id)}
              >
                <span className={classes.fileGlyph} aria-hidden>
                  <FileText size={40} strokeWidth={1.5} />
                </span>
                <span className={classes.iconName}>{docFileName(doc)}</span>
                <span className={classes.iconMeta}>{doc.title}</span>
              </button>
            ))}
          </div>
          <div className={classes.stageFoot}>
            <button type="button" className={classes.footLinkBtn} onClick={openRoot}>
              ← All folders
            </button>
          </div>
        </div>
      ) : null}

      {view === 'file' && activeDoc ? (
        <section className={classes.readerSolo} aria-label="Document reader">
          <div className={classes.readerBar}>
            <div className={classes.readerMeta}>
              <p className={classes.readerPath}>
                docs/{folder?.name || '—'}/{docFileName(activeDoc)}
              </p>
              <h1 className={classes.readerTitle}>{activeDoc.title}</h1>
              {activeDoc.summary ? <p className={classes.readerSummary}>{activeDoc.summary}</p> : null}
            </div>
            {activeDoc.badge ? <span className={classes.readerBadge}>{activeDoc.badge}</span> : null}
          </div>
          <div className={`${classes.readerBody} main-content main-content--docs`}>
            <DocViewer doc={activeDoc} setTocItems={setTocItems} />
            <Footer />
          </div>
        </section>
      ) : null}
    </div>
  );
}
