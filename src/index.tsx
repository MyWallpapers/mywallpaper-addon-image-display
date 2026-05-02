import { useSettings, useFiles } from '@mywallpaper/sdk-react'
import { useState, useEffect } from 'react'

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

function normalizeSettings(settings: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    imageUrl: typeof settings.imageUrl === 'string' ? settings.imageUrl.trim() : '',
    objectFit: settings.objectFit ?? DEFAULT_SETTINGS.objectFit,
    sourceType: settings.sourceType ?? DEFAULT_SETTINGS.sourceType,
  }
}

export default function ImageDisplay() {
  const settings = normalizeSettings(useSettings<Partial<Settings>>())
  const { request: requestFile, release: releaseFile, isFileReference } = useFiles()
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (settings.sourceType !== 'local' || !isFileReference(settings.wallpaperImage)) {
      setLocalImageUrl(null)
      return
    }

    let active = true
    let resolvedUrl: string | null = null

    requestFile('wallpaperImage')
      .then((url) => {
        resolvedUrl = url
        if (active) {
          setLocalImageUrl(url)
        } else {
          releaseFile(url)
        }
      })
      .catch((error) => {
        console.error('[ImageDisplay] Failed to load selected image:', error)
        if (active) setLocalImageUrl(null)
      })

    return () => {
      active = false
      if (resolvedUrl) {
        releaseFile(resolvedUrl)
      }
    }
  }, [settings.sourceType, settings.wallpaperImage, requestFile, releaseFile, isFileReference])

  const src = settings.sourceType === 'url' ? settings.imageUrl : localImageUrl

  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: settings.objectFit,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}
