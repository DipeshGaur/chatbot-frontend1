import React, { useState, useRef, useEffect } from "react";
import { Send, Utensils, Sparkles, HeadphonesIcon } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import OrderStatus from "./OrderStatus";
import SupportModeIndicator from "./SupportModeIndicator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import "../styles/components.css";

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'failed' | 'delayed';
  paymentStatus: 'pending' | 'success' | 'failed';
  estimatedTime?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to FoodieBot 🍕 I'm here to help you with your food delivery needs. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSupportMode, setIsSupportMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate or retrieve session ID on component mount
  const [sessionId, setSessionId] = useState<string>(() => {
    const existingSessionId = localStorage.getItem('foodiebot_session_id');
    if (existingSessionId) {
      console.log('Using existing session ID:', existingSessionId);
      return existingSessionId;
    } else {
      // Generate new session ID using crypto API
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('foodiebot_session_id', newSessionId);
      console.log('Created new session ID:', newSessionId);
      return newSessionId;
    }
  });

  // API Configuration
  const API_BASE_URL = "https://chatbot-backend-1-q03j.onrender.com";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add user message to chat
  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
  };

  // Add bot message to chat
  const addBotMessage = (text: string, messageType?: Message['messageType']) => {
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      messageType,
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Send message to backend API with manual session management
  const sendMessageToAPI = async (message: string) => {
    try {
      console.log('Sending message with session ID:', sessionId);
      
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId, // Send session ID in header
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId // Also send in body for redundancy
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Session expired. Please refresh the page.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Response received for session:', sessionId);
      return data.response;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', error.message);
        
        if (error.message.includes('fetch')) {
          return "Unable to connect to server. Please check your internet connection.";
        } else if (error.message.includes('Session expired')) {
          return "Your session has expired. Please refresh the page to continue.";
        } else {
          return "Sorry, I'm having trouble connecting to the server. Please try again later.";
        }
      } else {
        console.error('Unknown API error:', error);
        return "Sorry, I'm having trouble connecting to the server. Please try again later.";
      }
    }
  };

  // Check if user wants to switch to support mode
  const checkForSupportMode = (message: string) => {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes("customer support") || 
           lowerMessage.includes("support") || 
           lowerMessage.includes("help with order") ||
           lowerMessage.includes("complaint");
  };

  // Switch to support mode
  const switchToSupportMode = () => {
    setIsSupportMode(true);
    addBotMessage(
      "You are now connected to Customer Support Bot. I have access to your order details and I'm here to help resolve any issues. How can I assist you?", 
      'support_transition'
    );
  };

  // Handle sending message
  const handleSendMessage = async (messageText?: string) => {
    const msg = messageText ?? inputValue.trim();
    if (!msg) return;

    // Reset session error state
    setSessionError(false);

    // Add user message immediately
    addUserMessage(msg);
    setInputValue("");
    
    // Check if user wants to switch to support mode
    if (checkForSupportMode(msg) && !isSupportMode) {
      setTimeout(() => {
        switchToSupportMode();
      }, 1000);
      return;
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send to backend and get response
      const botResponse = await sendMessageToAPI(msg);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Check for session-related errors
      if (botResponse.includes("session has expired") || botResponse.includes("Session ID required")) {
        setSessionError(true);
      }
      
      // Add bot response
      addBotMessage(botResponse);
      
      // Check if the response indicates an order was created
      if (botResponse.toLowerCase().includes("order") && 
          (botResponse.toLowerCase().includes("confirmed") || 
           botResponse.toLowerCase().includes("placed"))) {
        const newOrder: Order = {
          id: `FD${Date.now()}`,
          restaurant: "Selected Restaurant",
          items: ["Selected Items"],
          total: Math.floor(Math.random() * 50) + 15,
          status: 'confirmed',
          paymentStatus: 'success',
          estimatedTime: '25-30 minutes'
        };
        setCurrentOrder(newOrder);
      }
      
    } catch (error) {
      setIsTyping(false);
      setSessionError(true);
      
      if (error instanceof Error) {
        console.error('Send message error:', error.message);
      } else {
        console.error('Unknown send error:', error);
      }
      
      addBotMessage("Sorry, I encountered an error. Please try again.", 'normal');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-glass-container">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <Avatar className={`chat-avatar ${isSupportMode ? "chat-avatar-support" : "chat-avatar-bot"}`}>
              <AvatarFallback className="chat-avatar-fallback">
                {isSupportMode ? <HeadphonesIcon size={28} /> : <Utensils size={28} />}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="chat-header-title">
                {isSupportMode ? "Customer Support" : "FoodieBot"}
                <Sparkles size={24} className="chat-header-sparkle" />
              </div>
              <div className="chat-header-subtitle">
                {isSupportMode
                  ? "Support Bot - Here to help with your order"
                  : "Your AI Food Delivery Assistant"}
              </div>
            </div>
          </div>
          {isSupportMode && <SupportModeIndicator />}
        </div>

        {/* Session Error Warning */}
        {sessionError && (
          <div className="session-error-warning">
            <p>⚠️ Session issue detected. If problems persist, please refresh the page.</p>
          </div>
        )}

        {/* Order Status Display */}
        {currentOrder && !isSupportMode && (
          <OrderStatus order={currentOrder} />
        )}

        {/* Messages */}
        <div className="chat-messages">
          <div className="chat-messages-content">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionClick={handleSendMessage}
                isSupportMode={isSupportMode}
              />
            ))}
            {isTyping && <TypingIndicator isSupportMode={isSupportMode} />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isSupportMode ? "Describe your issue..." : "Type your message..."}
                className="chat-input"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`chat-send-btn ${isSupportMode ? "support" : "normal"}`}
            >
              <Send size={20} />
            </button>
          </div>
          {!isSupportMode && (
            <div className="chat-support-hint">
              Type "customer support" anytime to get help with your order
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
