// ============================================
// RAVEN STORE — DISCORD WEBHOOK HELPER
// ============================================

import type { Order, DiscordWebhookPayload } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

const DISCORD_COLORS = {
  success: 0x00ff88,
  warning: 0xffaa00,
  error: 0xff4444,
  info: 0x4488ff,
  purple: 0x9b59b6,
} as const;

// ============================================
// SEND WEBHOOK
// ============================================
async function sendWebhook(
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[Discord] Webhook failed:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Discord] Webhook error:", err);
    return false;
  }
}

// ============================================
// NOTIFY NEW ORDER
// ============================================
export async function notifyNewOrder(order: Order): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_ORDERS;
  if (!webhookUrl) return;

  const itemList = (order.items as any[])
    .map((item) => `• **${item.product_title}** — ${formatPrice(item.price)}`)
    .join("\n");

  const payload: DiscordWebhookPayload = {
    username: "Raven Store",
    avatar_url: "https://i.imgur.com/raven-logo.png",
    embeds: [
      {
        title: "🛒 Order Baru Masuk!",
        color: DISCORD_COLORS.success,
        fields: [
          {
            name: "Order Number",
            value: `\`${order.order_number}\``,
            inline: true,
          },
          {
            name: "Customer",
            value: order.user_email,
            inline: true,
          },
          {
            name: "Status",
            value: `\`${order.status.toUpperCase()}\``,
            inline: true,
          },
          {
            name: "Items",
            value: itemList || "—",
            inline: false,
          },
          {
            name: "Total",
            value: `**${formatPrice(order.total_amount)}**`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Raven Store Payment System" },
      },
    ],
  };

  await sendWebhook(webhookUrl, payload);
}

// ============================================
// NOTIFY ORDER PAID
// ============================================
export async function notifyOrderPaid(order: Order): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_ORDERS;
  if (!webhookUrl) return;

  const payload: DiscordWebhookPayload = {
    username: "Raven Store",
    embeds: [
      {
        title: "✅ Pembayaran Berhasil!",
        color: DISCORD_COLORS.success,
        fields: [
          {
            name: "Order Number",
            value: `\`${order.order_number}\``,
            inline: true,
          },
          {
            name: "Customer",
            value: order.user_email,
            inline: true,
          },
          {
            name: "Total Dibayar",
            value: `**${formatPrice(order.total_amount)}**`,
            inline: true,
          },
          {
            name: "Metode Bayar",
            value: order.payment_method ?? "—",
            inline: true,
          },
          {
            name: "Waktu",
            value: formatDate(new Date().toISOString(), "full"),
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Raven Store Payment System" },
      },
    ],
  };

  await sendWebhook(webhookUrl, payload);
}

// ============================================
// NOTIFY ORDER CANCELLED
// ============================================
export async function notifyOrderCancelled(order: Order): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_ORDERS;
  if (!webhookUrl) return;

  const payload: DiscordWebhookPayload = {
    username: "Raven Store",
    embeds: [
      {
        title: "❌ Order Dibatalkan",
        color: DISCORD_COLORS.error,
        fields: [
          { name: "Order Number", value: `\`${order.order_number}\``, inline: true },
          { name: "Customer", value: order.user_email, inline: true },
          { name: "Total", value: formatPrice(order.total_amount), inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Raven Store Payment System" },
      },
    ],
  };

  await sendWebhook(webhookUrl, payload);
}

// ============================================
// NOTIFY ADMIN (generic alert)
// ============================================
export async function notifyAdmin(
  title: string,
  message: string,
  level: "info" | "warning" | "error" = "info"
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_ADMIN;
  if (!webhookUrl) return;

  const colorMap = {
    info: DISCORD_COLORS.info,
    warning: DISCORD_COLORS.warning,
    error: DISCORD_COLORS.error,
  };

  const payload: DiscordWebhookPayload = {
    username: "Raven Admin Bot",
    embeds: [
      {
        title,
        description: message,
        color: colorMap[level],
        timestamp: new Date().toISOString(),
        footer: { text: "Raven Store Admin System" },
      },
    ],
  };

  await sendWebhook(
    process.env.DISCORD_WEBHOOK_ADMIN ?? webhookUrl,
    payload
  );
}
