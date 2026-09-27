import type React from "react";
/* Іконки для "Every site includes" і дрібні стрілки */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const featureIcons: Record<string, React.ReactElement> = {
  fast: (<svg viewBox="0 0 24 24" {...S}><path d="M4.5 16.5a8.5 8.5 0 1 1 15 0" /><path d="M12 13.5l4-4.5" /><circle cx="12" cy="13.5" r="1.3" fill="currentColor" /></svg>),
  devices: (<svg viewBox="0 0 24 24" {...S}><rect x="2.5" y="4" width="14" height="10" rx="1.5" /><path d="M6 18h7" /><rect x="17" y="9" width="5" height="10" rx="1.2" /></svg>),
  edit: (<svg viewBox="0 0 24 24" {...S}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>),
  inbox: (<svg viewBox="0 0 24 24" {...S}><path d="M3 13l2.5-7h13L21 13v5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></svg>),
  chart: (<svg viewBox="0 0 24 24" {...S}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>),
  globe: (<svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>),
};

export const ArrowUpRight = () => (
  <svg className="i-arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 12 12 2M12 2H4.5M12 2v7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const CheckCircle = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#5e6cff" /><path d="M4.8 8.2 7 10.3l4.2-4.6" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* Перетворює "рядок 1\nрядок 2" у текст з <br> */
export function Lines({ text }: { text?: string | null }) {
  const parts = (text || "").split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
