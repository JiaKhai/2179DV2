import VegaChart from "./components/VegaChart.jsx";

const base = import.meta.env.BASE_URL;
const spec = (name) => `${base}specs/${name}.json`;

const chartVariant = (chartSpec) => {
  if (["01_flood_loss_map", "07_station_map", "10_rainfall_map"].includes(chartSpec)) return "map";
  if (
    [
      "05_loss_categories_stacked",
      "06_district_losses",
      "11_rank_shift_dumbbell",
      "12_loss_change_lollipop",
      "13_loss_mix_proportional_heatmap",
      "14_state_profile_radar",
    ].includes(chartSpec)
  ) return "large";
  return "standard";
};

const sections = [
  {
    kicker: "Where risk gathers",
    title: "Flood losses are concentrated, not evenly spread.",
    body: "The story begins with an uneven map. In 2025, flood losses gathered around a few places while much of the country recorded far smaller totals.",
    charts: [
      {
        title: "Flood loss by state",
        spec: "01_flood_loss_map",
        caption: "The map shades each state by recorded 2025 flood loss. Darker areas quickly reveal that flood impact is not spread evenly across Malaysia."
      },
      {
        title: "Top state losses",
        spec: "02_top_losses_bar",
        caption: "The ranking pulls the largest losses out of the map and lines them up for comparison. The gap between the leading states helps show how concentrated the national total is."
      },
      {
        title: "Loss per person",
        spec: "09_loss_per_person",
        caption: "Total RM loss does not tell the whole story. By dividing loss by population, smaller places become easier to see when the burden falls across fewer people."
      },
      {
        title: "Exposure compared with loss",
        spec: "11_rank_shift_dumbbell",
        caption: "Homes and losses are plotted together, with average lines as a reference point. Places far from the middle suggest that exposure matters, but it is not the only force shaping damage."
      },
    ],
  },
  {
    kicker: "Rainfall context",
    title: "Rainfall matters, but it is not the whole explanation.",
    body: "Rain is the obvious starting point, but floods become costly only when rain meets exposed homes, roads, rivers, and drainage systems.",
    charts: [
      {
        title: "Annual rainfall by selected states",
        spec: "03_rainfall_lines",
        caption: "The lines follow annual rainfall in selected states. Terengganu and other wetter states stand out, but the year-to-year movement shows that rainfall is never a fixed backdrop."
      },
      {
        title: "Rainfall compared with 2025 flood loss",
        spec: "04_rainfall_loss_scatter",
        caption: "Rainfall and loss are placed on the same plane here. The scattered pattern is the key: wet places are not automatically the most costly, and lower-rainfall places can still suffer serious losses."
      },
      {
        title: "Selected state signal profile",
        spec: "14_state_profile_radar",
        caption: "The profile lines compare several signals at once: rainfall, exposed homes, total loss, and loss per person. Each state traces a different shape, which is the point of the comparison."
      },
      {
        title: "Rainfall area cartogram",
        spec: "10_rainfall_map",
        caption: "The cartogram keeps Malaysia recognisable while enlarging wetter states. It turns rainfall into map area, so places with heavier average rain physically take up more space in the story."
      },
    ],
  },
  {
    kicker: "Everyday disruption",
    title: "Flood damage shows up in ordinary systems.",
    body: "Behind each RM total are familiar systems: homes, farms, shops, vehicles, roads, bridges, and public infrastructure that daily life depends on.",
    charts: [
      {
        title: "Small-multiple damage treemaps",
        spec: "05_loss_categories_stacked",
        caption: "Each mini treemap opens up a state total into its damage categories. The blocks show whether losses are mostly infrastructure, homes, agriculture, or a more mixed pattern."
      },
      {
        title: "District loss points",
        spec: "06_district_losses",
        caption: "Districts bring the story closer to the ground. Larger points mark the local areas where losses were highest, turning broad state patterns into more specific places."
      },
      {
        title: "Loss change from 2024 to 2025",
        spec: "12_loss_change_lollipop",
        caption: "The connected points compare losses from 2024 to 2025. Some states moved down sharply, while others climbed, showing how flood impact can shift from one year to the next."
      },
      {
        title: "National damage shift",
        spec: "13_loss_mix_proportional_heatmap",
        caption: "The slope lines follow national damage categories across two years. Infrastructure remains a major part of the bill, while agriculture drops sharply from the previous year."
      },
    ],
  },
  {
    kicker: "Monitoring the rain",
    title: "Preparedness starts with local monitoring.",
    body: "The story ends upstream, with measurement. Rainfall stations do not prevent floods, but they shape what can be watched, compared, and acted on.",
    charts: [
      {
        title: "Rainfall station network",
        spec: "07_station_map",
        caption: "Each point marks a rainfall station with usable coordinates. The pattern is about monitoring coverage, not direct flood danger, and it shows where rainfall evidence is being collected."
      },
      {
        title: "Rainfall station coverage waffle",
        spec: "08_station_counts",
        caption: "The waffle view turns the station network into 100 small parts. Each square is about 1% of mapped stations, making regional coverage easier to compare at a glance."
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
              A scroll through where Malaysia’s 2025 flood losses gathered, how rainfall fits into the pattern, and why place changes the outcome.
            </p>
          </div>
          <div className="grid content-end gap-5">
            <Stat value="RM636.9m" label="Recorded flood losses across Malaysia in 2025." />
            <Stat value="16" label="States and federal territories followed through the story." />
            <Stat value="1,699" label="Rainfall stations mapped after coordinate cleaning." />
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
            <p className="text-base leading-7 text-muted">Rain starts the hazard, but the damage follows the shape of rivers, drainage, settlements, infrastructure, and exposure.</p>
            <p className="text-base leading-7 text-muted">Sources: DOSM flood impact report 2025, DOSM population, JPS rainfall data, and geoBoundaries. FIT2179 Data Visualisation 2, 2026.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
