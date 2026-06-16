"use client";

import { ChatMessage } from "@/types";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-none bg-primary-600 text-white"
            : "rounded-bl-none bg-white text-slate-900 shadow-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
