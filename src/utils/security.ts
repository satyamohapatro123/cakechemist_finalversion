/**
 * Security utility functions for the CakeChemist application
 * These functions handle password hashing, validation, and other security-related tasks
 */

import { jwtDecode } from 'jwt-decode';

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Simulates password hashing (in a real app, use bcrypt or Argon2)
 * @param password - The plain text password to hash
 * @returns A simulated hash of the password
 */
export const hashPassword = (password: string): string => {
  // In a real application, use a proper hashing library like bcrypt
  // This is just a simulation for demonstration purposes
  return btoa(`${password}_hashed_salt`);
};

/**
 * Simulates password verification (in a real app, use bcrypt.compare or similar)
 * @param plainPassword - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns True if the password matches, false otherwise
 */
export const verifyPassword = (plainPassword: string, hashedPassword: string): boolean => {
  // In a real application, use a proper password verification
  // This is just a simulation for demonstration purposes
  const hashedInput = hashPassword(plainPassword);
  return hashedInput === hashedPassword;
};

/**
 * Generates a JWT token (simulated)
 * @param user - The user object to encode in the token
 * @returns A simulated JWT token
 */
export const generateToken = (user: any): string => {
  // In a real application, use a proper JWT library
  // This is just a simulation for demonstration purposes
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  };

  return btoa(JSON.stringify(payload));
};

/**
 * Verifies a JWT token (simulated)
 * @param token - The token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    // In a real application, use a proper JWT verification
    // This is just a simulation for demonstration purposes
    const decoded = JSON.parse(atob(token)) as JwtPayload;

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns An object with validation result and message
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true, message: 'Password meets all requirements' };
};

/**
 * Generates a secure random token
 * @param length - The length of the token to generate
 * @returns A random token
 */
export const generateRandomToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use crypto API if available for better randomness
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += characters.charAt(values[i] % characters.length);
    }
    return result;
  }

  // Fallback to Math.random
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/**
 * Sets secure HttpOnly cookies (simulated)
 * @param name - The name of the cookie
 * @param value - The value of the cookie
 * @param expiryDays - The number of days until the cookie expires
 */
export const setSecureCookie = (name: string, value: string, expiryDays: number = 7): void => {
  // In a real application, this would be handled by the server
  // This is just a simulation for demonstration purposes
  const date = new Date();
  date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`;
};

/**
 * Gets a cookie value (simulated)
 * @param name - The name of the cookie to get
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Deletes a cookie
 * @param name - The name of the cookie to delete
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
};

/**
 * Validates an email address format
 * @param email - The email to validate
 * @returns True if the email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Validates a phone number format
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
  // Basic validation for Indian phone numbers
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

/**
 * Validates a GST number format
 * @param gst - The GST number to validate
 * @returns True if the GST number is valid, false otherwise
 */
export const validateGST = (gst: string): boolean => {
  // Basic validation for Indian GST numbers
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gst);
};
