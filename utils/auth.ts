import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = {
  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
  },
  
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },
  
  removeToken: async () => {
    await AsyncStorage.removeItem('token');
  },
  
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
  }
}; 