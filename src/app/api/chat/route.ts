import { NextRequest, NextResponse } from "next/server";
import { streamGroqResponse, ChatMessage } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";

// Simple rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 50; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 },
      );
    }

    const { messages } = (await request.json()) as {
      messages: ChatMessage[];
      chatId: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 },
      );
    }

    // Check subscription for message limits
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    const plan = subscription?.plan || "free";

    if (plan === "free") {
      // Check daily message count
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user")
        .gte("created_at", today.toISOString())
        .in(
          "chat_id",
          (
            await supabase.from("chats").select("id").eq("user_id", user.id)
          ).data?.map((c) => c.id) || [],
        );

      if ((count || 0) >= 10) {
        return NextResponse.json(
          {
            error:
              "Daily message limit reached. Upgrade to Pro for unlimited messages.",
          },
          { status: 403 },
        );
      }
    }

    const stream = await streamGroqResponse(messages);

    if (!stream) {
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 },
      );
    }

    // Return streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
