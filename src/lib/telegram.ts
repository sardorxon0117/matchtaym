import "server-only";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Fire-and-forget — a Telegram hiccup should never break commenting. */
export async function notifyNewComment(params: {
  authorName: string;
  content: string;
  articleTitle: string;
  articleUrl: string;
  isReply: boolean;
}) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  const kind = params.isReply ? "Javob" : "Yangi izoh";
  const text =
    `💬 <b>${kind}</b>\n` +
    `<b>${escapeHtml(params.authorName)}</b>: ${escapeHtml(params.content)}\n\n` +
    `📰 ${escapeHtml(params.articleTitle)}\n` +
    `${params.articleUrl}`;

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
