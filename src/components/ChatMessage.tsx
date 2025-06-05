import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bot, User, HeadphonesIcon, AlertTriangle, CreditCard, Truck } from "lucide-react";
import React from "react";
import "../styles/components.css";

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
  messageType?: 'normal' | 'order_confirmation' | 'payment_failure' | 'delivery_delay' | 'support_transition';
}

interface ChatMessageProps {
  message: Message;
  onOptionClick: (option: string) => void;
  isSupportMode?: boolean;
}

const ChatMessage = ({ message, onOptionClick, isSupportMode }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getMessageIcon = () => {
    if (!message.isBot) return null;
    
    switch (message.messageType) {
      case 'payment_failure':
        return <CreditCard className="icon-red" />;
      case 'delivery_delay':
        return <Truck className="icon-orange" />;
      case 'support_transition':
        return <HeadphonesIcon className="icon-orange" />;
      case 'order_confirmation':
        return <AlertTriangle className="icon-green" />;
      default:
        return null;
    }
  };

  const getBubbleClass = () => {
    let baseClass = message.isBot ? "message-bubble bot" : "message-bubble user";
    if (isSupportMode && message.isBot) {
      baseClass += " support";
    }
    if (message.messageType && message.isBot) {
      baseClass += ` ${message.messageType.replace('_', '-')}`;
    }
    return baseClass;
  };

  const getAvatarClass = () => {
    if (message.isBot) {
      return `chat-avatar ${isSupportMode ? 'chat-avatar-support' : 'chat-avatar-bot'}`;
    } else {
      return `chat-avatar ${isSupportMode ? 'chat-avatar-support' : 'chat-avatar-bot'}`;
    }
  };

  return (
    <div className={`message-container ${message.isBot ? 'bot' : 'user'}`}>
      {message.isBot && (
        <Avatar className={getAvatarClass()}>
          <AvatarFallback className="chat-avatar-fallback">
            {isSupportMode ? <HeadphonesIcon /> : <Bot />}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`message-content ${message.isBot ? 'bot' : 'user'}`}>
        <div className={getBubbleClass()}>
          {message.isBot && getMessageIcon() && (
            <div className="message-icon-header">
              {getMessageIcon()}
              <span className="message-icon-label">
                {message.messageType === 'payment_failure' && 'Payment Issue'}
                {message.messageType === 'delivery_delay' && 'Delivery Update'}
                {message.messageType === 'support_transition' && 'Support Connected'}
                {message.messageType === 'order_confirmation' && 'Order Update'}
              </span>
            </div>
          )}
          <p className="message-text">
            {message.text}
          </p>
        </div>
        
        {message.options && message.options.length > 0 && (
          <div className="message-options">
            {message.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionClick(option)}
                className={`message-option-btn ${isSupportMode ? 'support' : 'normal'}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        <span className="message-timestamp">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {!message.isBot && (
        <Avatar className={getAvatarClass()}>
          <AvatarFallback className="chat-avatar-fallback">
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
