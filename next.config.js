/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep server-side code from being bundled into the client.
  // Supabase and Gemini server calls stay in API routes.
  reactStrictMode: true,
};

module.exports = nextConfig;
