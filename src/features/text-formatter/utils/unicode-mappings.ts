type CharMap = Record<string, string>;

interface TransformOptions {
  upperStart: number;
  lowerStart: number;
  digitStart?: number;
  exceptions?: CharMap;
}

const createTransform = ({
  upperStart,
  lowerStart,
  digitStart,
  exceptions = {},
}: TransformOptions) => {
  return (text: string): string => {
    return Array.from(text)
      .map((char) => {
        if (exceptions[char]) return exceptions[char];

        const code = char.charCodeAt(0);

        // Uppercase A-Z (65-90)
        if (code >= 65 && code <= 90) {
          return String.fromCodePoint(upperStart + (code - 65));
        }

        // Lowercase a-z (97-122)
        if (code >= 97 && code <= 122) {
          return String.fromCodePoint(lowerStart + (code - 97));
        }

        // Digits 0-9 (48-57)
        if (digitStart !== undefined && code >= 48 && code <= 57) {
          return String.fromCodePoint(digitStart + (code - 48));
        }

        return char;
      })
      .join("");
  };
};

// Bold: Mathematical Bold (U+1D400)
export const toBold = createTransform({
  upperStart: 0x1d400,
  lowerStart: 0x1d41a,
  digitStart: 0x1d7ce,
});

// Italic: Mathematical Italic (U+1D434)
// Note: 'h' has a special exception
export const toItalic = createTransform({
  upperStart: 0x1d434,
  lowerStart: 0x1d44e,
  exceptions: {
    h: "\u210E", // Planck constant
  },
});

// Bold Italic: Mathematical Bold Italic (U+1D468)
export const toBoldItalic = createTransform({
  upperStart: 0x1d468,
  lowerStart: 0x1d482,
});

// Script/Cursive: Mathematical Script (U+1D49C)
export const toScript = createTransform({
  upperStart: 0x1d49c,
  lowerStart: 0x1d4b6,
  exceptions: {
    B: "\u212C", // Script B
    E: "\u2130", // Script E
    F: "\u2131", // Script F
    H: "\u210B", // Script H
    I: "\u2110", // Script I
    L: "\u2112", // Script L
    M: "\u2133", // Script M
    R: "\u211B", // Script R
    e: "\u212F", // Script e
    g: "\u210A", // Script g
    o: "\u2134", // Script o
  },
});

// Double-struck/Blackboard Bold (U+1D538)
export const toDoubleStruck = createTransform({
  upperStart: 0x1d538,
  lowerStart: 0x1d552,
  digitStart: 0x1d7d8,
  exceptions: {
    C: "\u2102", // Complex numbers
    H: "\u210D", // Quaternions
    N: "\u2115", // Natural numbers
    P: "\u2119", // Primes
    Q: "\u211A", // Rationals
    R: "\u211D", // Reals
    Z: "\u2124", // Integers
  },
});

// Monospace: Mathematical Monospace (U+1D670)
export const toMonospace = createTransform({
  upperStart: 0x1d670,
  lowerStart: 0x1d68a,
  digitStart: 0x1d7f6,
});

// Fraktur (U+1D504)
export const toFraktur = createTransform({
  upperStart: 0x1d504,
  lowerStart: 0x1d51e,
  exceptions: {
    C: "\u212D", // Fraktur C
    H: "\u210C", // Fraktur H
    I: "\u2111", // Fraktur I
    R: "\u211C", // Fraktur R
    Z: "\u2128", // Fraktur Z
  },
});

// Circled letters (U+24B6 for uppercase, U+24D0 for lowercase)
export const toCircled = createTransform({
  upperStart: 0x24b6,
  lowerStart: 0x24d0,
  digitStart: 0x2460, // Circled digits start at 1, so 0 needs exception
  exceptions: {
    "0": "\u24EA", // Circled 0
  },
});

// Squared letters (U+1F130, uppercase only)
export const toSquared = (text: string): string => {
  return Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1f130 + (code - 65));
      }
      // Convert lowercase to uppercase equivalent
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1f130 + (code - 97));
      }
      return char;
    })
    .join("");
};

// Fullwidth (U+FF21 for uppercase, U+FF41 for lowercase, U+FF10 for digits)
export const toFullwidth = createTransform({
  upperStart: 0xff21,
  lowerStart: 0xff41,
  digitStart: 0xff10,
});

