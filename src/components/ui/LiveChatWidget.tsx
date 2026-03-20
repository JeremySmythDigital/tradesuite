'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
}

interface LiveChatWidgetProps {
  company?: string;
  trade?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
}

export function LiveChatWidget({
  company = 'TradeSuite',
  trade,
  welcomeMessage = "Hi! How can I help you today?",
  position = 'bottom-right',
  primaryColor = '#2563eb',
}: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    // Add welcome message when chat opens
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: welcomeMessage,
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    const container = document.getElementById('chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response (in production, this would connect to a chat server)
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        pricing: "Our pricing starts at $29/month for solo businesses. Would you like me to show you the full pricing options?",
        demo: "I'd be happy to help you schedule a demo! You can book one at tradesuite.app/book or I can have someone reach out to you.",
        support: "Our support team is available 24/7. For urgent issues, call (916) 555-0100. For non-urgent, I can create a ticket for you.",
        features: "TradeSuite includes client management, job tracking, estimates, invoices, scheduling, and reporting. What would you like to know more about?",
        default: "Thanks for your message! I'm here to help. You can ask about pricing, features, or schedule a demo.",
      };

      const lowerInput = userMessage.text.toLowerCase();
      let response = botResponses.default;
      
      if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('plan')) {
        response = botResponses.pricing;
      } else if (lowerInput.includes('demo') || lowerInput.includes('trial') || lowerInput.includes('try')) {
        response = botResponses.demo;
      } else if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('issue')) {
        response = botResponses.support;
      } else if (lowerInput.includes('feature') || lowerInput.includes('include') || lowerInput.includes('what')) {
        response = botResponses.features;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setHasNewMessage(true);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setHasNewMessage(false); }}
        className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${hasNewMessage ? 'animate-bounce' : ''}`}
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {hasNewMessage && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-all ${isMinimized ? 'h-14' : 'h-96'}`}
    >
      {/* Header */}
      <div
        className="h-14 px-4 flex items-center justify-between text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{company} Support</span>
          {trade && <span className="text-xs opacity-75">({trade})</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div
            id="chat-messages"
            className="h-64 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}