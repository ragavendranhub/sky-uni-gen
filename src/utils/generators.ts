export type GeneratorType = "random" | "uuid" | "skySerials";
export type SkySerialType =
  | "IMEI"
  | "NDS"
  | "SKY9"
  | "SKY14"
  | "SKY17"
  | "SAGEM10"
  | "ICCID"
  | "EID"
  | "DEVICE_APPLE"
  | "MAC12"
  | "MAC16"
  | "MAC12OR16";

const PATTERNS = {
  DEVICE_APPLE: /^[A-Za-z0-9]{10,12}$/,
  EID: /^[0-9]{32}$/,
  ICCID: /^(89)(\d{17,18})$/,
  IMEI: /^[0-9]{15}$/,
  MAC12: /^[0-9A-Fa-f]{12}$/,
  MAC12OR16: /^[0-9A-Fa-f]{12,16}$/,
  MAC16: /^[0-9A-Fa-f]{16}$/,
  NDS: /^[A-F0-9]{16}$/,
  SAGEM10: /^[A-Z]{2}[A-F0-9]{8}$/,
  SKY14: /^([A-Z0-9]{4})([0-9]{2})([0-C]{1})([0-E]{1})([0-9]{6})$/,
  SKY17: /^[A-Z]{2}[A-Z0-9]{2}[A-Z]{2}[A-Z0-9][0-9]{2}([0-4][0-9]|5[0-3])[A-F0-9]{5}[A-Z0-9]$/,
  SKY9: /^[D]([0-9]{8})$/,
};

const LENGTHS = {
  IMEI: 15,
  NDS: 16,
  SKY9: 9,
  SKY14: 14,
  SKY17: 17,
  SAGEM10: 10,
  ICCID: 20,
  EID: 32,
  DEVICE_APPLE: 12,
  MAC12: 12,
  MAC16: 16,
  MAC12OR16: 16,
};

const CODE_POINTS: { [key: string]: number } = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17,
  'I': 18, 'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 24, 'P': 25,
  'Q': 26, 'R': 27, 'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33,
  'Y': 34, 'Z': 35
};

const REVERSE_CODE_POINTS: { [key: number]: string } = Object.entries(CODE_POINTS)
  .reduce((acc, [char, value]) => ({ ...acc, [value]: char }), {});

const calculateLuhnChecksum = (value: string): string => {
  // Map characters to code points
  const codePoints = value.split('').map(char => CODE_POINTS[char] || 0);
  
  // Calculate sum according to Luhn algorithm with custom rules
  let sum = 0;
  for (let i = 0; i < codePoints.length; i++) {
    let num = codePoints[i];
    // Multiply by 2 if in even position
    if (i % 2 === 0) {
      num *= 2;
    }
    // Apply the rule for values > 36
    if (num > 36) {
      num = 1 + (num - 36);
    }
    sum += num;
  }

  // Calculate final checksum
  let checksumValue = sum % 36;
  checksumValue = 36 - checksumValue;
  if (checksumValue === 36) {
    checksumValue = 0;
  }

  // Convert back to character
  return REVERSE_CODE_POINTS[checksumValue];
};

const generateSky17Value = (deviceType?: "Glass" | "Puck") => {
  const prefix = deviceType === "Glass" ? "LT02SK7" : deviceType === "Puck" ? "IP02SK7" : "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const remainingLength = 16 - prefix.length; // We reserve one position for checksum
  let result = prefix;

  // Generate the main part of the serial
  for (let i = 0; i < remainingLength; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  // Calculate and append the Luhn checksum
  const checksum = calculateLuhnChecksum(result);
  result += checksum;

  return result;
};

const generateRandomChar = (type: "alpha" | "numeric" | "special") => {
  const chars = {
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    numeric: "0123456789",
    special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };
  return chars[type][Math.floor(Math.random() * chars[type].length)];
};

export const generateRandom = (
  length: number,
  options: { alpha: boolean; numeric: boolean; special: boolean }
) => {
  const types: ("alpha" | "numeric" | "special")[] = [];
  if (options.alpha) types.push("alpha");
  if (options.numeric) types.push("numeric");
  if (options.special) types.push("special");

  if (types.length === 0) return "";

  return Array.from({ length }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    return generateRandomChar(type);
  }).join("");
};

export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateSkySerial = (
  type: SkySerialType,
  prefix: string = "",
  deviceType?: "Glass" | "Puck"
) => {
  if (type === "SKY17" && deviceType) {
    return generateSky17Value(deviceType);
  }

  const pattern = PATTERNS[type];
  const length = LENGTHS[type];

  if (!pattern || !length) return "";

  let result = prefix;
  const remainingLength = length - prefix.length;

  if (remainingLength <= 0) return "";

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const numericChars = "0123456789";
  const hexChars = "0123456789ABCDEF";

  switch (type) {
    case "IMEI":
    case "EID":
      result = result.padEnd(length, "0");
      break;
    case "ICCID":
      result = "89" + result;
      result = result.padEnd(length, "0");
      break;
    case "SKY9":
      result = "D" + result;
      result = result.padEnd(length, "0");
      break;
    case "SKY14":
      // Format: [A-Z0-9]{4}[0-9]{2}[0-C][0-E][0-9]{6}
      if (!result) {
        result = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        result += Array.from({ length: 2 }, () => numericChars[Math.floor(Math.random() * numericChars.length)]).join("");
        result += String.fromCharCode(65 + Math.floor(Math.random() * 3)); // 0-C (A-C)
        result += String.fromCharCode(65 + Math.floor(Math.random() * 5)); // 0-E (A-E)
        result += Array.from({ length: 6 }, () => numericChars[Math.floor(Math.random() * numericChars.length)]).join("");
      }
      break;
    case "MAC12":
    case "MAC16":
    case "MAC12OR16":
    case "NDS":
      result = result.padEnd(length, "0");
      break;
    default:
      result = result.padEnd(length, "A");
  }

  // Validate against pattern
  if (!pattern.test(result)) {
    return generateSkySerial(type, prefix);
  }

  return result;
};
