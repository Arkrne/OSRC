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
        }}
      >
        {/* Left orange accent bar — absolutely positioned, no children, fine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 8,
            height: '100%',
            background: '#E85D04',
          }}
        />

        {/* Domain label top-right */}
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
              borderRadius: 4,
              background: '#E85D04',
              display: 'flex',
            }}
          />
          <span style={{ color: '#6E6055', fontSize: 16 }}>
            orangesquarerealty.com.ph
          </span>
        </div>

        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
          }}
        >
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span style={{ color: '#FBF6EC', fontSize: 20, fontWeight: 600 }}>
              Orange Square
            </span>
            <span style={{ color: '#8A7C68', fontSize: 13, letterSpacing: '0.18em' }}>
              REALTY CORPORATION
            </span>
          </div>
        </div>

        {/* Headline — flex column instead of <br>, all children wrapped in spans */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: '#FBF6EC',
                lineHeight: 1,
                letterSpacing: '-0.035em',
              }}
            >
              Find Your
            </span>
            <span
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: '#F27024',
                lineHeight: 1,
                letterSpacing: '-0.035em',
                fontStyle: 'italic',
              }}
            >
              Dream Home.
            </span>
          </div>
          <span
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: '#FBF6EC',
              lineHeight: 1,
              letterSpacing: '-0.035em',
            }}
          >
            We Handle the Pag‑IBIG.
          </span>
        </div>

        {/* Tagline */}
        <span style={{ color: '#8A7C68', fontSize: 22, marginBottom: 52 }}>
          Pag-IBIG Loan Processing · Property Matching · Free Pre-Qualification
        </span>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 36,
          }}
        >
          {[
            { val: '10+',   label: 'Developer Partners' },
            { val: '3',     label: 'Regions Served'     },
            { val: '₱890K', label: 'Starting Price'     },
            { val: '24h',   label: 'Pre-Qualification'  },
          ].map(s => (
            <div
              key={s.val}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <span style={{ color: '#E85D04', fontSize: 30, fontWeight: 700 }}>
                {s.val}
              </span>
              <span style={{ color: '#6E6055', fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
