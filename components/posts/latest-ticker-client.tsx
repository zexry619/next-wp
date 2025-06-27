'use client'

import Link from "next/link";
import Marquee from "react-fast-marquee";
import type { Post } from "@/lib/wordpress.d";

export function LatestTickerClient({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-muted border-b text-sm">
      <Marquee gradient={false} pauseOnHover className="gap-4 p-2">
        <span className="font-semibold mr-4">Terbaru:</span>
        {posts.map((post, idx) => (
          <span key={post.id} className="flex items-center mr-6">
            {idx > 0 && <span className="mx-2 text-muted-foreground">•</span>}
            <Link
              href={`/posts/${post.slug}`}
              className="hover:underline"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
