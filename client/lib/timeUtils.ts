/**
 * Time utility functions for converting between 12-hour and 24-hour formats
 */

/**
 * Convert 12-hour time format (e.g., "2:30 PM") to 24-hour format (e.g., "14:30")
 * @param time12 - Time in 12-hour format with AM/PM
 * @returns Time in 24-hour format
 */
export const convertTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(" ");
  const [hours, minutes] = time.split(":");
  let hour24 = parseInt(hours);

  if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, "0")}:${minutes}`;
};

/**
 * Convert 24-hour time format (e.g., "14:30") to 12-hour format (e.g., "2:30 PM")
 * @param time24 - Time in 24-hour format
 * @returns Time in 12-hour format with AM/PM
 */
export const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":");
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const period = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${period}`;
};

/**
 * Format time for display in a user-friendly format
 * @param timeString - Time in either 12-hour or 24-hour format
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (timeString: string): string => {
  // Check if it's already in 12-hour format (contains AM/PM)
  if (timeString.includes("AM") || timeString.includes("PM")) {
    return timeString;
  }

  // Convert from 24-hour to 12-hour format
  return convertTo12Hour(timeString);
};

/**
 * Format time for API submission (24-hour format)
 * @param timeString - Time in either 12-hour or 24-hour format
 * @returns Time in 24-hour format for API
 */
export const formatTimeForAPI = (timeString: string): string => {
  // Check if it's already in 24-hour format (no AM/PM)
  if (!timeString.includes("AM") && !timeString.includes("PM")) {
    return timeString;
  }

  // Convert from 12-hour to 24-hour format
  return convertTo24Hour(timeString);
};



