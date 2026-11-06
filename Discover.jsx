import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { HOSP, DOCS, SPEC, LOCS, LANGS, ACCESS, ALIAS } from "./data";
import { Modal, Stars, Demo, Chips, Empty, AccessBadge } from "./ui";

export default function Discover({ S }) {
  // What the user typed
  const [search, setSearch] = useState(S.query);
  const [locationText, setLocationText] = useState("");
  // Filters
  const [spec, setSpec] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [accessNeed, setAccessNeed] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  // Screen state
  const [tab, setTab] = useState("doctors");
  const [profile, setProfile] = useState(null); // doctor or hospital shown in a popup
  const [showLocation, setShowLocation] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const text = search.toLowerCase();

  // Work out which departments a keyword like "heart" points to
  let mappedSpecs = [];
  for (const word in ALIAS) {
    if (text.includes(word)) mappedSpecs.push(ALIAS[word]);
  }

  // Checks the filters shared by doctors and hospitals.
  // Adds explanations to the reasons list. Returns false if it should be hidden.
  function passesFilters(hospital, reasons, hasLanguage, hasSlots, hasSpec) {
    if (locationText !== "" && !hospital.loc.toLowerCase().includes(locationText.toLowerCase())) return false;
    if (location !== "" && hospital.loc !== location) return false;
    if (spec !== "") {
      if (!hasSpec) return false;
      reasons.push("Matches the selected specialty");
    }
    if (language !== "") {
      if (!hasLanguage) return false;
      reasons.push("Offers " + language);
    }
    if (onlyAvailable) {
      if (!hasSlots) return false;
      reasons.push("Has available appointment slots");
    }
    if (accessNeed !== "") {
      const status = hospital.access[ACCESS.indexOf(accessNeed)];
      if (status !== "verified") return false;
      reasons.push("Provides " + accessNeed.toLowerCase() + " (verified)");
    }
    if (hospital.loc === S.loc) reasons.push("Located near " + S.loc);
    return true;
  }

  // Build the list of doctors to show
  const doctorResults = [];
  for (const doctor of DOCS) {
    const hospital = HOSP.find((h) => h.id === doctor.h);
    const reasons = [];

    if (text !== "") {
      let found = false;
      if (doctor.name.toLowerCase().includes(text)) { found = true; reasons.push("Name matches your search"); }
      if (doctor.spec.toLowerCase().includes(text) || mappedSpecs.includes(doctor.spec)) { found = true; reasons.push("Matches the specialty you searched"); }
      if (hospital.name.toLowerCase().includes(text)) { found = true; reasons.push("Works at a hospital matching your search"); }
      if (!found) continue; // skip this doctor
    }

    const ok = passesFilters(hospital, reasons, doctor.langs.includes(language), doctor.slots.length > 0, doctor.spec === spec);
    if (ok) doctorResults.push({ doctor, hospital, reasons });
  }

  // Build the list of hospitals to show
  const hospitalResults = [];
  for (const hospital of HOSP) {
    const doctorsHere = DOCS.filter((d) => d.h === hospital.id);
    const reasons = [];

    if (text !== "") {
      let found = false;
      if (hospital.name.toLowerCase().includes(text)) { found = true; reasons.push("Name matches your search"); }
      for (const s of hospital.specs) {
        if (s.toLowerCase().includes(text) || mappedSpecs.includes(s)) { found = true; reasons.push("Offers the specialty you searched"); break; }
      }
      if (!found) continue;
    }

    const anyLanguage = doctorsHere.some((d) => d.langs.includes(language));
    const anySlots = doctorsHere.some((d) => d.slots.length > 0);
    const ok = passesFilters(hospital, reasons, anyLanguage, anySlots, hospital.specs.includes(spec));
    if (ok) hospitalResults.push({ hospital, reasons });
  }

  function startBooking(doctor) {
    S.setBook({ h: doctor.h, d: doctor.id });
    S.go("book");
  }

  function toggleCompare(id) {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else if (compareIds.length >= 2) {
      S.toast("You can compare up to 2 items.");
    } else {
      setCompareIds([...compareIds, id]);
    }
  }

  function changeTab(name) {
    setTab(name);
    setCompareIds([]);
  }

  function chooseLocation(name) {
    S.setLoc(name);
    setShowLocation(false);
    S.toast("Location set to " + name);
  }

  // Small pieces of repeated screen
  function WhyBox({ reasons }) {
    if (reasons.length === 0) return null;
    return (
      <ul className="why">
        <b>Why this appears:</b>
        {reasons.map((r) => <li key={r}>{r}</li>)}
      </ul>
    );
  }
  function CompareBox({ id }) {
    return (
      <label className="row">
        <input type="checkbox" checked={compareIds.includes(id)} onChange={() => toggleCompare(id)} /> Compare
      </label>
    );
  }

  const compareDoctors = doctorResults.filter((r) => compareIds.includes(r.doctor.id));
  const compareHospitals = hospitalResults.filter((r) => compareIds.includes(r.hospital.id));

  return (
    <div className="stack">
      {/* Search bars */}
      <div className="card">
        <div className="row">
          <div className="search grow" style={{ margin: 0 }}>
            <Search size={18} />
            <input aria-label="Search" placeholder="Doctor name, specialty (try heart or skin) or hospital" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="search grow" style={{ margin: 0 }}>
            <MapPin size={18} />
            <input aria-label="Location search" placeholder="Search a location" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
          </div>
        </div>

        {/* Change Location sits directly below the search bar */}
        <div className="row" style={{ marginTop: "0.6rem" }}>
          <button className="btn ghost sm" onClick={() => setShowLocation(true)}><MapPin size={15} /> Change Location</button>
          <small>Current location: <b>{S.loc}</b></small>
        </div>

        {/* Filters */}
        <div className="grid s" style={{ marginTop: "0.8rem" }}>
          <select aria-label="Specialty" value={spec} onChange={(e) => setSpec(e.target.value)}>
            <option value="">Any specialty</option>
            {SPEC.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Any location</option>
            {LOCS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Any language</option>
            {LANGS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Accessibility" value={accessNeed} onChange={(e) => setAccessNeed(e.target.value)}>
            <option value="">Any accessibility</option>
            {ACCESS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <label className="row">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} /> Available slots only
          </label>
        </div>
      </div>

      <div className="row between">
        <div className="tabs">
          <button className={tab === "doctors" ? "tab on" : "tab"} onClick={() => changeTab("doctors")}>Doctors ({doctorResults.length})</button>
          <button className={tab === "hospitals" ? "tab on" : "tab"} onClick={() => changeTab("hospitals")}>Hospitals ({hospitalResults.length})</button>
        </div>
        <div className="row">
          <Demo />
          <button className="btn sm" disabled={compareIds.length < 2} onClick={() => setShowCompare(true)}>Compare ({compareIds.length}/2)</button>
        </div>
      </div>

      <p className="notice">This tool helps you find services only. It does not diagnose conditions or recommend treatment.</p>

      {/* Doctor cards */}
      {tab === "doctors" && doctorResults.length === 0 && <Empty text="No doctors match. Try clearing a filter." />}
      {tab === "doctors" && (
        <div className="grid">
          {doctorResults.map((r) => (
            <div className="card" key={r.doctor.id}>
              <div className="row between"><h3>{r.doctor.name}</h3><CompareBox id={r.doctor.id} /></div>
              <p><b>{r.doctor.spec}</b> · {r.doctor.exp} years experience (sample)</p>
              <p><small>{r.hospital.name}, {r.hospital.loc}</small></p>
              <p><Stars v={r.doctor.rating} n={r.doctor.reviews} /> · <small>{r.doctor.langs.join(", ")}</small></p>
              {r.doctor.slots.length > 0 ? <Chips items={r.doctor.slots} /> : <p><small>No slots available</small></p>}
              <WhyBox reasons={r.reasons} />
              <div className="row" style={{ marginTop: "0.7rem" }}>
                <button className="btn ghost sm" onClick={() => setProfile({ doctor: r.doctor })}>View Profile</button>
                <button className="btn sm" disabled={r.doctor.slots.length === 0} onClick={() => startBooking(r.doctor)}>Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital cards */}
      {tab === "hospitals" && hospitalResults.length === 0 && <Empty text="No hospitals match. Try clearing a filter." />}
      {tab === "hospitals" && (
        <div className="grid">
          {hospitalResults.map((r) => (
            <div className="card" key={r.hospital.id}>
              <div className="row between"><h3>{r.hospital.name}</h3><CompareBox id={r.hospital.id} /></div>
              <p><MapPin size={14} /> {r.hospital.loc} · <Stars v={r.hospital.rating} n={r.hospital.reviews} /></p>
              <Chips items={r.hospital.specs} />
              <p><small>Services: {r.hospital.services.join(", ")}</small></p>
              <p><small>Verified accessibility: {ACCESS.filter((a, i) => r.hospital.access[i] === "verified").join(", ") || "none yet"}</small></p>
              <WhyBox reasons={r.reasons} />
              <button className="btn ghost sm" style={{ marginTop: "0.7rem" }} onClick={() => setProfile({ hospital: r.hospital })}>View Details</button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {/* Change location popup */}
        {showLocation && (
          <Modal title="Change location" onClose={() => setShowLocation(false)}>
            <div className="stack">
              {LOCS.map((name) => (
                <button key={name} className={S.loc === name ? "opt on" : "opt"} onClick={() => chooseLocation(name)}>{name}</button>
              ))}
              <small>Demo list only. Your real location is never used.</small>
            </div>
          </Modal>
        )}

        {/* Compare popup */}
        {showCompare && tab === "doctors" && (
          <Modal title="Compare doctors" onClose={() => setShowCompare(false)}>
            <table><tbody>
              <tr><th></th>{compareDoctors.map((r) => <th key={r.doctor.id}>{r.doctor.name}</th>)}</tr>
              <tr><th>Specialty</th>{compareDoctors.map((r) => <td key={r.doctor.id}>{r.doctor.spec}</td>)}</tr>
              <tr><th>Hospital</th>{compareDoctors.map((r) => <td key={r.doctor.id}>{r.hospital.name}</td>)}</tr>
              <tr><th>Experience</th>{compareDoctors.map((r) => <td key={r.doctor.id}>{r.doctor.exp} years</td>)}</tr>
              <tr><th>Languages</th>{compareDoctors.map((r) => <td key={r.doctor.id}>{r.doctor.langs.join(", ")}</td>)}</tr>
              <tr><th>Rating</th>{compareDoctors.map((r) => <td key={r.doctor.id}>{r.doctor.rating} ({r.doctor.reviews})</td>)}</tr>
            </tbody></table>
          </Modal>
        )}
        {showCompare && tab === "hospitals" && (
          <Modal title="Compare hospitals" onClose={() => setShowCompare(false)}>
            <table><tbody>
              <tr><th></th>{compareHospitals.map((r) => <th key={r.hospital.id}>{r.hospital.name}</th>)}</tr>
              <tr><th>Location</th>{compareHospitals.map((r) => <td key={r.hospital.id}>{r.hospital.loc}</td>)}</tr>
              <tr><th>Specialties</th>{compareHospitals.map((r) => <td key={r.hospital.id}>{r.hospital.specs.join(", ")}</td>)}</tr>
              <tr><th>Rating</th>{compareHospitals.map((r) => <td key={r.hospital.id}>{r.hospital.rating} ({r.hospital.reviews})</td>)}</tr>
              <tr><th>Services</th>{compareHospitals.map((r) => <td key={r.hospital.id}>{r.hospital.services.join(", ")}</td>)}</tr>
            </tbody></table>
          </Modal>
        )}

        {/* Doctor profile popup */}
        {profile && profile.doctor && (
          <Modal title={profile.doctor.name} onClose={() => setProfile(null)}>
            <div className="stack">
              <p><b>{profile.doctor.spec}</b> · {profile.doctor.exp} years (sample data)</p>
              <p>{S.hosp(profile.doctor.h).name}, {S.hosp(profile.doctor.h).loc}</p>
              <p>Speaks: {profile.doctor.langs.join(", ")}</p>
              <Stars v={profile.doctor.rating} n={profile.doctor.reviews} />
              <p className="notice">Ratings show patient experience, not clinical quality. Demo profile.</p>
              <button className="btn" disabled={profile.doctor.slots.length === 0} onClick={() => startBooking(profile.doctor)}>Book Appointment</button>
            </div>
          </Modal>
        )}

        {/* Hospital details popup */}
        {profile && profile.hospital && (
          <Modal title={profile.hospital.name} onClose={() => setProfile(null)}>
            <div className="stack">
              <p><MapPin size={14} /> {profile.hospital.loc}</p>
              <Stars v={profile.hospital.rating} n={profile.hospital.reviews} />
              <Chips items={profile.hospital.services} />
              <h4>Accessibility information</h4>
              {ACCESS.map((name, i) => (
                <div className="row between" key={name}><span>{name}</span><AccessBadge status={profile.hospital.access[i]} /></div>
              ))}
              <small>Unverified and unknown items are not guaranteed. Please confirm with the hospital.</small>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
