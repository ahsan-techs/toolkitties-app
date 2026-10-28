import QRCode from "qrcode";

export type QrOptions = {
  size?: number;
  dark?: string;
  light?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
};

export async function generateQrDataUrl(text: string, opts: QrOptions = {}) {
  return QRCode.toDataURL(text, {
    width: opts.size ?? 320,
    margin: 1,
    errorCorrectionLevel: opts.errorCorrectionLevel ?? "M",
    color: { dark: opts.dark ?? "#15171A", light: opts.light ?? "#F5F6F3" },
  });
}

// ---------------------------------------------------------------- Passwords
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_-+=?";
const AMBIGUOUS = /[O0Il1|]/g;

// Unbiased random number from 0 up to (but not including) max, using the browser's secure generator.
function randomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

export function generatePassword(
  length: number,
  opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; avoidAmbiguous?: boolean }
) {
  if (!Number.isFinite(length) || length < 4 || length > 128) {
    throw new Error("Choose a password length between 4 and 128.");
  }
  const len = Math.floor(length);
  const clean = (set: string) => (opts.avoidAmbiguous ? set.replace(AMBIGUOUS, "") : set);
  let sets: string[] = [];
  if (opts.upper) sets.push(clean(UPPER));
  if (opts.lower) sets.push(clean(LOWER));
  if (opts.numbers) sets.push(clean(DIGITS));
  if (opts.symbols) sets.push(clean(SYMBOLS));
  if (sets.length === 0) sets = [clean(LOWER)];

  const all = sets.join("");
  // Start with one character from every chosen group, so each choice is really present.
  const chars = sets.map((set) => set[randomInt(set.length)]);
  while (chars.length < len) chars.push(all[randomInt(all.length)]);
  // Shuffle so the guaranteed characters are not always at the front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function generateUuid() {
  return crypto.randomUUID();
}

// Generates `count` (1–100) v4 UUIDs, one per line.
export function generateUuids(count: number): string {
  const n = Math.min(100, Math.max(1, Math.floor(count) || 1));
  return Array.from({ length: n }, () => crypto.randomUUID()).join("\n");
}

// ---------------------------------------------------------------- Unit converter
export type UnitKind = "length" | "weight" | "temperature" | "volume" | "speed";

type UnitDef = { id: string; label: string; factor: number };

// "factor" converts one of the unit into the base unit of its kind (metres, grams, litres, metres per second).
export const UNIT_CATALOG: Record<UnitKind, { label: string; units: UnitDef[] }> = {
  length: {
    label: "Length",
    units: [
      { id: "meters", label: "Meters (m)", factor: 1 },
      { id: "kilometers", label: "Kilometers (km)", factor: 1000 },
      { id: "centimeters", label: "Centimeters (cm)", factor: 0.01 },
      { id: "millimeters", label: "Millimeters (mm)", factor: 0.001 },
      { id: "miles", label: "Miles (mi)", factor: 1609.344 },
      { id: "yards", label: "Yards (yd)", factor: 0.9144 },
      { id: "feet", label: "Feet (ft)", factor: 0.3048 },
      { id: "inches", label: "Inches (in)", factor: 0.0254 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { id: "grams", label: "Grams (g)", factor: 1 },
      { id: "kilograms", label: "Kilograms (kg)", factor: 1000 },
      { id: "milligrams", label: "Milligrams (mg)", factor: 0.001 },
      { id: "tonnes", label: "Tonnes (t)", factor: 1_000_000 },
      { id: "pounds", label: "Pounds (lb)", factor: 453.59237 },
      { id: "ounces", label: "Ounces (oz)", factor: 28.349523125 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "C", label: "Celsius (°C)", factor: 1 },
      { id: "F", label: "Fahrenheit (°F)", factor: 1 },
      { id: "K", label: "Kelvin (K)", factor: 1 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "liters", label: "Liters (L)", factor: 1 },
      { id: "milliliters", label: "Milliliters (mL)", factor: 0.001 },
      { id: "gallons", label: "US gallons", factor: 3.785411784 },
      { id: "quarts", label: "US quarts", factor: 0.946352946 },
      { id: "cups", label: "US cups", factor: 0.2365882365 },
      { id: "floz", label: "US fluid ounces", factor: 0.0295735295625 },
      { id: "tablespoons", label: "US tablespoons", factor: 0.01478676478125 },
      { id: "teaspoons", label: "US teaspoons", factor: 0.00492892159375 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "mps", label: "Meters per second (m/s)", factor: 1 },
      { id: "kph", label: "Kilometers per hour (km/h)", factor: 1 / 3.6 },
      { id: "mph", label: "Miles per hour (mph)", factor: 0.44704 },
      { id: "knots", label: "Knots (kn)", factor: 1852 / 3600 },
    ],
  },
};

export function convertTemperature(value: number, from: string, to: string) {
  let celsius = value;
  if (from === "F") celsius = ((value - 32) * 5) / 9;
  else if (from === "K") celsius = value - 273.15;
  else if (from !== "C") throw new Error("Unknown temperature unit.");
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  if (to === "K") return celsius + 273.15;
  throw new Error("Unknown temperature unit.");
}

export function convertUnit(kind: UnitKind, value: number, from: string, to: string) {
  if (kind === "temperature") return convertTemperature(value, from, to);
  const units = UNIT_CATALOG[kind].units;
  const a = units.find((u) => u.id === from);
  const b = units.find((u) => u.id === to);
  if (!a || !b) throw new Error("Pick a unit in both lists.");
  return (value * a.factor) / b.factor;
}

export function convertLength(value: number, from: string, to: string) {
  return convertUnit("length", value, from, to);
}
export function convertWeight(value: number, from: string, to: string) {
  return convertUnit("weight", value, from, to);
}

// ---------------------------------------------------------------- Percentages
export function calcPercentage(a: number, b: number) {
  return (a / b) * 100;
}
export function calcPercentageChange(from: number, to: number) {
  return ((to - from) / from) * 100;
}

// ---------------------------------------------------------------- Age
// Reads "YYYY-MM-DD" as a calendar date in the visitor's own time zone (new Date("2000-01-01")
// would be read as UTC and could be off by a day).
export function parseLocalDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  if (d.getFullYear() !== +m[1] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return null;
  return d;
}

export function calcAge(birthDate: Date, onDate: Date = new Date()) {
  let years = onDate.getFullYear() - birthDate.getFullYear();
  let months = onDate.getMonth() - birthDate.getMonth();
  let days = onDate.getDate() - birthDate.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(onDate.getFullYear(), onDate.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

// ---------------------------------------------------------------- Colour
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(clean)) clean = clean.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// ---------------------------------------------------------------- Timestamps
// Unix time is normally in seconds. Values with 12 or more digits are treated as milliseconds.
export function timestampToDate(ts: number) {
  return new Date(Math.abs(ts) >= 1e11 ? ts : ts * 1000);
}
export function dateToTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
