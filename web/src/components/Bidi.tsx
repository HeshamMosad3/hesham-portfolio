import { Fragment, type ReactNode } from "react";

const ARABIC = /[؀-ۿ]/;
// A Latin "phrase": tech names like "Full Stack .NET", "C#", "ASP.NET Core", "A+".
const LATIN = /([A-Za-z0-9#+.][A-Za-z0-9#+.\-/ ]*[A-Za-z0-9#+]|[A-Za-z0-9#+])/g;

/**
 * Wraps Latin phrases inside Arabic text in <bdi dir="ltr"> so punctuation
 * such as the dot in ".NET" or the hash in "C#" never flips in RTL.
 * Text without Arabic letters is returned unchanged.
 */
export function bidi(text: string): ReactNode {
  if (!ARABIC.test(text)) return text;
  const parts = text.split(LATIN);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <bdi key={i} dir="ltr">
        {p}
      </bdi>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

export default function Bidi({ children }: { children: string }) {
  return <>{bidi(children)}</>;
}
