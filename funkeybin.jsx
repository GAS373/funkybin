import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Rocket,
  Share2,
  Lock,
  Wand2,
  Trash2,
  Github,
  Copy,
  Check,
  Plus,
  Download,
  Upload,
  Sun,
  Moon,
  Tag,
} from "lucide-react";

// --- tiny helpers -----------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();
const STORAGE_KEY = "funkybin.bins.v1";
const THEME_KEY = "funkybin.theme";

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function useTheme() {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, "dark");
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);
  return [theme, setTheme];
}

// --- types -----------------------------------------------------------------
/** @typedef {{id:string, title:string, tags:string[], content:string, createdAt:string, updatedAt:string}} Bin */

// --- UI primitives (no external UI lib; Tailwind only) ---------------------
function Button({ as: As = "button", className = "", children, ...props }) {
  return (
    <As
      className={
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium " +
        "shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] " +
        "bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white hover:opacity-95 " +
        className
      }
      {...props}
    >
      {children}
    </As>
  );
}

function GhostButton({ className = "", children, ...props }) {
  return (
    <button
      className={
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium " +
        "transition ring-1 ring-zinc-300/60 dark:ring-zinc-700/60 bg-white/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-zinc-300/70 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/60 " +
        "px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400/60 dark:focus:ring-fuchsia-500/40 " +
        className
      }
      {...props}
    />
  );
}

function TextArea({ className = "", ...props }) {
  return (
    <textarea
      className={
        "w-full min-h-[180px] rounded-xl border border-zinc-300/70 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/60 " +
        "px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-400/60 dark:focus:ring-indigo-500/40 " +
        className
      }
      spellCheck={false}
      {...props}
    />
  );
}

function TagPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-700 dark:text-zinc-300">
      <Tag className="h-3 w-3" />
      {label}
    </span>
  );
}

