export const generateRandomChar = (type: "alpha" | "numeric" | "special") => {
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