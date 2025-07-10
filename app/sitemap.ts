import { MetadataRoute } from "next";
import { getAllPosts, getAllAuthors, getAllCategories, getAllTags, getAllPages } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import type { Post, Author, Category, Tag, Page } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Post[] = [];
  let authors: Author[] = [];
  let categories: Category[] = [];
  let tags: Tag[] = [];
  let pages: Page[] = [];

  try {
    [posts, authors, categories, tags, pages] = await Promise.all([
      getAllPosts(),
      getAllAuthors(),
      getAllCategories(),
      getAllTags(),
      getAllPages(),
    ]);
  } catch (error) {
    console.error("Failed to fetch data for sitemap:", error);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/posts/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const authorUrls: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${siteConfig.site_domain}/posts/authors/${author.slug}`,
    lastModified: new Date(), // Consider using a more specific date if available
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.site_domain}/posts/categories/${category.slug}`,
    lastModified: new Date(), // Consider using a more specific date if available
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const tagUrls: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteConfig.site_domain}/posts/tags/${tag.slug}`,
    lastModified: new Date(), // Consider using a more specific date if available
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const pageUrls: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteConfig.site_domain}/pages/${page.slug}`,
    lastModified: new Date(page.modified),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticUrls, ...postUrls, ...authorUrls, ...categoryUrls, ...tagUrls, ...pageUrls];
}