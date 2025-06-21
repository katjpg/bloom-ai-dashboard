"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Message {
  username: string;
  content: string;
  avatarColor: string;
  textColor?: string;
  duration: number;
}

interface ChatDemoProps {
  onMessageComplete?: (messageIndex: number) => void;
}

const gamingMessages: Message[] = [
  {
    username: "NoobSlayer42",
    content: "gg everyone, great match!",
    avatarColor: "bg-blue-500/30",
    textColor: "text-blue-400",
    duration: 3000,
  },
  {
    username: "xXDragonXx",
    content: "you guys are trash, uninstall the game",
    avatarColor: "bg-red-500/30", 
    textColor: "text-red-400",
    duration: 2500,
  },
  {
    username: "GamerGirl2024",
    content: "hey everyone! anyone want to team up?",
    avatarColor: "bg-purple-500/30",
    textColor: "text-purple-400", 
    duration: 3500,
  },
  {
    username: "ProGamer_Elite",
    content: "nice strategy on that last round",
    avatarColor: "bg-green-500/30",
    textColor: "text-green-400",
    duration: 2800,
  },
  {
    username: "ToxicKid99", 
    content: "this lobby is full of idiots",
    avatarColor: "bg-orange-500/30",
    textColor: "text-orange-400",
    duration: 2200,
  },
];

export function ChatDemo({ onMessageComplete }: ChatDemoProps) {
  const [visibleMessages, setVisibleMessages] = useState<(Message & { id: number })[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [currentTypingMessage, setCurrentTypingMessage] = useState<Message | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const typeMessage = (message: Message, messageIndex: number, callback: () => void) => {
      setIsTyping(true);
      setTypingText("");
      setCurrentTypingMessage(message);
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex <= message.content.length) {
          setTypingText(message.content.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setCurrentTypingMessage(null);
          
          // Add complete message
          const newMessage = { ...message, id: Date.now() };
          setVisibleMessages(prev => [...prev, newMessage].slice(-4));
          
          // Notify parent that message is complete
          if (onMessageComplete) {
            onMessageComplete(messageIndex);
          }
          
          setTimeout(callback, 500);
        }
      }, 50);
    };

    const addMessage = () => {
      const messageIndex = currentIndexRef.current;
      const message = gamingMessages[messageIndex];
      currentIndexRef.current = (currentIndexRef.current + 1) % gamingMessages.length;

      typeMessage(message, messageIndex, () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(addMessage, message.duration);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentIndexRef.current = 0;
          setVisibleMessages([]);
          addMessage();
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setVisibleMessages([]);
          setIsTyping(false);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative rounded-xl lg:rounded-[24px] border border-neutral-700 bg-neutral-800/50 backdrop-blur-lg p-2 md:p-4">
        <div className="absolute top-1/4 left-1/2 -z-10 w-3/4 h-1/4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 -translate-x-1/2 -translate-y-1/2 blur-[3rem]"></div>
        
        <div className="rounded-lg lg:rounded-[20px] border border-neutral-700 bg-black/90 overflow-hidden">
          {/* Channel Header */}
          <div className="border-b border-neutral-700 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-white">#lobby</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400 text-sm">general chat</span>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 flex flex-col justify-end gap-3 overflow-hidden">
            {visibleMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${message.avatarColor}`}></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm ${message.textColor}`}>
                      {message.username}
                    </span>
                    <span className="text-gray-500 text-xs">just now</span>
                  </div>
                  <p className="text-gray-300 text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${currentTypingMessage?.avatarColor}`}></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm ${currentTypingMessage?.textColor}`}>
                      {currentTypingMessage?.username}
                    </span>
                    <span className="text-gray-500 text-xs">just now</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {typingText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-0.5"
                    >
                      |
                    </motion.span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}