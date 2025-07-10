import { getPageBySlug } from "@/lib/wordpress";
import { Container, Section } from "@/components/craft";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate metadata for the page
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await getPageBySlug("about").catch(() => notFound());

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: page.title.rendered,
    description: page.excerpt.rendered.replace(/<[^>]+>/g, ""), // Strip HTML tags from excerpt
    openGraph: {
      title: page.title.rendered,
      description: page.excerpt.rendered.replace(/<[^>]+>/g, ""),
      url: `/about`,
      images: previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: page.excerpt.rendered.replace(/<[^>]+>/g, ""),
      images: previousImages,
    },
    alternates: {
      canonical: `/about`,
    },
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug("about").catch(() => notFound());

  return (
    <Section>
      <Container>
        <article className="prose dark:prose-invert lg:prose-xl mx-auto">
          <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </article>
      </Container>
    </Section>
  );
}
