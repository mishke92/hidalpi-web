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

/**
 * Validates form field length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {object} - Validation result
 */
export const validateLength = (value, min, max) => {
  const length = value ? value.trim().length : 0;
  
  if (length < min) {
    return {
      isValid: false,
      message: `El campo debe tener al menos ${min} caracteres`
    };
  }
  
  if (max && length > max) {
    return {
      isValid: false,
      message: `El campo no puede tener más de ${max} caracteres`
    };
  }
  
  return { isValid: true };
};

/**
 * Validates name field
 * @param {string} name - Name to validate
 * @returns {object} - Validation result
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      message: 'El nombre es requerido'
    };
  }
  
  const cleanName = name.trim();
  
  if (cleanName.length < 2) {
    return {
      isValid: false,
      message: 'El nombre debe tener al menos 2 caracteres'
    };
  }
  
  if (cleanName.length > 50) {
    return {
      isValid: false,
      message: 'El nombre no puede tener más de 50 caracteres'
    };
  }
  
  // Check for invalid characters
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(cleanName)) {
    return {
      isValid: false,
      message: 'El nombre solo puede contener letras y espacios'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates subject field
 * @param {string} subject - Subject to validate
 * @returns {object} - Validation result
 */
export const validateSubject = (subject) => {
  if (!subject || !subject.trim()) {
    return {
      isValid: false,
      message: 'El asunto es requerido'
    };
  }
  
  const cleanSubject = subject.trim();
  
  if (cleanSubject.length < 3) {
    return {
      isValid: false,
      message: 'El asunto debe tener al menos 3 caracteres'
    };
  }
  
  if (cleanSubject.length > 100) {
    return {
      isValid: false,
      message: 'El asunto no puede tener más de 100 caracteres'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates message field
 * @param {string} message - Message to validate
 * @param {number} minLength - Minimum length (default: 10)
 * @returns {object} - Validation result
 */
export const validateMessage = (message, minLength = 10) => {
  if (!message || !message.trim()) {
    return {
      isValid: false,
      message: 'El mensaje es requerido'
    };
  }
  
  const cleanMessage = message.trim();
  
  if (cleanMessage.length < minLength) {
    return {
      isValid: false,
      message: `El mensaje debe tener al menos ${minLength} caracteres`
    };
  }
  
  if (cleanMessage.length > 2000) {
    return {
      isValid: false,
      message: 'El mensaje no puede tener más de 2000 caracteres'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates if passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Las contraseñas no coinciden'
    };
  }
  
  return { isValid: true };
};

/**
 * Validates multiple fields at once
 * @param {object} data - Data object to validate
 * @param {object} validationRules - Validation rules object
 * @returns {object} - Validation result with errors object
 */
export const validateMultipleFields = (data, validationRules) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = data[field];
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.message;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Debounce function for validation
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate user-friendly error messages for network errors
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getNetworkErrorMessage = (error) => {
  if (!error) return 'Error desconocido';
  
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Error de conexión. Verifique su conexión a internet e intente nuevamente.';
  }
  
  // Timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return 'La conexión ha tardado demasiado. Intente nuevamente.';
  }
  
  // Server errors
  if (error.status >= 500) {
    return 'Error del servidor. Intente más tarde.';
  }
  
  // Client errors
  if (error.status >= 400) {
    return 'Error en la solicitud. Verifique los datos e intente nuevamente.';
  }
  
  return 'Error de conexión. Intente más tarde.';
};