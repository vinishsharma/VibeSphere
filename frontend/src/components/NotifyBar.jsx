import React from 'react'
import { FaTimes } from 'react-icons/fa'
import axios from 'axios'
import { Link } from 'react-router-dom'

const NotifyBar = ({ notification, onDelete }) => {

  const handleDeleteNotification = async () => {
    try {
      await axios.delete(`/api/notification/delete/${notification._id}`, { withCredentials: true });

      // Remove notification from UI
      onDelete(notification._id);
    } catch (error) {
      console.error(
        'Error deleting notification:',
        error
      );
    }
  };

  const linkTo = notification.type === "#like" || notification.type === "#comment" ? `/post/${notification.postId}` : `/profile/${notification.senderId._id}`;

  return (

    <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-white/50 hover:bg-white/80 border border-white transition-all duration-300">

      <div className="flex items-center">
        <Link to={linkTo}>
          <img
            src={notification.senderId.profilePicture}
            alt={notification.senderId.name}

            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/30"
          />
        </Link>
        <div className="ml-4 flex flex-col">

          <span className="font-bold text-slate-800 text-md">{notification.message}</span>
          <span className="text-sm text-slate-500">@{notification.senderId.username}</span>
        </div>
      </div>


      <div>
        <button className="cursor-pointer" onClick={handleDeleteNotification}>
          <FaTimes />
        </button>
      </div>
    </div>
  )
}

export default NotifyBar