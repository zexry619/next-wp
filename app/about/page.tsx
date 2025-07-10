import { getPageBySlug } from "@/lib/wordpress";
import { Container, Section } from "@/components/craft";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Props are inferred by Next.js
// No need to define them manually

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about").catch(() => notFound());

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  const description = page.excerpt.rendered.replace(/<[^>]+>/g, "");

  return {
    title: page.title.rendered,
    description: description,
    openGraph: {
      title: page.title.rendered,
      description: description,
      url: `/about`,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: description,
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
