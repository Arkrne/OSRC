import { ImageResponse } from 'next/og'

export const alt = 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists Philippines'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B0906',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Left orange accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 8,
            height: '100%',
            background: 'linear-gradient(180deg, #E85D04 0%, #FF8C42 100%)',
          }}
        />

        {/* Top-right domain label */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#E85D04',
            }}
          />
          <span style={{ color: '#6E6055', fontSize: 16, letterSpacing: '0.05em' }}>
            orangesquarerealty.com.ph
          </span>
        </div>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#E85D04',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '0.12em',
            }}
          >
            OS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#FBF6EC', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Orange Square
            </span>
            <span style={{ color: '#8A7C68', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Realty Corporation
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: '#FBF6EC',
            lineHeight: 0.95,
            letterSpacing: '-0.035em',
            marginBottom: 28,
          }}
        >
          Find Your{' '}
          <span style={{ color: '#F27024', fontStyle: 'italic' }}>Dream Home.</span>
          <br />
          <span style={{ color: '#FBF6EC' }}>We Handle the Pag‑IBIG.</span>
        </div>

        {/* Tagline */}
        <div style={{ color: '#8A7C68', fontSize: 22, marginBottom: 52, letterSpacing: '-0.01em' }}>
          Pag-IBIG Loan Processing · Property Matching · Free Pre-Qualification
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 36 }}>
          {[
            { val: '10+',   label: 'Developer Partners' },
            { val: '3',     label: 'Regions Served'     },
            { val: '₱890K', label: 'Starting Price'      },
            { val: '24h',   label: 'Pre-Qualification'  },
          ].map(s => (
            <div key={s.val} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ color: '#E85D04', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {s.val}
              </span>
              <span style={{ color: '#6E6055', fontSize: 14, letterSpacing: '0.02em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
