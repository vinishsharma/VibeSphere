// import React, { useState, useEffect, useRef } from 'react';
// import { useSocket } from '../context/SocketContext';
// import axios from 'axios';

// // Assume you pass the authenticated user (sender) and the receiver's info as props
// const Chat = ({ sender, receiver }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const { socket } = useSocket();
//   const messagesEndRef = useRef(null);

//   // Effect for listening to new messages
//   useEffect(() => {
//     if (socket) {
//       const handleNewMessage = (newMessage) => {
//         // Add message only if it belongs to the current conversation
//         if (newMessage.senderId === receiver._id || newMessage.senderId === sender._id) {
//           setMessages((prevMessages) => [...prevMessages, newMessage]);
//         }
//       };
//       socket.on('newMessage', handleNewMessage);

//       // Cleanup listener on component unmount
//       return () => {
//         socket.off('newMessage', handleNewMessage);
//       };
//     }
//   }, [socket, receiver._id, sender._id]);

//   // Effect for fetching message history (implement this API endpoint)
//   useEffect(() => {
//     const fetchMessagesHistory = async () => {
//       try {
//         const response = await axios.get(`/api/message/getChatWith/${receiver._id}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch message history", error);
//       }
//     };

//     if (receiver?._id) {
//       fetchMessagesHistory();
//     }
//   }, [receiver._id]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputText.trim() === '' || !socket) return;

//     const messageData = {
//       senderId: sender._id,
//       receiverId: receiver._id,
//       text: inputText,
//     };

//     // Emit the message to the server
//     socket.emit('sendMessage', messageData);

//     // Add the message to our own UI instantly
//     setMessages([...messages, messageData]);
//     setInputText('');
//   };

//   // Auto-scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);


//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={msg.senderId === sender._id ? 'sent' : 'received'}>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSendMessage} className="message-form">
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default Chat;







import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Chat = ({ sender, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  // Effect for listening to new messages
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        // Add message only if it belongs to the current conversation
        if (newMessage.senderId === receiver._id || newMessage.senderId === sender._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };
      socket.on('newMessage', handleNewMessage);

      // Cleanup listener on component unmount
      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [socket, receiver._id, sender._id]);

  // Effect for fetching message history (implement this API endpoint)
  useEffect(() => {
    const fetchMessagesHistory = async () => {
      try {
        const response = await axios.get(`/api/message/getChatWith/${receiver._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch message history", error);
      }
    };

    if (receiver?._id) {
      fetchMessagesHistory();
    }
  }, [receiver._id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || !socket) return;
    const messageData = { senderId: sender._id, receiverId: receiver._id, text: inputText };
    socket.emit('sendMessage', messageData);
    setMessages([...messages, { ...messageData, createdAt: new Date().toISOString() }]);
    setInputText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    // THEME CHANGE: Main container with flex-grow to fill space
    <div className="flex flex-col h-full overflow-hidden  rounded-3xl">
      {/* THEME CHANGE: Themed message display area */}
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={msg._id || index} // Use msg._id from fetched messages, or index for optimistic updates
            className={`flex items-end gap-3 ${msg.senderId === sender._id ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Show receiver's picture for received messages */}
            {msg.senderId === receiver._id && (
              <img src={receiver.profilePicture} className="w-8 h-8 rounded-full object-cover" alt={receiver.name} />
            )}

            {/* THEME CHANGE: Themed message bubbles */}
            <p className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.senderId === sender._id
              ? 'bg-purple-500/80 rounded-br-none text-white'
              : 'bg-white/80 text-purple-500 ring-1 ring-purple-500 rounded-bl-none'
              }`}
            >
              {msg.text}
            </p>

            {/* Show sender's picture for sent messages */}
            {msg.senderId === sender._id && (
              <img src={sender.profilePicture} className="w-8 h-8 rounded-full object-cover" alt={sender.name} />
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* THEME CHANGE: Themed message input form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/50 border-t border-purple-200/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message..."
            className="w-full p-3 pl-4 pr-12 bg-white/80 border-2 border-transparent rounded-full focus:outline-none focus:border-purple-400 transition-colors"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors">
            <FaPaperPlane size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;