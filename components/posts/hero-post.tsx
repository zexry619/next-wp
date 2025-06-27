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
      <div className="h-64 md:h-96 w-full overflow-hidden relative rounded-lg border flex items-center justify-center bg-muted mb-4">
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-muted-foreground">No image available</div>
        )}
      </div>
      <h2
        className="text-2xl font-semibold group-hover:underline"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <div className="text-sm text-muted-foreground mt-1">
        {category?.name} &bull; {date}
      </div>
    </Link>
  );
}
