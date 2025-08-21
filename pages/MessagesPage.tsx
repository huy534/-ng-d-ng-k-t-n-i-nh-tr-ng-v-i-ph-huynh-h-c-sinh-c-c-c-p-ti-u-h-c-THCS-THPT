
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/mockApi';
import { User, Message } from '../types';
import { SendIcon } from '../components/icons';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      api.getContacts().then(data => {
        setContacts(data);
        setLoadingContacts(false);
        if (data.length > 0) {
            handleSelectContact(data[0]);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectContact = (contact: User) => {
    setSelectedContact(contact);
    setLoadingMessages(true);
    if (user) {
      // API now infers current user from token
      api.getMessages(contact.id).then(data => {
        setMessages(data);
        setLoadingMessages(false);
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedContact || !user) return;
    
    // API now infers senderId from token
    const sentMessage = await api.sendMessage(selectedContact.id, newMessage);
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Danh bạ</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingContacts ? <p className="p-4 text-gray-500">Đang tải...</p> : (
            <ul>
              {contacts.map(contact => (
                <li
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? 'bg-primary-100' : ''}`}
                >
                  <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.role === 'TEACHER' ? 'Giáo viên' : 'Phụ huynh'}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b flex items-center">
              <img src={selectedContact.avatarUrl} alt={selectedContact.name} className="w-10 h-10 rounded-full mr-3" />
              <h2 className="text-xl font-bold text-gray-800">{selectedContact.name}</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {loadingMessages ? <p className="text-center text-gray-500">Đang tải tin nhắn...</p> : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex mb-4 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.senderId === user?.id ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="submit" className="ml-3 p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <SendIcon className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chọn một người để bắt đầu trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
