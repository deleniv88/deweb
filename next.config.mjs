/** @type {import('next').NextConfig} */
const nextConfig = {
  // адмінка Tina збирається в public/admin/index.html — відкриваємо її за адресою /admin
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};
export default nextConfig;
