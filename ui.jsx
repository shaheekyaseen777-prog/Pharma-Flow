import { motion } from "framer-motion";
import { Star, X } from "lucide-react";

export const Logo = ({ size = 44, anim }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="pfg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0f766e" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient></defs>
    <rect width="64" height="64" rx="18" fill="url(#pfg)" />
    <motion.path d="M10 34h12l5-12 8 24 6-16h13" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
      initial={anim ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: anim ? Infinity : 0, repeatType: "reverse" }} />
  </svg>
);
export const Stars = ({ v, n }) => <span className="stars"><Star size={14} fill="currentColor" /> {v.toFixed(1)}{n != null && <small> ({n})</small>}</span>;
export const Demo = () => <span className="badge demo">Demo data</span>;
export const Modal = ({ title, onClose, children }) => (
  <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-modal="true" aria-label={title} className="modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
      <div className="mh"><h3>{title}</h3><button className="icon" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>
      {children}
    </motion.div>
  </motion.div>
);
export const DocBot = ({ size = 56 }) => (
  <motion.svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
    <circle cx="32" cy="35" r="21" fill="#ffe3cf" />
    <path d="M11 30a21 19 0 0 1 42 0z" fill="#fff" stroke="#14b8a6" strokeWidth="2" />
    <rect x="29" y="11" width="6" height="14" rx="2" fill="#14b8a6" /><rect x="25" y="15" width="14" height="6" rx="2" fill="#14b8a6" />
    <circle cx="24" cy="37" r="2.6" fill="#0b2540" /><circle cx="40" cy="37" r="2.6" fill="#0b2540" />
    <circle cx="19" cy="42" r="3" fill="#ffb4a2" opacity=".6" /><circle cx="45" cy="42" r="3" fill="#ffb4a2" opacity=".6" />
    <path d="M26 45q6 6 12 0" fill="none" stroke="#0b2540" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 58q18 9 36 0" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

// Small list of tags
export function Chips({ items }) {
  return (
    <div className="chips">
      {items.map((item) => <span className="badge" key={item}>{item}</span>)}
    </div>
  );
}

// Message shown when a list is empty
export function Empty({ text }) {
  return <div className="card" style={{ textAlign: "center" }}>{text}</div>;
}

// Shows "verified", "unverified" or "unknown"
export function AccessBadge({ status }) {
  return <span className={"badge " + status[0]}>{status}</span>;
}
