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
      <div className="relative overflow-hidden rounded-lg border bg-muted aspect-video">
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title.rendered}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <span className="text-xs md:text-sm">
            {category?.name} &bull; {date}
          </span>
          <h2
            className="text-xl md:text-2xl font-semibold mt-1 leading-tight group-hover:underline line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </div>
    </Link>
  );
}
