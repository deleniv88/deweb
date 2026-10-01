import { NextResponse } from "next/server";

/* Заявка з поп-апу → повідомлення в Telegram.
   На Vercel додай змінні: TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID. */
export async function POST(req: Request) {
  let data: Record<string, string> = {};
  try { data = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  // пастка для ботів
  if (data.company) return NextResponse.json({ ok: true });

  const name = String(data.name || "").trim().slice(0, 200);
  const contact = String(data.contact || "").trim().slice(0, 200);
  const method = String(data.method || "").trim().slice(0, 30);
  const message = String(data.message || "").trim().slice(0, 3000);
  if (!name || !contact) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });

  const text = `🆕 Нова заявка з сайту\n\n👤 ${name}\n📬 ${method}: ${contact}\n\n📝 ${message || "—"}`;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!r.ok) return NextResponse.json({ ok: false, error: "telegram" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
