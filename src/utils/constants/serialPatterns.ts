export const PATTERNS = {
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

export const LENGTHS = {
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