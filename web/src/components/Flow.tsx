"use client";

import { useState } from "react";
import { bidi } from "./Bidi";

type Node = { id: string; title: string; text: string };

/** System flow as connected stages. Hovering or focusing a stage highlights it and its neighbours. */
export default function Flow({ nodes }: { nodes: Node[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className={`flow ${active !== null ? "has-active" : ""}`} onMouseLeave={() => setActive(null)}>
      {nodes.map((n, i) => {
        const linked = active !== null && Math.abs(active - i) === 1;
        return (
          <div
            key={n.id}
            className={`flow-node ${active === i ? "is-active" : ""} ${linked ? "is-linked" : ""}`}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            data-tilt="10"
          >
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{bidi(n.title)}</h3>
            <p>{bidi(n.text)}</p>
          </div>
        );
      })}
      <span className="flow-pulse" aria-hidden="true" />
    </div>
  );
}
