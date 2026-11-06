import { useState } from "react";
import { Logo } from "./ui";

// Demo login, register and forgot-password screens. Nothing is saved or checked.
export default function Auth({ onEnter, toast }) {
  const [mode, setMode] = useState("login"); // "login", "register" or "forgot"
  const [role, setRole] = useState("Patient");

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === "forgot") {
      toast("Demo only: no reset email is sent.");
      setMode("login");
      return;
    }
    if (mode === "login" && role === "Doctor") {
      toast("The doctor portal is outside this prototype. Opening the patient portal.");
    }
    onEnter();
  }

  let heading = "Sign in";
  if (mode === "register") heading = "Create your account";
  if (mode === "forgot") heading = "Reset password";

  return (
    <div className="auth">
      <div className="l">
        <Logo size={72} />
        <h1 style={{ fontSize: "2.4rem" }}>PharmaFlow</h1>
        <p>Healthcare, Made Simple.</p>
        <p>Find hospitals, book visits and know your next step.</p>
      </div>

      <div className="r">
        <form onSubmit={handleSubmit}>
          <h2>{heading}</h2>
          <p className="notice">Demonstration screen only. Please don't enter real credentials or personal details.</p>

          {mode === "login" && (
            <div className="tabs">
              <button type="button" className={role === "Patient" ? "tab on" : "tab"} onClick={() => setRole("Patient")}>Patient Login</button>
              <button type="button" className={role === "Doctor" ? "tab on" : "tab"} onClick={() => setRole("Doctor")}>Doctor Login</button>
            </div>
          )}

          {mode === "register" && (
            <label>Full name (fictional)<input className="input" required placeholder="Priya Sharma" /></label>
          )}
          <label>Email<input className="input" type="email" required placeholder="demo@example.com" autoComplete="off" /></label>
          {mode !== "forgot" && (
            <label>Password<input className="input" type="password" required placeholder="Any demo password" autoComplete="off" /></label>
          )}

          <button className="btn">
            {mode === "login" && "Sign in"}
            {mode === "register" && "Register"}
            {mode === "forgot" && "Send reset link"}
          </button>

          {mode === "login" && <button type="button" className="link" onClick={() => setMode("forgot")}>Forgot password?</button>}
          {mode === "login" && <button type="button" className="link" onClick={() => setMode("register")}>New patient? Create an account</button>}
          {mode !== "login" && <button type="button" className="link" onClick={() => setMode("login")}>Back to sign in</button>}
        </form>
      </div>
    </div>
  );
}
