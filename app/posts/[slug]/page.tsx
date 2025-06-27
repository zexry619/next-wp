import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
  getRecentPosts,
  getRelatedPosts,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { SidebarPost } from "@/components/posts/sidebar-post";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", post.title.rendered);
  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  ogUrl.searchParams.append("description", description);

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);
  const [recentPosts, relatedPosts] = await Promise.all([
    getRecentPosts(5),
    getRelatedPosts(post.id, category.id, 5),
  ]);

  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <Balancer>
              <span
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              ></span>
            </Balancer>
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{" "}
              {author.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                </span>
              )}
            </h5>

            <Link
              href={`/posts/?category=${category.id}`}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "!no-underline"
              )}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
              <img
                className="w-full h-full object-cover"
                src={featuredMedia.source_url}
                alt={post.title.rendered}
              />
            </div>
          )}
        </Prose>

        <div className="md:grid md:grid-cols-[3fr_1fr] gap-8">
          <div>
            <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </div>
          <aside className="space-y-8 mt-8 md:mt-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Related Posts</h3>
              <ul className="space-y-4">
                {relatedPosts.map((p) => (
                  <SidebarPost key={p.id} post={p} />
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recent Posts</h3>
              <ul className="space-y-4">
                {recentPosts
                  .filter((p) => p.id !== post.id)
                  .map((p) => (
                    <SidebarPost key={p.id} post={p} />
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
