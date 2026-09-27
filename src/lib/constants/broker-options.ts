// lib/constants/broker-options.ts

export const CA_COUNTIES = [
  "Alameda County", "Alpine County", "Amador County", "Butte County", "Calaveras County",
  "Colusa County", "Contra Costa County", "Del Norte County", "El Dorado County", "Fresno County",
  "Glenn County", "Humboldt County", "Imperial County", "Inyo County", "Kern County", "Kings County",
  "Lake County", "Lassen County", "Los Angeles County", "Madera County", "Marin County",
  "Mariposa County", "Mendocino County", "Merced County", "Modoc County", "Mono County",
  "Monterey County", "Napa County", "Nevada County", "Orange County", "Placer County",
  "Plumas County", "Riverside County", "Sacramento County", "San Benito County",
  "San Bernardino County", "San Diego County", "San Francisco County", "San Joaquin County",
  "San Luis Obispo County", "San Mateo County", "Santa Barbara County", "Santa Clara County",
  "Santa Cruz County", "Shasta County", "Sierra County", "Siskiyou County", "Solano County",
  "Sonoma County", "Stanislaus County", "Sutter County", "Tehama County", "Trinity County",
  "Tulare County", "Tuolumne County", "Ventura County", "Yolo County", "Yuba County",
] as const;

export const BROKER_LANGUAGES = [
  "English", "Spanish", "Mandarin", "Cantonese", "Korean", "Japanese", "Vietnamese",
  "Tagalog", "Farsi", "Arabic", "Russian", "Ukrainian", "Armenian", "Portuguese",
  "French", "German", "Hindi", "Punjabi", "Hebrew", "Uzbek",
] as const;

// Credential badge explainers (hover/tooltip text)
export const CREDENTIAL_INFO: Record<string, string> = {
  CBI: "Certified Business Intermediary — awarded by the International Business Brokers Association (IBBA).",
  CBB: "Certified Business Broker — a California Association of Business Brokers (CABB) designation for brokers with a strong track record and active CABB membership.",
  CABB: "Member of the California Association of Business Brokers.",
  "M&AMI": "Merger & Acquisition Master Intermediary — an M&A Source certification for advisors meeting strict educational and deal-experience requirements.",
};

export function slugify(name: string, brokerageName?: string) {
  const base = brokerageName ? `${name}-${brokerageName}` : name;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}