import { useEffect, useState } from "react";
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
      "15_population_area_brush",
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
        title: "The largest flood losses cluster on the east coast",
        spec: "01_flood_loss_map",
        type: "choropleth map",
        caption: "Recorded 2025 flood loss is mapped by state, making **geographic unevenness** the first message. The darker states identify where the national total is concentrated, while lighter states show that flood loss was not spread evenly across Malaysia."
      },
      {
        title: "Two east-coast states almost share the top loss rank",
        spec: "02_top_losses_bar",
        type: "ranked bar chart",
        caption: "Ranking the ten largest state losses turns the map pattern into a direct comparison. It shows **how concentrated the top losses are**, especially because Terengganu and Kelantan sit very close together at the top."
      },
      {
        title: "Small populations can carry a heavier loss burden",
        spec: "09_loss_per_person",
        type: "ranked bar chart",
        caption: "Dividing flood loss by population shows burden rather than total size. The result highlights **small-population vulnerability**, where places such as Perlis can rank highly even when their total RM loss is much lower than the largest states."
      },
      {
        title: "Exposure helps explain loss, but not perfectly",
        spec: "11_rank_shift_dumbbell",
        type: "bubble scatter plot",
        caption: "Living quarters are compared with flood loss, while point size shows loss per person. The best-fit line gives a reference for the general pattern, while points far above it show **losses that are higher than exposure alone would suggest**."
      },
      {
        title: "Population exposure has grown steadily across regions",
        spec: "15_population_area_brush",
        type: "brushed stacked area chart",
        caption: "Regional population exposure is stacked over time to show how the exposed base has changed. The key point is **exposure growth before disaster happens**; brushing the lower overview zooms the upper chart so shorter periods can be compared more clearly."
      },
    ],
  },
  {
    kicker: "Rainfall context",
    title: "Rainfall matters, but it is not the whole explanation.",
    body: "Rain is the obvious starting point, but floods become costly only when rain meets exposed homes, roads, rivers, and drainage systems.",
    charts: [
      {
        title: "Rainfall swings sharply from year to year",
        spec: "03_rainfall_lines",
        type: "interactive line chart",
        caption: "Annual rainfall for selected states is followed from 2013 to 2017. The movement shows that rainfall is **volatile from year to year**, so flood risk cannot be read from a single fixed rainfall level."
      },
      {
        title: "Wet places are not always the most costly",
        spec: "04_rainfall_loss_scatter",
        type: "brushed bubble plot",
        caption: "States are placed by average rainfall, 2025 loss, and population. The pattern challenges the simple idea that wetter states always lose more, because outliers such as Johor and Sarawak show **rainfall alone does not explain flood cost**."
      },
      {
        title: "Each state combines rainfall, exposure, and loss differently",
        spec: "14_state_profile_radar",
        type: "profile line chart",
        caption: "Selected states are compared across rainfall, homes, total loss, and loss per person. The different line shapes show **different pathways into risk**, making it easier to see when a state is driven more by exposure, rainfall, or burden."
      },
      {
        title: "Heavier rainfall reshapes the map",
        spec: "10_rainfall_map",
        type: "area cartogram",
        caption: "States are resized according to average annual rainfall in the cartogram. By turning rainfall into map area, it makes **wetness visually dominant** while still keeping Malaysia recognisable enough for geographic comparison."
      },
    ],
  },
  {
    kicker: "Everyday disruption",
    title: "Flood damage shows up in ordinary systems.",
    body: "Behind each RM total are familiar systems: homes, farms, shops, vehicles, roads, bridges, and public infrastructure that daily life depends on.",
    charts: [
      {
        title: "Damage categories vary from state to state",
        spec: "05_loss_categories_stacked",
        type: "small-multiple treemap",
        caption: "Each state total is split into damage categories through small treemaps. Similar flood totals can come from very different systems being damaged, with **infrastructure, homes, agriculture, business, vehicles, and manufacturing** contributing in different mixes."
      },
      {
        title: "Local losses reveal the places behind state totals",
        spec: "06_district_losses",
        type: "interactive dot plot",
        caption: "District losses are ranked to move the story below the state level. The point is **which local places drive the totals**; use the state filter to rerank districts within one state, or keep all states selected to see the national leaders."
      },
      {
        title: "Flood losses shifted sharply between years",
        spec: "12_loss_change_lollipop",
        type: "interactive dumbbell chart",
        caption: "Each state's 2024 and 2025 flood loss is connected to show year-to-year change. The chart shows **how quickly flood impact can shift between years**, with the distance between points showing the size of the increase or decrease."
      },
      {
        title: "Infrastructure became the dominant national damage cost",
        spec: "13_loss_mix_proportional_heatmap",
        type: "slope chart",
        caption: "National damage categories are followed from 2024 to 2025. The story is not only about the total changing, but about **which systems carried the cost**, especially as infrastructure rose while agriculture fell."
      },
    ],
  },
  {
    kicker: "Monitoring the rain",
    title: "Preparedness starts with local monitoring.",
    body: "The story ends upstream, with measurement. Rainfall stations do not prevent floods, but they shape what can be watched, compared, and acted on.",
    charts: [
      {
        title: "Rainfall monitoring is dense but uneven",
        spec: "07_station_map",
        type: "point map",
        caption: "Every rainfall station with usable coordinates is shown as a point. The map is about **monitoring coverage rather than direct flood danger**, showing where rainfall evidence is dense and where measurement gaps remain."
      },
      {
        title: "Station coverage is concentrated by region",
        spec: "08_station_counts",
        type: "waffle chart",
        caption: "The station network is converted into 100 small squares. Each square represents about 1% of mapped stations, making **regional monitoring concentration** easier to compare than on the dense point map."
      },
    ],
  },
];

