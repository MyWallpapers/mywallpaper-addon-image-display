import { useSettings, useFiles } from '@mywallpaper/sdk-react'
import { useEffect, useState } from 'react'

interface Settings {
  sourceType: 'local' | 'url'
  wallpaperImage: unknown
  imageUrl: string
  objectFit: 'cover' | 'contain' | 'fill'
}

const DEFAULT_SETTINGS: Settings = {
  sourceType: 'local',
  wallpaperImage: null,
  imageUrl: '',
  objectFit: 'cover',
}

const ROOT_STYLE = {
  width: '100%',
  height: '100%',
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
  border: '1px dashed rgba(255, 255, 255, 0.32)',
  borderRadius: '18px',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
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
    return url.protocol === 'https:' || url.protocol === 'data:' || url.protocol === 'blob:'
  } catch {
    return false
  }
}

function canUseUrlDirectly(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'data:' || url.protocol === 'blob:'
  } catch {
    return false
  }
}

function EmptyImageState({ reason }: { reason: 'missing-local' | 'missing-url' | 'invalid-url' | 'load-failed' | 'loading' }) {
  const copy = {
    'missing-local': {
      title: 'Image Display is ready',
      hint: 'Select an image in the layer settings to show it on the wallpaper.',
    },
    'missing-url': {
      title: 'Image Display is ready',
      hint: 'Choose "Online URL" and paste an image URL, or switch back to a local upload.',
    },
    'invalid-url': {
      title: 'Image URL is invalid',
      hint: 'Use an https, data, or blob URL.',
    },
    'load-failed': {
      title: 'Image could not be loaded',
      hint: 'Check the selected file or URL, then update the layer settings.',
    },
    loading: {
      title: 'Loading image...',
      hint: 'The selected local image is being prepared by the host runtime.',
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
  const { request: requestFile, release: releaseFile, isFileReference } = useFiles()
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)
  const [remoteImageUrl, setRemoteImageUrl] = useState<string | null>(null)
  const [isLoadingLocalImage, setIsLoadingLocalImage] = useState(false)
  const [isLoadingRemoteImage, setIsLoadingRemoteImage] = useState(false)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  useEffect(() => {
    if (settings.sourceType !== 'local' || !isFileReference(settings.wallpaperImage)) {
      setLocalImageUrl(null)
      setIsLoadingLocalImage(false)
      return
    }

    let active = true
    let resolvedUrl: string | null = null

    setIsLoadingLocalImage(true)
    requestFile('wallpaperImage')
      .then((url) => {
        resolvedUrl = url
        if (active) {
          setLocalImageUrl(url)
          setFailedSrc(null)
        } else {
          releaseFile(url)
        }
      })
      .catch((error) => {
        console.error('[ImageDisplay] Failed to load selected image:', error)
        if (active) setLocalImageUrl(null)
      })
      .finally(() => {
        if (active) setIsLoadingLocalImage(false)
      })

    return () => {
      active = false
      if (resolvedUrl) {
        releaseFile(resolvedUrl)
      }
    }
  }, [settings.sourceType, settings.wallpaperImage, requestFile, releaseFile, isFileReference])

  useEffect(() => {
    if (
      settings.sourceType !== 'url' ||
      !isUsableUrl(settings.imageUrl) ||
      canUseUrlDirectly(settings.imageUrl)
    ) {
      setRemoteImageUrl(null)
      setIsLoadingRemoteImage(false)
      return
    }

    let active = true
    let objectUrl: string | null = null

    setIsLoadingRemoteImage(true)
    fetch(settings.imageUrl, {
      credentials: 'omit',
      mode: 'cors',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Image request failed: ${response.status}`)
        }
        const contentType = response.headers.get('content-type') ?? ''
        if (contentType && !contentType.toLowerCase().startsWith('image/')) {
          throw new Error(`URL does not point to an image: ${contentType}`)
        }
        return response.blob()
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        if (active) {
          setRemoteImageUrl(objectUrl)
          setFailedSrc(null)
        } else {
          URL.revokeObjectURL(objectUrl)
        }
      })
      .catch((error) => {
        console.error('[ImageDisplay] Failed to load remote image:', error)
        if (active) setRemoteImageUrl(null)
      })
      .finally(() => {
        if (active) setIsLoadingRemoteImage(false)
      })

    return () => {
      active = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [settings.sourceType, settings.imageUrl])

  const src = settings.sourceType === 'url'
    ? canUseUrlDirectly(settings.imageUrl) ? settings.imageUrl : remoteImageUrl
    : localImageUrl

  useEffect(() => {
    setFailedSrc(null)
  }, [src])

  if (settings.sourceType === 'url' && !settings.imageUrl) {
    return <EmptyImageState reason="missing-url" />
  }

  if (settings.sourceType === 'url' && !isUsableUrl(settings.imageUrl)) {
    return <EmptyImageState reason="invalid-url" />
  }

  if (settings.sourceType === 'local' && isLoadingLocalImage) {
    return <EmptyImageState reason="loading" />
  }

  if (settings.sourceType === 'url' && isLoadingRemoteImage) {
    return <EmptyImageState reason="loading" />
  }

  if (!src) {
    return <EmptyImageState reason="missing-local" />
  }

  if (failedSrc === src) {
    return <EmptyImageState reason="load-failed" />
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      style={{
        ...ROOT_STYLE,
        objectFit: settings.objectFit,
        display: 'block',
      }}
    />
  )
}
