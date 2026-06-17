// Input filtering utilities - prevent typing invalid characters
export const inputFilters = {
  // Only letters and spaces
  nameOnly: (value) => value.replace(/[^a-zA-Z\s]/g, ''),

  // Only numbers
  numbersOnly: (value) => value.replace(/[^0-9]/g, ''),

  // Only letters and numbers
  alphanumeric: (value) => value.replace(/[^a-zA-Z0-9]/g, ''),

  // Email format - letters, numbers, @, dot, hyphen, underscore
  emailFormat: (value) => value.replace(/[^a-zA-Z0-9@._-]/g, ''),

  // Phone - numbers only
  phoneFormat: (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    return numbers.slice(0, 10); // Max 10 digits
  },

  // URL format - letters, numbers, /, :, ., -, _
  urlFormat: (value) => value.replace(/[^a-zA-Z0-9/:._\-]/g, ''),

  // Experience - numbers and space only
  experienceFormat: (value) => value.replace(/[^0-9\s]/g, ''),

  // Password - allow all characters
  passwordFormat: (value) => value,
};

// Validation utilities for forms

export const validation = {
  // Email validation
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return null;
  },

  // Phone validation (10 digits for India)
  phone: (value) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) return 'Phone number must be 10 digits';
    return null;
  },

  // Full name validation
  fullName: (value) => {
    if (!value) return 'Full name is required';
    if (value.trim().length < 2) return 'Please enter a valid full name';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return null;
  },

  // Company name validation
  companyName: (value) => {
    if (!value) return 'Company name is required';
    if (value.trim().length < 2) return 'Please enter a valid company name';
    return null;
  },

  // Industry validation
  industry: (value) => {
    if (!value) return 'Industry type is required';
    if (value.trim().length < 2) return 'Please enter a valid industry type';
    return null;
  },

  // City validation
  city: (value) => {
    if (!value) return 'City is required';
    if (value.trim().length < 2) return 'Please enter a valid city name';
    return null;
  },

  // Experience validation
  experience: (value) => {
    if (!value) return 'Years of experience is required';
    if (!/^\d+/.test(value)) return 'Please enter a valid number';
    return null;
  },

  // Website validation (optional)
  website: (value) => {
    if (!value) return null; // Optional field
    const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!websiteRegex.test(value)) return 'Please enter a valid website URL';
    return null;
  },

  // Resume file validation
  resume: (file) => {
    if (!file) return 'Resume is required';
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) return 'Only PDF, DOC, and DOCX files are allowed';
    if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5MB';
    return null;
  },
};

export const validateField = (name, value) => {
  switch (name) {
    case 'email':
      return validation.email(value);
    case 'password':
      return validation.password(value);
    case 'phone':
      return validation.phone(value);
    case 'fullName':
      return validation.fullName(value);
    case 'companyName':
      return validation.companyName(value);
    case 'industry':
      return validation.industry(value);
    case 'city':
      return validation.city(value);
    case 'experience':
      return validation.experience(value);
    case 'website':
      return validation.website(value);
    default:
      return null;
  }
};

export const filterInput = (name, value) => {
  switch (name) {
    case 'fullName':
    case 'companyName':
    case 'industry':
    case 'city':
      return inputFilters.nameOnly(value);
    case 'email':
      return inputFilters.emailFormat(value);
    case 'phone':
      return inputFilters.phoneFormat(value);
    case 'website':
      return inputFilters.urlFormat(value);
    case 'experience':
      return inputFilters.experienceFormat(value);
    case 'password':
      return inputFilters.passwordFormat(value);
    default:
      return value;
  }
};

export default validation;
