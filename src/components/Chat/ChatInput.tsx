"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  isStreaming: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isLoading,
  isStreaming,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 bg-secondary/50 border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message NexusAI..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-[15px] max-h-[200px] py-0.5"
              disabled={isLoading && !isStreaming}
            />
            {isStreaming ? (
              <Button
                type="button"
                onClick={onStop}
                size="icon"
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-destructive hover:bg-destructive/90"
              >
                <Square className="w-4 h-4 text-white" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2.5">
          NexusAI can make mistakes. Consider checking important information.
        </p>
      </div>
    </motion.div>
  );
}
