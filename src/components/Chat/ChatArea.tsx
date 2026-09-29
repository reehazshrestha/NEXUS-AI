"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { uid } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sparkles, Menu, Brain } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatStore, Message } from "@/lib/store";
import {
  DEFAULT_MODELS,
  fetchModels,
  generateTitle,
  isThinkingModel,
  resolveModel,
  splitFollowUps,
  streamChat,
  stripForStreaming,
  type ModelInfo,
} from "@/lib/chat-api";

interface ChatAreaProps {
  onToggleSidebar: () => void;
}

export default function ChatArea({ onToggleSidebar }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [models, setModels] = useState<ModelInfo[]>(DEFAULT_MODELS);
  const {
    currentChatId,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    model,
    thinking,
    setModel,
    setThinking,
    setMessages,
    resetStreaming,
  } = useChatStore();

  useEffect(() => {
    fetchModels().then((list) => {
      setModels(list);
      const { model: current, setModel: set } = useChatStore.getState();
      if (!list.some((m) => m.id === current)) {
        set(list.find((m) => m.id === "gemini-3.5-flash")?.id ?? list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isLoading]);

  const hasThinking = models.some((m) => isThinkingModel(m.id));
  const baseModel = model
    .replace("-thinking-lite", "")
    .replace("-thinking", "");
  const pickable = models.filter((m) => !isThinkingModel(m.id));

  // Generates the assistant reply for the current chat's messages.
  const generate = useCallback(
    async (chatId: string) => {
      const store = useChatStore.getState();
      const controller = new AbortController();
      abortRef.current = controller;
      const startedAt = Date.now();
      const history = store.messages;
      const lastUser = [...history].reverse().find((m) => m.role === "user");
      const isFirstExchange =
        history.filter((m) => m.role === "user").length === 1;
      const push = (m: Partial<Message>) =>
        useChatStore.getState().addMessage({
          id: uid(),
          chat_id: chatId,
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
          responseMs: Date.now() - startedAt,
          ...m,
        });

      store.setIsLoading(true);
      try {
        let raw = "";
        let reasoning = "";
        store.setStreamingContent("");
        useChatStore.setState({ streamingReasoning: "" });
        try {
          await streamChat({
            model: resolveModel(store.model, store.thinking, models),
            history: history
              .slice(-30)
              .map((m) => ({ role: m.role, content: m.content })),
            signal: controller.signal,
            onContent: (chunk) => {
              if (!useChatStore.getState().isStreaming) {
                useChatStore.getState().setIsLoading(false);
                useChatStore.getState().setIsStreaming(true);
              }
              raw += chunk;
              useChatStore
                .getState()
                .setStreamingContent(stripForStreaming(raw));
            },
            onReasoning: (chunk) => {
              reasoning += chunk;
              useChatStore.getState().appendStreamingReasoning(chunk);
            },
          });
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            raw += (raw ? "\n\n" : "") + "⚠️ " + (err as Error).message;
            toast.error("Request failed — " + (err as Error).message);
          }
        }

        const { content, followUps } = splitFollowUps(raw);
        if (content.trim() || reasoning.trim()) {
          push({
            content: content || (raw ? "" : "⏹ Stopped."),
            reasoning: reasoning || undefined,
            followUps: followUps.length ? followUps : undefined,
          });
        } else if (controller.signal.aborted) {
          push({ content: "⏹ Stopped." });
        } else {
          push({
            content: "⚠️ The assistant returned an empty response. Try again.",
          });
        }

        if (isFirstExchange && lastUser && !controller.signal.aborted) {
          generateTitle(lastUser.content, store.model).then((title) => {
            if (title) useChatStore.getState().updateChatTitle(chatId, title);
          });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          push({ content: "⚠️ " + (err as Error).message });
          toast.error("Request failed — " + (err as Error).message);
        }
      } finally {
        abortRef.current = null;
        resetStreaming();
        useChatStore.getState().setIsLoading(false);
      }
    },
    [models, resetStreaming],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const store = useChatStore.getState();
      if (store.isLoading || store.isStreaming) return;
      let chatId = store.currentChatId;
      if (!chatId) {
        chatId = uid();
        store.addChat({
          id: chatId,
          user_id: "local",
          title: content.slice(0, 40) + (content.length > 40 ? "…" : ""),
          created_at: new Date().toISOString(),
        });
        store.setCurrentChatId(chatId);
        store.setMessages([]);
      } else if (
        store.chats.find((c) => c.id === chatId)?.title === "New Chat"
      ) {
        store.updateChatTitle(
          chatId,
          content.slice(0, 40) + (content.length > 40 ? "…" : ""),
        );
      }
      useChatStore.getState().addMessage({
        id: uid(),
        chat_id: chatId,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      });
      await generate(chatId);
    },
    [generate],
  );

  const handleStop = () => abortRef.current?.abort();

  const handleRegenerate = async () => {
    const store = useChatStore.getState();
    if (!store.currentChatId || store.messages.length < 2) return;
    if (store.messages[store.messages.length - 1].role !== "assistant") return;
    setMessages(store.messages.slice(0, -1));
    await generate(store.currentChatId);
  };

  const controls = (
    <div className="ml-auto flex items-center gap-2">
      {hasThinking && (
        <button
          onClick={() => setThinking(!thinking)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
            thinking
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          Thinking
        </button>
      )}
      <select
        value={baseModel}
        onChange={(e) => setModel(e.target.value)}
        className="max-w-[180px] rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
      >
        {pickable.map((m) => (
          <option key={m.id} value={m.id} title={m.description}>
            {m.id}
          </option>
        ))}
      </select>
    </div>
  );

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
          {controls}
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
        {controls}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            onRegenerate={
              index === messages.length - 1 &&
              message.role === "assistant" &&
              !isLoading &&
              !isStreaming
                ? handleRegenerate
                : undefined
            }
            onFollowUp={
              index === messages.length - 1 && !isLoading && !isStreaming
                ? sendMessage
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
                <div className="flex items-center gap-2 pt-2">
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
