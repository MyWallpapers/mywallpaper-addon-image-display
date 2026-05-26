const __MYWALLPAPER_WIDGET_RUNTIME_CONTRACT__ = "1";
if (!__canvasRuntime) {
      throw new Error('Canvas runtime globals are unavailable');
    }
if (!__canvasRuntime.react || !__canvasRuntime.reactJsxRuntime || !__canvasRuntime.sdkReact || !__canvasRuntime.sdkContracts || !__canvasRuntime.sdkPermissions) {
      throw new Error('Canvas runtime globals are unavailable');
    }
const __canvasRuntimeReact = __canvasRuntime.react;
const __canvasRuntimeJsxRuntime = __canvasRuntime.reactJsxRuntime;
const __canvasRuntimeSdk = __canvasRuntime.sdkReact;
const __canvasRuntimeSdkContracts = __canvasRuntime.sdkContracts;
const __canvasRuntimeSdkPermissions = __canvasRuntime.sdkPermissions;
const i = __canvasRuntimeJsxRuntime.jsx;
const j = __canvasRuntimeJsxRuntime.jsxs;
const v = __canvasRuntimeSdk.useSettings;
const _ = __canvasRuntimeSdk.useFiles;
const g = __canvasRuntimeReact.useState;
const b = __canvasRuntimeReact.useEffect;
const U = {
  sourceType: "url",
  wallpaperImage: null,
  imageUrl: "",
  objectFit: "cover"
}, I = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  pointerEvents: "none"
}, F = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectPosition: "center",
  display: "block"
}, k = "x-mywallpaper-cache-mode", P = "https://cdn.mywallpaper.online", A = {
  ...I,
  display: "grid",
  placeItems: "center",
  boxSizing: "border-box",
  padding: "24px",
  color: "rgba(255, 255, 255, 0.88)",
  background: "linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 12px, rgba(255,255,255,0.02) 12px 24px)",
  border: "1px dashed rgba(255, 255, 255, 0.32)",
  borderRadius: "18px",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  textAlign: "center"
}, C = {
  margin: 0,
  fontSize: "clamp(16px, 2.3vw, 28px)",
  fontWeight: 700,
  letterSpacing: "0.01em"
}, D = {
  margin: "8px 0 0",
  maxWidth: "34rem",
  fontSize: "clamp(12px, 1.35vw, 16px)",
  lineHeight: 1.45,
  color: "rgba(255, 255, 255, 0.68)"
};
function Y(e) {
  return {
    ...U,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? U.objectFit,
    sourceType: e.sourceType ?? U.sourceType
  };
}
function L(e) {
  if (!e) return !1;
  try {
    const r = new URL(e);
    return r.protocol === "https:" || r.protocol === "data:" || r.protocol === "blob:";
  } catch {
    return !1;
  }
}
function M(e) {
  const r = new URL(e);
  return r.hash = "", r.href;
}
function T(e) {
  try {
    const r = new URL(e);
    return r.protocol === "data:" || r.protocol === "blob:";
  } catch {
    return !1;
  }
}
function O(e) {
  return e.toLowerCase().split(";")[0]?.trim() === "application/json";
}
function H(e) {
  if (!e || typeof e != "object")
    throw new Error("Image cache response is not an object");
  const r = e.cachedUrl;
  if (typeof r != "string")
    throw new Error("Image cache response is missing cachedUrl");
  const a = new URL(r);
  if (a.protocol !== "https:" || a.origin !== P)
    throw new Error("Image cache response returned an unexpected CDN URL");
  return a.href;
}
function s({ reason: e }) {
  const r = {
    "missing-local": {
      title: "Choose an image",
      hint: "Pick a local image in the layer settings."
    },
    "missing-url": {
      title: "Paste an image URL",
      hint: "Any public HTTPS image URL is accepted."
    },
    "invalid-url": {
      title: "Image URL is invalid",
      hint: "Use a public HTTPS image URL, or a data/blob URL."
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
  return /* @__PURE__ */ i("div", { style: A, children: /* @__PURE__ */ j("div", { children: [
    /* @__PURE__ */ i("p", { style: C, children: r.title }),
    /* @__PURE__ */ i("p", { style: D, children: r.hint })
  ] }) });
}
function q() {
  const e = Y(v()), { request: r, release: a, isFileReference: y } = _(), [w, p] = g(null), [E, m] = g(null), [R, f] = g(!1), [S, h] = g(!1), [x, c] = g(null);
  b(() => {
    if (e.sourceType !== "local" || !y(e.wallpaperImage)) {
      p(null), f(!1);
      return;
    }
    let o = !0, l = null;
    return f(!0), r("wallpaperImage").then((n) => {
      l = n, o ? (p(n), c(null)) : a(n);
    }).catch((n) => {
      console.error("[ImageDisplay] Failed to load selected image:", n), o && p(null);
    }).finally(() => {
      o && f(!1);
    }), () => {
      o = !1, l && a(l);
    };
  }, [e.sourceType, e.wallpaperImage, r, a, y]), b(() => {
    if (e.sourceType !== "url" || !L(e.imageUrl) || T(e.imageUrl)) {
      m(null), h(!1);
      return;
    }
    let o = !0, l = null;
    h(!0);
    const n = M(e.imageUrl);
    return fetch(n, {
      credentials: "omit",
      headers: {
        accept: "image/*",
        [k]: "image-cdn"
      },
      mode: "cors",
      redirect: "error",
      referrerPolicy: "no-referrer"
    }).then(async (t) => {
      if (!t.ok)
        throw new Error(`Image request failed: ${t.status}`);
      const d = t.headers.get("content-type") ?? "";
      if (O(d))
        return {
          kind: "url",
          url: H(await t.json())
        };
      if (d && !d.toLowerCase().startsWith("image/"))
        throw new Error(`URL does not point to an image: ${d}`);
      return {
        kind: "blob",
        blob: await t.blob()
      };
    }).then((t) => {
      if (t.kind === "url") {
        o && (m(t.url), c(null));
        return;
      }
      l = URL.createObjectURL(t.blob), o ? (m(l), c(null)) : URL.revokeObjectURL(l);
    }).catch((t) => {
      console.error("[ImageDisplay] Failed to load remote image:", t), o && m(null);
    }).finally(() => {
      o && h(!1);
    }), () => {
      o = !1, l && URL.revokeObjectURL(l);
    };
  }, [e.sourceType, e.imageUrl]);
  const u = e.sourceType === "url" ? T(e.imageUrl) ? e.imageUrl : E : w;
  return b(() => {
    c(null);
  }, [u]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ i(s, { reason: "missing-url" }) : e.sourceType === "url" && !L(e.imageUrl) ? /* @__PURE__ */ i(s, { reason: "invalid-url" }) : e.sourceType === "local" && R ? /* @__PURE__ */ i(s, { reason: "loading" }) : e.sourceType === "url" && S ? /* @__PURE__ */ i(s, { reason: "loading" }) : u ? x === u ? /* @__PURE__ */ i(s, { reason: "load-failed" }) : /* @__PURE__ */ i("div", { style: I, children: /* @__PURE__ */ i(
    "img",
    {
      src: u,
      alt: "",
      referrerPolicy: "no-referrer",
      onError: () => c(u),
      style: {
        ...F,
        objectFit: e.objectFit
      }
    }
  ) }) : /* @__PURE__ */ i(s, { reason: "missing-local" });
}
export {
  q as default
};