// Small Caps (scattered Unicode points, explicit mapping)
const smallCapsMap: CharMap = {
  a: "\u1D00",
  b: "\u0299",
  c: "\u1D04",
  d: "\u1D05",
  e: "\u1D07",
  f: "\uA730",
  g: "\u0262",
  h: "\u029C",
  i: "\u026A",
  j: "\u1D0A",
  k: "\u1D0B",
  l: "\u029F",
  m: "\u1D0D",
  n: "\u0274",
  o: "\u1D0F",
  p: "\u1D18",
  q: "\u01EB", // Using ogonek q as approximation
  r: "\u0280",
  s: "\u1D22", // Using small cap S
  t: "\u1D1B",
  u: "\u1D1C",
  v: "\u1D20",
  w: "\u1D21",
  x: "\u1D431", // Using mathematical small x
  y: "\u028F",
  z: "\u1D22",
};

export const toSmallCaps = (text: string): string => {
  return Array.from(text)
    .map((char) => {
      const lower = char.toLowerCase();
      if (smallCapsMap[lower]) {
        return smallCapsMap[lower];
      }
      return char;
    })
    .join("");
};

// Zalgo text combining marks
const zalgoAbove = [
  0x030d, 0x030e, 0x0304, 0x0305, 0x033f, 0x0311, 0x0306, 0x0310, 0x0352,
  0x0357, 0x0351, 0x0307, 0x0308, 0x030a, 0x0342, 0x0343, 0x0344, 0x034a,
  0x034b, 0x034c, 0x0303, 0x0302, 0x030c, 0x0350, 0x0300, 0x0301, 0x030b,
  0x030f, 0x0312, 0x0313, 0x0314, 0x033d, 0x0309, 0x0363, 0x0364, 0x0365,
  0x0366, 0x0367, 0x0368, 0x0369, 0x036a, 0x036b, 0x036c, 0x036d, 0x036e,
  0x036f, 0x033e, 0x035b,
];

const zalgoBelow = [
  0x0316, 0x0317, 0x0318, 0x0319, 0x031c, 0x031d, 0x031e, 0x031f, 0x0320,
  0x0324, 0x0325, 0x0326, 0x0329, 0x032a, 0x032b, 0x032c, 0x032d, 0x032e,
  0x032f, 0x0330, 0x0331, 0x0332, 0x0333, 0x0339, 0x033a, 0x033b, 0x033c,
  0x0345, 0x0347, 0x0348, 0x0349, 0x034d, 0x034e, 0x0353, 0x0354, 0x0355,
  0x0356, 0x0359, 0x035a,
];

const zalgoMiddle = [
  0x0315, 0x031b, 0x0340, 0x0341, 0x0358, 0x0321, 0x0322, 0x0327, 0x0328,
  0x0334, 0x0335, 0x0336, 0x034f,
];

// Seeded random for consistent output
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const toZalgo = (text: string): string => {
  return Array.from(text)
    .map((char, i) => {
      // Skip spaces
      if (char === " ") return char;

      let result = char;
      const seed = char.charCodeAt(0) + i;

      // Add 1-3 marks above
      const aboveCount = Math.floor(seededRandom(seed) * 3) + 1;
      for (let j = 0; j < aboveCount; j++) {
        const idx = Math.floor(
          seededRandom(seed + j + 100) * zalgoAbove.length,
        );
        result += String.fromCodePoint(zalgoAbove[idx]);
      }

      // Add 1-2 marks in middle
      const middleCount = Math.floor(seededRandom(seed + 50) * 2) + 1;
      for (let j = 0; j < middleCount; j++) {
        const idx = Math.floor(
          seededRandom(seed + j + 200) * zalgoMiddle.length,
        );
        result += String.fromCodePoint(zalgoMiddle[idx]);
      }

      // Add 1-3 marks below
      const belowCount = Math.floor(seededRandom(seed + 75) * 3) + 1;
      for (let j = 0; j < belowCount; j++) {
        const idx = Math.floor(
          seededRandom(seed + j + 300) * zalgoBelow.length,
        );
        result += String.fromCodePoint(zalgoBelow[idx]);
      }

      return result;
    })
    .join("");
};

export interface TextStyle {
  name: string;
  transform: (text: string) => string;
  className?: string;
}

export const TEXT_STYLES: TextStyle[] = [
  { name: "Bold", transform: toBold, className: "rounded-tl" },
  { name: "Italic", transform: toItalic, className: "rounded-tr" },
  { name: "Bold Italic", transform: toBoldItalic },
  { name: "Script", transform: toScript },
  { name: "Double-struck", transform: toDoubleStruck },
  { name: "Monospace", transform: toMonospace },
  { name: "Fraktur", transform: toFraktur },
  { name: "Circled", transform: toCircled },
  { name: "Squared", transform: toSquared },
  { name: "Fullwidth", transform: toFullwidth },
  { name: "Small Caps", transform: toSmallCaps, className: "rounded-bl" },
  { name: "Zalgo", transform: toZalgo, className: "rounded-br" },
];
