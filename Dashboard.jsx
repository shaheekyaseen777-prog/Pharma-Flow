import { useState } from "react";
import { Search, CalendarCheck, CheckCircle2, Heart, ListChecks } from "lucide-react";
import { fmtDate } from "./data";
import { Demo } from "./ui";

export default function Dashboard({ S }) {
  const [search, setSearch] = useState("");

  // Count appointments by status
  let upcoming = [];
  let completedCount = 0;
  for (const a of S.appts) {
    if (a.status === "Upcoming") upcoming.push(a);
    if (a.status === "Completed") completedCount = completedCount + 1;
  }

  function handleSearch(event) {
    event.preventDefault(); // stop the page from reloading
    S.setQuery(search);
    S.go("find");
  }

  return (
    <div className="stack">
      <section className="card hero">
        <div>
          <h2>Welcome back, Priya</h2>
          <p>Care begins with a simpler journey.</p>
          <form className="search" onSubmit={handleSearch}>
            <Search size={18} />
            <input aria-label="Search" placeholder="Search doctors, specialties or hospitals" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn sm">Search</button>
          </form>
        </div>
        <div className="profile">
          <div className="avatar">PS</div>
          <b>Priya Sharma</b>
          <span>Patient ID: DEMO-1024</span>
          <span>Language: {S.lang}</span>
          <Demo />
        </div>
      </section>

      {/* Statistics cards */}
      <div className="grid s">
        <div className="card stat"><div className="ic"><CalendarCheck /></div><div><b>{upcoming.length}</b><small>Upcoming appointments</small></div></div>
        <div className="card stat"><div className="ic"><CheckCircle2 /></div><div><b>{completedCount}</b><small>Completed appointments</small></div></div>
        <div className="card stat"><div className="ic"><Heart /></div><div><b>3</b><small>Saved hospitals</small></div></div>
        <div className="card stat"><div className="ic"><ListChecks /></div><div><b>2</b><small>Pending tasks</small></div></div>
      </div>

      {/* Quick actions */}
      <div className="grid s">
        <button className="card opt" onClick={() => S.go("find")}><b>Find a doctor</b></button>
        <button className="card opt" onClick={() => { S.setBook(null); S.go("book"); }}><b>Book appointment</b></button>
        <button className="card opt" onClick={() => S.go("drive")}><b>Open Health Drive</b></button>
        <button className="card opt" onClick={() => S.go("ai")}><b>Ask the assistant</b></button>
      </div>

      <div className="grid">
        <section className="card">
          <div className="row between"><h3>Upcoming appointments</h3><Demo /></div>
          {upcoming.length === 0 && <p>No upcoming appointments.</p>}
          {upcoming.map((a) => (
            <p key={a.id}><b>{S.doc(a.d).name}</b><br /><small>{fmtDate(a.date)}, {a.time}</small></p>
          ))}
          <button className="btn ghost sm" onClick={() => S.go("appts")}>Manage appointments</button>
        </section>

        <section className="card">
          <div className="row between"><h3>Recent documents</h3><Demo /></div>
          {S.docs.slice(0, 3).map((d) => (
            <p key={d.id}>{d.name}<br /><small>{d.cat}</small></p>
          ))}
          <button className="btn ghost sm" onClick={() => S.go("drive")}>Open Health Drive</button>
        </section>

        <section className="card">
          <h3>Notifications</h3>
          {S.notifs.length === 0 && <p>You're all caught up.</p>}
          {S.notifs.slice(0, 3).map((n) => (
            <p key={n.id}><b>{n.t}</b><br /><small>{n.m}</small></p>
          ))}
        </section>
      </div>

      <p className="notice">Sample data is for demonstration only. PharmaFlow provides healthcare navigation support, not medical diagnosis or treatment advice.</p>
    </div>
  );
}
