import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF3B30',
          borderRadius: '110px',
          border: '14px solid #141416',
          position: 'relative',
        }}
      >
        {/* Yellow Sun Disk */}
        <div
          style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: '#FFCC00',
            border: '12px solid #141416',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
          }}
        >
          🎯
        </div>
      </div>
    ),
    { ...size }
  );
}
