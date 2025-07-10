type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  socialLinks: string[];
};

// Jumlah maksimal slug yang dirender secara statik
export const MAX_STATIC_SLUGS = 100;

export const siteConfig: SiteConfig = {
  site_name: "zekriansyah.com",
  site_description:
    "Menyajikan berita dan informasi terkini seputar politik, hiburan, olahraga, dan sosial. Sumber terpercaya untuk wawasan mendalam dan update setiap hari.",
  site_domain: "https://zekriansyah.com",
  socialLinks: [
    "https://facebook.com/zekriansyah",
    "https://twitter.com/zekriansyah",
    "https://instagram.com/zekriansyah",
  ],
};
