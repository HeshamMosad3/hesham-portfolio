import { notFound } from "next/navigation";

// Catch-all so unknown URLs render a localized 404 inside the [lang] layout.
export default function CatchAll() {
  notFound();
}
