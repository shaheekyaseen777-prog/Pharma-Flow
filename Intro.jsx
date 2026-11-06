import { useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "./ui";

// Animated welcome screen. Moves on by itself after about 5 seconds.
export default function Intro({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4800);
    return () => clearTimeout(timer); // stop the timer if the screen closes early
  }, [onDone]);

  return (
    <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <button className="skip" onClick={onDone}>Skip Intro</button>
      <div>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: "inline-block" }}>
          <Logo size={104} anim />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>PharmaFlow</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ fontSize: "1.2rem" }}>Care begins with a simpler journey.</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} style={{ fontWeight: 600, letterSpacing: "0.25em" }}>HEALTHCARE, MADE SIMPLE.</motion.p>
        <div className="prog"><motion.i initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4.8, ease: "linear" }} /></div>
      </div>
    </motion.div>
  );
}
