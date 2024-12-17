import { CODE_POINTS, REVERSE_CODE_POINTS } from './codePoints';

export const calculateLuhnChecksum = (value: string): string => {
  // Map characters to code points
  const codePoints = value.split('').map(char => CODE_POINTS[char] || 0);
  
  // Calculate sum according to Luhn algorithm with custom rules
  let sum = 0;
  for (let i = 0; i < codePoints.length; i++) {
    let num = codePoints[i];
    // Multiply by 2 if in even position (1-based index)
    if ((i + 1) % 2 === 0) {
      num *= 2;
    }
    // Apply the rule for values > 36
    if (num > 36) {
      num = 1 + (num - 36);
    }
    sum += num;
  }

  // Get mod 36 of the sum
  const mod36 = sum % 36;
  
  // Subtract from 36 to get checksum value
  let checksumValue = 36 - mod36;
  
  // If checksum is 36, use 0 instead
  if (checksumValue === 36) {
    checksumValue = 0;
  }

  // Convert back to character
  return REVERSE_CODE_POINTS[checksumValue];
};