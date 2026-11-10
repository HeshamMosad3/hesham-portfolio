import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const Arrow = (p: P) => (<svg {...base} className="arrow" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowUpRight = (p: P) => (<svg {...base} {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>);
export const ArrowUp = (p: P) => (<svg {...base} {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>);
export const Download = (p: P) => (<svg {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>);
export const Copy = (p: P) => (<svg {...base} {...p}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 012-2h8" /></svg>);
export const Check = (p: P) => (<svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const Home = (p: P) => (<svg {...base} {...p}><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z" /></svg>);
export const Grid = (p: P) => (<svg {...base} {...p}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>);
export const User = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0115 0" /></svg>);
export const Spark = (p: P) => (<svg {...base} {...p}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /><path d="M19 17l.6 1.6L21 19l-1.4.4L19 21l-.6-1.6L17 19l1.4-.4z" /></svg>);
export const Chat = (p: P) => (<svg {...base} {...p}><path d="M20 12a8 8 0 01-11.7 7.1L4 20l.9-4.1A8 8 0 1120 12z" /></svg>);
export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 2.9 2.9 0 00-.9 2.2 5.1 5.1 0 001.1 2.7 11.6 11.6 0 004.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.2-1.2c-.1-.1-.3-.2-.6-.3z" />
  </svg>
);
export const GitHub = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 011-2.7 3.6 3.6 0 01.1-2.7s.8-.3 2.8 1a9.5 9.5 0 015 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 01.1 2.7 3.9 3.9 0 011 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z" />
  </svg>
);
export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.4 2H3.6A1.6 1.6 0 002 3.6v16.8A1.6 1.6 0 003.6 22h16.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0020.4 2zM8 19H5V9.5h3zM6.5 8.2a1.7 1.7 0 110-3.5 1.7 1.7 0 010 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3a3.1 3.1 0 012.8-1.5c3 0 3.6 2 3.6 4.6z" />
  </svg>
);
