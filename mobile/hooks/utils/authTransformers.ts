import type { RegisterDto } from '../api/requests';

// Transform UI form data to API format
export const transformRegistrationData = (formData: Record<string, any>): RegisterDto => {
  return {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword,
    first_name: formData.firstName,
    last_name: formData.lastName,
    role: formData.role as 'Pupil' | 'Teacher',
  };
};