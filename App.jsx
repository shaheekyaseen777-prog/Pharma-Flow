import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Stethoscope, CalendarDays, FolderHeart, Bot, Star, Settings as SettingsIcon, Bell, UserCircle, Menu, X } from "lucide-react";
import { DOCS, HOSP, INIT_APPTS, INIT_DOCS, INIT_NOTIFS, LANGS, NAV, NAV_T } from "./data";
import { Logo } from "./ui";
import Intro from "./Intro";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Discover from "./Discover";
import Booking from "./Booking";
import Appointments from "./Appointments";
import Drive from "./Drive";
import Assistant from "./Assistant";
import Reviews from "./Reviews";
import Settings from "./Settings";

// The sidebar items: page id + icon. Labels come from NAV in data.js (same order).
const PAGE_IDS = ["dash", "find", "appts", "drive", "ai", "reviews", "settings"];
const PAGE_ICONS = [LayoutDashboard, Stethoscope, CalendarDays, FolderHeart, Bot, Star, SettingsIcon];

// Saved in the browser. Only harmless choices (language, text size), never patient data.
function readSaved(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    if (text === null) return fallback;
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}
function writeSaved(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // ignore: saving is optional
  }
}

export default function App() {
  // Which screen we are on: "intro", "auth" or "app"
  const [stage, setStage] = useState("intro");
  const [page, setPage] = useState("dash");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  // Demo data lives in state so buttons can change it
  const [appts, setAppts] = useState(INIT_APPTS);
  const [docs, setDocs] = useState(INIT_DOCS);
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [toasts, setToasts] = useState([]);

  // Shared choices
  const [lang, setLang] = useState(readSaved("pf_lang", "English"));
  const [look, setLook] = useState(readSaved("pf_look", { large: false, contrast: false }));
  const [loc, setLoc] = useState("Chengalpattu");
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);

  useEffect(() => { writeSaved("pf_lang", lang); }, [lang]);
  useEffect(() => {
    writeSaved("pf_look", look);
    let classes = "";
    if (look.large) classes = classes + "large ";
    if (look.contrast) classes = classes + "contrast";
    document.documentElement.className = classes;
  }, [look]);

  // Show a small message in the corner for 3 seconds
  function toast(message) {
    const id = Date.now() + Math.random();
    setToasts((old) => [...old, { id: id, m: message }]);
    setTimeout(() => {
      setToasts((old) => old.filter((t) => t.id !== id));
    }, 3200);
  }

  // Add a new notification at the top of the list
  function notify(title, message) {
    setNotifs((old) => [{ id: Date.now(), t: title, m: message, read: false }, ...old]);
  }

  // Switch page
  function go(id) {
    setPage(id);
    setMenuOpen(false);
    setBellOpen(false);
    window.scrollTo(0, 0);
  }

  // Everything the pages need, passed down as one object called S
  const S = {
    appts, setAppts, docs, setDocs, notifs, lang, setLang, look, setLook,
    loc, setLoc, query, setQuery, book, setBook, toast, notify, go,
    doc: (id) => DOCS.find((d) => d.id === id),
    hosp: (id) => HOSP.find((h) => h.id === id),
  };

  // Sidebar labels: translated if we have them, English otherwise
  let labels = NAV;
  if (NAV_T[lang]) labels = NAV_T[lang];

  // The "book" page highlights "Find" in the sidebar
  let activeIndex = PAGE_IDS.indexOf(page);
  if (page === "book") activeIndex = 1;

  let title = NAV[activeIndex];
  if (page === "dash") title = "Welcome, Priya";
  if (page === "book") title = "Book an appointment";

  const unread = notifs.filter((n) => !n.read).length;

  function markRead(id) {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  // Pick which page component to show
  let pageContent = null;
  if (page === "dash") pageContent = <Dashboard S={S} />;
  if (page === "find") pageContent = <Discover S={S} />;
  if (page === "book") pageContent = <Booking S={S} />;
  if (page === "appts") pageContent = <Appointments S={S} />;
  if (page === "drive") pageContent = <Drive S={S} />;
  if (page === "ai") pageContent = <Assistant S={S} />;
  if (page === "reviews") pageContent = <Reviews S={S} />;
  if (page === "settings") pageContent = <Settings S={S} />;

  return (
    <>
      <AnimatePresence>
        {stage === "intro" && <Intro key="intro" onDone={() => setStage("auth")} />}
      </AnimatePresence>

      {stage === "auth" && <Auth onEnter={() => setStage("app")} toast={toast} />}

      {stage === "app" && (
        <div className="app">
          {/* Left sidebar */}
          <aside className={menuOpen ? "side open" : "side"}>
            <div className="brand">
              <Logo size={40} />
              <div><b>PharmaFlow</b><small>Healthcare, Made Simple.</small></div>
            </div>
            {PAGE_IDS.map((id, i) => {
              const Icon = PAGE_ICONS[i];
              return (
                <button key={id} className={activeIndex === i ? "nav on" : "nav"} onClick={() => { setBook(null); go(id); }}>
                  <Icon size={19} /> {labels[i]}
                </button>
              );
            })}
            <p className="note">Prototype with fictional data. Not for real medical use.</p>
          </aside>
          {menuOpen && <div className="overlay" style={{ zIndex: 25 }} onClick={() => setMenuOpen(false)} />}

          <div className="main">
            {/* Top bar */}
            <header className="top">
              <button className="icon burger" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <h1 className="grow">{title}</h1>
              <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
                {LANGS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <button className="icon" aria-label="Notifications" onClick={() => setBellOpen(!bellOpen)}>
                <Bell size={18} />
                {unread > 0 && <span className="dot">{unread}</span>}
              </button>
              <button className="icon" aria-label="Profile" onClick={() => go("settings")}><UserCircle size={20} /></button>
            </header>

            {/* Notification panel */}
            {bellOpen && (
              <div className="card panel">
                <div className="row between">
                  <h3>Notifications</h3>
                  <span className="row">
                    <button className="link" onClick={() => setNotifs(notifs.map((n) => ({ ...n, read: true })))}>Mark all read</button>
                    <button className="link" onClick={() => { setNotifs([]); toast("Notifications cleared"); }}>Clear</button>
                  </span>
                </div>
                {notifs.length === 0 && <p>You're all caught up.</p>}
                {notifs.map((n) => (
                  <div key={n.id} className={n.read ? "nitem" : "nitem un"}>
                    <span className="pip" />
                    <div className="grow">
                      <b>{n.t}</b>
                      <p><small>{n.m}</small></p>
                      {!n.read && <button className="link" onClick={() => markRead(n.id)}>Mark as read</button>}
                    </div>
                  </div>
                ))}
                <small>Sample notifications. No push messages are sent.</small>
              </div>
            )}

            {/* Current page, with a small fade between pages */}
            <main className="content">
              <AnimatePresence mode="wait">
                <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {pageContent}
                </motion.div>
              </AnimatePresence>
              <p style={{ marginTop: "2rem", textAlign: "center" }}>
                <small>PharmaFlow is a frontend-only demo with fictional data. It does not book real appointments, store medical records or give medical advice.</small>
              </p>
            </main>
          </div>
        </div>
      )}

      {/* Toast messages */}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className="toast">{t.m}</div>)}
      </div>
    </>
  );
}
