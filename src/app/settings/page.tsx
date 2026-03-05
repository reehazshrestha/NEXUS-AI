"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  User,
  CreditCard,
  Trash2,
  ArrowLeft,
  Save,
  Crown,
  AlertTriangle,
  Key,
  Copy,
  RefreshCw,
  Palette,
  Check,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { THEMES, type ThemeId, getTheme, setTheme } from "@/components/ThemeProvider";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface SubscriptionData {
  plan: string;
  status: string;
  renew_date?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: "free",
    status: "active",
  });
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("nebula");

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  const handleThemeChange = (theme: ThemeId) => {
    setTheme(theme);
    setCurrentTheme(theme);
    toast.success(`Theme changed to ${theme}`);
  };

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const part = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setApiKey(`nxai-${part(8)}-${part(12)}-${part(8)}-${part(16)}`);
    setCopied(false);
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }

      setUser(authUser as unknown as UserData);
      setName(authUser.user_metadata?.full_name || "");

      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error saving name:", error);
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      toast.success(
        "To cancel your subscription, please contact support@nexusai.com",
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border glass">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-purple-500 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">NexusAI</span>
          </div>
          <h1 className="text-lg font-semibold ml-2">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Display Name
              </Label>
              <div className="flex gap-3">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl bg-secondary/50 border-border max-w-sm"
                  placeholder="Your name"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-11 rounded-xl bg-secondary/50 border-border max-w-sm opacity-60"
              />
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose your color theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  currentTheme === theme.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/20 hover:bg-secondary/40"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border border-black/10"
                  style={{ background: `linear-gradient(135deg, ${theme.bg} 50%, ${theme.accent} 50%)` }}
                >
                  {currentTheme === theme.id && (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{theme.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{theme.description}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Subscription</h2>
              <p className="text-sm text-muted-foreground">
                Manage your plan and billing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold capitalize">
                  {subscription.plan} Plan
                </span>
                <Badge
                  variant={
                    subscription.status === "active" ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {subscription.status}
                </Badge>
                {subscription.plan === "pro" && (
                  <Crown className="w-4 h-4 text-amber-400" />
                )}
              </div>
              {subscription.renew_date && (
                <p className="text-sm text-muted-foreground">
                  Renews on{" "}
                  {new Date(subscription.renew_date).toLocaleDateString()}
                </p>
              )}
            </div>
            {subscription.plan === "free" ? (
              <Link href="/pricing">
                <Button className="rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                className="rounded-xl"
              >
                Cancel Plan
              </Button>
            )}
          </div>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">API Key</h2>
              <p className="text-sm text-muted-foreground">
                Use this key to access the NexusAI API
              </p>
            </div>
          </div>

          {apiKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 border border-border font-mono text-sm overflow-x-auto">
                <span className="flex-1 text-muted-foreground select-all">{apiKey}</span>
                <button
                  onClick={copyApiKey}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  title="Copy key"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-400">Copied to clipboard!</p>}
              <p className="text-xs text-muted-foreground">
                Store this key securely — it will not be shown again after you leave this page.
              </p>
              <Button
                variant="outline"
                onClick={generateApiKey}
                className="rounded-xl gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Key
              </Button>
            </div>
          ) : (
            <Button
              onClick={generateApiKey}
              className="rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white gap-2"
            >
              <Key className="w-4 h-4" />
              Generate API Key
            </Button>
          )}
        </motion.div>

        <Separator />

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-destructive/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive">
                Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground">
                Irreversible account actions
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <p className="text-sm text-destructive mb-4">
                Are you sure? This will permanently delete your account, all
                chats, and cancel any active subscriptions. This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="rounded-xl"
                >
                  Yes, delete my account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
