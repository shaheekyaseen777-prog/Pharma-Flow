// All data below is FICTIONAL demonstration data.
// Turns a short code like "vv?u" into ["verified","verified","unknown","unverified"]
// v = verified, u = unverified, ? = unknown
function A(code) {
  const result = [];
  for (const letter of code) {
    if (letter === "v") result.push("verified");
    if (letter === "u") result.push("unverified");
    if (letter === "?") result.push("unknown");
  }
  return result;
}
export const SPEC = ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "ENT", "General Medicine"];
export const LOCS = ["Chengalpattu", "Tambaram", "Chennai", "Kanchipuram"];
export const LANGS = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada"];
export const ACCESS = ["Wheelchair accessibility", "Ramps and lifts", "Accessible washrooms", "Sign-language assistance", "Hearing assistance", "Visual assistance"];
// Predefined keyword -> department mapping (service navigation only, never diagnosis)
export const ALIAS = { heart: "Cardiology", skin: "Dermatology", child: "Pediatrics", kids: "Pediatrics", bone: "Orthopedics", joint: "Orthopedics", nerve: "Neurology", ear: "ENT", throat: "ENT", family: "General Medicine" };
export const HOSP = [
  { id: "h1", name: "Lotus Care Hospital", loc: "Chengalpattu", specs: ["Cardiology", "General Medicine", "Pediatrics"], rating: 4.6, reviews: 312, services: ["Pharmacy", "Laboratory", "Help desk"], access: A("vvv?uv") },
  { id: "h2", name: "Riverbend Medical Centre", loc: "Tambaram", specs: ["Orthopedics", "Neurology", "ENT"], rating: 4.4, reviews: 208, services: ["Imaging centre", "Pharmacy", "Cafeteria"], access: A("vu?vv?") },
  { id: "h3", name: "Sunrise Community Hospital", loc: "Chennai", specs: ["Dermatology", "Pediatrics", "General Medicine"], rating: 4.7, reviews: 540, services: ["Laboratory", "Day-care ward", "Help desk"], access: A("vvvvvu") },
  { id: "h4", name: "Palm Grove Clinic", loc: "Kanchipuram", specs: ["General Medicine", "ENT", "Cardiology"], rating: 4.2, reviews: 96, services: ["Pharmacy", "Consultation rooms"], access: A("u???u?") },
];
export const DOCS = [
  { id: "d1", name: "Dr. Meera Raghavan", spec: "Cardiology", h: "h1", exp: 14, langs: ["English", "Tamil"], rating: 4.8, reviews: 121, slots: ["09:30", "11:00", "15:30"] },
  { id: "d2", name: "Dr. Arjun Pillai", spec: "General Medicine", h: "h1", exp: 9, langs: ["English", "Malayalam", "Tamil"], rating: 4.5, reviews: 88, slots: ["10:00", "12:30"] },
  { id: "d3", name: "Dr. Kavya Subramanian", spec: "Pediatrics", h: "h3", exp: 11, langs: ["English", "Tamil", "Hindi"], rating: 4.9, reviews: 203, slots: ["09:00", "10:30", "16:00"] },
  { id: "d4", name: "Dr. Imran Sheikh", spec: "Orthopedics", h: "h2", exp: 16, langs: ["English", "Hindi"], rating: 4.6, reviews: 97, slots: ["11:30", "14:00"] },
  { id: "d5", name: "Dr. Lakshmi Narayanan", spec: "Neurology", h: "h2", exp: 18, langs: ["English", "Tamil", "Telugu"], rating: 4.7, reviews: 64, slots: [] },
  { id: "d6", name: "Dr. Rohan Das", spec: "Dermatology", h: "h3", exp: 7, langs: ["English", "Hindi", "Kannada"], rating: 4.4, reviews: 59, slots: ["13:00", "17:00"] },
  { id: "d7", name: "Dr. Anitha Joseph", spec: "ENT", h: "h4", exp: 12, langs: ["English", "Malayalam", "Tamil"], rating: 4.3, reviews: 41, slots: ["10:15", "11:45"] },
  { id: "d8", name: "Dr. Vikram Reddy", spec: "Cardiology", h: "h4", exp: 20, langs: ["English", "Telugu", "Kannada"], rating: 4.6, reviews: 77, slots: ["09:45", "15:00"] },
];
// Returns a date like "2026-11-10", n days from today
function day(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
export function dateList() {
  return [1, 2, 3, 4, 5, 6].map(day);
}
// Shows "2026-11-10" as "Tue, 10 Nov"
export function fmtDate(s) {
  return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
export const INIT_APPTS = [
  { id: "PF-482913", d: "d1", date: day(3), time: "11:00", status: "Upcoming", acc: ["Wheelchair accessibility"], reason: "Routine follow-up consultation (demo)" },
  { id: "PF-337701", d: "d3", date: day(6), time: "09:00", status: "Upcoming", acc: [], reason: "General check-up (demo)" },
  { id: "PF-129044", d: "d4", date: day(-20), time: "14:00", status: "Completed", acc: ["Ramps and lifts"], reason: "Consultation (demo)" },
  { id: "PF-118562", d: "d2", date: day(-45), time: "10:00", status: "Completed", acc: [], reason: "Consultation (demo)" },
  { id: "PF-090277", d: "d6", date: day(-10), time: "13:00", status: "Cancelled", acc: [], reason: "Consultation (demo)" },
];
export const CATS = ["Lab Reports", "Prescriptions", "Scans and Images", "Discharge Summaries", "Other Documents"];
export const INIT_DOCS = [
  { id: 1, name: "Blood_test_sample.pdf", type: "PDF", size: "212 KB", date: "2026-10-12", cat: "Lab Reports" },
  { id: 2, name: "Prescription_sample.pdf", type: "PDF", size: "96 KB", date: "2026-09-30", cat: "Prescriptions" },
  { id: 3, name: "Chest_scan_sample.png", type: "PNG", size: "1.4 MB", date: "2026-08-21", cat: "Scans and Images" },
  { id: 4, name: "Discharge_summary_sample.pdf", type: "PDF", size: "340 KB", date: "2026-06-04", cat: "Discharge Summaries" },
];
export const INIT_NOTIFS = [
  { id: 1, t: "Appointment confirmed", m: "Your visit with Dr. Meera Raghavan is confirmed.", read: false },
  { id: 2, t: "Upcoming appointment reminder", m: "You have an appointment in 3 days at Lotus Care Hospital.", read: false },
  { id: 3, t: "Pending task", m: "Complete your pre-visit registration form.", read: false },
  { id: 4, t: "Appointment rescheduled", m: "Your earlier visit was moved to a new slot.", read: true },
  { id: 5, t: "Appointment cancelled", m: "Your dermatology visit was cancelled.", read: true },
  { id: 6, t: "Follow-up reminder", m: "Book a follow-up visit if your doctor requested one.", read: true },
];
export const INIT_REVIEWS = [
  { id: 1, who: "Demo Patient A", target: "Lotus Care Hospital", stars: 5, text: "Clear signage and a helpful front desk. Check-in was quick." },
  { id: 2, who: "Demo Patient B", target: "Dr. Kavya Subramanian", stars: 5, text: "Listened patiently and explained the next steps clearly." },
  { id: 3, who: "Demo Patient C", target: "Riverbend Medical Centre", stars: 4, text: "Ramps were easy to use. Waiting time was a little long." },
];
export const NAV = ["Dashboard", "Find Hospitals & Doctors", "My Appointments", "My Health Drive", "AI Assistant", "Ratings & Reviews", "Settings & Language"];
export const NAV_T = {
  Tamil: ["முகப்பு", "மருத்துவமனைகள்", "என் சந்திப்புகள்", "சுகாதார டிரைவ்", "உதவியாளர்", "மதிப்பீடுகள்", "அமைப்புகள்"],
  Hindi: ["डैशबोर्ड", "अस्पताल खोजें", "मेरी अपॉइंटमेंट", "हेल्थ ड्राइव", "सहायक", "रेटिंग और समीक्षा", "सेटिंग्स"],
  Telugu: ["డాష్‌బోర్డ్", "ఆసుపత్రులు", "నా అపాయింట్‌మెంట్లు", "హెల్త్ డ్రైవ్", "సహాయకుడు", "రేటింగ్‌లు", "సెట్టింగ్‌లు"],
  Malayalam: ["ഡാഷ്ബോർഡ്", "ആശുപത്രികൾ", "എന്റെ അപ്പോയിന്റ്മെന്റുകൾ", "ഹെൽത്ത് ഡ്രൈവ്", "സഹായി", "റേറ്റിംഗുകൾ", "ക്രമീകരണങ്ങൾ"],
  Kannada: ["ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ಆಸ್ಪತ್ರೆಗಳು", "ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", "ಹೆಲ್ತ್ ಡ್ರೈವ್", "ಸಹಾಯಕ", "ರೇಟಿಂಗ್‌ಗಳು", "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"],
};
