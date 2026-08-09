import "server-only";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Fire-and-forget — a Telegram hiccup should never break the caller's flow. */
async function sendTelegramMessage(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("Telegram notify failed:", err);
  }
}

export async function notifyNewComment(params: {
  authorName: string;
  content: string;
  articleTitle: string;
  articleUrl: string;
  isReply: boolean;
}) {
  const kind = params.isReply ? "Javob" : "Yangi izoh";
  await sendTelegramMessage(
    `💬 <b>${kind}</b>\n` +
      `<b>${escapeHtml(params.authorName)}</b>: ${escapeHtml(params.content)}\n\n` +
      `📰 ${escapeHtml(params.articleTitle)}\n` +
      `${params.articleUrl}`
  );
}

export async function notifyNewDonationInquiry(params: { name: string; email: string; message: string | null }) {
  await sendTelegramMessage(
    `💚 <b>Yangi yordam so'rovi (Donate)</b>\n` +
      `<b>${escapeHtml(params.name)}</b> — ${escapeHtml(params.email)}` +
      (params.message ? `\n${escapeHtml(params.message)}` : "")
  );
}

export async function notifyContractSigned(params: {
  signerName: string;
  signerEmail: string;
  startAt: Date;
  endAt: Date;
  amount: string;
  adminUrl: string;
}) {
  await sendTelegramMessage(
    `✍️ <b>Reklama shartnomasi imzolandi</b>\n` +
      `<b>${escapeHtml(params.signerName)}</b> — ${escapeHtml(params.signerEmail)}\n` +
      `💰 ${escapeHtml(params.amount)}\n\n` +
      `To'lov kutilmoqda.\n${params.adminUrl}`
  );
}

export async function notifyPaymentSubmitted(params: { signerName: string; amount: string; adminUrl: string }) {
  await sendTelegramMessage(
    `💳 <b>To'lov cheki yuklandi</b>\n` +
      `<b>${escapeHtml(params.signerName)}</b> — ${escapeHtml(params.amount)}\n\n` +
      `Tasdiqlash kerak.\n${params.adminUrl}`
  );
}

export async function notifyNewFeedback(params: {
  name: string;
  email: string;
  message: string;
  type: "SUGGESTION" | "COMPLAINT";
}) {
  const kind = params.type === "COMPLAINT" ? "Shikoyat" : "Taklif";
  await sendTelegramMessage(
    `📩 <b>Yangi ${kind}</b>\n` +
      `<b>${escapeHtml(params.name)}</b> — ${escapeHtml(params.email)}\n` +
      `${escapeHtml(params.message)}`
  );
}
