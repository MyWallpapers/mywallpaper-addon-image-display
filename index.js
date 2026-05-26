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
const o = __canvasRuntimeJsxRuntime.jsx;
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
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  pointerEvents: "none"
}, F = {
  ...I,
  width: "100%",
  height: "100%",
  maxWidth: "none",
  maxHeight: "none",
  objectPosition: "center",
  display: "block",
  pointerEvents: "none"
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
function H(e) {
  return e.toLowerCase().split(";")[0]?.trim() === "application/json";
}
function O(e) {
  if (!e || typeof e != "object")
    throw new Error("Image cache response is not an object");
  const r = e.cachedUrl;
  if (typeof r != "string")
    throw new Error("Image cache response is missing cachedUrl");
  const l = new URL(r);
  if (l.protocol !== "https:" || l.origin !== P)
    throw new Error("Image cache response returned an unexpected CDN URL");
  return l.href;
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
  return /* @__PURE__ */ o("div", { style: A, children: /* @__PURE__ */ j("div", { children: [
    /* @__PURE__ */ o("p", { style: C, children: r.title }),
    /* @__PURE__ */ o("p", { style: D, children: r.hint })
  ] }) });
}
function W() {
  const e = Y(v()), { request: r, release: l, isFileReference: y } = _(), [w, p] = g(null), [E, m] = g(null), [R, f] = g(!1), [x, h] = g(!1), [S, c] = g(null);
  b(() => {
    if (e.sourceType !== "local" || !y(e.wallpaperImage)) {
      p(null), f(!1);
      return;
    }
    let i = !0, n = null;
    return f(!0), r("wallpaperImage").then((a) => {
      n = a, i ? (p(a), c(null)) : l(a);
    }).catch((a) => {
      console.error("[ImageDisplay] Failed to load selected image:", a), i && p(null);
    }).finally(() => {
      i && f(!1);
    }), () => {
      i = !1, n && l(n);
    };
  }, [e.sourceType, e.wallpaperImage, r, l, y]), b(() => {
    if (e.sourceType !== "url" || !L(e.imageUrl) || T(e.imageUrl)) {
      m(null), h(!1);
      return;
    }
    let i = !0, n = null;
    h(!0);
    const a = M(e.imageUrl);
    return fetch(a, {
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
      if (H(d))
        return {
          kind: "url",
          url: O(await t.json())
        };
      if (d && !d.toLowerCase().startsWith("image/"))
        throw new Error(`URL does not point to an image: ${d}`);
      return {
        kind: "blob",
        blob: await t.blob()
      };
    }).then((t) => {
      if (t.kind === "url") {
        i && (m(t.url), c(null));
        return;
      }
      n = URL.createObjectURL(t.blob), i ? (m(n), c(null)) : URL.revokeObjectURL(n);
    }).catch((t) => {
      console.error("[ImageDisplay] Failed to load remote image:", t), i && m(null);
    }).finally(() => {
      i && h(!1);
    }), () => {
      i = !1, n && URL.revokeObjectURL(n);
    };
  }, [e.sourceType, e.imageUrl]);
  const u = e.sourceType === "url" ? T(e.imageUrl) ? e.imageUrl : E : w;
  return b(() => {
    c(null);
  }, [u]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ o(s, { reason: "missing-url" }) : e.sourceType === "url" && !L(e.imageUrl) ? /* @__PURE__ */ o(s, { reason: "invalid-url" }) : e.sourceType === "local" && R ? /* @__PURE__ */ o(s, { reason: "loading" }) : e.sourceType === "url" && x ? /* @__PURE__ */ o(s, { reason: "loading" }) : u ? S === u ? /* @__PURE__ */ o(s, { reason: "load-failed" }) : /* @__PURE__ */ o(
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
  ) : /* @__PURE__ */ o(s, { reason: "missing-local" });
}
export {
  W as default
};
