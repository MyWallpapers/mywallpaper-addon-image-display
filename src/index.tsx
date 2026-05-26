import { useSettings, useFiles } from '@mywallpaper/sdk-react'
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
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
} as const

const IMAGE_STYLE = {
  ...ROOT_STYLE,
  width: '100%',
  height: '100%',
  objectPosition: 'center',
  display: 'block',
} as const

const IMAGE_CDN_CACHE_MODE_HEADER = 'x-mywallpaper-cache-mode'
const MYWALLPAPER_IMAGE_CDN_ORIGIN = 'https://cdn.mywallpaper.online'

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

function normalizeRemoteImageUrl(value: string): string {
  const url = new URL(value)
  url.hash = ''
  return url.href
}

function canUseUrlDirectly(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'data:' || url.protocol === 'blob:'
  } catch {
    return false
  }
}

function isJsonResponse(contentType: string): boolean {
  return contentType.toLowerCase().split(';')[0]?.trim() === 'application/json'
}

function readCachedImageUrl(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Image cache response is not an object')
  }

  const cachedUrl = (payload as { cachedUrl?: unknown }).cachedUrl
  if (typeof cachedUrl !== 'string') {
    throw new Error('Image cache response is missing cachedUrl')
  }

  const url = new URL(cachedUrl)
  if (url.protocol !== 'https:' || url.origin !== MYWALLPAPER_IMAGE_CDN_ORIGIN) {
    throw new Error('Image cache response returned an unexpected CDN URL')
  }

  return url.href
}

function EmptyImageState({ reason }: { reason: 'missing-local' | 'missing-url' | 'invalid-url' | 'load-failed' | 'loading' }) {
  const copy = {
    'missing-local': {
      title: 'Choose an image',
      hint: 'Pick a local image in the layer settings.',
    },
    'missing-url': {
      title: 'Paste an image URL',
      hint: 'Any public HTTPS image URL is accepted.',
    },
    'invalid-url': {
      title: 'Image URL is invalid',
      hint: 'Use a public HTTPS image URL, or a data/blob URL.',
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
    const remoteUrl = normalizeRemoteImageUrl(settings.imageUrl)

    fetch(remoteUrl, {
      credentials: 'omit',
      headers: {
        accept: 'image/*',
        [IMAGE_CDN_CACHE_MODE_HEADER]: 'image-cdn',
      },
      mode: 'cors',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Image request failed: ${response.status}`)
        }
        const contentType = response.headers.get('content-type') ?? ''
        if (isJsonResponse(contentType)) {
          return {
            kind: 'url' as const,
            url: readCachedImageUrl(await response.json()),
          }
        }
        if (contentType && !contentType.toLowerCase().startsWith('image/')) {
          throw new Error(`URL does not point to an image: ${contentType}`)
        }
        return {
          kind: 'blob' as const,
          blob: await response.blob(),
        }
      })
      .then((result) => {
        if (result.kind === 'url') {
          if (active) {
            setRemoteImageUrl(result.url)
            setFailedSrc(null)
          }
          return
        }

        objectUrl = URL.createObjectURL(result.blob)
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
        ...IMAGE_STYLE,
        objectFit: settings.objectFit,
      }}
    />
  )
}
