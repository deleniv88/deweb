import { defineConfig } from "tinacms";

/* Гілка GitHub, у яку Tina зберігає зміни.
   На Vercel береться автоматично з VERCEL_GIT_COMMIT_REF. */
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const textarea = { component: "textarea" } as const;

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, // з Tina Cloud
  token: process.env.TINA_TOKEN, // з Tina Cloud (read-only token)

  build: {
    outputFolder: "admin", // адмінка → /admin
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads", // усі фото лежать у public/uploads
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      /* ================= ГОЛОВНА ================= */
      {
        name: "home",
        label: "Головна сторінка",
        path: "content/home",
        format: "json",
        ui: {
          router: () => "/", // відкриває головну для візуального редагування
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "seo",
            label: "SEO",
            fields: [
              { type: "string", name: "title", label: "Title (вкладка браузера, Google)" },
              { type: "string", name: "description", label: "Description (Google)", ui: textarea },
            ],
          },
          {
            type: "object",
            name: "hero",
            label: "Hero (перший екран)",
            fields: [
              { type: "string", name: "titleLine1", label: "Заголовок — рядок 1" },
              { type: "string", name: "titleLine2", label: "Заголовок — рядок 2" },
              { type: "string", name: "lead", label: "Підзаголовок", ui: textarea },
              { type: "string", name: "ctaLabel", label: "Кнопка — текст" },
              { type: "string", name: "ctaHref", label: "Кнопка — посилання" },
              { type: "image", name: "photo", label: "Фото" },
              { type: "string", name: "photoAlt", label: "Фото — опис (alt)" },
              { type: "string", name: "name", label: "Підпис біля фото" },
              {
                type: "object",
                name: "stats",
                label: "Статистика",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item?.value ?? ""} ${item?.label ?? ""}` }) },
                fields: [
                  { type: "string", name: "value", label: "Число (70+, 6…)" },
                  { type: "string", name: "label", label: "Підпис" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "work",
            label: "Recent work (кейси)",
            fields: [
              { type: "string", name: "titleAccent", label: "Заголовок — синє слово" },
              { type: "string", name: "titleRest", label: "Заголовок — решта" },
              { type: "string", name: "lead", label: "Підзаголовок (Enter = новий рядок)", ui: textarea },
              { type: "string", name: "buttonLabel", label: "Кнопка — текст" },
              { type: "string", name: "buttonHref", label: "Кнопка — посилання" },
              {
                type: "object",
                name: "cases",
                label: "Кейси",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Новий кейс" }) },
                fields: [
                  { type: "image", name: "image", label: "Скрін сайту (16:9)" },
                  { type: "string", name: "category", label: "Категорія (Automotive · Corporate website)" },
                  { type: "string", name: "name", label: "Назва" },
                  { type: "string", name: "description", label: "Опис", ui: textarea },
                  { type: "string", name: "url", label: "Посилання на сайт (https://…)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "services",
            label: "Services (послуги)",
            fields: [
              { type: "string", name: "titleAccent", label: "Заголовок — синє слово" },
              { type: "string", name: "titleRest", label: "Заголовок — решта" },
              { type: "string", name: "lead", label: "Підзаголовок" },
              { type: "string", name: "note", label: "Примітка під підзаголовком" },
              {
                type: "object",
                name: "items",
                label: "Картки послуг",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Нова послуга" }) },
                fields: [
                  { type: "string", name: "type", label: "Тип (One-page site)" },
                  { type: "string", name: "timeline", label: "Термін (Timeline: 2–3 weeks)" },
                  { type: "string", name: "name", label: "Назва" },
                  { type: "string", name: "description", label: "Опис", ui: textarea },
                  { type: "string", name: "features", label: "Пункти списку", list: true },
                  { type: "string", name: "buttonLabel", label: "Кнопка — текст" },
                  { type: "string", name: "buttonHref", label: "Кнопка — посилання" },
                  { type: "image", name: "image", label: "Картинка (748×421, кути вже заокруглені)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "features",
            label: "Every site includes",
            fields: [
              { type: "string", name: "titleAccent", label: "Заголовок — синє слово" },
              { type: "string", name: "titleRest", label: "Заголовок — решта" },
              { type: "string", name: "lead", label: "Підзаголовок" },
              {
                type: "object",
                name: "items",
                label: "Переваги",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Нова перевага" }) },
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Іконка",
                    options: [
                      { value: "fast", label: "Швидкість" },
                      { value: "devices", label: "Пристрої" },
                      { value: "edit", label: "Олівець" },
                      { value: "inbox", label: "Вхідні" },
                      { value: "chart", label: "Графік" },
                      { value: "globe", label: "Глобус" },
                    ],
                  },
                  { type: "string", name: "name", label: "Назва" },
                  { type: "string", name: "description", label: "Опис" },
                  { type: "image", name: "image", label: "Картинка 2:1 (порожньо = заглушка)" },
                  { type: "string", name: "imageAlt", label: "Картинка — опис (alt)" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "projectLine",
            label: "Project line (етапи роботи)",
            fields: [
              { type: "string", name: "title", label: "Заголовок" },
              { type: "string", name: "note", label: "Примітка справа (Enter = новий рядок)", ui: textarea },
              { type: "string", name: "hint", label: "Підказка внизу" },
              { type: "string", name: "buttonLabel", label: "Кнопка — текст" },
              { type: "string", name: "buttonHref", label: "Кнопка — посилання" },
              {
                type: "object",
                name: "steps",
                label: "Етапи",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Новий етап" }) },
                fields: [
                  { type: "string", name: "name", label: "Назва" },
                  {
                    type: "string",
                    name: "icon",
                    label: "Іконка",
                    options: [
                      { value: "users", label: "Люди" },
                      { value: "chart", label: "Графік" },
                      { value: "sitemap", label: "Структура" },
                      { value: "palette", label: "Палітра" },
                      { value: "code", label: "Код" },
                      { value: "rocket", label: "Ракета" },
                      { value: "headset", label: "Навушники" },
                    ],
                  },
                  { type: "number", name: "start", label: "Початок — робочий день (1–20, 21 = After)" },
                  { type: "number", name: "span", label: "Тривалість — днів" },
                  {
                    type: "string",
                    name: "variant",
                    label: "Колір смуги",
                    options: [
                      { value: "solid", label: "Синій" },
                      { value: "soft", label: "Світло-синій" },
                      { value: "light", label: "Лавандовий" },
                      { value: "gradient", label: "Градієнт" },
                      { value: "dark", label: "Темний" },
                      { value: "outline", label: "Контурний" },
                    ],
                  },
                  { type: "string", name: "when", label: "Коли (для мобілки: Week 1–2)" },
                  { type: "string", name: "description", label: "Опис (у підказці)", ui: textarea },
                  { type: "string", name: "result", label: "Результат (→ …)" },
                ],
              },
            ],
          },
        ],
      },

      /* ================= БЛОГ ================= */
      {
        name: "post",
        label: "Blog",
        path: "content/posts",
        format: "mdx",
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`,
          filename: {
            // назва файлу = адреса статті (/blog/nazva-statti)
            slugify: (values) =>
              `${values?.title || "post"}`
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/ł/g, "l")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
          },
        },
        defaultItem: () => ({ date: new Date().toISOString() }),
        fields: [
          { type: "string", name: "title", label: "Заголовок", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Дата" },
          { type: "string", name: "excerpt", label: "Короткий опис (для списку і Google)", ui: textarea },
          { type: "image", name: "cover", label: "Обкладинка" },
          { type: "rich-text", name: "body", label: "Текст статті", isBody: true },
        ],
      },
    ],
  },
});
