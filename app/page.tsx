import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.site_name} - ${siteConfig.site_description}`,
  description: `Website ${siteConfig.site_name} - ${siteConfig.site_description}`,
  alternates: {
    canonical: "/",
  },
};

// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { PostCard } from "@/components/posts/post-card";
import { HeroPost } from "@/components/posts/hero-post";
import { SidebarPost } from "@/components/posts/sidebar-post";
import { PostSlider } from "@/components/posts/post-slider";
import { getPostsPaginated } from "@/lib/wordpress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Script from "next/script";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteConfig.site_domain,
  name: siteConfig.site_name,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.site_domain}/posts?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.site_name,
  url: siteConfig.site_domain,
  logo: `${siteConfig.site_domain}/logo.svg`,
  sameAs: siteConfig.socialLinks,
};

export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 10);
  const [hero, ...rest] = posts;
  const sidePosts = rest.slice(0, 3);
  const gridPosts = rest.slice(3);
  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />
      <Section className="py-4">
        <Container>
          <PostSlider />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="space-y-8">
            <div className="grid md:grid-cols-[2fr_1fr] gap-6">
              <HeroPost post={hero} />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold pb-2 border-b">Terbaru</h3>
                <ul className="space-y-2 pt-2">
                  {sidePosts.map((post) => (
                    <SidebarPost key={post.id} post={post} />
                  ))}
                </ul>
              </div>
            </div>
            <Prose>
              <h1>
                <Balancer>Berita Terbaru</Balancer>
              </h1>
            </Prose>
            <div className="grid md:grid-cols-3 gap-4">
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/posts">Lihat Semua</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

