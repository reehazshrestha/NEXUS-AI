"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatStore, Message } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ChatAreaProps {
  onToggleSidebar: () => void;
}

export default function ChatArea({ onToggleSidebar }: ChatAreaProps) {
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
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

      // Create new chat if none exists
      if (!chatId) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            toast.error("Please log in to send messages");
            return;
          }

          const { data: newChat, error } = await supabase
            .from("chats")
            .insert([
              {
                user_id: user.id,
                title:
                  content.slice(0, 50) + (content.length > 50 ? "..." : ""),
              },
            ])
            .select()
            .single();

          if (error) throw error;
          chatId = newChat.id;
          addChat(newChat);
          setCurrentChatId(chatId);
        } catch (error) {
          const e = error as { message?: string; code?: string; details?: string; hint?: string };
          console.error("Error creating chat:", e.message, e.code, e.details, e.hint, error);
          toast.error(e.message || "Failed to create chat");
          return;
        }
      }

      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        chat_id: chatId!,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };

      addMessage(userMessage);
      setIsLoading(true);

      // Save user message to DB
      try {
        await supabase.from("messages").insert([
          {
            chat_id: chatId,
            role: "user",
            content,
          },
        ]);
      } catch (error) {
        console.error("Error saving message:", error);
      }

      // Send to API
      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Gather conversation context
        const conversationMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content },
        ];

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationMessages,
            chatId,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send message");
        }

        setIsStreaming(true);
        setStreamingContent("");
        setIsLoading(false);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    fullContent += content;
                    appendStreamingContent(content);
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        }

        // Add completed assistant message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          chat_id: chatId!,
          role: "assistant",
          content: fullContent,
          created_at: new Date().toISOString(),
        };

        addMessage(assistantMessage);
        resetStreaming();

        // Save assistant message to DB
        await supabase.from("messages").insert([
          {
            chat_id: chatId,
            role: "assistant",
            content: fullContent,
          },
        ]);

        // Update chat title if it was a new chat
        if (messages.length === 0) {
          const title =
            content.slice(0, 50) + (content.length > 50 ? "..." : "");
          await supabase.from("chats").update({ title }).eq("id", chatId);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // User stopped the generation
          if (streamingContent) {
            const assistantMessage: Message = {
              id: crypto.randomUUID(),
              chat_id: chatId!,
              role: "assistant",
              content: streamingContent,
              created_at: new Date().toISOString(),
            };
            addMessage(assistantMessage);
          }
          resetStreaming();
        } else {
          console.error("Chat error:", error);
          toast.error((error as Error).message || "Failed to get AI response");
          setIsLoading(false);
          resetStreaming();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChatId, messages],
  );

  const handleStop = () => {
    abortControllerRef.current?.abort();
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
