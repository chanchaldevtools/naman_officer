import API_CONFIG from './apiConfig';
import { LoginResponse } from '../types';

export const loginApi = {
  getLogin: async (mobile_number: string, password: string): Promise<LoginResponse> => {
    try {
      const formData = new FormData();
      formData.append('mobile_number', mobile_number);
      formData.append('password', password);

      const response = await fetch(`${API_CONFIG.BASE_URL}login`, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      try {
        return JSON.parse(text) as LoginResponse;
      } catch {
        return { response: text };
      }
    } catch (error) {
      console.error('loginApi error:', error);
      return { response: 'error' };
    }
  },
};

export default loginApi;
