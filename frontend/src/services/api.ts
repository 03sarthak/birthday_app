import axios from 'axios';

// Replace with your machine's IP address
const BASE_URL = 'http://192.168.29.134:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Birthday {
  id: number;
  name: string;
  dob: string;
}

// Get all birthdays
export const getAllBirthdays = async (): Promise<Birthday[]> => {
  const response = await api.get('/birthdays');
  return response.data;
};

// Get single birthday
export const getBirthday = async (id: number): Promise<Birthday> => {
  const response = await api.get(`/birthdays/${id}`);
  return response.data;
};

// Add a new birthday
export const addBirthday = async (name: string, dob: string): Promise<Birthday> => {
  const response = await api.post('/birthdays', { name, dob });
  return response.data;
};

// Update a birthday
export const updateBirthday = async (id: number, name: string, dob: string): Promise<Birthday> => {
  const response = await api.put(`/birthdays/${id}`, { name, dob });
  return response.data;
};

// Delete a birthday
export const deleteBirthday = async (id: number): Promise<void> => {
  await api.delete(`/birthdays/${id}`);
};