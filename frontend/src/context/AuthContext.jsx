import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const getLoggedInUser = async () => {
  try {
    const response = await axios.get("/api/auth/loggedInUser", { withCredentials: true });
    return response.data; // Returns user data
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser();
      setUser(loggedInUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);