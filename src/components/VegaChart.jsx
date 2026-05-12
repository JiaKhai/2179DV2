import { useEffect, useRef, useState } from "react";
import embed from "vega-embed";

export default function VegaChart({ specUrl, title, variant = "standard" }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const [error, setError] = useState("");
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const updateWidth = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      const nextWidth = Math.max(280, Math.floor(width));
      setChartWidth((currentWidth) => {
        if (Math.abs(currentWidth - nextWidth) < 16) return currentWidth;
        return nextWidth;
      });
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        if (!chartWidth) return;
        setError("");
        const response = await fetch(specUrl);
        if (!response.ok) {
          throw new Error(`Could not load ${specUrl}`);
        }
        const spec = await response.json();
        const sizedSpec = {
          ...spec,
          width: chartWidth,
          autosize: { type: "fit", contains: "padding" },
          config: {
            ...(spec.config || {}),
            axis: {
              labelFont: "Manrope",
              titleFont: "Manrope",
              labelFontSize: 12,
              titleFontSize: 13,
              labelLimit: 220,
              titleLimit: 360,
              ...(spec.config?.axis || {}),
            },
            legend: {
              labelFont: "Manrope",
              titleFont: "Manrope",
              labelFontSize: 12,
              titleFontSize: 12,
              labelLimit: 300,
              titleLimit: 420,
              columns: 3,
              ...(spec.config?.legend || {}),
            },
          },
        };
        if (!containerRef.current || cancelled) return;
        if (viewRef.current) {
          viewRef.current.finalize();
          viewRef.current = null;
        }
        containerRef.current.innerHTML = "";
        const result = await embed(containerRef.current, sizedSpec, {
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
  }, [specUrl, chartWidth]);

  return (
    <figure className="chart-shell w-full rounded-sm bg-white/75 p-5 shadow-soft ring-1 ring-ink/10 md:p-7">
      <div ref={containerRef} className="w-full overflow-x-auto overflow-y-visible pb-1" aria-label={title} />
      {error ? <p className="px-2 py-4 text-sm text-flood">{error}</p> : null}
    </figure>
  );
}
