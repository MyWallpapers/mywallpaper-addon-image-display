import { useFileUrl, useRemoteAssetUrl, useSettings } from '@mywallpaper/sdk-react'
import { useEffect, useState } from 'react'

interface Settings {
  sourceType: 'local' | 'url'
  wallpaperImage: unknown
  imageUrl: string
  objectFit: 'cover' | 'contain' | 'fill'
}

const DEFAULT_SETTINGS: Settings = {
  sourceType: 'url',
  wallpaperImage: null,
  imageUrl: '',
  objectFit: 'cover',
}

const ROOT_STYLE = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  pointerEvents: 'none',
} as const

const IMAGE_STYLE = {
  ...ROOT_STYLE,
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  maxHeight: 'none',
  objectPosition: 'center',
  display: 'block',
  pointerEvents: 'none',
} as const

const EMPTY_STATE_STYLE = {
  ...ROOT_STYLE,
  display: 'grid',
  placeItems: 'center',
  boxSizing: 'border-box',
  padding: '24px',
  color: 'rgba(255, 255, 255, 0.88)',
  background:
    'linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 12px, rgba(255,255,255,0.02) 12px 24px)',
  textAlign: 'center',
} as const

const EMPTY_TITLE_STYLE = {
  margin: 0,
  fontSize: 'clamp(16px, 2.3vw, 28px)',
  fontWeight: 700,
  letterSpacing: '0.01em',
} as const

const EMPTY_HINT_STYLE = {
  margin: '8px 0 0',
  maxWidth: '34rem',
  fontSize: 'clamp(12px, 1.35vw, 16px)',
  lineHeight: 1.45,
  color: 'rgba(255, 255, 255, 0.68)',
} as const

function normalizeSettings(settings: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    imageUrl: typeof settings.imageUrl === 'string' ? settings.imageUrl.trim() : '',
    objectFit: settings.objectFit ?? DEFAULT_SETTINGS.objectFit,
    sourceType: settings.sourceType ?? DEFAULT_SETTINGS.sourceType,
  }
}

function isUsableUrl(value: string): boolean {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'data:' || url.protocol === 'blob:'
  } catch {
    return false
  }
}

function EmptyImageState({ reason }: { reason: 'missing-local' | 'missing-url' | 'invalid-url' | 'load-failed' | 'loading' }) {
  const copy = {
    'missing-local': {
      title: 'Choose an image',
      hint: 'Pick a local image in the layer settings.',
    },
    'missing-url': {
      title: 'Paste an image URL',
      hint: 'Any public HTTP(S) image URL is accepted.',
    },
    'invalid-url': {
      title: 'Image URL is invalid',
      hint: 'Use a public HTTP(S) image URL, or a data/blob URL.',
    },
    'load-failed': {
      title: 'Image could not be loaded',
      hint: 'Check the file or URL. Some sites block image downloads or require a direct image link.',
    },
    loading: {
      title: 'Loading image...',
      hint: 'The selected image is being prepared by the host runtime.',
    },
  }[reason]

  return (
    <div style={EMPTY_STATE_STYLE}>
      <div>
        <p style={EMPTY_TITLE_STYLE}>{copy.title}</p>
        <p style={EMPTY_HINT_STYLE}>{copy.hint}</p>
      </div>
    </div>
  )
}

export default function ImageDisplay() {
  const settings = normalizeSettings(useSettings<Partial<Settings>>())
  const localImage = useFileUrl('wallpaperImage')
  const remoteImage = useRemoteAssetUrl(settings.imageUrl, { kind: 'image' })
  const asset = settings.sourceType === 'local' ? localImage : remoteImage
  const src = asset.url
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  useEffect(() => {
    setFailedSrc(null)
  }, [src])

  if (settings.sourceType === 'url' && !settings.imageUrl) {
    return <EmptyImageState reason="missing-url" />
  }

  if (settings.sourceType === 'url' && !isUsableUrl(settings.imageUrl)) {
    return <EmptyImageState reason="invalid-url" />
  }

  if (asset.loading) {
    return <EmptyImageState reason="loading" />
  }

  if (asset.error || (src && failedSrc === src)) {
    return <EmptyImageState reason="load-failed" />
  }

  if (!src) {
    return <EmptyImageState reason={settings.sourceType === 'local' ? 'missing-local' : 'missing-url'} />
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      style={{
        ...IMAGE_STYLE,
        objectFit: settings.objectFit,
      }}
    />
  )
}
