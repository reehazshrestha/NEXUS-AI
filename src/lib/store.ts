import { create } from "zustand";

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  chatMessages: Record<string, Message[]>;
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChatId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  resetStreaming: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChatId: null,
  messages: [],
  chatMessages: {},
  isLoading: false,
  isStreaming: false,
  streamingContent: "",

  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  deleteChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      currentChatId:
        state.currentChatId === chatId ? null : state.currentChatId,
      messages: state.currentChatId === chatId ? [] : state.messages,
      chatMessages: Object.fromEntries(
        Object.entries(state.chatMessages).filter(([id]) => id !== chatId),
      ),
    })),
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setMessages: (messages) =>
    set((state) => ({
      messages,
      chatMessages: state.currentChatId
        ? { ...state.chatMessages, [state.currentChatId]: messages }
        : state.chatMessages,
    })),
  addMessage: (message) =>
    set((state) => {
      const messages = [...state.messages, message];
      return {
        messages,
        chatMessages: { ...state.chatMessages, [message.chat_id]: messages },
      };
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingContent: (streamingContent) => set({ streamingContent }),
  appendStreamingContent: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),
  resetStreaming: () => set({ isStreaming: false, streamingContent: "" }),
}));
