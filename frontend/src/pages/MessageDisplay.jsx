// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import Chat from '../components/Chat';
// import { Spinner } from '../components/Spinner';
// import { motion } from 'framer-motion';

// const MessageDisplay = () => {
//   const { receiverId } = useParams(); // Get receiver's ID from the URL
//   const { user: sender } = useAuth(); // Get the logged-in user (sender)
//   const [receiver, setReceiver] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getReceiverInfo = async () => {
//       if (!receiverId) return;
//       try {
//         setLoading(true);
//         // Fetch the receiver's user data to display their name, profile pic, etc.
//         const response = await axios.get(`/api/user/profile/${receiverId}`);
//         setReceiver(response.data.user);
//       } catch (error) {
//         console.error("Failed to fetch receiver info", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getReceiverInfo();
//   }, [receiverId]);

//   if (loading) {
//     return <Spinner />;
//   }

//   if (!receiver) {
//     return <div>Could not load user data.</div>;
//   }

//   // Now that we have both sender and receiver, render the chat component
//   return (
//     <>
//       <motion.div
//         className="mt-12 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto bg-white/60 backdrop-blur-lg p-6 rounded-4xl shadow-2xl shadow-purple-200/50"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.7, type: "spring" }}>
//         {/* You can add a header here with the receiver's info */}
//         <div className="chat-header p-4 bg-white rounded-t-lg shadow">
//           <h2 className="text-xl font-bold">Chat with @{receiver.username}</h2>
//         </div>
//         <Chat sender={sender} receiver={receiver} />
//       </motion.div>
//     </>
//   );
// };

// export default MessageDisplay;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import { Loader } from '../components/Spinner'; // Assuming you have a themed Loader
import { motion } from 'framer-motion';

const MessageDisplay = () => {
  const { receiverId } = useParams();
  const { user: sender } = useAuth();
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getReceiverInfo = async () => {
      if (!receiverId) return;
      try {
        setLoading(true);
        const response = await axios.get(`/api/user/profile/${receiverId}`);
        setReceiver(response.data.user);
      } catch (error) {
        console.error("Failed to fetch receiver info", error);
      } finally {
        setLoading(false);
      }
    };
    getReceiverInfo();
  }, [receiverId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x flex items-center justify-center text-slate-700 text-lg">
        Could not load user data.
      </div>
    );
  }

  return (
    // THEME CHANGE: Full-page animated gradient background
    <div className="flex-col w-full min-h-screen bg-gradient-to-br animate-gradient-x p-4 py-12 flex items-center justify-center ">

      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        Chat with Friends...
      </h2>

      <motion.div
        className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-4xl h-[85vh] flex flex-col bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-200/50  overflow-hidden border-1 border-purple-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >


        {/* THEME CHANGE: Themed chat header */}
        <div
          className="flex items-center p-4 border-b border-purple-500 cursor-pointer transition-colors duration-300 bg-white/50"
          onClick={() => navigate(`/profile/${receiver._id}`)}
        >
          <img
            src={receiver.profilePicture || 'profile.jpg'}
            alt={receiver.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 ring-offset-2 ring-offset-white/30"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-slate-800">{receiver.name}</h2>
            <p className="text-sm text-slate-500">@{receiver.username}</p>
          </div>
        </div>

        {/* The Chat component fits perfectly inside */}
        <Chat sender={sender} receiver={receiver} />
      </motion.div>
    </div>
  );
};

export default MessageDisplay;