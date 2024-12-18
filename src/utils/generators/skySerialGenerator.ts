import { PATTERNS, LENGTHS } from '../constants/serialPatterns';
import { calculateLuhnChecksum } from '../luhn/calculateChecksum';
import { SkySerialType } from './types';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const NUMERIC_CHARS = '0123456789';
const ALPHA_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const HEX_CHARS = '0123456789ABCDEF';

const generateRandomChar = (charset: string) => {
  return charset[Math.floor(Math.random() * charset.length)];
};

const generatePatternBasedValue = (pattern: RegExp, length: number): string => {
  let result = '';
  
  if (pattern.toString().includes('[0-9]')) {
    result = Array(length).fill('0').join('');
  } else if (pattern.toString().includes('[A-Z]')) {
    result = Array(length).fill('A').join('');
  } else if (pattern.toString().includes('[A-F]')) {
    result = Array(length).fill('A').join('');
  } else {
    result = Array(length).fill('0').join('');
  }
  
  return result;
};

export const generateSkySerial = (
  type: SkySerialType,
  prefix: string = "",
  deviceType?: "Glass" | "Puck"
): string => {
  if (type === "SKY17" && deviceType) {
    return generateSky17Value(deviceType);
  }

  const pattern = PATTERNS[type];
  const length = LENGTHS[type];

  if (!pattern || !length) return "";

  let result = prefix;
  const remainingLength = length - prefix.length;

  if (remainingLength <= 0) return "";

  switch (type) {
    case "SKY14":
      if (!result) {
        result = Array.from({ length: 4 }, () => ALPHANUM_CHARS[Math.floor(Math.random() * ALPHANUM_CHARS.length)]).join("");
        result += Array.from({ length: 2 }, () => NUMERIC_CHARS[Math.floor(Math.random() * NUMERIC_CHARS.length)]).join("");
        result += String.fromCharCode(65 + Math.floor(Math.random() * 3)); // 0-C (A-C)
        result += String.fromCharCode(65 + Math.floor(Math.random() * 5)); // 0-E (A-E)
        result += Array.from({ length: 6 }, () => NUMERIC_CHARS[Math.floor(Math.random() * NUMERIC_CHARS.length)]).join("");
      }
      break;
    case "ICCID":
      result = "89" + result;
      result = result.padEnd(length, "0");
      break;
    case "SKY9":
      result = "D" + result;
      result = result.padEnd(length, "0");
      break;
    case "SAGEM10":
      result = Array.from({ length: 2 }, () => generateRandomChar(ALPHA_CHARS)).join('') +
               Array.from({ length: 8 }, () => generateRandomChar(HEX_CHARS)).join('');
      break;
    case "MAC12":
    case "MAC16":
    case "MAC12OR16":
      result = Array.from({ length: remainingLength }, () => generateRandomChar(HEX_CHARS)).join('');
      break;
    case "NDS":
      result = Array.from({ length: remainingLength }, () => generateRandomChar(HEX_CHARS)).join('');
      break;
    case "DEVICE_APPLE":
      result = Array.from({ length: remainingLength }, () => generateRandomChar(ALPHANUM_CHARS)).join('');
      break;
    case "EID":
      result = Array.from({ length: remainingLength }, () => generateRandomChar(NUMERIC_CHARS)).join('');
      break;
    case "IMEI":
      result = Array.from({ length: remainingLength }, () => generateRandomChar(NUMERIC_CHARS)).join('');
      break;
    default:
      result = result + generatePatternBasedValue(pattern, remainingLength);
  }

  return result;
};

const generateSky17Value = (deviceType: "Glass" | "Puck"): string => {
  const prefix = deviceType === "Glass" ? "LT02SK7" : "IP02SK7";
  const remainingLength = 16 - prefix.length; // We reserve one position for checksum
  let result = prefix;

  // Generate the main part of the serial
  for (let i = 0; i < remainingLength; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  // Calculate and append the Luhn checksum
  const checksum = calculateLuhnChecksum(result);
  result += checksum;

  return result;
};