import QRCode from "qrcode";

export async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, { width: 320, margin: 1, color: { dark: "#15171A", light: "#F5F6F3" } });
}

export function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  let charset = "";
  if (opts.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (opts.numbers) charset += "0123456789";
  if (opts.symbols) charset += "!@#$%^&*()_-+=?";
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => charset[b % charset.length]).join("");
}

export function generateUuid() {
  return crypto.randomUUID();
}

const LENGTH_TO_M: Record<string, number> = {
  meters: 1, kilometers: 1000, centimeters: 0.01, miles: 1609.34, feet: 0.3048, inches: 0.0254,
};
export function convertLength(value: number, from: string, to: string) {
  const meters = value * LENGTH_TO_M[from];
  return meters / LENGTH_TO_M[to];
}

const WEIGHT_TO_G: Record<string, number> = {
  grams: 1, kilograms: 1000, pounds: 453.592, ounces: 28.3495,
};
export function convertWeight(value: number, from: string, to: string) {
  const grams = value * WEIGHT_TO_G[from];
  return grams / WEIGHT_TO_G[to];
}

export function convertTemperature(value: number, from: "C" | "F" | "K", to: "C" | "F" | "K") {
  let celsius = value;
  if (from === "F") celsius = ((value - 32) * 5) / 9;
  if (from === "K") celsius = value - 273.15;
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function calcPercentage(a: number, b: number) {
  return (a / b) * 100;
}
export function calcPercentageChange(from: number, to: number) {
  return ((to - from) / from) * 100;
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

export function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
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

export function timestampToDate(ts: number) {
  return new Date(ts * 1000);
}
export function dateToTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
