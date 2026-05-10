import { useEffect, useRef, useState } from "react";
import embed from "vega-embed";

export default function VegaChart({ specUrl, title }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        setError("");
        const response = await fetch(specUrl);
        if (!response.ok) {
          throw new Error(`Could not load ${specUrl}`);
        }
        const spec = await response.json();
        if (!containerRef.current || cancelled) return;
        const result = await embed(containerRef.current, spec, {
          actions: false,
          renderer: "svg",
          config: {
            background: "transparent",
          },
        });
        viewRef.current = result.view;
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    }

    render();

    return () => {
      cancelled = true;
      if (viewRef.current) {
        viewRef.current.finalize();
        viewRef.current = null;
      }
    };
  }, [specUrl]);

  return (
    <figure className="chart-shell min-h-[280px] w-full rounded-sm bg-white/70 p-3 shadow-soft ring-1 ring-ink/10">
      <div ref={containerRef} aria-label={title} />
      {error ? <p className="px-2 py-4 text-sm text-flood">{error}</p> : null}
    </figure>
  );
}
