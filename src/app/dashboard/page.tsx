"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store";
import Sidebar from "@/components/Chat/Sidebar";
import ChatArea from "@/components/Chat/ChatArea";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    useChatStore.persist.rehydrate();
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatArea onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  );
}
