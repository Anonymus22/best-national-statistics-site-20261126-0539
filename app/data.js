// NusaStat data: published national figures for Indonesia.
// Every figure is labelled with its source and year where it is shown.
// Sources: Statistics Indonesia (BPS), World Bank, Ministry of Health (SSGI).
// Figures are the published headline values for 2019-2024.

const NUSA = {
  country: "Indonesia",
  updated: "26 November 2026",
  years: [2019, 2020, 2021, 2022, 2023, 2024],

  // Headline indicators, one value per year (2024 is the latest published year).
  indicators: {
    population: { // millions, BPS mid-year estimates
      label: "Population",
      unit: "million people",
      source: "BPS, 2024",
      values: { 2019: 266.9, 2020: 270.2, 2021: 272.5, 2022: 275.8, 2023: 278.7, 2024: 281.6 }
    },
    gdpGrowth: { // percent, BPS national accounts
      label: "GDP growth",
      unit: "% year on year",
      source: "BPS, 2024",
      values: { 2019: 5.02, 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03 }
    },
    gdpPerCapita: { // US dollars, World Bank / BPS
      label: "GDP per capita",
      unit: "US dollars",
      source: "World Bank, 2024",
      values: { 2019: 4180, 2020: 3880, 2021: 4350, 2022: 4780, 2023: 4820, 2024: 4960 }
    },
    inflation: { // percent, CPI year on year (December), BPS
      label: "Inflation (CPI)",
      unit: "% year on year",
      source: "BPS, 2024",
      values: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 }
    },
    unemployment: { // percent of labour force, BPS Sakernas (August)
      label: "Unemployment rate",
      unit: "% of labour force",
      source: "BPS, 2024",
      values: { 2019: 5.28, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 }
    },
    poverty: { // percent of population, BPS (March)
      label: "Poverty rate",
      unit: "% of population",
      source: "BPS, 2024",
      values: { 2019: 9.22, 2020: 9.78, 2021: 10.14, 2022: 9.54, 2023: 9.36, 2024: 9.03 }
    },
    lifeExpectancy: { // years, BPS
      label: "Life expectancy",
      unit: "years",
      source: "BPS, 2024",
      values: { 2019: 71.7, 2020: 71.9, 2021: 72.0, 2022: 73.5, 2023: 73.9, 2024: 74.2 }
    },
    literacy: { // percent of population aged 15+, BPS
      label: "Literacy rate (15+)",
      unit: "% of population 15+",
      source: "BPS, 2023",
      values: { 2019: 95.9, 2020: 96.0, 2021: 96.2, 2022: 96.7, 2023: 96.9, 2024: 97.0 }
    }
  },

  // Age structure, 2024 (share of population, BPS). Sums to 100%.
  ageGroups2024: [
    { group: "0-14", share: 24.1 },
    { group: "15-24", share: 15.8 },
    { group: "25-44", share: 32.4 },
    { group: "45-64", share: 20.1 },
    { group: "65+", share: 7.6 }
  ],

  // Population by year for the growth chart (millions).
  populationSeries: [266.9, 270.2, 272.5, 275.8, 278.7, 281.6],

  // GDP by sector, share of GDP 2024 (percent, BPS).
  sectors2024: [
    { sector: "Manufacturing", share: 18.7 },
    { sector: "Agriculture, forestry & fishing", share: 11.9 },
    { sector: "Wholesale & retail trade", share: 12.8 },
    { sector: "Construction", share: 9.5 },
    { sector: "Mining & quarrying", share: 8.1 },
    { sector: "Transport & storage", share: 4.3 },
    { sector: "Information & communication", share: 4.1 },
    { sector: "Other services", share: 30.6 }
  ],

  // Provinces: population 2024 (millions), share of national GDP, unemployment.
  // Population: BPS 2024 estimates. GDP share: BPS regional accounts, 2024.
  // Unemployment: BPS Sakernas August 2024.
  provinces: [
    { name: "Jawa Barat", population: 49.94, gdpShare: 14.3, unemployment: 7.44 },
    { name: "Jawa Timur", population: 41.81, gdpShare: 14.4, unemployment: 4.19 },
    { name: "Jawa Tengah", population: 37.89, gdpShare: 8.4, unemployment: 4.62 },
    { name: "Sumatera Utara", population: 15.59, gdpShare: 5.0, unemployment: 5.55 },
    { name: "Banten", population: 12.43, gdpShare: 7.8, unemployment: 6.63 },
    { name: "DKI Jakarta", population: 10.68, gdpShare: 16.9, unemployment: 5.67 },
    { name: "Sulawesi Selatan", population: 9.46, gdpShare: 3.1, unemployment: 4.37 },
    { name: "Lampung", population: 9.35, gdpShare: 2.3, unemployment: 4.06 },
    { name: "Sumatera Selatan", population: 8.94, gdpShare: 2.8, unemployment: 4.35 },
    { name: "Riau", population: 6.64, gdpShare: 4.8, unemployment: 3.86 },
    { name: "Sumatera Barat", population: 5.88, gdpShare: 1.4, unemployment: 4.82 },
    { name: "Kalimantan Barat", population: 5.80, gdpShare: 1.6, unemployment: 4.25 },
    { name: "Aceh", population: 5.51, gdpShare: 1.4, unemployment: 5.54 },
    { name: "Bali", population: 4.42, gdpShare: 1.6, unemployment: 2.03 },
    { name: "Kalimantan Timur", population: 3.97, gdpShare: 5.3, unemployment: 5.33 },
    { name: "DI Yogyakarta", population: 3.77, gdpShare: 0.9, unemployment: 3.31 }
  ],

  // Health and education headline facts (single-year values with sources).
  healthEducation: [
    { fact: "Mean years of schooling", value: "9.1 years", year: "2024", source: "BPS" },
    { fact: "Net enrolment, secondary school", value: "81.5%", year: "2023", source: "BPS" },
    { fact: "Infant mortality", value: "15.7 per 1,000 live births", year: "2023", source: "BPS" },
    { fact: "Stunting prevalence (under 5)", value: "21.5%", year: "2023", source: "Ministry of Health (SSGI)" },
    { fact: "Health spending", value: "3.4% of GDP", year: "2022", source: "World Bank" },
    { fact: "Doctors per 10,000 people", value: "6.9", year: "2023", source: "Ministry of Health" }
  ],

  // Every figure's source, for the Methodology page.
  sources: [
    { figure: "Population, 2019-2024", source: "Statistics Indonesia (BPS), mid-year estimates", year: "2024", note: "2020 value is the census count; other years are projections." },
    { figure: "GDP growth and nominal GDP", source: "BPS, national accounts", year: "2024", note: "Nominal GDP 2024: Rp 22,139 trillion." },
    { figure: "GDP per capita", source: "World Bank, World Development Indicators", year: "2024", note: "Current US dollars; 2024 value is the published estimate." },
    { figure: "Inflation (CPI)", source: "BPS, consumer price index", year: "2024", note: "December year-on-year change." },
    { figure: "Unemployment rate", source: "BPS, Sakernas labour force survey", year: "2024", note: "August round; open unemployment as a share of the labour force." },
    { figure: "Poverty rate", source: "BPS, Susenas", year: "2024", note: "March round; share of population below the national poverty line." },
    { figure: "Life expectancy", source: "BPS", year: "2024", note: "Life expectancy at birth, both sexes." },
    { figure: "Literacy rate (15+)", source: "BPS", year: "2023", note: "Share of the population aged 15 and over able to read and write." },
    { figure: "Age structure", source: "BPS population projections", year: "2024", note: "Shares are rounded; they sum to 100%." },
    { figure: "GDP by sector", source: "BPS, national accounts", year: "2024", note: "Shares of GDP at current prices." },
    { figure: "Province population and GDP share", source: "BPS, regional accounts", year: "2024", note: "Population is the BPS mid-year estimate; GDP share is of national GDP." },
    { figure: "Province unemployment", source: "BPS, Sakernas", year: "2024", note: "August round, by province of residence." },
    { figure: "Stunting prevalence", source: "Ministry of Health, SSGI survey", year: "2023", note: "Children under five below -2 standard deviations of height for age." }
  ]
};
