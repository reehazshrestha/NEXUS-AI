"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Trash2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useChatStore, Chat } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();
  const {
    chats,
    setChats,
    currentChatId,
    setCurrentChatId,
    setMessages,
    addChat,
    deleteChat,
  } = useChatStore();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadChats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setChats(data);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("chats")
        .insert([
          {
            user_id: user.id,
            title: "New Chat",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        addChat(data);
        setCurrentChatId(data.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat");
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    setCurrentChatId(chat.id);
    try {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from("messages").delete().eq("chat_id", chatId);
      await supabase.from("chats").delete().eq("id", chatId);
      deleteChat(chatId);
      toast.success("Chat deleted");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          width: 280,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full z-40 lg:relative lg:translate-x-0! lg:transform-none! flex flex-col bg-sidebar border-r border-sidebar-border"
        style={{ width: 280 }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-purple-500 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">NexusAI</span>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat list */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleSelectChat(chat)}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  className={`w-full min-w-0 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    currentChatId === chat.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
                  <span className="truncate flex-1 min-w-0 text-left">
                    {chat.title}
                  </span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: hoveredChat === chat.id ? 1 : 0, scale: hoveredChat === chat.id ? 1 : 0.8 }}
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="flex-shrink-0 p-1 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Bottom actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link href="/settings">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
