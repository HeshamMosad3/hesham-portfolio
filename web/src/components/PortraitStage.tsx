import Image from "next/image";
import type { CSSProperties } from "react";
import DotWave from "./DotWave";
import { bidi } from "./Bidi";

/**
 * Cut-out portrait with a neon contour, framed by a grid, a dotted wave,
 * a rotating ring, a large outlined name and floating chips.
 * Every layer sits at its own depth and the stage tilts with the pointer.
 */
export default function PortraitStage({
  name,
  alt,
  chips,
  status,
  preload = false,
}: {
  name: string;
  alt: string;
  chips: string[];
  status: string;
  preload?: boolean;
}) {
  return (
    <div className="ps-stage" data-tilt="8">
      <div className="ps-bg" aria-hidden="true">
        <span className="ps-grid" />
        <span className="ps-glow" />
        <DotWave />
      </div>

      <span className="ps-ring" data-depth style={{ "--d": 20 } as CSSProperties} aria-hidden="true" />
      <span className="ps-name" data-depth style={{ "--d": 10 } as CSSProperties} aria-hidden="true">
        {name}
      </span>

      <div className="ps-person" data-depth style={{ "--d": 50 } as CSSProperties}>
        <Image src="/hesham-cutout.webp" alt={alt} width={846} height={1461} sizes="(max-width: 900px) 80vw, 460px" preload={preload} />
      </div>

      {chips.map((c, i) => (
        <span key={c} className={`ps-chip ps-chip-${i}`} data-depth style={{ "--d": 90 + i * 20 } as CSSProperties}>
          <bdi dir="ltr">{c}</bdi>
        </span>
      ))}
      <span className="ps-chip ps-chip-status" data-depth style={{ "--d": 120 } as CSSProperties}>
        <i className="pulse" />
        {bidi(status)}
      </span>
    </div>
  );
}
