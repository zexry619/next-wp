'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SliderItem {
  id: number
  slug: string
  title: string
  image: string | null
  date: string
}

export function PostSliderClient({ posts }: { posts: SliderItem[] }) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 2, spacing: 8 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 3, spacing: 12 } },
      '(min-width: 1024px)': { slides: { perView: 5, spacing: 16 } },
    },
  })

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {posts.map((post) => (
          <div key={post.id} className="keen-slider__slide">
            <Link href={`/posts/${post.slug}`} className="block space-y-1">
              <div className="relative w-40 h-28 overflow-hidden rounded-md bg-muted">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{post.date}</span>
              <div className="text-sm font-semibold line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
            </Link>
          </div>
        ))}
      </div>
      <button
        aria-label="Sebelumnya"
        className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border bg-background/90 hover:bg-accent transition-colors"
        onClick={() => instanceRef.current?.prev()}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        aria-label="Berikutnya"
        className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border bg-background/90 hover:bg-accent transition-colors"
        onClick={() => instanceRef.current?.next()}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
