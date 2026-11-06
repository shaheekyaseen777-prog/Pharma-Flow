import { useState, useRef, useEffect } from "react";
import { Mic, Send, Trash2 } from "lucide-react";
import { DocBot } from "./ui";

const SUGGESTIONS = [
  "How can I find a nearby hospital?",
  "How do I book an appointment?",
  "What documents should I carry?",
  "How can I reschedule an appointment?",
  "How do I find a doctor who speaks my language?",
];

// Words that mean the user is asking a medical question
const MEDICAL_WORDS = ["diagnos", "medicine", "tablet", "drug", "dose", "prescri", "symptom", "pain", "fever", "treatment", "cure", "disease"];

// Picks an answer using simple if-statements. No real AI and nothing is sent anywhere.
function getReply(question) {
  const text = question.toLowerCase();

  for (const word of MEDICAL_WORDS) {
    if (text.includes(word)) {
      return "I can't help with medical questions such as diagnosis, medicines or treatment. Please speak with a qualified healthcare professional. I can help you find a hospital or book a visit.";
    }
  }
  if (text.includes("resched")) {
    return "Go to My Appointments, choose Reschedule on an upcoming appointment, then pick a new date and time slot.";
  }
  if (text.includes("book") || text.includes("appointment")) {
    return "Pick a doctor in Find Hospitals & Doctors and press Book Appointment. You will choose a date, a time and accessibility needs, then review and confirm.";
  }
  if (text.includes("near") || text.includes("hospital")) {
    return "Open Find Hospitals & Doctors, use Change Location under the search bar, then filter by specialty or accessibility. Each result explains why it appears.";
  }
  if (text.includes("document") || text.includes("carry") || text.includes("bring")) {
    return "Hospitals often ask for a photo ID, a referral letter if you have one, earlier reports or prescriptions, and insurance details. Check with your hospital for its exact list.";
  }
  if (text.includes("language") || text.includes("speak")) {
    return "In Find Hospitals & Doctors, set the Language filter. Each doctor card lists the languages they speak.";
  }
  return "I can help you find facilities, understand booking steps and know which documents to carry. Try one of the suggested questions.";
}

export default function Assistant({ S }) {
  const firstMessage = [{ from: "bot", text: "Hi, I'm Pharma, your navigation helper. How can I help you today?" }];
  const [messages, setMessages] = useState(firstMessage);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottom = useRef();

  // Scroll to the newest message
  useEffect(() => {
    bottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text) {
    if (text.trim() === "" || typing) return;
    setMessages((old) => [...old, { from: "me", text: text }]);
    setInput("");
    setTyping(true);
    // Wait a moment so the typing dots show
    setTimeout(() => {
      setMessages((old) => [...old, { from: "bot", text: getReply(text) }]);
      setTyping(false);
    }, 900);
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="card chat">
      <div className="row between">
        <div className="row">
          <DocBot />
          <div><h3 style={{ margin: 0 }}>Pharma Assistant</h3><small>Navigation help · answers stay on this device</small></div>
        </div>
        <button className="btn ghost sm" onClick={() => setMessages(firstMessage)}><Trash2 size={14} /> Clear chat</button>
      </div>

      <div className="msgs" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "me" ? "bub me" : "bub bot"}>{m.text}</div>
        ))}
        {typing && <div className="bub bot typing"><span /><span /><span /></div>}
        <div ref={bottom} />
      </div>

      <div className="chips">
        {SUGGESTIONS.map((q) => <button key={q} className="tab" onClick={() => sendMessage(q)}>{q}</button>)}
      </div>

      <form className="row" onSubmit={handleSubmit}>
        <input className="input grow" aria-label="Message" placeholder="Ask about hospitals, booking or documents" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="button" className="icon" aria-label="Voice search (visual only)" onClick={() => S.toast("Voice search is only a visual control in this prototype.")}><Mic size={18} /></button>
        <button className="btn" aria-label="Send"><Send size={16} /></button>
      </form>
      <small>PharmaFlow provides healthcare navigation support, not medical diagnosis or treatment advice.</small>
    </div>
  );
}
