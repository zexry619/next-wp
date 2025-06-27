type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

// Jumlah maksimal slug yang dirender secara statik
export const MAX_STATIC_SLUGS = 100;

export const siteConfig: SiteConfig = {
  site_name: "next-wp",
  site_description: "Starter template for Headless WordPress with Next.js",
  site_domain: "https://next-wp.com",
};
