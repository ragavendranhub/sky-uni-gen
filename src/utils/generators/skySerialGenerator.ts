import { PATTERNS, LENGTHS } from '../constants/serialPatterns';
import { calculateLuhnChecksum } from '../luhn/calculateChecksum';

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

export const generateSkySerial = (
  type: keyof typeof PATTERNS,
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