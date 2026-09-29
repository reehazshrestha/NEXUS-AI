"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatStore, Message } from "@/lib/store";

interface ChatAreaProps {
  onToggleSidebar: () => void;
}

export default function ChatArea({ onToggleSidebar }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const {
    currentChatId,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    setMessages,
    addMessage,
    setIsLoading,
    setIsStreaming,
    setStreamingContent,
    appendStreamingContent,
    resetStreaming,
    setCurrentChatId,
    addChat,
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const sendMessage = useCallback(
    async (content: string) => {
      let chatId = currentChatId;

      if (!chatId) {
        chatId = crypto.randomUUID();
        addChat({
          id: chatId,
          user_id: "local",
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          created_at: new Date().toISOString(),
        });
        setCurrentChatId(chatId);
      }

      addMessage({
        id: crypto.randomUUID(),
        chat_id: chatId,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      });
      setIsLoading(true);
      abortRef.current = false;

      // Placeholder reply, no backend connected
      const reply = `This is a demo response. No AI backend is connected.\n\nYou said: "${content}"`;
      await new Promise((r) => setTimeout(r, 600));

      setIsStreaming(true);
      setStreamingContent("");
      setIsLoading(false);

      let shown = "";
      for (const word of reply.split(/(?<=\s)/)) {
        if (abortRef.current) break;
        shown += word;
        appendStreamingContent(word);
        await new Promise((r) => setTimeout(r, 30));
      }

      if (shown) {
        addMessage({
          id: crypto.randomUUID(),
          chat_id: chatId,
          role: "assistant",
          content: shown,
          created_at: new Date().toISOString(),
        });
      }
      resetStreaming();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChatId, messages],
  );

  const handleStop = () => {
    abortRef.current = true;
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // Remove last assistant message
    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);

    // Resend
    await sendMessage(lastUserMessage.content);
  };

  // Empty state
  if (!currentChatId && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            New conversation
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center px-4 max-w-lg"
          >
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              How can I help you today?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ask me anything — from coding questions to creative writing.
              I&apos;m powered by advanced AI to give you fast, accurate
              responses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Explain quantum computing in simple terms",
                "Write a Python function to sort a list",
                "Draft a professional email template",
                "Create a workout plan for beginners",
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <ChatInput
          onSend={sendMessage}
          onStop={handleStop}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          NexusAI
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRegenerate={
              index === messages.length - 1 && message.role === "assistant"
                ? handleRegenerate
                : undefined
            }
          />
        ))}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <ChatMessage
            message={{
              id: "streaming",
              chat_id: currentChatId || "",
              role: "assistant",
              content: streamingContent,
              created_at: new Date().toISOString(),
            }}
            isStreaming
          />
        )}

        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center glow-subtle flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={sendMessage}
        onStop={handleStop}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
    </div>
  );
}
