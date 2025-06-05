import { HeadphonesIcon } from "lucide-react";
import "../styles/components.css";
import React from "react";

const SupportModeIndicator = () => {
  return (
    <div className="support-indicator">
      <HeadphonesIcon className="support-indicator-icon" />
      <span className="support-indicator-text">
        Customer Support Mode Active
      </span>
      <div className="support-indicator-dot"></div>
    </div>
  );
};

export default SupportModeIndicator;
