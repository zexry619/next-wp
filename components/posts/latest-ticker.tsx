import Link from "next/link";
import { getRecentPosts } from "@/lib/wordpress";

export async function LatestTicker() {
  const posts = await getRecentPosts(5);
  return (
    <div className="bg-muted border-b overflow-x-auto whitespace-nowrap text-sm">
      <div className="flex gap-4 p-2">
        <span className="font-semibold">Terbaru:</span>
        {posts.map((post, idx) => (
          <span key={post.id} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground">|</span>}
            <Link
              href={`/posts/${post.slug}`}
              className="hover:underline"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
