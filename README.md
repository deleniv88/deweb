# Deweb studio — Next.js + TinaCMS

Сайт на **Next.js (React + TypeScript)** з адмінкою **TinaCMS**.
Жодного PHP: відвідувачі отримують готовий статичний HTML, а адмінка живе на `/admin`.

```
/admin → правиш текст/фото прямо на сторінці → Save
      → Tina комітить зміни в GitHub
      → Vercel сам перезбирає сайт (~1 хв)
```

---

## Що де лежить

| Шлях | Що це |
|---|---|
| `content/home/home.json` | Усі тексти, кейси, послуги, переваги головної |
| `content/posts/*.mdx` | Статті блогу (одна стаття = один файл) |
| `public/uploads/` | Усі картинки (сюди ж потрапляють фото, завантажені в адмінці) |
| `tina/config.ts` | Які поля є в адмінці |
| `components/HomeClient.tsx` | Розмітка головної |
| `lib/behaviors.js` | Анімації: 3D-карусель, наїзд карток, хедер, таби |
| `app/globals.css` | Усі стилі (ті самі, що в index.html) |

---

## Крок 1. Залити код у GitHub

1. Створи репозиторій на GitHub (наприклад `deweb-studio`), можна приватний.
2. Розпакуй архів у порожню папку і в терміналі виконай:
   ```bash
   git init
   git add .
   git commit -m "Next.js + TinaCMS"
   git branch -M main
   git remote add origin https://github.com/ТВІЙ_ЛОГІН/deweb-studio.git
   git push -u origin main
   ```
   ⚠️ Файл `tina/tina-lock.json` обов'язково має бути в репозиторії — без нього Tina Cloud не запрацює.

## Крок 2. Перевірити локально (необов'язково, але раджу)

Потрібен Node.js 20+.
```bash
npm install
npm run dev
```
- сайт: http://localhost:3000
- адмінка: http://localhost:3000/admin (локально без логіну, зміни пишуться прямо у файли)

## Крок 3. Tina Cloud (логін в адмінку)

1. Зайди на **app.tina.io** і увійди через GitHub.
2. Створи проєкт і вибери свій репозиторій `deweb-studio`, гілка `main`.
3. У налаштуваннях проєкту вкажи **Site URL**: `https://deweb-gules.vercel.app`
4. Скопіюй **Client ID**.
5. У розділі токенів створи **Read-only token** і скопіюй його.

Безкоштовного плану вистачає (до 2 користувачів).

## Крок 4. Vercel

Твій проєкт `deweb-gules` має бути **підключений до GitHub-репозиторію** (у налаштуваннях проєкту → Git).
Якщо зараз ти заливав файли вручну — підключи репозиторій з кроку 1 (або створи новий проєкт через *Add New → Project → Import* і потім перенеси на нього домен).

У налаштуваннях проєкту → **Environment Variables** додай:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Client ID з Tina Cloud |
| `TINA_TOKEN` | Read-only token з Tina Cloud |

Framework: **Next.js**, Build Command залиш стандартний (`npm run build`).
Після цього зроби **Redeploy**.

## Крок 5. Готово

- Сайт: https://deweb-gules.vercel.app
- Адмінка: **https://deweb-gules.vercel.app/admin** → логін через Tina Cloud
- Вкладка **Головна сторінка** — відкриває сайт, клікаєш на будь-який текст чи фото → поле відкривається збоку.
- Вкладка **Blog** — створити / редагувати / видалити статтю.
- Після **Save** зачекай ~1 хв, поки Vercel перезбере сайт.

---

## Коли підключиш deweb.studio

1. Vercel → проєкт → Domains → додай `deweb.studio`.
2. Tina Cloud → Site URL → заміни на `https://deweb.studio`.
3. (Необов'язково) у Vercel додай змінну `NEXT_PUBLIC_SITE_URL=https://deweb.studio`.

## Якщо щось не працює

- **Build на Vercel падає з помилкою Tina** — перевір, що обидві змінні середовища додані і в Tina Cloud проєкт показує, що гілку `main` проіндексовано (після першого пушу це займає 1–2 хв).
- **Змінив `tina/config.ts`** (додав поле) — запусти локально `npm run dev` один раз, щоб оновився `tina/tina-lock.json`, і закоміть його.
- **/admin показує 404** — дочекайся завершення деплою; адмінка генерується під час build.
