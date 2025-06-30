/**
 * Validation utilities for data sanitization and type checking
 * Provides common validation functions used throughout the application
 */

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a string is a valid email address
 * @param email - The email string to validate
 * @returns boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validates and sanitizes user input
 * @param input - The user input to validate
 * @param maxLength - Maximum allowed length
 * @returns Sanitized input or null if invalid
 */
export const validateUserInput = (input: string, maxLength: number = 1000): string | null => {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Remove potentially dangerous characters
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, maxLength);

  return sanitized.length > 0 ? sanitized : null;
};

/**
 * Validates file upload
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result object
 */
export const validateFile = (
  file: File,
  allowedTypes: string[] = [],
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type if allowedTypes is specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Validates date string format
 * @param dateString - The date string to validate
 * @param format - Expected date format (default: YYYY-MM-DD)
 * @returns boolean indicating if the date is valid
 */
export const isValidDate = (dateString: string, format: string = 'YYYY-MM-DD'): boolean => {
  if (!dateString) return false;

  // For YYYY-MM-DD format
  if (format === 'YYYY-MM-DD') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
  }

  // For other formats, try parsing with Date constructor
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validates if a value is within a specified range
 * @param value - The numeric value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns boolean indicating if the value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates if a string contains only alphanumeric characters
 * @param str - The string to validate
 * @returns boolean indicating if the string is alphanumeric
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Validates if a string is a valid hexadecimal color
 * @param color - The color string to validate
 * @returns boolean indicating if the color is valid
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}; 