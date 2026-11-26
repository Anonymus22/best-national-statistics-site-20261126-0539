# NusaStat — Indonesia in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Anonymus22/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Anonymus22/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat is an original national statistics site for **Indonesia**, built for the
make.fun bounty "Make the best national statistics site". It is plain static
files — no build step, no network requests, nothing fetched from another origin —
and it works in a desktop browser and on a phone.

## What it shows

- **Overview** — headline KPI cards (population, GDP growth, GDP per capita,
  unemployment, poverty, life expectancy) with a year selector, plus population
  and GDP-growth charts.
- **Population** — population growth chart and an age-structure donut chart,
  with key facts.
- **Economy** — a metric switcher (GDP growth / inflation / GDP per capita),
  a sector breakdown chart, and key facts.
- **Health & Education** — life-expectancy chart and a table of health and
  education measures.
- **Regions** — a sortable, searchable table of the 16 largest provinces with
  population, share of GDP and unemployment.
- **Methodology & Sources** — every figure's source, year and reading notes.

Every figure is a real published value, labelled with its source and year
(BPS, World Bank, Ministry of Health, 2019–2024). Charts are drawn by the
site's own canvas code; there are no libraries.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The site is hash-routed:
`#/` overview, `#/population`, `#/economy`, `#/health-education`,
`#/regions`, `#/methodology`.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — page shell, header, nav, footer
- `app/style.css` — the whole visual design (teal / amber / cream)
- `app/data.js` — every published figure, with sources
- `app/charts.js` — hand-drawn canvas charts (bar, line, horizontal bar, donut)
- `app/views.js` — hash router and page rendering
- `app/main.js` — boot
- `main.ts` — the hand-in program
- `serve.ts` — tiny static server for local testing
- `screenshots/` — real renders of the site
