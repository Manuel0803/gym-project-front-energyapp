/**
 * Parses a multiline string description into an array of individual features/benefits.
 * Filters out empty or whitespace-only lines.
 *
 * @param description - The raw multiline string from the backend.
 * @returns An array of cleaned strings representing individual features.
 */
export const parseDescription = (description?: string | null): string[] => {
  if (!description) return ['Sin beneficios especificados'];
  
  return description
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
