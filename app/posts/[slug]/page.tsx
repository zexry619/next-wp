import {
  getPostBySlug,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
  getRecentPosts,
  getRelatedPosts,
  WordPressAPIError,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { SidebarPost } from "@/components/posts/sidebar-post";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return await getAllPostSlugs();
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      console.warn("Failed to fetch post slugs", error);
      return [];
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", post.title.rendered);
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
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      console.warn(`Failed to fetch metadata for post ${slug}`, error);
      return {};
    }
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return (
        <Section>
          <Container>
            <Prose>
              <h1>Postingan tidak ditemukan</h1>
              <p>Data postingan gagal diambil.</p>
            </Prose>
          </Container>
        </Section>
      );
    }

    const author = await getAuthorById(post.author);
    const date = new Date(post.date).toLocaleDateString("id-ID", {
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
                Dipublikasikan {date} oleh{" "}
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
          </Prose>

          <div className="md:grid md:grid-cols-[3fr_1fr] gap-8">
            <div>
              <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>
            <aside className="space-y-8 mt-8 md:mt-0">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Artikel Terkait</h3>
                <ul className="space-y-4">
                  {relatedPosts.map((p) => (
                    <SidebarPost key={p.id} post={p} />
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Artikel Terbaru</h3>
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
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      console.warn(`Failed to fetch post ${slug}`, error);
      return (
        <Section>
          <Container>
            <Prose>
              <h1>Postingan tidak tersedia</h1>
              <p>Data postingan gagal diambil.</p>
            </Prose>
          </Container>
        </Section>
      );
    }
    throw error;
  }
}
