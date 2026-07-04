const __MYWALLPAPER_WIDGET_RUNTIME_CONTRACT_VERSION__ = "sdk-only-v1";
const window = undefined;
const document = undefined;
const self = undefined;
const globalThis = undefined;
const top = undefined;
const parent = undefined;
const frames = undefined;
const opener = undefined;
const location = undefined;
const navigator = undefined;
const fetch = undefined;
const XMLHttpRequest = undefined;
const WebSocket = undefined;
const EventSource = undefined;
const Notification = undefined;
const localStorage = undefined;
const sessionStorage = undefined;
const indexedDB = undefined;
const BroadcastChannel = undefined;
const caches = undefined;
const open = undefined;
const crypto = undefined;
const Worker = undefined;
const SharedWorker = undefined;
const RTCPeerConnection = undefined;
const RTCDataChannel = undefined;
const __mwRuntime = __canvasWidgetGlobals.runtime;
const __mwReact = __mwRuntime.react;
const __mwReactJsxRuntime = __mwRuntime.reactJsxRuntime;
const __mwSdkReact = __mwRuntime.sdkReact;
const __mwSdkContracts = __mwRuntime.sdkContracts;
const __mwSdkPermissions = __mwRuntime.sdkPermissions;
const t = __mwReactJsxRuntime.jsx;
const m = __mwReactJsxRuntime.jsxs;
const p = __mwSdkReact.useSettings;
const d = __mwSdkReact.useFileUrl;
const u = __mwSdkReact.useRemoteAssetUrl;
const h = __mwReact.useState;
const f = __mwReact.useEffect;
const l = {
  sourceType: "url",
  wallpaperImage: null,
  imageUrl: "",
  objectFit: "cover"
}, s = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  pointerEvents: "none"
}, T = {
  ...s,
  width: "100%",
  height: "100%",
  maxWidth: "none",
  maxHeight: "none",
  objectPosition: "center",
  display: "block",
  pointerEvents: "none"
}, b = {
  ...s,
  display: "grid",
  placeItems: "center",
  boxSizing: "border-box",
  padding: "24px",
  color: "rgba(255, 255, 255, 0.88)",
  background: "linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 12px, rgba(255,255,255,0.02) 12px 24px)",
  textAlign: "center"
}, y = {
  margin: 0,
  fontSize: "clamp(16px, 2.3vw, 28px)",
  fontWeight: 700,
  letterSpacing: "0.01em"
}, S = {
  margin: "8px 0 0",
  maxWidth: "34rem",
  fontSize: "clamp(12px, 1.35vw, 16px)",
  lineHeight: 1.45,
  color: "rgba(255, 255, 255, 0.68)"
};
function U(e) {
  return {
    ...l,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? l.objectFit,
    sourceType: e.sourceType ?? l.sourceType
  };
}
function x(e) {
  if (!e) return !1;
  try {
    const i = new URL(e);
    return i.protocol === "https:" || i.protocol === "http:" || i.protocol === "data:" || i.protocol === "blob:";
  } catch {
    return !1;
  }
}
function o({ reason: e }) {
  const i = {
    "missing-local": {
      title: "Choose an image",
      hint: "Pick a local image in the layer settings."
    },
    "missing-url": {
      title: "Paste an image URL",
      hint: "Any public HTTP(S) image URL is accepted."
    },
    "invalid-url": {
      title: "Image URL is invalid",
      hint: "Use a public HTTP(S) image URL, or a data/blob URL."
    },
    "load-failed": {
      title: "Image could not be loaded",
      hint: "Check the file or URL. Some sites block image downloads or require a direct image link."
    },
    loading: {
      title: "Loading image...",
      hint: "The selected image is being prepared by the host runtime."
    }
  }[e];
  return /* @__PURE__ */ t("div", { style: b, children: /* @__PURE__ */ m("div", { children: [
    /* @__PURE__ */ t("p", { style: y, children: i.title }),
    /* @__PURE__ */ t("p", { style: S, children: i.hint })
  ] }) });
}
function v() {
  const e = U(p()), i = d("wallpaperImage"), c = u(e.imageUrl, { kind: "image" }), n = e.sourceType === "local" ? i : c, r = n.url, [g, a] = h(null);
  return f(() => {
    a(null);
  }, [r]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ t(o, { reason: "missing-url" }) : e.sourceType === "url" && !x(e.imageUrl) ? /* @__PURE__ */ t(o, { reason: "invalid-url" }) : n.loading ? /* @__PURE__ */ t(o, { reason: "loading" }) : n.error || r && g === r ? /* @__PURE__ */ t(o, { reason: "load-failed" }) : r ? /* @__PURE__ */ t(
    "img",
    {
      src: r,
      alt: "",
      referrerPolicy: "no-referrer",
      onError: () => a(r),
      style: {
        ...T,
        objectFit: e.objectFit
      }
    }
  ) : /* @__PURE__ */ t(o, { reason: e.sourceType === "local" ? "missing-local" : "missing-url" });
}
export {
  v as default
};
