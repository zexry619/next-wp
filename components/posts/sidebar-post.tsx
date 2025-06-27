import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { getFeaturedMediaById, getCategoryById } from "@/lib/wordpress";

export async function SidebarPost({ post }: { post: Post }) {
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
    <li className="flex gap-3 items-start">
      {media?.source_url && (
        <Image
          src={media.source_url}
          alt=""
          width={80}
          height={60}
          className="rounded-md object-cover flex-none"
        />
      )}
      <div className="space-y-1">
        <Link
          href={`/posts/${post.slug}`}
          className="font-medium hover:underline"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="text-xs text-muted-foreground">
          {category?.name} &bull; {date}
        </div>
      </div>
    </li>
  );
}
