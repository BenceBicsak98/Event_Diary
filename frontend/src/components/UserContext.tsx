/**
 * User interface representing the structure of a user object.
 * @interface User
 * @property {number} ID - Unique identifier for the user.
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} last_login - The last login timestamp of the user.
 * @property {number} is_admin - Indicates if the user has admin privileges (1 for true, 0 for false).
 * @property {number} is_enable - Indicates if the user account is enabled (1 for true, 0 for false).
 */

/**
 * UserContextType interface defining the structure of the user context.
 * @interface UserContextType
 * @property {string | null} username - The username of the current user or null if not set.
 * @property {(name: string | null) => void} setUsernames - Function to update the username.
 * @property {User | null} user - The user object or null if not set.
 * @property {(user: User | null) => void} setUser - Function to update the user object.
 */

/**
 * React context for managing user-related data.
 * @constant
 * @type {React.Context<UserContextType | undefined>}
 */

/**
 * React context for storing the user object.
 * @constant
 * @type {React.Context<User | null>}
 */

/**
 * UserProvider component that provides the user context to its children.
 * @function
 * @param {Object} props - The props for the UserProvider component.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The UserProvider component.
 */

/**
 * Custom hook to access the UserContext.
 * @function
 * @throws Will throw an error if used outside of a UserProvider.
 * @returns {UserContextType} The user context values.
 */

/**
 * Custom hook to access the UserData context.
 * @function
 * @returns {User | null} The user object or null if not set.
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/api/client';

// Define the User interface
interface User {
  ID: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  last_login: string;
  is_admin: number;
  is_enable: number;
}

// Define the context type
interface UserContextType {
  username: string | null;
  setUsernames: (name: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);
const UserData = createContext<User | null>(null);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage to the username if available
  const [username, setUsernames] = useState<string | null>(() => {
    return localStorage.getItem('username') || null;
  });
  // Initialize state from localStorage to the user if available
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // save username to localStorage when it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  // save user to localStorage when it changes 
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Fetch user data when username changes
  useEffect(() => {
    const fetchUser = async () => {
      if (username && !user) {
        try {
          const response = await api.get(`/get_user_data?username=${username}`);
          if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchUser();
  }, [username]);

  // Provide the context values to children components
  return (
    <UserContext.Provider value={{ username, setUsernames, user, setUser }}>
      <UserData.Provider value={user}>
        {children}
      </UserData.Provider>
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Custom hook to use the UserData context
export function useUserData(): User | null {
  const userDataContext = useContext(UserData);
  if (!userDataContext) {
    throw new Error("userDataContext must be used within a UserProvider");
  }
  return userDataContext;
}