// --- Modals ----------------------------------------------------------------
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="content"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        className="fixed inset-x-0 top-10 z-50 mx-auto w-full max-w-2xl p-4"
      >
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-900/90 shadow-2xl">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main app --------------------------------------------------------------
export default function FunkyBinApp() {
  const [theme, setTheme] = useTheme();
  const [bins, setBins] = useLocalStorage(STORAGE_KEY, /** @type {Bin[]} */([]));
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // Bin | null
  const [copied, setCopied] = useState("");

  // hash-based deep link
  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const found = bins.find(b => b.id === id);
    if (found) setEditing(found);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return bins;
    const q = query.toLowerCase();
    return bins.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.content.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [bins, query]);

  function createEmptyBin() {
    const b = {
      id: uid(),
      title: "Untitled bin",
      tags: ["draft"],
      content: "// Drop your code here\n",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setBins([b, ...bins]);
    setEditing(b);
    queueMicrotask(() => (location.hash = b.id));
  }

  function saveBin(partial) {
    setBins(prev => prev.map(b => (b.id === partial.id ? { ...b, ...partial, updatedAt: nowISO() } : b)));
  }

  function deleteBin(id) {
    setBins(prev => prev.filter(b => b.id !== id));
    if (editing && editing.id === id) setEditing(null);
    if (location.hash.replace(/^#/, "") === id) history.replaceState(null, "", location.pathname);
  }

  function copy(text) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 1200);
    });
  }

  function exportAll() {
    const blob = new Blob([JSON.stringify(bins, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `funkybin-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) setBins(parsed);
      } catch {}
    };
    reader.readAsText(file);
  }

  const headerFX = "bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(147,51,234,0.25),transparent)]";

  return (
    <div className={`min-h-screen ${headerFX} antialiased transition-colors ${theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <a className="group inline-flex items-center gap-3" href="#">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
                <Code2 className="h-5 w-5 drop-shadow" />
                <div className="absolute -inset-0.5 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-fuchsia-500/40 to-indigo-500/40 blur-lg" />
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight">FunkyBin<span className="text-fuchsia-500">.dev</span></div>
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 group-hover:text-zinc-400">Throw code in. Retrieve magic.</div>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <GhostButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
              </GhostButton>
              <GhostButton as="a" href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </GhostButton>
              <Button onClick={createEmptyBin}>
                <Plus className="h-4 w-4" /> New Bin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl sm:text-5xl font-black leading-tight">
              A tiny, local-first <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500">code bin</span> for developers
            </motion.h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-prose">
              Paste. Save. Share via URL hash. Everything stays in your browser until you export it. No accounts, no servers — just vibes.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <FeaturePill icon={Rocket} label="Blazing-fast" />
              <FeaturePill icon={Share2} label="Hash share" />
              <FeaturePill icon={Lock} label="Local-first" />
              <FeaturePill icon={Wand2} label="Funkify text" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={createEmptyBin}>
                <Plus className="h-4 w-4" /> Create your first bin
              </Button>
              <GhostButton onClick={exportAll}><Download className="h-4 w-4" /> Export</GhostButton>
              <label className="cursor-pointer">
                <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importFromFile(e.target.files[0])} />
                <span className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ring-1 ring-zinc-300/60 dark:ring-zinc-700/60 bg-white/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900"><Upload className="h-4 w-4" />Import</span>
              </label>
            </div>
          </div>

          <ShowcaseCard onQuickCreate={createEmptyBin} />
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">{bins.length} bin{bins.length === 1 ? "" : "s"}</div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search by title, tag, or content…" value={query} onChange={e => setQuery(e.target.value)} className="w-64" />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        {filtered.length === 0 ? (
          <EmptyState onCreate={createEmptyBin} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((b) => (
                <motion.article
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/70 shadow-sm hover:shadow-md"
                >
                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(600px_200px_at_20%_-20%,rgba(147,51,234,.15),transparent),radial-gradient(600px_200px_at_80%_-20%,rgba(99,102,241,.15),transparent)]" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-base font-bold tracking-tight">{b.title}</h3>
                      <div className="flex items-center gap-1">
                        <IconButton title="Copy link" onClick={() => copy(`${location.origin}${location.pathname}#${b.id}`)} icon={copied.includes(b.id) ? Check : Share2} />
                        <IconButton title="Delete" onClick={() => deleteBin(b.id)} icon={Trash2} />
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {b.tags.map((t) => (
                        <TagPill key={t} label={t} />
                      ))}
                    </div>
                    <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-zinc-950/90 text-zinc-50 p-3 text-xs font-mono leading-relaxed dark:[--tw-ring-color:rgba(255,255,255,.1)]">
{b.content.slice(0, 600)}{b.content.length > 600 ? "\n…" : ""}
                    </pre>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                      <div>Updated {new Date(b.updatedAt).toLocaleString()}</div>
                      <button onClick={() => setEditing(b)} className="underline decoration-dotted underline-offset-2 hover:text-fuchsia-500">Open</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* EDITOR MODAL */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <Editor bin={editing} onChange={saveBin} onClose={() => setEditing(null)} onCopy={copy} />
        )}
      </Modal>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} funkybin.dev — built local-first, with ♥</div>
            <div className="flex items-center gap-3">
              <a className="hover:text-zinc-700 dark:hover:text-zinc-300 underline decoration-dotted underline-offset-2" href="#" onClick={(e)=>{e.preventDefault(); alert("Psst… it’s all in your browser!");}}>Privacy</a>
              <a className="hover:text-zinc-700 dark:hover:text-zinc-300 underline decoration-dotted underline-offset-2" href="#" onClick={(e)=>{e.preventDefault(); alert("Open-source soon. Stars welcome!");}}>Open Source</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-zinc-900/60 px-3 py-1 text-xs ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function IconButton({ icon: Icon, className = "", ...props }) {
  return (
    <button
      className={
        "grid h-8 w-8 place-items-center rounded-xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 bg-white/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 transition " +
        className
      }
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300/70 dark:border-zinc-700/60 p-12 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-lg">
          <Code2 />
        </div>
        <h3 className="text-lg font-bold">No bins yet</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create your first funky bin and start collecting snippets, configs, and one‑liners.</p>
        <div className="mt-4 flex items-center justify-center"><Button onClick={onCreate}><Plus className="h-4 w-4" /> Create Bin</Button></div>
      </div>
    </div>
  );
}

function ShowcaseCard({ onQuickCreate }) {
  const sample = `# FunkyBin demo\n\n$ curl -sSL https://funkybin.dev | bash\n\n// paste your code, notes, or configs\nconst hello = (name) => ` + "`Hello, ${name}!`" + `\nconsole.log(hello('world'))`;
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-50 shadow-xl">
      <div className="absolute -inset-16 -z-10 bg-[radial-gradient(500px_200px_at_20%_20%,rgba(244,63,94,.25),transparent),radial-gradient(500px_200px_at_80%_0%,rgba(139,92,246,.25),transparent)]" />
      <div className="flex items-center justify-between px-4 py-3 text-xs">
        <div className="font-mono text-zinc-400">~/funky/demo.js</div>
        <div className="flex items-center gap-2">
          <GhostButton onClick={() => { navigator.clipboard?.writeText(sample); setCopied(true); setTimeout(()=>setCopied(false), 1000); }}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy
          </GhostButton>
          <Button onClick={onQuickCreate}><Plus className="h-3.5 w-3.5" /> New Bin</Button>
        </div>
      </div>
      <pre className="m-4 rounded-xl bg-black/60 p-4 text-[12px] leading-relaxed ring-1 ring-white/10 overflow-auto">
{sample}
      </pre>
      <div className="px-4 pb-4 text-[11px] text-zinc-400">Tip: everything stays local until you export it.</div>
    </div>
  );
}

function Editor({ bin, onChange, onCopy, onClose }) {
  const [title, setTitle] = useState(bin.title);
  const [tags, setTags] = useState(bin.tags.join(", "));
  const [content, setContent] = useState(bin.content);
  const [funk, setFunk] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    setTitle(bin.title);
    setTags(bin.tags.join(", "));
    setContent(bin.content);
  }, [bin]);

  function applyFunk() {
    // playful text effect: add ✨ around function names & collapse multiple spaces
    const tweaked = content
      .replace(/function\s+(\w+)/g, "function ✨$1✨")
      .replace(/\s{3,}/g, "  ");
    setContent(tweaked);
    setFunk(true);
    setTimeout(() => setFunk(false), 600);
  }

  function persist() {
    onChange({ id: bin.id, title, tags: tags.split(",").map(s => s.trim()).filter(Boolean), content });
  }

  function selectAll() {
    taRef.current?.focus();
    taRef.current?.select();
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow"><Code2 className="h-5 w-5" /></div>
          <div>
            <div className="text-sm uppercase tracking-wider text-zinc-500">Editing bin</div>
            <div className="text-lg font-bold">{bin.id}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GhostButton onClick={() => { onCopy(`${location.origin}${location.pathname}#${bin.id}`); }}><Share2 className="h-4 w-4" /> Link</GhostButton>
          <GhostButton onClick={onClose}>Close</GhostButton>
          <Button onClick={persist}>Save</Button>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <label className="text-xs font-semibold">Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My brilliant snippet" />

        <label className="mt-2 text-xs font-semibold">Tags (comma separated)</label>
        <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="http, nginx, docker" />

        <label className="mt-2 text-xs font-semibold">Content</label>
        <TextArea ref={taRef} value={content} onChange={e => setContent(e.target.value)} className={funk ? "ring-2 ring-fuchsia-400" : ""} />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <GhostButton onClick={applyFunk}><Wand2 className="h-4 w-4" /> Funkify</GhostButton>
          <GhostButton onClick={selectAll}><Copy className="h-4 w-4" /> Select all</GhostButton>
          <GhostButton onClick={() => onCopy(content)}><Copy className="h-4 w-4" /> Copy</GhostButton>
          <div className="ml-auto text-[11px] text-zinc-500">Created {new Date(bin.createdAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
