import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/* =========================================================
   Заявка з поп-апу → Telegram (група або особистий чат) + Gmail.
   Змінні середовища (Vercel → Environment Variables, тип Secret):
     TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID      — Telegram
     GMAIL_USER, GMAIL_APP_PASSWORD            — Gmail (пароль застосунку)
     NOTIFY_EMAIL                              — куди слати (необов'язково, за замовчуванням GMAIL_USER)
     TURNSTILE_SECRET_KEY                      — Cloudflare Turnstile (необов'язково)
   Заявка вважається відправленою, якщо дійшла хоча б в один канал.
   ========================================================= */

const MIN_FILL_MS = 2500; // людина не заповнить форму швидше за 2,5 с

function clean(v: unknown, max: number) {
  return String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}
function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
/* ознаки типового спаму: багато посилань, кирилиця/латиниця тут не важлива — дивимось на лінки */
function looksLikeSpam(text: string) {
  const links = (text.match(/https?:\/\/|www\./gi) || []).length;
  return links > 2;
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // не налаштовано — перевірку пропускаємо
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = await r.json();
    return !!j.success;
  } catch {
    return false;
  }
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return "skip";
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return r.ok ? "ok" : "fail";
  } catch {
    return "fail";
  }
}

async function sendEmail(subject: string, html: string, text: string, replyTo?: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return "skip";
  const to = process.env.NOTIFY_EMAIL || user;
  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass: pass.replace(/\s+/g, "") } });
    await transporter.sendMail({ from: `"Deweb site" <${user}>`, to, subject, text, html, replyTo });
    return "ok";
  } catch {
    return "fail";
  }
}

export async function POST(req: Request) {
  let data: Record<string, unknown> = {};
  try { data = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  /* 1) пастка-поле: людина його не бачить, бот заповнює → тихо "приймаємо" і нічого не шлемо */
  if (clean(data.company, 100)) return NextResponse.json({ ok: true });

  /* 2) пастка часу: відправлено швидше, ніж людина встигла б заповнити */
  const elapsed = Number(data.t || 0);
  if (!elapsed || elapsed < MIN_FILL_MS) return NextResponse.json({ ok: true });

  const name = clean(data.name, 120);
  const contact = clean(data.contact, 160);
  const method = clean(data.method, 20);
  const message = clean(data.message, 3000);
  if (!name || !contact) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });

  /* 3) явний спам у тексті */
  if (looksLikeSpam(`${name} ${contact} ${message}`)) return NextResponse.json({ ok: true });

  /* 4) Cloudflare Turnstile (якщо підключено) */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (!(await verifyTurnstile(clean(data.turnstile, 4000), ip))) {
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });
  }

  const labels: Record<string, string> = { telegram: "Telegram", instagram: "Instagram", whatsapp: "WhatsApp", email: "Email" };
  const via = labels[method] || method || "—";
  const page = clean(req.headers.get("referer"), 300);

  const tg =
    `🆕 <b>Нова заявка з сайту</b>\n\n` +
    `👤 <b>${esc(name)}</b>\n` +
    `📬 ${esc(via)}: <code>${esc(contact)}</code>\n\n` +
    `📝 ${esc(message || "—")}` +
    (page ? `\n\n🔗 ${esc(page)}` : "");

  const subject = `Нова заявка з сайту — ${name}`;
  const text = `Ім'я: ${name}\nЗв'язок (${via}): ${contact}\n\nЗапит:\n${message || "—"}\n\nСторінка: ${page || "—"}`;
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#242527">
      <h2 style="margin:0 0 12px;color:#5e6cff">Нова заявка з сайту</h2>
      <p><b>Ім'я:</b> ${esc(name)}<br><b>Зв'язок (${esc(via)}):</b> ${esc(contact)}</p>
      <p><b>Запит:</b><br>${esc(message || "—").replace(/\n/g, "<br>")}</p>
      <p style="color:#888;font-size:13px">Сторінка: ${esc(page || "—")}</p>
    </div>`;
  const replyTo = method === "email" && /^\S+@\S+\.\S+$/.test(contact) ? contact : undefined;

  const [t, e] = await Promise.all([sendTelegram(tg), sendEmail(subject, html, text, replyTo)]);

  if (t === "ok" || e === "ok") return NextResponse.json({ ok: true });
  if (t === "skip" && e === "skip") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
}
