import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

export async function PostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = new Date(post.date).toLocaleDateString("id-ID", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
          {media?.source_url ? (
            <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={post.title?.rendered || "Post thumbnail"}
              width={400}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No image available
            </div>
          )}
          {category?.name && (
            <span className="absolute top-2 left-2 bg-background/80 text-xs px-2 py-0.5 rounded-md">
              {category.name}
            </span>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all line-clamp-2"
        ></div>
        <div
          className="text-sm line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(" ").slice(0, 20).join(" ").trim() +
                "..."
              : "No excerpt available",
          }}
        ></div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{category?.name || "Uncategorized"}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
