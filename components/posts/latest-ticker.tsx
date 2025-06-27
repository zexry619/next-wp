import { getRecentPosts } from "@/lib/wordpress";
import { LatestTickerClient } from "./latest-ticker-client";

export async function LatestTicker() {
  const posts = await getRecentPosts(5);
  return <LatestTickerClient posts={posts} />;
}
