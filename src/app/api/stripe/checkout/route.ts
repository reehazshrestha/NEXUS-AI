import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Check for existing Stripe customer
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "business" ? "NexusAI Business" : "NexusAI Pro",
              description: plan === "business"
                ? "Advanced AI tools for growing teams"
                : "Unlimited AI chat with priority responses",
            },
            recurring: {
              interval: "month",
            },
            unit_amount: plan === "business" ? 2500 : 1000, // $25.00 or $10.00
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
