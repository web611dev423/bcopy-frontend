import api from '../api';

interface LoginCredentials {
  email: string;
  password: string;
  userType: 'user' | 'recruiter';
}

interface RegisterData extends LoginCredentials {
  name: string;
  profileLink: string;
  country: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  phoneNumber: string;
  description: string;
  userType: 'user' | 'recruiter';
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
        userType: credentials.userType
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('userType', credentials.userType);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  async register(data: RegisterData) {
    console.log(data);
    try {
      const response = await api.post("/auth/register", data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('userType', data.userType);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  }
}; 