// utils/timeUtils.js

/**
 * Parse time string in format "HH.MM A.M" or "HH.MM P.M" into Date object
 * @param {string} timeString - Time string in format "HH.MM A.M" or "HH.MM P.M"
 * @returns {Date} - Date object representing the parsed time
 */
function parseTime(timeString) {
    const [hourMinute, meridiem] = timeString.split(' ');
    const [hour, minute] = hourMinute.split('.').map(Number);
    let hours = hour;
  
    if (meridiem.toUpperCase() === 'P.M' && hour !== 12) {
      hours += 12;
    } else if (meridiem.toUpperCase() === 'A.M' && hour === 12) {
      hours = 0;
    }
  
    return new Date(0, 0, 0, hours, minute);
  }
  
  module.exports = { parseTime };
  