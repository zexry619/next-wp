import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { getCategoryById } from "@/lib/wordpress";

export async function SidebarPost({ post }: { post: Post }) {
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;
  const date = new Date(post.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <li className="space-y-1">
      <Link
        href={`/posts/${post.slug}`}
        className="hover:underline line-clamp-2"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <div className="text-xs text-muted-foreground">
        {category?.name} &bull; {date}
      </div>
    </li>
  );
}
