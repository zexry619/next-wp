// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { PostCard } from "@/components/posts/post-card";
import { HeroPost } from "@/components/posts/hero-post";
import { getPostsPaginated } from "@/lib/wordpress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 6);
  const [hero, ...rest] = posts;
  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <HeroPost post={hero} />
          <Prose>
            <h2>
              <Balancer>Latest Posts</Balancer>
            </h2>
          </Prose>
          <div className="grid md:grid-cols-3 gap-4">
            {rest.map((post) => (
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
  );
}

