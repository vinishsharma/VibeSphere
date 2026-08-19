import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext"; // Adjust the import path as necessary
import { apiUrl } from "../config/api";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth(); // Get the authenticated user from AuthContext

  // Get the user ID from the authenticated user
  const authUserId = user ? user._id : null;
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.trim().replace(/\/$/, "")
    || apiUrl
    || (import.meta.env.DEV ? "http://localhost:8080" : window.location.origin);

  useEffect(() => {
    if (!authUserId) {
      setSocket(null);
      setOnlineUsers([]);
      return undefined;
    }

    const socketInstance = io(socketUrl, {
      query: {
        userId: authUserId,
      },
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketInstance.close();
      setSocket((activeSocket) => activeSocket === socketInstance ? null : activeSocket);
    };
  }, [authUserId, socketUrl]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
