import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBellSlash } from 'react-icons/fa'
import NotifyBar from '../components/NotifyBar'
import axios from 'axios'

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notification/get-all', { withCredentials: true });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleClearAllNotifications = async () => {
    try {
      await axios.delete('/api/notification/delete-all', {
        withCredentials: true,
      });

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Remove notification from UI
  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification._id !== id
      )
    );
  };

  return (
    <div className="w-full min-h-screen  p-4 py-12">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >

        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Notifications
        </h2>

        <div className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-purple-200/50 ring-1 ring-purple-200 space-y-6 h-[70vh] overflow-scroll">

          {notifications.length > 0 && (
            <div className="flex justify-end mb-4 w-full">
              <button className=" text-gray-400 rounded-lg cursor-pointer hover:text-gray-600 transition-all duration-300" onClick={handleClearAllNotifications} >
                Clear All
              </button>
            </div>
          )}

          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NotifyBar notification={notification} onDelete={handleDeleteNotification} />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col flex-grow items-center justify-center text-center text-slate-500 p-8 h-full">
              <FaBellSlash size={80} className="mb-6 text-purple-300" />
              <h3 className="text-2xl font-bold text-slate-800">No Notifications Yet</h3>
            </div>
          )}
        </div>
      </motion.div >
    </div >
  )
}

export default Notifications