/**
 * Formats a given number of days into a human-readable temporal string.
 *
 * @param days - The total duration in days.
 * @returns A formatted string representing the duration (e.g., "mes", "año", "15 días").
 */
export const formatDuration = (days: number): string => {
  switch (days) {
    case 1:
      return 'día';
    case 30:
      return 'mes';
    case 365:
      return 'año';
    default:
      return `${days} días`;
  }
};
