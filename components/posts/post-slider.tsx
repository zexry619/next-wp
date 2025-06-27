import { getRecentPosts, getFeaturedMediaById } from '@/lib/wordpress'
import { PostSliderClient, SliderItem } from './post-slider-client'

export async function PostSlider() {
  const posts = await getRecentPosts(8)
  const items: SliderItem[] = await Promise.all(
    posts.map(async (post) => {
      const media = post.featured_media
        ? await getFeaturedMediaById(post.featured_media)
        : null
      const date = new Date(post.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      return {
        id: post.id,
        slug: post.slug,
        title: post.title.rendered,
        image: media?.source_url ?? null,
        date,
      }
    })
  )

  return <PostSliderClient posts={items} />
}
