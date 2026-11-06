import { useState } from "react";
import { HOSP, DOCS, INIT_REVIEWS } from "./data";
import { Stars } from "./ui";

const CATEGORIES = [
  { name: "Cleanliness", score: 4.6 },
  { name: "Staff behaviour", score: 4.5 },
  { name: "Accessibility", score: 4.2 },
  { name: "Appointment experience", score: 4.4 },
];

export default function Reviews({ S }) {
  const [reviews, setReviews] = useState(INIT_REVIEWS);
  const [target, setTarget] = useState(HOSP[0].name);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  // Names for the dropdown: all hospitals, then all doctors
  const names = [];
  for (const h of HOSP) names.push(h.name);
  for (const d of DOCS) names.push(d.name);

  function submitReview(event) {
    event.preventDefault();
    if (text.trim().length < 5) {
      S.toast("Please write a few words first.");
      return;
    }
    const newReview = { id: Date.now(), who: "You (demo)", target: target, stars: stars, text: text };
    setReviews([newReview, ...reviews]);
    setText("");
    S.toast("Sample review added (demo only)");
  }

  return (
    <div className="stack">
      <p className="notice">Reviews here are demonstration data, not verified patient reviews. In a real app, only verified patients with completed appointments could review. Ratings show patient experience and do not establish clinical quality.</p>

      <div className="grid">
        <div className="card">
          <h3>Overall rating</h3>
          <b style={{ fontFamily: "Sora", fontSize: "2.6rem" }}>4.5</b> <Stars v={4.5} />
          <p><small>out of 5 · 1,156 reviews (demo)</small></p>
        </div>
        <div className="card stack">
          {CATEGORIES.map((c) => (
            <div key={c.name}>
              <div className="row between"><span>{c.name}</span><b>{c.score}</b></div>
              <div className="bar"><i style={{ width: c.score * 20 + "%" }} /></div>
            </div>
          ))}
        </div>
      </div>

      <form className="card stack" onSubmit={submitReview}>
        <h3>Write a sample review</h3>
        <label>Hospital or doctor
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {names.map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label>Rating
          <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
        </label>
        <label>Your review
          <textarea rows={3} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe the service, not medical details" />
        </label>
        <button className="btn" style={{ justifySelf: "start" }}>Submit sample review</button>
      </form>

      <div className="grid">
        {reviews.map((r) => (
          <div className="card" key={r.id}>
            <div className="row between"><b>{r.target}</b><Stars v={r.stars} /></div>
            <p>{r.text}</p>
            <small>{r.who} · Demo review, unverified</small>
          </div>
        ))}
      </div>
    </div>
  );
}
