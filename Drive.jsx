import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { FileText, Upload, Eye, Download, Search } from "lucide-react";
import { CATS } from "./data";
import { Modal, Demo, Empty } from "./ui";

export default function Drive({ S }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [newCategory, setNewCategory] = useState("Other Documents");
  const [viewing, setViewing] = useState(null);
  const fileInput = useRef(); // lets us click the hidden file input

  // Documents that match the search and category
  const visible = S.docs.filter((d) => {
    const matchesCategory = category === "All" || d.cat === category;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Runs when the user picks files. Files stay in the browser only.
  function handleFiles(event) {
    const added = [];
    for (const file of event.target.files) {
      let size = Math.max(1, Math.round(file.size / 1000)) + " KB";
      if (file.size > 1000000) size = (file.size / 1000000).toFixed(1) + " MB";
      added.push({
        id: Date.now() + added.length,
        name: file.name,
        type: file.name.split(".").pop().toUpperCase(),
        size: size,
        date: new Date().toISOString().slice(0, 10),
        cat: newCategory,
        url: URL.createObjectURL(file), // temporary local link
      });
    }
    S.setDocs([...added, ...S.docs]);
    if (added.length > 0) S.toast("Selected locally. Not uploaded or stored.");
    event.target.value = "";
  }

  function viewDoc(doc) {
    if (doc.url) window.open(doc.url, "_blank");
    else setViewing(doc);
  }

  function downloadDoc(doc) {
    if (!doc.url) {
      S.toast("Demo documents have no downloadable content.");
      return;
    }
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  }

  return (
    <div className="stack">
      <p className="notice"><b>Prototype notice:</b> Files you select stay in this browser tab only. They are not uploaded, encrypted or securely stored, and they disappear when you refresh. Please don't select real medical records.</p>

      <div className="card row">
        <div className="search grow" style={{ margin: 0 }}>
          <Search size={18} />
          <input aria-label="Search documents" placeholder="Search documents" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select aria-label="Category for new files" style={{ width: "auto" }} value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input ref={fileInput} type="file" multiple hidden onChange={handleFiles} />
        <button className="btn" onClick={() => fileInput.current.click()}><Upload size={16} /> Select document</button>
      </div>

      <div className="tabs">
        {["All", ...CATS].map((c) => (
          <button key={c} className={category === c ? "tab on" : "tab"} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {visible.length === 0 && <Empty text="No documents found. Select a file or change the category." />}

      <div className="grid">
        {visible.map((doc) => (
          <div className="card" key={doc.id}>
            <div className="row between"><FileText color="#0f766e" />{doc.url ? <span className="badge">Local only</span> : <Demo />}</div>
            <h4 style={{ wordBreak: "break-word" }}>{doc.name}</h4>
            <small>{doc.cat}</small>
            <p><small>{doc.type} · {doc.size} · Added {doc.date}</small></p>
            <div className="row">
              <button className="btn ghost sm" onClick={() => viewDoc(doc)}><Eye size={14} /> View</button>
              <button className="btn ghost sm" onClick={() => downloadDoc(doc)}><Download size={14} /> Download</button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {viewing && (
          <Modal title={viewing.name} onClose={() => setViewing(null)}>
            <p>This is a fictional demo document with no real content. A future secure version could show a preview here.</p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
