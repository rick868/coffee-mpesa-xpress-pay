
export interface PhoneValidation {
  isValid: boolean;
  error?: string;
}

export const validatePhoneNumber = (phone: string): PhoneValidation => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all spaces and special characters except +
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check different formats
  const formats = [
    /^07\d{8}$/, // 07XXXXXXXX
    /^\+2547\d{8}$/, // +2547XXXXXXXX
    /^2547\d{8}$/ // 2547XXXXXXXX
  ];

  const isValidFormat = formats.some(format => format.test(cleanPhone));
  
  if (!isValidFormat) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Safaricom number (e.g., 0712345678)' 
    };
  }

  // Check if it's a Safaricom number (starts with 7 after country code)
  if (cleanPhone.startsWith('07')) {
    if (!cleanPhone.startsWith('071') && !cleanPhone.startsWith('072') && 
        !cleanPhone.startsWith('073') && !cleanPhone.startsWith('074') &&
        !cleanPhone.startsWith('075') && !cleanPhone.startsWith('076') &&
        !cleanPhone.startsWith('077') && !cleanPhone.startsWith('078') &&
        !cleanPhone.startsWith('079')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid Safaricom number' 
      };
    }
  }

  return { isValid: true };
};

export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.startsWith('07')) {
    return `254${cleanPhone.substring(1)}`;
  } else if (cleanPhone.startsWith('+254')) {
    return cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('254')) {
    return cleanPhone;
  }
  
  return cleanPhone;
};
