import { PostCard } from "./post-card";
import { getRandomWeeklyPosts } from "@/lib/wordpress";

export async function RandomWeekPosts() {
  const posts = await getRandomWeeklyPosts(5);
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
