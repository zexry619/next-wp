import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { getFeaturedMediaById, getCategoryById } from "@/lib/wordpress";

export async function HeroPost({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;
  const date = new Date(post.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <div className="h-64 md:h-96 w-full overflow-hidden relative rounded-lg border bg-muted">
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <span className="text-xs md:text-sm">
            {category?.name} &bull; {date}
          </span>
          <h2
            className="text-xl md:text-2xl font-semibold mt-1 group-hover:underline"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </div>
    </Link>
  );
}
