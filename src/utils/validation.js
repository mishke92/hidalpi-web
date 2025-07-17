/**
 * Validation utilities for form fields
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Ecuador phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const isValidPhone = (phone) => {
  // Remove any non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Ecuador phone formats:
  // Mobile: 09XXXXXXXX (10 digits)
  // Landline: 0XXXXXXX (8 digits) - province code + 7 digits
  // International: +593XXXXXXXXX
  
  if (cleanPhone.startsWith('593')) {
    // International format +593XXXXXXXXX
    return cleanPhone.length === 12 && /^593[2-9]\d{8}$/.test(cleanPhone);
  } else if (cleanPhone.startsWith('0')) {
    // National format
    return (cleanPhone.length === 10 && /^09\d{8}$/.test(cleanPhone)) || // Mobile
           (cleanPhone.length === 8 && /^0[2-7]\d{6}$/.test(cleanPhone));   // Landline
  }
  
  return false;
};

/**
 * Validates Ecuador RUC format
 * @param {string} ruc - RUC to validate
 * @returns {boolean} - True if valid RUC format
 */
export const isValidRUC = (ruc) => {
  // Remove any non-digit characters
  const cleanRUC = ruc.replace(/\D/g, '');
  
  // Ecuador RUC formats:
  // Natural person: 10 digits + 001
  // Company: 13 digits ending in 001
  // Public sector: 13 digits ending in 001
  
  if (cleanRUC.length !== 13) return false;
  
  // Must end with 001
  if (!cleanRUC.endsWith('001')) return false;
  
  // Get the first 10 digits for validation
  const cedula = cleanRUC.substring(0, 10);
  
  // Validate cedula/RUC checksum
  return validateEcuadorCedula(cedula);
};

/**
 * Validates Ecuador cedula format and checksum
 * @param {string} cedula - Cedula to validate
 * @returns {boolean} - True if valid cedula
 */
export const isValidCedula = (cedula) => {
  const cleanCedula = cedula.replace(/\D/g, '');
  
  if (cleanCedula.length !== 10) return false;
  
  return validateEcuadorCedula(cleanCedula);
};

/**
 * Internal function to validate Ecuador cedula checksum
 * @param {string} cedula - 10-digit cedula
 * @returns {boolean} - True if valid checksum
 */
function validateEcuadorCedula(cedula) {
  // Province code validation (first 2 digits)
  const province = parseInt(cedula.substring(0, 2));
  if (province < 1 || province > 24) return false;
  
  // Third digit must be less than 6 for natural persons
  const thirdDigit = parseInt(cedula.charAt(2));
  if (thirdDigit >= 6) return false;
  
  // Calculate verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cedula.charAt(i));
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const calculatedCheckDigit = ((Math.ceil(sum / 10) * 10) - sum) % 10;
  const actualCheckDigit = parseInt(cedula.charAt(9));
  
  return calculatedCheckDigit === actualCheckDigit;
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validates required fields
 * @param {object} data - Data object to validate
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - Validation result with isValid boolean and errors object
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `El campo '${field}' es requerido`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

/**
 * Sanitizes string input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Validates company name
 * @param {string} name - Company name to validate
 * @returns {boolean} - True if valid company name
 */
export const isValidCompanyName = (name) => {
  const cleanName = sanitizeString(name);
  return cleanName.length >= 2 && cleanName.length <= 100;
};

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10 && cleanPhone.startsWith('09')) {
    // Mobile format: 09XX XXX XXX
    return `${cleanPhone.substring(0, 4)} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7)}`;
  } else if (cleanPhone.length === 8 && cleanPhone.startsWith('0')) {
    // Landline format: 0X XXX XXXX
    return `${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2, 5)} ${cleanPhone.substring(5)}`;
  }
  
  return phone; // Return original if no formatting applicable
};

/**
 * Formats RUC for display
 * @param {string} ruc - RUC to format
 * @returns {string} - Formatted RUC
 */
export const formatRUC = (ruc) => {
  const cleanRUC = ruc.replace(/\D/g, '');
  
  if (cleanRUC.length === 13) {
    // Format as XXXXXXXXXX001
    return `${cleanRUC.substring(0, 10)}-${cleanRUC.substring(10)}`;
  }
  
  return ruc;
};