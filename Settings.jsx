import { useState } from "react";
import { LANGS } from "./data";
import { Demo } from "./ui";

export default function Settings({ S }) {
  const [reminders, setReminders] = useState(true);
  const [updates, setUpdates] = useState(true);
  const [tasks, setTasks] = useState(true);

  function changeLanguage(event) {
    S.setLang(event.target.value);
    S.toast("Language changed to " + event.target.value);
  }

  return (
    <div className="grid">
      <section className="card">
        <h3>Profile preview</h3>
        <div className="row">
          <div className="avatar">PS</div>
          <div><b>Priya Sharma</b><br /><small>priya.demo@example.com · DEMO-1024</small></div>
        </div>
        <Demo />
      </section>

      <section className="card stack">
        <h3>Language</h3>
        <select aria-label="Language" value={S.lang} onChange={changeLanguage}>
          {LANGS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <p className="notice">Prototype limitation: only the sidebar menu is translated. Other labels stay in English.</p>
      </section>

      <section className="card stack">
        <h3>Notification preferences</h3>
        <label className="row"><input type="checkbox" checked={reminders} onChange={() => setReminders(!reminders)} /> Reminders</label>
        <label className="row"><input type="checkbox" checked={updates} onChange={() => setUpdates(!updates)} /> Appointment updates</label>
        <label className="row"><input type="checkbox" checked={tasks} onChange={() => setTasks(!tasks)} /> Administrative tasks</label>
        <small>Preview only. No push notifications are sent.</small>
      </section>

      <section className="card stack">
        <h3>Appearance</h3>
        <label className="row"><input type="checkbox" checked={S.look.large} onChange={() => S.setLook({ ...S.look, large: !S.look.large })} /> Larger text</label>
        <label className="row"><input type="checkbox" checked={S.look.contrast} onChange={() => S.setLook({ ...S.look, contrast: !S.look.contrast })} /> Higher contrast</label>
      </section>

      <section className="card">
        <h3>Help and support</h3>
        <p>This is a prototype. For real care questions, contact your hospital or a qualified healthcare professional.</p>
        <small>Demo support: support@pharmaflow.example</small>
      </section>

      <section className="card">
        <h3>Privacy</h3>
        <p>PharmaFlow is frontend-only. All data is fictional, nothing is sent to a server, and no secure medical-record storage is provided. Only your language and appearance choices are saved in this browser.</p>
      </section>
    </div>
  );
}
