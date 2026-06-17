import { describe, it, expect } from 'vitest'
import { isEmail, isPhone, strip, esc, isSafeKey } from './validation'

describe('isEmail', () => {
  it('accepts valid addresses', () => {
    expect(isEmail('a@b.co')).toBe(true)
    expect(isEmail('first.last@sub.example.com')).toBe(true)
  })
  it('rejects malformed addresses', () => {
    expect(isEmail('no-at-sign')).toBe(false)
    expect(isEmail('a@b')).toBe(false)
    expect(isEmail('a@b.c')).toBe(false) // TLD must be >= 2 chars
    expect(isEmail('a b@c.com')).toBe(false)
    expect(isEmail('')).toBe(false)
  })
  it('rejects over-long addresses', () => {
    expect(isEmail('a'.repeat(250) + '@example.com')).toBe(false)
  })
})

describe('isPhone', () => {
  it('accepts common PH/international formats', () => {
    expect(isPhone('09568843373')).toBe(true)
    expect(isPhone('+63 956 884 3373')).toBe(true)
    expect(isPhone('(02) 8123-4567')).toBe(true)
  })
  it('rejects too-short / too-long / lettered input', () => {
    expect(isPhone('123')).toBe(false)
    expect(isPhone('1'.repeat(21))).toBe(false)
    expect(isPhone('call-me')).toBe(false)
  })
})

describe('strip', () => {
  it('trims and removes control characters', () => {
    expect(strip('  hello  ')).toBe('hello')
    expect(strip('a\x00b\x1Fc')).toBe('abc')
  })
  it('coerces non-strings to empty string', () => {
    expect(strip(null)).toBe('')
    expect(strip(42)).toBe('')
    expect(strip(undefined)).toBe('')
  })
  it('caps length at the provided max (default 1000)', () => {
    expect(strip('x'.repeat(2000)).length).toBe(1000)
    expect(strip('x'.repeat(2000), 50).length).toBe(50)
  })
})

describe('esc', () => {
  it('escapes HTML-significant characters', () => {
    expect(esc('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    )
    expect(esc("O'Brien & Co")).toBe('O&#39;Brien &amp; Co')
  })
})

describe('isSafeKey', () => {
  it('accepts ordinary storage keys', () => {
    expect(isSafeKey('listings/abc-123/full.jpg')).toBe(true)
    expect(isSafeKey('thumb_001.jpg')).toBe(true)
  })
  it('rejects traversal, absolute, and illegal characters', () => {
    expect(isSafeKey('../etc/passwd')).toBe(false)
    expect(isSafeKey('/abs/path.jpg')).toBe(false)
    expect(isSafeKey('has space.jpg')).toBe(false)
    expect(isSafeKey('a'.repeat(201))).toBe(false)
  })
})
