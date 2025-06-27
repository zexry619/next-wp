// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { PostCard } from "@/components/posts/post-card";
import { getPostsPaginated } from "@/lib/wordpress";
import Link from "next/link";

export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 6);
  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <Balancer>Latest Posts</Balancer>
          </h1>
        </Prose>
        <div className="grid md:grid-cols-3 gap-4 my-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Link href="/posts" className="underline text-sm">
            Lihat Semua
          </Link>
        </div>
      </Container>
    </Section>
  );
}

// This file previously contained a long example component. It has been replaced
// with a simple latest posts section.
