// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { PostCard } from "@/components/posts/post-card";
import { HeroPost } from "@/components/posts/hero-post";
import { SidebarPost } from "@/components/posts/sidebar-post";
import { LatestTicker } from "@/components/posts/latest-ticker";
import { PostSlider } from "@/components/posts/post-slider";
import { getPostsPaginated } from "@/lib/wordpress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 10);
  const [hero, ...rest] = posts;
  const sidePosts = rest.slice(0, 3);
  const gridPosts = rest.slice(3);
  return (
    <>
      <LatestTicker />
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
              <h2>
                <Balancer>Berita Terbaru</Balancer>
              </h2>
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

