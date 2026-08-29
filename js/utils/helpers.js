/**
 * Helper utilities for Algorithm Visualizer
 */

/**
 * Generate a random array of integers within a given range
 * @param {number} size - Number of elements
 * @param {number} min - Minimum value (default 5)
 * @param {number} max - Maximum value (default 100)
 * @returns {number[]} Array of random integers
 */
export function generateRandomArray(size = 12, min = 5, max = 100) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

/**
 * Generate a nearly sorted or shuffled array
 * @param {number[]} array - Array to shuffle
 * @returns {number[]} New shuffled array
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Parse a comma or space separated string of numbers into a valid array
 * @param {string} input - User input string
 * @param {number} minVal - Minimum allowed value
 * @param {number} maxVal - Maximum allowed value
 * @param {number} maxLen - Maximum allowed length
 * @returns {{ valid: boolean, data?: number[], error?: string }}
 */
export function parseCustomArray(input, minVal = 1, maxVal = 100, maxLen = 50) {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Please enter at least one number.' };
  }

  const cleaned = input.replace(/[[\]]/g, '').trim();
  const tokens = cleaned.split(/[\s,]+/).filter(t => t.length > 0);

  if (tokens.length === 0) {
    return { valid: false, error: 'No valid numbers found.' };
  }

  if (tokens.length > maxLen) {
    return { valid: false, error: `Maximum array size is ${maxLen} elements.` };
  }

  if (tokens.length < 2) {
    return { valid: false, error: 'Array should have at least 2 elements for visualization.' };
  }

  const result = [];
  for (const token of tokens) {
    const num = Number(token);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { valid: false, error: `"${token}" is not a valid integer.` };
    }
    if (num < minVal || num > maxVal) {
      return { valid: false, error: `Numbers must be between ${minVal} and ${maxVal}. Found ${num}.` };
    }
    result.push(num);
  }

  return { valid: true, data: result };
}

/**
 * Check if an array is sorted in ascending order
 * @param {number[]} arr 
 * @returns {boolean}
 */
export function isSortedAscending(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

/**
 * Clamp a number between min and max
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Escape HTML special characters for safe rendering
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
