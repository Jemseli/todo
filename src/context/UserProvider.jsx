import { useState } from "react";
import { UserContext } from "./UserContex";
import axios from "axios";

export default function UserProvider({ children }) {
  const userFromStorage = sessionStorage.getItem('user');
  const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : { email: '', password: '', token: '' });

  const signUp = async (email, password) => {
    const headers = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/signup`,
      { email, password },
      headers
    );
    setUser(response.data);
    sessionStorage.setItem('user', JSON.stringify(response.data));
  };

  const signIn = async (email, password) => {
    const headers = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/signin`,
      { email, password },
      headers
    );
    setUser(response.data);
    sessionStorage.setItem('user', JSON.stringify(response.data));
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  );
}