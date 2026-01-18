
import { User, Role } from '../types';

const USERS_KEY = 'rnsfgc_registered_users';

export const getRegisteredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (name: string, email: string, password: string, role: Role): { success: boolean; message: string; user?: User } => {
  const users = getRegisteredUsers();
  
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'User already exists with this email' };
  }

  const newUser: User & { password?: string } = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email: email.toLowerCase(),
    role,
    password // In a real app, this would be hashed and stored in Supabase Auth
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, message: 'Registration successful', user: userWithoutPassword as User };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as any[];
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  const { password: _, ...userWithoutPassword } = user;
  return { success: true, message: 'Login successful', user: userWithoutPassword as User };
};

export const resetPassword = (email: string): { success: boolean; message: string } => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, message: 'Email not found in our records' };
  }

  // Simulated email trigger
  console.log(`Password reset link sent to ${email}`);
  return { success: true, message: 'Password reset link has been sent to your email.' };
};
