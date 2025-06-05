import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bot, HeadphonesIcon } from "lucide-react";
import "../styles/components.css";
import React from "react";

interface TypingIndicatorProps {
  isSupportMode?: boolean;
}

const TypingIndicator = ({ isSupportMode }: TypingIndicatorProps) => {
  const avatarClass = `chat-avatar ${isSupportMode ? 'chat-avatar-support' : 'chat-avatar-bot'}`;
  const bubbleClass = `typing-bubble ${isSupportMode ? 'support' : 'normal'}`;
  const dotClass = `typing-dot ${isSupportMode ? 'support' : 'normal'}`;

  return (
    <div className="typing-indicator">
      <Avatar className={avatarClass}>
        <AvatarFallback className="chat-avatar-fallback">
          {isSupportMode ? <HeadphonesIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={bubbleClass}>
        <div className="typing-dots">
          <div className={dotClass}></div>
          <div className={dotClass}></div>
          <div className={dotClass}></div>
          <span className="typing-text">
            {isSupportMode ? "Support agent is typing..." : "FoodieBot is typing..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
