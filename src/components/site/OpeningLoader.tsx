import { useEffect, useState } from "react";

const MIN_VISIBLE_MS = 2000; // long enough to read as an intentional opening, not a glitch
const MAX_WAIT_MS = 5000; // never lock visitors out on slow networks
const FADE_MS = 800;

export function OpeningLoader() {
  // Rendered visible from the server so it covers the page from the first paint (no flash).
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    const start = performance.now();
    const image = document.querySelector<HTMLImageElement>("#home img");
    let done = false;
    const timers: number[] = [];

    const leave = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      timers.push(window.setTimeout(() => {
        setPhase("leaving");
        timers.push(window.setTimeout(() => setPhase("gone"), FADE_MS));
      }, wait));
    };

    const check = () => {
      if (!image || (image.complete && image.naturalWidth > 0)) leave();
    };
    check();
    image?.addEventListener("load", check);
    const interval = window.setInterval(check, 150);
    timers.push(window.setTimeout(leave, MAX_WAIT_MS));

    return () => {
      image?.removeEventListener("load", check);
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "gone" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  if (phase === "gone") return null;
  return (
    <div
      className={`opening-loader${phase === "leaving" ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="opening-loader-brand">HER CONCEPT</span>
      <span className="opening-loader-sub">MODEL AGENCY</span>
      <span className="opening-loader-track" aria-hidden="true">
        <span className="opening-loader-fill" />
      </span>
      <span className="opening-loader-label">Carregando…</span>
    </div>
  );
}
