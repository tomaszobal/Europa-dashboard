export type Region = "polnoc" | "zachod" | "poludnie" | "wschod";

export interface Country {
  /** id numeryczne ISO (zgodne z world-atlas) */
  id: string;
  iso2: string;
  name: string;
  capital: string;
  region: Region;
}

export const REGIONS: Record<Region, string> = {
  polnoc: "Północna",
  zachod: "Zachodnia",
  poludnie: "Południowa",
  wschod: "Wschodnia",
};

export const REGION_FULL: Record<Region, string> = {
  polnoc: "Europa Północna",
  zachod: "Europa Zachodnia",
  poludnie: "Europa Południowa",
  wschod: "Europa Wschodnia",
};

export const COUNTRIES: Country[] = [
  { id: "008", iso2: "AL", name: "Albania", capital: "Tirana", region: "poludnie" },
  { id: "020", iso2: "AD", name: "Andora", capital: "Andora la Vella", region: "poludnie" },
  { id: "040", iso2: "AT", name: "Austria", capital: "Wiedeń", region: "zachod" },
  { id: "112", iso2: "BY", name: "Białoruś", capital: "Mińsk", region: "wschod" },
  { id: "056", iso2: "BE", name: "Belgia", capital: "Bruksela", region: "zachod" },
  { id: "070", iso2: "BA", name: "Bośnia i Hercegowina", capital: "Sarajewo", region: "poludnie" },
  { id: "100", iso2: "BG", name: "Bułgaria", capital: "Sofia", region: "poludnie" },
  { id: "191", iso2: "HR", name: "Chorwacja", capital: "Zagrzeb", region: "poludnie" },
  { id: "196", iso2: "CY", name: "Cypr", capital: "Nikozja", region: "poludnie" },
  { id: "203", iso2: "CZ", name: "Czechy", capital: "Praga", region: "wschod" },
  { id: "208", iso2: "DK", name: "Dania", capital: "Kopenhaga", region: "polnoc" },
  { id: "233", iso2: "EE", name: "Estonia", capital: "Tallin", region: "polnoc" },
  { id: "246", iso2: "FI", name: "Finlandia", capital: "Helsinki", region: "polnoc" },
  { id: "250", iso2: "FR", name: "Francja", capital: "Paryż", region: "zachod" },
  { id: "300", iso2: "GR", name: "Grecja", capital: "Ateny", region: "poludnie" },
  { id: "724", iso2: "ES", name: "Hiszpania", capital: "Madryt", region: "poludnie" },
  { id: "528", iso2: "NL", name: "Holandia", capital: "Amsterdam", region: "zachod" },
  { id: "372", iso2: "IE", name: "Irlandia", capital: "Dublin", region: "zachod" },
  { id: "352", iso2: "IS", name: "Islandia", capital: "Reykjavík", region: "polnoc" },
  { id: "438", iso2: "LI", name: "Liechtenstein", capital: "Vaduz", region: "zachod" },
  { id: "440", iso2: "LT", name: "Litwa", capital: "Wilno", region: "polnoc" },
  { id: "442", iso2: "LU", name: "Luksemburg", capital: "Luksemburg", region: "zachod" },
  { id: "428", iso2: "LV", name: "Łotwa", capital: "Ryga", region: "polnoc" },
  { id: "470", iso2: "MT", name: "Malta", capital: "Valletta", region: "poludnie" },
  { id: "498", iso2: "MD", name: "Mołdawia", capital: "Kiszyniów", region: "wschod" },
  { id: "492", iso2: "MC", name: "Monako", capital: "Monako", region: "zachod" },
  { id: "276", iso2: "DE", name: "Niemcy", capital: "Berlin", region: "zachod" },
  { id: "578", iso2: "NO", name: "Norwegia", capital: "Oslo", region: "polnoc" },
  { id: "616", iso2: "PL", name: "Polska", capital: "Warszawa", region: "wschod" },
  { id: "620", iso2: "PT", name: "Portugalia", capital: "Lizbona", region: "poludnie" },
  { id: "643", iso2: "RU", name: "Rosja", capital: "Moskwa", region: "wschod" },
  { id: "642", iso2: "RO", name: "Rumunia", capital: "Bukareszt", region: "wschod" },
  { id: "674", iso2: "SM", name: "San Marino", capital: "San Marino", region: "poludnie" },
  { id: "807", iso2: "MK", name: "Macedonia Północna", capital: "Skopje", region: "poludnie" },
  { id: "703", iso2: "SK", name: "Słowacja", capital: "Bratysława", region: "wschod" },
  { id: "705", iso2: "SI", name: "Słowenia", capital: "Lublana", region: "poludnie" },
  { id: "756", iso2: "CH", name: "Szwajcaria", capital: "Berno", region: "zachod" },
  { id: "752", iso2: "SE", name: "Szwecja", capital: "Sztokholm", region: "polnoc" },
  { id: "792", iso2: "TR", name: "Turcja", capital: "Ankara", region: "poludnie" },
  { id: "804", iso2: "UA", name: "Ukraina", capital: "Kijów", region: "wschod" },
  { id: "336", iso2: "VA", name: "Watykan", capital: "Watykan", region: "poludnie" },
  { id: "826", iso2: "GB", name: "Wielka Brytania", capital: "Londyn", region: "zachod" },
  { id: "348", iso2: "HU", name: "Węgry", capital: "Budapeszt", region: "wschod" },
  { id: "380", iso2: "IT", name: "Włochy", capital: "Rzym", region: "poludnie" },
  { id: "688", iso2: "RS", name: "Serbia", capital: "Belgrad", region: "poludnie" },
  { id: "499", iso2: "ME", name: "Czarnogóra", capital: "Podgorica", region: "poludnie" },
  { id: "-99", iso2: "XK", name: "Kosowo", capital: "Prisztina", region: "poludnie" },
];

export const byId: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c])
);

export const INTERACTIVE_IDS = new Set(COUNTRIES.map((c) => c.id));

/** Państwa zbyt małe, by uczciwie pytać o nie w quizie "na mapie" (mikropaństwa) */
export const MAP_QUIZ_EXCLUDE = new Set(["336", "492", "674", "438", "020", "470"]);

export function flag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const REGION_ORDER: Region[] = ["polnoc", "zachod", "poludnie", "wschod"];
