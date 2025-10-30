export const validateStudentForm = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Age validation
  if (!formData.age) {
    errors.age = 'Age is required';
  } else if (isNaN(formData.age) || formData.age <= 0) {
    errors.age = 'Age must be a positive number';
  } else if (formData.age < 16 || formData.age > 100) {
    errors.age = 'Age must be between 16 and 100';
  }
  
  // Group validation
  if (!formData.group.trim()) {
    errors.group = 'Group is required';
  }
  
  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  // Avatar URL validation (optional)
  if (formData.avatar && formData.avatar.trim()) {
    try {
      new URL(formData.avatar);
    } catch (e) {
      errors.avatar = 'Avatar URL is invalid';
    }
  }
  
  return errors;
};