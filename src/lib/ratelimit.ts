import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const rateMap = new Map<string, { count: number; resetAt: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of rateMap) if (now > v.resetAt) rateMap.delete(k)
}, 5 * 60 * 1000)

export function makeRatelimit(prefix: string, max: number, windowSec: number) {
  const upstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
          prefix: `osrc:${prefix}`,
        })
      : null

  return async function isRateLimited(ip: string): Promise<boolean> {
    if (upstash) {
      const { success } = await upstash.limit(ip)
      return !success
    }
    const key = `${prefix}:${ip}`
    const now = Date.now()
    const entry = rateMap.get(key)
    if (!entry || now > entry.resetAt) {
      rateMap.set(key, { count: 1, resetAt: now + windowSec * 1000 })
      return false
    }
    if (entry.count >= max) return true
    entry.count++
    return false
  }
}
