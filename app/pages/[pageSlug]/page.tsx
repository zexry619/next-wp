export const runtime = 'edge';

import { getPageBySlug, getAllPages, WordPressAPIError } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}): Promise<Metadata> {
  const { pageSlug } = await params;
  try {
    const page = await getPageBySlug(pageSlug);

    if (!page) {
      return {};
    }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", page.title.rendered);
  // Strip HTML tags for description and limit length
  const description = page.excerpt?.rendered
    ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
    : page.content.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 200) + "...";
  ogUrl.searchParams.append("description", description);

  return {
    title: page.title.rendered,
    description: description,
    openGraph: {
      title: page.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/pages/${page.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      console.warn(`Failed to fetch metadata for page ${pageSlug}`, error);
      return {};
    }
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ pageSlug: string }>;
}) {
  const { pageSlug } = await params;
  const page = await getPageBySlug(pageSlug);

  return (
    <Section>
      <Container>
        <Prose>
          <h2>{page.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
