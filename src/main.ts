import type {
  AddonValues,
  CanvasAddonMountContext,
} from '../generated/mywallpaper-runtime'

interface Settings {
  imageUrl: string
  objectFit: 'cover' | 'contain' | 'fill'
}

const DEFAULT_SETTINGS: Settings = {
  imageUrl: '',
  objectFit: 'cover',
}

export function mount({ layer }: CanvasAddonMountContext): () => void {
  const root = layer.root
  root.classList.add('mwa-image-display-root')

  const style = document.createElement('style')
  style.textContent = `
    .mwa-image-display-root {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: transparent;
    }

    .mwa-image-display-root .mwa-image-display-image {
      width: 100%;
      height: 100%;
      display: block;
      max-width: none;
      max-height: none;
      object-position: center;
      pointer-events: none;
    }

    .mwa-image-display-root .mwa-image-display-empty {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      padding: 24px;
      color: rgba(255, 255, 255, 0.88);
      background:
        linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)),
        repeating-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.08) 0 12px,
          rgba(255, 255, 255, 0.02) 12px 24px
        );
      text-align: center;
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }

    .mwa-image-display-root .mwa-image-display-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }

    .mwa-image-display-root .mwa-image-display-hint {
      margin: 8px 0 0;
      max-width: 34rem;
      font-size: 14px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.68);
    }
  `
  document.head.append(style)

  let failedSource: string | null = null
  let currentSource: string | null = null
  let currentImage: HTMLImageElement | null = null

  function showEmpty(title: string, hint: string): void {
    currentImage = null
    currentSource = null

    const empty = document.createElement('div')
    empty.className = 'mwa-image-display-empty'

    const content = document.createElement('div')
    const titleElement = document.createElement('p')
    titleElement.className = 'mwa-image-display-title'
    titleElement.textContent = title

    const hintElement = document.createElement('p')
    hintElement.className = 'mwa-image-display-hint'
    hintElement.textContent = hint

    content.append(titleElement, hintElement)
    empty.append(content)
    root.replaceChildren(empty)
  }

  function renderImage(settings: Settings): void {
    if (!settings.imageUrl) {
      showEmpty('Paste an image URL', 'Any public HTTP(S), data or blob image URL is accepted.')
      return
    }

    if (!isUsableUrl(settings.imageUrl)) {
      showEmpty('Image URL is invalid', 'Use a public HTTP(S), data or blob image URL.')
      return
    }

    if (failedSource === settings.imageUrl) {
      showEmpty('Image could not be loaded', 'Check that the URL points directly to an image.')
      return
    }

    if (!currentImage) {
      const image = document.createElement('img')
      image.className = 'mwa-image-display-image'
      image.alt = ''
      image.referrerPolicy = 'no-referrer'
      image.addEventListener('error', () => {
        failedSource = currentSource ?? settings.imageUrl
        showEmpty('Image could not be loaded', 'Check that the URL points directly to an image.')
      })
      currentImage = image
      root.replaceChildren(image)
    }

    currentImage.style.objectFit = settings.objectFit
    if (currentSource !== settings.imageUrl) {
      failedSource = null
      currentSource = settings.imageUrl
      currentImage.src = settings.imageUrl
    }
  }

  function applySettings(values: AddonValues): void {
    renderImage(normalizeSettings(values))
  }

  applySettings(layer.settings.get())
  const unsubscribeSettings = layer.settings.subscribe(applySettings)

  return () => {
    unsubscribeSettings()
    style.remove()
    root.classList.remove('mwa-image-display-root')
    root.replaceChildren()
    currentImage = null
    currentSource = null
  }
}

function normalizeSettings(input: AddonValues): Settings {
  const objectFit = input['objectFit']
  return {
    imageUrl: typeof input['imageUrl'] === 'string' ? input['imageUrl'].trim() : '',
    objectFit:
      objectFit === 'contain' || objectFit === 'fill' || objectFit === 'cover'
        ? objectFit
        : DEFAULT_SETTINGS.objectFit,
  }
}

function isUsableUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      || url.protocol === 'http:'
      || url.protocol === 'data:'
      || url.protocol === 'blob:'
  } catch {
    return false
  }
}
