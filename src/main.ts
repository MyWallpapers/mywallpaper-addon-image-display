interface Settings {
  imageUrl: string
  objectFit: 'cover' | 'contain' | 'fill'
}

interface MyWallpaperApi {
  settings: {
    get(): Partial<Settings>
    subscribe(listener: (settings: Partial<Settings>) => void): () => void
  }
  lifecycle?: {
    onDispose(listener: () => void): () => void
  }
}

declare global {
  interface Window {
    MyWallpaper?: MyWallpaperApi
  }
}

const DEFAULT_SETTINGS: Settings = {
  imageUrl: '',
  objectFit: 'cover',
}

const root = document.getElementById('app') ?? document.body

const style = document.createElement('style')
style.textContent = `
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    background: transparent;
  }

  .image {
    width: 100%;
    height: 100%;
    display: block;
    max-width: none;
    max-height: none;
    object-position: center;
    pointer-events: none;
  }

  .empty {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    padding: 24px;
    color: rgba(255, 255, 255, 0.88);
    background:
      linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)),
      repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 12px, rgba(255,255,255,0.02) 12px 24px);
    text-align: center;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .empty-title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  .empty-hint {
    margin: 8px 0 0;
    max-width: 34rem;
    font-size: 14px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.68);
  }
`
document.head.append(style)

let failedSrc: string | null = null
let currentImage: HTMLImageElement | null = null

function normalizeSettings(input: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...input,
    imageUrl: typeof input.imageUrl === 'string' ? input.imageUrl.trim() : '',
    objectFit: input.objectFit ?? DEFAULT_SETTINGS.objectFit,
  }
}

function isUsableUrl(value: string): boolean {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)
    return ['https:', 'http:', 'data:', 'blob:'].includes(url.protocol)
  } catch {
    return false
  }
}

function showEmpty(title: string, hint: string): void {
  currentImage = null
  root.innerHTML = ''
  const empty = document.createElement('div')
  empty.className = 'empty'
  empty.innerHTML = `
    <div>
      <p class="empty-title"></p>
      <p class="empty-hint"></p>
    </div>
  `
  empty.querySelector('.empty-title')!.textContent = title
  empty.querySelector('.empty-hint')!.textContent = hint
  root.append(empty)
}

function renderImage(settings: Settings): void {
  if (!settings.imageUrl) {
    showEmpty('Paste an image URL', 'Any public HTTP(S), data, or blob image URL is accepted.')
    return
  }

  if (!isUsableUrl(settings.imageUrl)) {
    showEmpty('Image URL is invalid', 'Use a public HTTP(S) image URL, or a data/blob URL.')
    return
  }

  if (failedSrc === settings.imageUrl) {
    showEmpty('Image could not be loaded', 'Check that the URL points directly to an image.')
    return
  }

  if (!currentImage) {
    root.innerHTML = ''
    currentImage = document.createElement('img')
    currentImage.className = 'image'
    currentImage.alt = ''
    currentImage.referrerPolicy = 'no-referrer'
    currentImage.addEventListener('error', () => {
      failedSrc = currentImage?.src ?? settings.imageUrl
      showEmpty('Image could not be loaded', 'Check that the URL points directly to an image.')
    })
    root.append(currentImage)
  }

  currentImage.style.objectFit = settings.objectFit
  if (currentImage.src !== settings.imageUrl) {
    failedSrc = null
    currentImage.src = settings.imageUrl
  }
}

function applySettings(settings: Partial<Settings>): void {
  renderImage(normalizeSettings(settings))
}

applySettings(window.MyWallpaper?.settings.get() ?? DEFAULT_SETTINGS)
const unsubscribeSettings = window.MyWallpaper?.settings.subscribe(applySettings)
window.MyWallpaper?.lifecycle?.onDispose(() => {
  unsubscribeSettings?.()
  currentImage = null
})
