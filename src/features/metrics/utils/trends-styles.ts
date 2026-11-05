/**
 * Determines the trend color based on its numeric value.
 * @param trend Trend value.
 * @param invert If true, a positive trend is displayed in red
 * (useful for negative metrics such as "Cancellations" or "Debts").
 * @returns Tailwind CSS class corresponding to the trend state.
 */
export const getTrendColor = (trend: number, invert: boolean = false): string => {
  const safeTrend = Number(trend) || 0;
  
  if (safeTrend === 0) return 'text-text-muted';
  
  if (invert) {
    return safeTrend > 0 ? 'text-danger-main' : 'text-success-main';
  }
  
  return safeTrend > 0 ? 'text-success-main' : 'text-danger-main';
};

/**
 * Formats the trend text with its mathematical sign, percentage, and suffix.
 * @param trend Trend value.
 * @param suffix Descriptive text appended to the trend (e.g., 'vs previous month').
 * @returns Formatted string ready to be rendered.
 */
export const getTrendText = (trend: number, suffix: string): string => {
  const safeTrend = Number(trend) || 0;
  const sign = safeTrend > 0 ? '+' : '';
  
  const formattedTrend = Number.isInteger(safeTrend) 
    ? safeTrend.toString() 
    : safeTrend.toFixed(1);

  return `${sign}${formattedTrend}% ${suffix}`;
};
