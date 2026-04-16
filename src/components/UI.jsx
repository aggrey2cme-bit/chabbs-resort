import { useState } from 'react';
import { C, SC, inp } from '../styles/tokens';

export const Badge = ({ label }) => {
  const s = SC[label] || { bg: "#F5F5F5", tx: "#616161", dot: "#9E9E9E" };
  return (
    <span style={{ background: s.bg, color: s.tx, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{label}
    </span>
  );
};

export const Field = ({ label, children, col }) => (
  <div style={col ? { gridColumn: col } : {}}>
    <label style={{ fontSize: 11, color: C.textL, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

export const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display',Georgia,serif" }}>{title}</div>
    {sub && <div style={{ fontSize: 13, color: C.textL, marginTop: 4 }}>{sub}</div>}
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div style={{ background: "white", borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", ...style }}>
    {children}
  </div>
);

export const SubTabs = ({ tabs, active, setActive }) => (
  <div style={{ display: "flex", gap: 2, marginBottom: 20, background: C.sandL, borderRadius: 14, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
    {tabs.map(([k, icon, label]) => (
      <button key={k} onClick={() => setActive(k)} style={{
        padding: "8px 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
        background: active === k ? "white" : "transparent", color: active === k ? C.navy : C.textL,
        boxShadow: active === k ? "0 2px 8px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: 5
      }}>
        <span>{icon}</span>{label}
      </button>
    ))}
  </div>
);

export const StatBox = ({ bg, border: b, tx, label, value }) => (
  <div style={{ background: bg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${b}` }}>
    <div style={{ fontSize: 10, color: tx, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 900, color: tx, marginTop: 4 }}>{value}</div>
  </div>
);

// Reusable Input component
export const Inp = (props) => <input {...props} style={{ ...inp, ...props.style }} />;

// Reusable Select component
export const Sel = ({ children, ...props }) => <select {...props} style={{ ...inp, ...props.style }}>{children}</select>;

// Reusable Textarea component
export const Tex = (props) => <textarea {...props} style={{ ...inp, resize: "vertical", ...props.style }} />;

// Button component
export const Btn = ({ children, variant = "primary", ...props }) => {
  const styles = {
    primary: { background: `linear-gradient(135deg,${C.navy},${C.navyM})`, color: "white" },
    success: { background: `linear-gradient(135deg,${C.sageD},${C.sage})`, color: "white" },
    danger: { background: C.danger, color: "white" },
    warning: { background: `linear-gradient(135deg,${C.terra},${C.terraL})`, color: "white" },
    ghost: { background: C.border, color: C.textM },
    gold: { background: `linear-gradient(135deg,${C.gold},${C.goldL})`, color: C.text },
  };
  return (
    <button {...props} style={{
      padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer",
      fontWeight: 700, fontSize: 13, ...styles[variant], ...props.style
    }}>
      {children}
    </button>
  );
};
