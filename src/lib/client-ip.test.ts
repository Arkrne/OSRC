import { describe, it, expect } from 'vitest'
import { getClientIp } from './client-ip'

// Tiny case-insensitive Headers stand-in.
function H(map: Record<string, string>) {
  const lower: Record<string, string> = {}
  for (const k of Object.keys(map)) lower[k.toLowerCase()] = map[k]
  return { get: (name: string) => lower[name.toLowerCase()] ?? null }
}

describe('getClientIp', () => {
  it('prefers x-real-ip when present', () => {
    expect(getClientIp(H({ 'x-real-ip': '203.0.113.7', 'x-forwarded-for': '1.1.1.1' }))).toBe('203.0.113.7')
  })

  it('uses the LAST x-forwarded-for hop (the trusted proxy-appended IP)', () => {
    // Attacker forges the leading tokens; the real client IP is the last hop.
    expect(getClientIp(H({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2, 203.0.113.7' }))).toBe('203.0.113.7')
  })

  it('is NOT bypassable by rotating the leading XFF token', () => {
    const a = getClientIp(H({ 'x-forwarded-for': '9.9.9.9, 203.0.113.7' }))
    const b = getClientIp(H({ 'x-forwarded-for': '8.8.8.8, 203.0.113.7' }))
    expect(a).toBe('203.0.113.7')
    expect(b).toBe('203.0.113.7')
    expect(a).toBe(b) // same trusted IP -> same rate-limit bucket
  })

  it('handles a single XFF value', () => {
    expect(getClientIp(H({ 'x-forwarded-for': '203.0.113.7' }))).toBe('203.0.113.7')
  })

  it('trims whitespace', () => {
    expect(getClientIp(H({ 'x-real-ip': '  203.0.113.7  ' }))).toBe('203.0.113.7')
    expect(getClientIp(H({ 'x-forwarded-for': '1.1.1.1 ,  203.0.113.7 ' }))).toBe('203.0.113.7')
  })

  it('falls back to "unknown" when no usable header is present', () => {
    expect(getClientIp(H({}))).toBe('unknown')
    expect(getClientIp(H({ 'x-forwarded-for': '' }))).toBe('unknown')
    expect(getClientIp(H({ 'x-forwarded-for': ' , , ' }))).toBe('unknown')
    expect(getClientIp(H({ 'x-real-ip': '' }))).toBe('unknown')
  })
})