const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

function CountUpNumber({ value, decimals = 0, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayValue(value);
      return undefined;
    }

    let animationFrame = 0;
    const duration = 1400;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayValue(value * easeOutCubic(progress));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <>
      {displayValue.toLocaleString("en-MY", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function Stat({ value, decimals, suffix, label }) {
  return (
    <div className="border-t border-ink/20 pt-4">
      <p className="text-4xl font-semibold leading-none text-ink md:text-5xl">
        <CountUpNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mt-2 max-w-44 text-sm leading-snug text-muted">{label}</p>
    </div>
  );
}

function EmphasizedText({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
                <div className="shrink-0 text-right text-xs text-muted">
                  <a className="text-rain underline-offset-4 hover:underline" href={`${base}specs/${chart.spec}.json`}>
                    JSON spec
                  </a>{" "}
                  <span>({chart.type})</span>
                </div>
              </div>
              <VegaChart specUrl={spec(chart.spec)} title={chart.title} variant={chartVariant(chart.spec)} />
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                <EmphasizedText text={chart.caption} />
              </p>
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
              When Rain Becomes{" "}
              <span className="risk-title-word">
                Risk
                <img className="risk-title-bolt" src={`${base}assets/hero-lightning-bolt.png`} alt="" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              A scroll through where Malaysia’s 2025 flood losses gathered, how rainfall fits into the pattern, and why place changes the outcome.
            </p>
          </div>
          <div className="grid content-end gap-5">
            <Stat value={636.9} decimals={1} suffix=" million Malaysian ringgit" label="Recorded flood losses across Malaysia in 2025." />
            <Stat value={16} label="States and federal territories followed through the story." />
            <Stat value={1699} label="Rainfall stations mapped after coordinate cleaning." />
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
            <p className="text-2xl font-semibold leading-tight text-ink">
              Flood risk is uneven because Malaysia’s places are uneven.
            </p>
            <p className="text-base leading-7 text-muted">
              The 2025 losses were not spread evenly across the country. A few states and districts carried much of the cost, while per-person loss showed that smaller populations can still face a heavy burden.
            </p>
            <p className="text-base leading-7 text-muted">
              Rainfall is part of the story, but not the whole story. The charts point to exposure, infrastructure, local monitoring, and year-to-year change as the conditions that turn heavy rain into expensive damage.
            </p>
          </div>
          <div className="mt-10 border-t border-ink/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Sources</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6 text-muted">
              <a className="text-rain underline-offset-4 hover:underline" href="https://www.dosm.gov.my/portal-main/release-content/special-report-on-impact-of-floods-in-malaysia2025">
                DOSM flood impact report 2025
              </a>
              <a className="text-rain underline-offset-4 hover:underline" href="https://open.dosm.gov.my/data-catalogue/population_state">
                OpenDOSM population by state
              </a>
              <a className="text-rain underline-offset-4 hover:underline" href="https://archive.data.gov.my/data/en_US/dataset/?organization=Jabatan+Pengairan+dan+Saliran+%28JPS%29&res_format=CSV&tags=hujan+tahunan">
                JPS annual rainfall by state
              </a>
              <a className="text-rain underline-offset-4 hover:underline" href="https://archive.data.gov.my/data/en_US/dataset/stesen-hujan-di-rangkaian-hidrologi-nasional">
                JPS rainfall station network
              </a>
              <a className="text-rain underline-offset-4 hover:underline" href="https://github.com/wmgeolab/geoBoundaries">
                geoBoundaries administrative boundaries
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">FIT2179 Data Visualisation 2, 2026.</p>
            <div className="mt-4 flex items-center justify-between text-sm leading-6 text-muted">
              <p>Ng Jia Khai</p>
              <p>12 May 2026</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
