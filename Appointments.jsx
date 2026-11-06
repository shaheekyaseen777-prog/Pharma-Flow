import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { dateList, fmtDate } from "./data";
import { Modal, Demo, Empty } from "./ui";

export default function Appointments({ S }) {
  const [tab, setTab] = useState("Upcoming");
  const [selected, setSelected] = useState(null); // the appointment being used in a popup
  const [popup, setPopup] = useState("");          // "view", "reschedule", "cancel" or "map"
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const visible = S.appts.filter((a) => a.status === tab);

  function openPopup(type, appointment) {
    setSelected(appointment);
    setPopup(type);
  }

  function closePopup() {
    setPopup("");
    setSelected(null);
    setNewDate("");
    setNewTime("");
  }

  function cancelAppointment() {
    const updated = S.appts.map((a) => {
      if (a.id === selected.id) return { ...a, status: "Cancelled" };
      return a;
    });
    S.setAppts(updated);
    S.notify("Appointment cancelled", "Your visit with " + S.doc(selected.d).name + " was cancelled.");
    S.toast("Appointment cancelled");
    closePopup();
  }

  function rescheduleAppointment() {
    const updated = S.appts.map((a) => {
      if (a.id === selected.id) return { ...a, date: newDate, time: newTime };
      return a;
    });
    S.setAppts(updated);
    S.notify("Appointment rescheduled", "Moved to " + fmtDate(newDate) + ", " + newTime);
    S.toast("Appointment rescheduled");
    closePopup();
  }

  // Details for whichever appointment is open in a popup
  let doctor = null;
  let hospital = null;
  if (selected) {
    doctor = S.doc(selected.d);
    hospital = S.hosp(doctor.h);
  }

  return (
    <div className="stack">
      <div className="row between">
        <div className="tabs">
          {["Upcoming", "Completed", "Cancelled"].map((name) => (
            <button key={name} className={tab === name ? "tab on" : "tab"} onClick={() => setTab(name)}>
              {name} ({S.appts.filter((a) => a.status === name).length})
            </button>
          ))}
        </div>
        <Demo />
      </div>

      {visible.length === 0 && <Empty text={"No " + tab.toLowerCase() + " appointments."} />}

      <div className="grid">
        {visible.map((a) => {
          const d = S.doc(a.d);
          const h = S.hosp(d.h);
          return (
            <div className="card" key={a.id}>
              <div className="row between"><h3>{d.name}</h3><span className={"badge " + a.status}>{a.status}</span></div>
              <p>{d.spec} · {h.name}</p>
              <p><Clock size={14} /> {fmtDate(a.date)}, {a.time}</p>
              <small>ID {a.id}</small>
              <div className="row" style={{ marginTop: "0.7rem" }}>
                <button className="btn ghost sm" onClick={() => openPopup("view", a)}>View Details</button>
                {a.status === "Upcoming" && <button className="btn ghost sm" onClick={() => openPopup("reschedule", a)}>Reschedule</button>}
                {a.status === "Upcoming" && <button className="btn danger sm" onClick={() => openPopup("cancel", a)}>Cancel Appointment</button>}
                <button className="btn ghost sm" onClick={() => openPopup("map", a)}>View Map</button>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {popup === "view" && (
          <Modal title="Appointment details" onClose={closePopup}>
            <table><tbody>
              <tr><th>ID</th><td>{selected.id}</td></tr>
              <tr><th>Doctor</th><td>{doctor.name}</td></tr>
              <tr><th>Hospital</th><td>{hospital.name}, {hospital.loc}</td></tr>
              <tr><th>Date and time</th><td>{fmtDate(selected.date)}, {selected.time}</td></tr>
              <tr><th>Status</th><td>{selected.status}</td></tr>
              <tr><th>Accessibility</th><td>{selected.acc.join(", ") || "None selected"}</td></tr>
              <tr><th>Reason</th><td>{selected.reason}</td></tr>
            </tbody></table>
          </Modal>
        )}

        {popup === "cancel" && (
          <Modal title="Cancel this appointment?" onClose={closePopup}>
            <p>{doctor.name} on {fmtDate(selected.date)}, {selected.time}.</p>
            <div className="row" style={{ marginTop: "1rem" }}>
              <button className="btn danger" onClick={cancelAppointment}>Yes, cancel</button>
              <button className="btn ghost" onClick={closePopup}>Keep appointment</button>
            </div>
          </Modal>
        )}

        {popup === "reschedule" && (
          <Modal title="Reschedule" onClose={closePopup}>
            <h4>Choose a new date</h4>
            <div className="row">
              {dateList().map((d) => (
                <button key={d} className={newDate === d ? "tab on" : "tab"} onClick={() => { setNewDate(d); setNewTime(""); }}>{fmtDate(d)}</button>
              ))}
            </div>
            {newDate !== "" && (
              <>
                <h4 style={{ marginTop: "0.8rem" }}>Choose a time</h4>
                <div className="row">
                  {doctor.slots.map((slot) => (
                    <button key={slot} className={newTime === slot ? "tab on" : "tab"} onClick={() => setNewTime(slot)}>{slot}</button>
                  ))}
                </div>
              </>
            )}
            <button className="btn" style={{ marginTop: "1rem" }} disabled={newDate === "" || newTime === ""} onClick={rescheduleAppointment}>Confirm new time</button>
          </Modal>
        )}

        {popup === "map" && (
          <Modal title={hospital.name} onClose={closePopup}>
            <div className="map" role="img" aria-label="Simulated map">
              <div className="road" style={{ left: 0, right: 0, top: "55%", height: 10 }} />
              <div className="road" style={{ top: 0, bottom: 0, left: "40%", width: 10 }} />
              <MapPin className="pin" size={36} />
              <span className="tag">Simulated map · {hospital.loc}</span>
            </div>
            <p className="notice" style={{ marginTop: "0.6rem" }}>This is a simulated panel. Live directions need a real map service, which this prototype does not use.</p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
