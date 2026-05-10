import VegaChart from "./components/VegaChart.jsx";

const base = import.meta.env.BASE_URL;
const spec = (name) => `${base}specs/${name}.json`;

const sections = [
  {
    kicker: "Where risk gathers",
    title: "Flood losses cluster in particular states, not evenly across the map.",
    body: "The 2025 loss pattern points to a simple public message: flood impact is regional. The map sets up the national picture before the story moves into rainfall and exposure.",
    charts: [
      ["Flood loss by state", "01_flood_loss_map"],
      ["Top state losses", "02_top_losses_bar"],
      ["Loss per person", "09_loss_per_person"],
    ],
  },
  {
    kicker: "Rainfall context",
    title: "Rainfall is a major trigger, but it does not explain everything alone.",
    body: "Some high-rainfall areas do show high losses, but exposure, rivers, drainage, terrain, and urbanisation shape what happens after the rain arrives.",
    charts: [
      ["Annual rainfall by selected states", "03_rainfall_lines"],
      ["Rainfall compared with 2025 flood loss", "04_rainfall_loss_scatter"],
      ["Average rainfall across states", "10_rainfall_map"],
    ],
  },
  {
    kicker: "Everyday disruption",
    title: "The cost of floods appears in homes, roads, farms, businesses, and public works.",
    body: "Breaking losses into categories turns the topic from an abstract disaster figure into familiar parts of daily Malaysian life.",
    charts: [
      ["2025 flood losses by category", "05_loss_categories_stacked"],
      ["Districts with highest 2025 losses", "06_district_losses"],
    ],
  },
  {
    kicker: "Monitoring the rain",
    title: "Malaysia’s rainfall network shows how widely flood-relevant weather is watched.",
    body: "Station locations are not flood risk on their own, but they help explain that flood preparedness depends on local monitoring across very different landscapes.",
    charts: [
      ["Rainfall station network", "07_station_map"],
      ["Rainfall stations by region", "08_station_counts"],
    ],
  },
];

function Stat({ value, label }) {
  return (
    <div className="border-t border-ink/20 pt-4">
      <p className="font-serif text-4xl leading-none text-ink md:text-5xl">{value}</p>
      <p className="mt-2 max-w-44 text-sm leading-snug text-muted">{label}</p>
    </div>
  );
}

function Section({ section, index }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.82fr_1.18fr] md:px-8 lg:py-24">
      <div className="md:sticky md:top-10 md:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flood">{section.kicker}</p>
        <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight text-ink md:text-5xl">{section.title}</h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-muted">{section.body}</p>
        <p className="mt-8 text-sm text-muted">Section {index + 1} of {sections.length}</p>
      </div>
      <div className="grid gap-6">
        {section.charts.map(([title, chartSpec]) => (
          <div key={chartSpec}>
            <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink">{title}</h3>
              <a className="text-xs text-rain underline-offset-4 hover:underline" href={`${base}specs/${chartSpec}.json`}>
                JSON spec
              </a>
            </div>
            <VegaChart specUrl={spec(chartSpec)} title={title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <section className="relative min-h-[92svh] overflow-hidden px-5 py-8 md:px-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rain via-river to-flood" />
        <div className="mx-auto grid min-h-[82svh] max-w-7xl content-center gap-10 md:grid-cols-[1fr_0.9fr]">
          <div className="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rain">Malaysia flood risk story</p>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[0.95] text-ink md:text-7xl lg:text-8xl">
              When Rain Becomes Risk
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              A scroll-based visual story about where Malaysia’s 2025 flood losses were concentrated, how rainfall patterns relate to that risk, and why geography and exposure matter.
            </p>
          </div>
          <div className="grid content-end gap-5">
            <Stat value="RM636.9m" label="Estimated flood losses recorded nationally in 2025." />
            <Stat value="16" label="States and federal territories compared in the story." />
            <Stat value="1,699" label="Rainfall stations with usable coordinates after cleaning." />
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <Section key={section.title} section={section} index={index} />
      ))}

      <section className="border-t border-ink/15 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flood">Takeaways</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <p className="text-2xl font-serif leading-tight">Flood risk is uneven because Malaysia’s places are uneven.</p>
            <p className="text-base leading-7 text-muted">Heavy rain matters, but the final impact also depends on rivers, drainage, settlement patterns, infrastructure, and what lies in the water’s path.</p>
            <p className="text-base leading-7 text-muted">Data sources: DOSM flood impact report 2025, DOSM population by state, JPS rainfall datasets, and geoBoundaries Malaysia ADM1 boundaries. Authored for FIT2179 Data Visualisation 2, 2026.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
