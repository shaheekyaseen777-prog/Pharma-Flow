import { useState } from "react";
import { HOSP, DOCS, ACCESS, dateList, fmtDate } from "./data";
import { AccessBadge } from "./ui";

const STEP_NAMES = ["Hospital", "Doctor", "Date", "Time", "Details", "Access", "Review"];

export default function Booking({ S }) {
  const preset = S.book || {}; // set when the user clicked "Book" on a doctor card

  // Start on the right step depending on what is already chosen
  let firstStep = 0;
  if (preset.h) firstStep = 1;
  if (preset.d) firstStep = 2;

  const [step, setStep] = useState(firstStep);
  const [hospitalId, setHospitalId] = useState(preset.h || "");
  const [doctorId, setDoctorId] = useState(preset.d || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [accessChoices, setAccessChoices] = useState([]);
  const [confirmed, setConfirmed] = useState(null); // the finished appointment

  const doctor = DOCS.find((d) => d.id === doctorId);
  const hospital = HOSP.find((h) => h.id === hospitalId);

  // Is this time already booked for this doctor and date?
  function isTaken(slot) {
    for (const a of S.appts) {
      if (a.d === doctorId && a.date === date && a.time === slot && a.status === "Upcoming") return true;
    }
    return false;
  }

  // Can the user press Continue on the current step?
  function canContinue() {
    if (step === 0) return hospitalId !== "";
    if (step === 1) return doctorId !== "";
    if (step === 2) return date !== "";
    if (step === 3) return time !== "";
    if (step === 4) return reason.trim().length > 2;
    return true;
  }

  function toggleAccess(name) {
    if (accessChoices.includes(name)) {
      setAccessChoices(accessChoices.filter((x) => x !== name));
    } else {
      setAccessChoices([...accessChoices, name]);
    }
  }

  function confirmBooking() {
    const newAppointment = {
      id: "PF-" + Math.floor(100000 + Math.random() * 900000), // fake ID for the demo
      d: doctorId,
      date: date,
      time: time,
      status: "Upcoming",
      acc: accessChoices,
      reason: reason,
    };
    S.setAppts([newAppointment, ...S.appts]);
    S.notify("Appointment confirmed", "Demo booking with " + doctor.name + " on " + fmtDate(date) + ", " + time);
    S.toast("Demo appointment confirmed");
    setConfirmed(newAppointment);
  }

  // ----- Confirmation screen -----
  if (confirmed) {
    return (
      <div className="card stack" style={{ maxWidth: 560, margin: "auto" }}>
        <h2>Appointment confirmed</h2>
        <p><small>Demonstration only. No real appointment has been booked.</small></p>
        <table><tbody>
          <tr><th>Appointment ID</th><td>{confirmed.id}</td></tr>
          <tr><th>Doctor</th><td>{doctor.name}</td></tr>
          <tr><th>Hospital</th><td>{hospital.name}</td></tr>
          <tr><th>Date and time</th><td>{fmtDate(confirmed.date)}, {confirmed.time}</td></tr>
          <tr><th>Accessibility</th><td>{confirmed.acc.join(", ") || "None selected"}</td></tr>
          <tr><th>Status</th><td>Confirmed (demo)</td></tr>
        </tbody></table>
        <div className="row">
          <button className="btn" onClick={() => { S.setBook(null); S.go("appts"); }}>View my appointments</button>
          <button className="btn ghost" onClick={() => S.go("dash")}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  // ----- Booking steps -----
  return (
    <div className="stack">
      <div className="steps">
        {STEP_NAMES.map((name, i) => {
          let cls = "st";
          if (i === step) cls = "st on";
          if (i < step) cls = "st done";
          return <div key={name} className={cls}>{i + 1}. {name}</div>;
        })}
      </div>

      <div className="card stack">
        {step === 0 && (
          <>
            <h3>Select a hospital</h3>
            {HOSP.map((h) => (
              <button key={h.id} className={hospitalId === h.id ? "opt on" : "opt"} onClick={() => { setHospitalId(h.id); setDoctorId(""); }}>
                <b>{h.name}</b><br /><small>{h.loc} · {h.specs.join(", ")}</small>
              </button>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <h3>Select a doctor</h3>
            {DOCS.filter((d) => d.h === hospitalId).map((d) => (
              <button key={d.id} disabled={d.slots.length === 0} className={doctorId === d.id ? "opt on" : "opt"} onClick={() => { setDoctorId(d.id); setTime(""); }}>
                <b>{d.name}</b> · {d.spec}<br />
                <small>{d.slots.length > 0 ? d.slots.length + " slots" : "No slots available"}</small>
              </button>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h3>Select a date</h3>
            <div className="row">
              {dateList().map((d) => (
                <button key={d} className={date === d ? "tab on" : "tab"} onClick={() => { setDate(d); setTime(""); }}>{fmtDate(d)}</button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Select a time slot</h3>
            <div className="row">
              {doctor.slots.map((slot) => (
                <button key={slot} disabled={isTaken(slot)} className={time === slot ? "tab on" : "tab"} onClick={() => setTime(slot)}>
                  {slot}{isTaken(slot) ? " (taken)" : ""}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3>Consultation details</h3>
            <label>Reason for visit (demo text only)
              <textarea rows={3} maxLength={160} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Routine consultation" />
            </label>
            <p className="notice">Please don't enter real medical details. Nothing is stored or sent anywhere.</p>
          </>
        )}

        {step === 5 && (
          <>
            <h3>Accessibility preferences</h3>
            {ACCESS.map((name, i) => (
              <label key={name} className="row between opt">
                <span className="row">
                  <input type="checkbox" checked={accessChoices.includes(name)} onChange={() => toggleAccess(name)} /> {name}
                </span>
                <AccessBadge status={hospital.access[i]} />
              </label>
            ))}
            <small>These are requests, not guarantees. Please confirm directly with the hospital.</small>
          </>
        )}

        {step === 6 && (
          <>
            <h3>Review your booking</h3>
            <table><tbody>
              <tr><th>Hospital</th><td>{hospital.name}</td></tr>
              <tr><th>Doctor</th><td>{doctor.name}</td></tr>
              <tr><th>Date</th><td>{fmtDate(date)}</td></tr>
              <tr><th>Time</th><td>{time}</td></tr>
              <tr><th>Reason</th><td>{reason}</td></tr>
              <tr><th>Accessibility</th><td>{accessChoices.join(", ") || "None selected"}</td></tr>
            </tbody></table>
          </>
        )}

        <div className="row between">
          <button className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {step < 6 && <button className="btn" disabled={!canContinue()} onClick={() => setStep(step + 1)}>Continue</button>}
          {step === 6 && <button className="btn" onClick={confirmBooking}>Confirm appointment</button>}
        </div>
      </div>
    </div>
  );
}
