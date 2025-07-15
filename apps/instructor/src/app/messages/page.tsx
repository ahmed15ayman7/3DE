'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Input, Avatar, Badge } from '@3de/ui';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'received' | 'sent';
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'away';
  role: 'student' | 'instructor' | 'admin';
}

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data للمحادثات
  const conversations: Conversation[] = [
    {
      id: '1',
      participantId: '1',
      participantName: 'أحمد محمد',
      participantAvatar: '🧑‍💻',
      lastMessage: 'شكراً لك على الشرح الرائع في المحاضرة الأخيرة',
      lastMessageTime: '10:30 ص',
      unreadCount: 2,
      status: 'online',
      role: 'student'
    },
    {
      id: '2',
      participantId: '2',
      participantName: 'فاطمة علي',
      participantAvatar: '👩‍💻',
      lastMessage: 'هل يمكنك مساعدتي في حل المشكلة في الواجب؟',
      lastMessageTime: 'أمس',
      unreadCount: 1,
      status: 'online',
      role: 'student'
    },
    {
      id: '3',
      participantId: '3',
      participantName: 'محمد سعد',
      participantAvatar: '👨‍💻',
      lastMessage: 'متى موعد الاختبار النهائي؟',
      lastMessageTime: 'أمس',
      unreadCount: 0,
      status: 'away',
      role: 'student'
    },
    {
      id: '4',
      participantId: '4',
      participantName: 'د. سارة أحمد',
      participantAvatar: '👩‍🏫',
      lastMessage: 'اجتماع لجنة المناهج غداً الساعة 2 ظهراً',
      lastMessageTime: 'أمس',
      unreadCount: 0,
      status: 'offline',
      role: 'instructor'
    }
  ];

  // Mock data للرسائل
  const messages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'أحمد محمد',
        senderAvatar: '🧑‍💻',
        content: 'السلام عليكم دكتور، لدي سؤال حول الدرس الأخير',
        timestamp: '09:30 ص',
        isRead: true,
        type: 'received'
      },
      {
        id: '2',
        senderId: 'instructor',
        senderName: 'أنت',
        content: 'وعليكم السلام، تفضل بطرح سؤالك',
        timestamp: '09:35 ص',
        isRead: true,
        type: 'sent'
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'أحمد محمد',
        senderAvatar: '🧑‍💻',
        content: 'أواجه صعوبة في فهم مفهوم الوراثة في البرمجة الكائنية',
        timestamp: '09:40 ص',
        isRead: true,
        type: 'received'
      },
      {
        id: '4',
        senderId: 'instructor',
        senderName: 'أنت',
        content: 'لا مشكلة، سأوضح لك المفهوم بطريقة مبسطة. الوراثة تعني أن كلاس معين يمكنه أن يرث خصائص وطرق من كلاس آخر...',
        timestamp: '09:45 ص',
        isRead: true,
        type: 'sent'
      },
      {
        id: '5',
        senderId: '1',
        senderName: 'أحمد محمد',
        senderAvatar: '🧑‍💻',
        content: 'شكراً لك على الشرح الرائع في المحاضرة الأخيرة',
        timestamp: '10:30 ص',
        isRead: false,
        type: 'received'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '2',
        senderName: 'فاطمة علي',
        senderAvatar: '👩‍💻',
        content: 'هل يمكنك مساعدتي في حل المشكلة في الواجب؟',
        timestamp: 'أمس 8:20 م',
        isRead: false,
        type: 'received'
      }
    ]
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // هنا سيتم إرسال الرسالة للـ API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return '🎓';
      case 'instructor': return '👨‍🏫';
      case 'admin': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - قائمة المحادثات */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">الرسائل</h2>
          <Input
            placeholder="البحث في المحادثات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {conversation.participantAvatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participantName}
                      </h3>
                      <span className="text-lg">{getRoleIcon(conversation.role)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="primary" size="sm">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header المحادثة */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {conversations.find(c => c.id === selectedConversation)?.participantAvatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversations.find(c => c.id === selectedConversation)?.status || 'offline')}`}></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.participantName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.id === selectedConversation)?.status === 'online' ? 'متصل الآن' : 'غير متصل'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">📞</Button>
                  <Button variant="ghost" size="sm">📹</Button>
                  <Button variant="ghost" size="sm">⚙️</Button>
                </div>
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start space-x-3 ${
                    message.type === 'sent' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {message.type === 'received' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {message.senderAvatar}
                    </div>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'sent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* إرسال رسالة جديدة */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="اكتب رسالتك هنا..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6"
                >
                  إرسال
                </Button>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <Button variant="ghost" size="sm">📎</Button>
                <Button variant="ghost" size="sm">😊</Button>
                <Button variant="ghost" size="sm">📷</Button>
                <Button variant="ghost" size="sm">🎤</Button>
              </div>
            </div>
          </>
        ) : (
          /* حالة عدم اختيار محادثة */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة للبدء</h3>
              <p className="text-gray-600">اختر محادثة من القائمة للبدء في التواصل</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 