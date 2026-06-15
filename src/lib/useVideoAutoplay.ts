'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useVideoAutoplay(): boolean {
  const reduced = useReducedMotion()
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
    setSaveData(conn?.saveData === true)
  }, [])

  return !reduced && !saveData
}
