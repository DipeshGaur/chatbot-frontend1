import React from "react";
import ChatInterface from "./components/ChatInterface";
import './chatui.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1443] via-[#2a1e5c] to-[#3b2062] flex items-center justify-center text-white">
      <ChatInterface />
    </div>
  );
}

export default App;
