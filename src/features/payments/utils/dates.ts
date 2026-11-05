/**
 * Converts a given ISO string or the current date into a local date string (YYYY-MM-DD).
 *
 * @param dateString - Optional ISO date string.
 * @returns A string representing the local date in YYYY-MM-DD format.
 */
export const getLocalDateString = (dateString?: string): string => {
  const d = dateString ? new Date(dateString) : new Date();
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Converts a local date string (YYYY-MM-DD) to an ISO string representing midday (12:00 PM) in local time.
 * This prevents timezone offset issues that could shift the date to the previous day in UTC.
 *
 * @param dateString - The local date string in YYYY-MM-DD format.
 * @returns An ISO 8601 string representing midday of the provided date.
 */
export const getIsoWithLocalMidday = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  
  return d.toISOString();
};

/**
 * Retrieves the current local date as a string in YYYY-MM-DD format,
 * automatically adjusting for the local timezone offset.
 *
 * @returns A string representing today's local date.
 */
export const getTodayLocalString = (): string => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};
