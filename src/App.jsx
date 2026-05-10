import VegaChart from "./components/VegaChart.jsx";

const base = import.meta.env.BASE_URL;
const spec = (name) => `${base}specs/${name}.json`;

const chartVariant = (chartSpec) => {
  if (["01_flood_loss_map", "07_station_map", "10_rainfall_map"].includes(chartSpec)) return "map";
  if (["05_loss_categories_stacked", "06_district_losses"].includes(chartSpec)) return "large";
  return "standard";
};

const sections = [
  {
    kicker: "Where risk gathers",
    title: "Flood losses are concentrated, not evenly spread.",
    body: "The 2025 pattern starts the story: several states carry a much larger share of recorded flood losses than others.",
    charts: [
      {
        title: "Flood loss by state",
        spec: "01_flood_loss_map",
        caption: "Terengganu and Kelantan sit at the high end of total recorded losses."
      },
      {
        title: "Top state losses",
        spec: "02_top_losses_bar",
        caption: "The leading states form a clear east-coast and southern pattern."
      },
      {
        title: "Loss per person",
        spec: "09_loss_per_person",
        caption: "Smaller states can look more exposed once loss is viewed per person."
      },
    ],
  },
  {
    kicker: "Rainfall context",
    title: "Rainfall matters, but it is not the whole explanation.",
    body: "Heavy rain is the trigger. Impact depends on where it falls, what is exposed, and how water moves through each place.",
    charts: [
      {
        title: "Annual rainfall by selected states",
        spec: "03_rainfall_lines",
        caption: "East-coast states often record high rainfall, especially Terengganu."
      },
      {
        title: "Rainfall compared with 2025 flood loss",
        spec: "04_rainfall_loss_scatter",
        caption: "Rainfall and loss move together imperfectly; exposure and geography still matter."
      },
      {
        title: "Average rainfall across states",
        spec: "10_rainfall_map",
        caption: "Rainfall is high in several regions, but flood losses remain uneven."
      },
    ],
  },
  {
    kicker: "Everyday disruption",
    title: "Flood damage shows up in ordinary systems.",
    body: "The losses are not just abstract totals. They touch homes, farms, businesses, vehicles, and infrastructure.",
    charts: [
      {
        title: "2025 flood losses by category",
        spec: "05_loss_categories_stacked",
        caption: "Infrastructure and household losses dominate in different states."
      },
      {
        title: "Districts with highest 2025 losses",
        spec: "06_district_losses",
        caption: "District-level losses show how local the impact can become."
      },
    ],
  },
  {
    kicker: "Monitoring the rain",
    title: "Preparedness starts with local monitoring.",
    body: "Rainfall stations do not measure flood risk directly, but they show how flood-relevant weather is watched across varied terrain.",
    charts: [
      {
        title: "Rainfall station network",
        spec: "07_station_map",
        caption: "Stations are spread across Peninsular Malaysia, Sabah, and Sarawak."
      },
      {
        title: "Rainfall stations by region",
        spec: "08_station_counts",
        caption: "Station counts reflect monitoring coverage, not flood danger by themselves."
      },
    ],
  },
];

function Stat({ value, label }) {
  return (
    <div className="border-t border-ink/20 pt-4">
      <p className="text-4xl font-semibold leading-none text-ink md:text-5xl">{value}</p>
      <p className="mt-2 max-w-44 text-sm leading-snug text-muted">{label}</p>
    </div>
  );
}

function Section({ section, index }) {
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-16 md:px-8 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-8 lg:h-[calc(100svh-4rem)] lg:self-start lg:border-r lg:border-ink/10 lg:pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flood">{section.kicker}</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-ink md:text-5xl lg:text-4xl xl:text-5xl">{section.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">{section.body}</p>
          <p className="mt-8 text-sm text-muted">Section {index + 1} of {sections.length}</p>
        </div>
        <div className="grid min-w-0 gap-10">
          {section.charts.map((chart) => (
            <div key={chart.spec} className="min-w-0">
              <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink">{chart.title}</h3>
                <a className="shrink-0 text-xs text-rain underline-offset-4 hover:underline" href={`${base}specs/${chart.spec}.json`}>
                  JSON spec
                </a>
              </div>
              <VegaChart specUrl={spec(chart.spec)} title={chart.title} variant={chartVariant(chart.spec)} />
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{chart.caption}</p>
            </div>
          ))}
        </div>
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
              Where Malaysia’s 2025 flood losses concentrated, how rainfall relates to that pattern, and why place matters.
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
            <p className="text-2xl font-semibold leading-tight text-ink">Flood risk is uneven because Malaysia’s places are uneven.</p>
            <p className="text-base leading-7 text-muted">Heavy rain matters, but the final impact also depends on rivers, drainage, settlements, and infrastructure.</p>
            <p className="text-base leading-7 text-muted">Sources: DOSM flood impact report 2025, DOSM population, JPS rainfall data, and geoBoundaries. FIT2179 Data Visualisation 2, 2026.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
