import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { changeTimeFormat } from '../utils/helper'; // Assuming you have a helper function to format time
import { FaComments } from 'react-icons/fa';

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
    <div className="flex flex-col h-full overflow-hidden  rounded-b-3xl">
      {/* THEME CHANGE: Themed message display area */}
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
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
              <div className={`flex flex-col ${msg.senderId === sender._id ? 'items-end' : 'items-start'}`}>
                <p className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.senderId === sender._id
                  ? 'bg-purple-500/80 rounded-br-none text-white'
                  : 'bg-white/80 text-purple-500 ring-1 ring-purple-500 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
                <span className="text-xs text-slate-400 mt-1">
                  {changeTimeFormat(msg.createdAt)}
                </span>
              </div>

              {/* Show sender's picture for sent messages */}
              {
                msg.senderId === sender._id && (
                  <img src={sender.profilePicture} className="w-8 h-8 rounded-full object-cover" alt={sender.name} />
                )
              }
            </motion.div>
          ))
        ) : (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaComments className="w-24 h-24 mb-6 text-purple-200" />
            <h3 className="text-2xl font-bold text-slate-700">Start a Conversation</h3>
            <p className="text-slate-500 mt-2">Your messages in this chat will appear here.</p>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* THEME CHANGE: Themed message input form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/50 border-t border-purple-200/50 ">
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
    </div >
  );
};

export default Chat;