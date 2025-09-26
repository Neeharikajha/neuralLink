import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiSend, 
  FiUsers, 
  FiPlus, 
  FiMessageSquare, 
  FiMoreVertical,
  FiSmile,
  FiPaperclip,
  FiSearch
} from 'react-icons/fi';

const Chat = () => {
  const { user, githubProfile, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('new_message', (data) => {
        setMessages(prev => [...prev, data.message]);
      });

      newSocket.on('user_typing', (data) => {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      });

      newSocket.on('joined_room', (data) => {
        console.log('Joined room:', data);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        alert(error.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  // Fetch chat rooms
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRooms(response.data.chatRooms);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    if (token) {
      fetchChatRooms();
    }
  }, [token]);

  // Fetch messages when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentRoom) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/chat/rooms/${currentRoom._id}/messages`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [currentRoom, token]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && currentRoom) {
      socket.emit('send_message', {
        roomId: currentRoom._id,
        content: newMessage.trim(),
        messageType: 'text'
      });
      setNewMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        socket.emit('typing_stop', { roomId: currentRoom._id });
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && socket && currentRoom) {
      setIsTyping(true);
      socket.emit('typing_start', { roomId: currentRoom._id });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping && socket && currentRoom) {
        socket.emit('typing_stop', { roomId: currentRoom._id });
        setIsTyping(false);
      }
    }, 1000);
  };

  const joinRoom = (room) => {
    if (socket) {
      socket.emit('join_room', { roomId: room._id });
      setCurrentRoom(room);
    }
  };

  const createRoom = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/chat/rooms`,
        {
          name: newRoomName,
          description: newRoomDescription,
          isPrivate: false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRooms(prev => [response.data.chatRoom, ...prev]);
      setNewRoomName('');
      setNewRoomDescription('');
      setShowCreateRoom(false);
      joinRoom(response.data.chatRoom);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0b1020]">
        <div className="text-center text-gray-200">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">You need to be logged in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b1020]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-200">Chat Rooms</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg"
              >
                <FiPlus size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg">
                <FiMoreVertical size={20} />
              </button>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search rooms..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => joinRoom(room)}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                currentRoom?._id === room._id ? 'bg-blue-900 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiMessageSquare className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-200 truncate">{room.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{room.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiUsers size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{room.participants.length} members</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              {githubProfile?.avatar ? (
                <img 
                  src={githubProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-gray-300">
                  {githubProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {githubProfile?.displayName || githubProfile?.username || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-200">{currentRoom.name}</h2>
                  <p className="text-sm text-gray-400">{currentRoom.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{currentRoom.participants.length} members</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.senderId._id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId._id === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-200 border border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">
                        {message.senderId._id === user?.id ? 'You' : message.senderId.email}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">
                    <span className="text-sm">
                      {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg">
                  <FiPaperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg">
                  <FiSmile size={20} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiMessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Select a chat room</h3>
              <p className="text-gray-400">Choose a room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Create New Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
                  placeholder="Enter room description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                disabled={!newRoomName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
