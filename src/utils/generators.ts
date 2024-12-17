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

const generateSky17Value = (deviceType?: "Glass" | "Puck") => {
  const prefix = deviceType === "Glass" ? "LT02SK7" : deviceType === "Puck" ? "IP02SK7" : "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const remainingLength = 17 - prefix.length;
  let result = prefix;

  for (let i = 0; i < remainingLength; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
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