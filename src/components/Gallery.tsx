'use client'

import { motion } from 'framer-motion'
import { SpotlightCard } from './motion'

const EASE = [0.23, 1, 0.32, 1] as const

// Adapted from 21st.dev "Interactive Bento Gallery" — themed bento of photos + a video
type Media = { type: 'image' | 'video'; url: string; title: string; desc: string; span: string }

const media: Media[] = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80', title: 'Model Homes', desc: 'Walkthrough-ready units', span: 'md:col-span-2 md:row-span-2' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80', title: 'Interiors', desc: 'Turnover-quality finishes', span: 'md:col-span-1 md:row-span-1' },
  { type: 'video', url: 'https://videos.pexels.com/video-files/7578548/7578548-uhd_2560_1440_30fps.mp4', title: 'Community Tour', desc: 'Master-planned living', span: 'md:col-span-1 md:row-span-2' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=80', title: 'Bedrooms', desc: 'Space for the family', span: 'md:col-span-1 md:row-span-1' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80', title: 'Facades', desc: 'Modern Filipino design', span: 'md:col-span-2 md:row-span-1' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=700&q=80', title: 'Amenities', desc: 'Parks, pools & clubhouses', span: 'md:col-span-1 md:row-span-1' },
]

export default function Gallery() {
  return (
    <section className="relative py-12 sm:py-18 md:py-24 px-5 sm:px-8 lg:px-20 overflow-hidden">
      <div className="blob blob-2 right-[-5rem] top-1/3 h-72 w-72" aria-hidden />
      <div className="relative z-10 max-w-[1360px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-5 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="eyebrow">Gallery</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              className="font-display text-[clamp(36px,4vw,60px)] text-[#1C1714]"
              style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              Life at <em className="italic text-shine">Orange Square</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#6E6055] text-[15px] max-w-sm"
          >
            A look inside the homes and communities we help Filipino families move into.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]"
        >
          {media.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { y: 40, scale: 0.95, opacity: 0 },
                visible: { y: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 340, damping: 26 } },
              }}
              className={`group ${item.span}`}
            >
              <SpotlightCard className="glow-border relative h-full w-full overflow-hidden rounded-2xl bg-[#F5EEE8] border border-[rgba(28,23,20,0.07)] shadow-[0_8px_30px_-16px_rgba(28,23,20,0.3)]">
                {item.type === 'video' ? (
                  <video
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
                    src={item.url}
                    autoPlay loop muted playsInline
                  />
                ) : (
                  // plain img to avoid next/image domain config; lazy-loaded
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
                  />
                )}
                {/* Caption — title always visible, desc reveals on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="relative text-white text-[14px] font-semibold drop-shadow">{item.title}</h3>
                  <p className="relative text-white/75 text-[12px] mt-0.5 max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-[max-height,opacity] duration-300 overflow-hidden">{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
