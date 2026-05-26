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
const l = __canvasRuntimeJsxRuntime.jsx;
const j = __canvasRuntimeJsxRuntime.jsxs;
const F = __canvasRuntimeSdk.useSettings;
const _ = __canvasRuntimeSdk.useFiles;
const g = __canvasRuntimeReact.useState;
const U = __canvasRuntimeReact.useEffect;
const b = {
  sourceType: "url",
  wallpaperImage: null,
  imageUrl: "",
  objectFit: "cover"
}, I = {
  width: "100%",
  height: "100%",
  pointerEvents: "none"
}, v = "x-mywallpaper-cache-mode", k = "https://cdn.mywallpaper.online", P = {
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
}, A = {
  margin: 0,
  fontSize: "clamp(16px, 2.3vw, 28px)",
  fontWeight: 700,
  letterSpacing: "0.01em"
}, C = {
  margin: "8px 0 0",
  maxWidth: "34rem",
  fontSize: "clamp(12px, 1.35vw, 16px)",
  lineHeight: 1.45,
  color: "rgba(255, 255, 255, 0.68)"
};
function D(e) {
  return {
    ...b,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? b.objectFit,
    sourceType: e.sourceType ?? b.sourceType
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
function Y(e) {
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
function M(e) {
  return e.toLowerCase().split(";")[0]?.trim() === "application/json";
}
function O(e) {
  if (!e || typeof e != "object")
    throw new Error("Image cache response is not an object");
  const r = e.cachedUrl;
  if (typeof r != "string")
    throw new Error("Image cache response is missing cachedUrl");
  const a = new URL(r);
  if (a.protocol !== "https:" || a.origin !== k)
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
  return /* @__PURE__ */ l("div", { style: P, children: /* @__PURE__ */ j("div", { children: [
    /* @__PURE__ */ l("p", { style: A, children: r.title }),
    /* @__PURE__ */ l("p", { style: C, children: r.hint })
  ] }) });
}
function q() {
  const e = D(F()), { request: r, release: a, isFileReference: y } = _(), [R, d] = g(null), [w, m] = g(null), [E, f] = g(!1), [x, h] = g(!1), [S, c] = g(null);
  U(() => {
    if (e.sourceType !== "local" || !y(e.wallpaperImage)) {
      d(null), f(!1);
      return;
    }
    let i = !0, o = null;
    return f(!0), r("wallpaperImage").then((n) => {
      o = n, i ? (d(n), c(null)) : a(n);
    }).catch((n) => {
      console.error("[ImageDisplay] Failed to load selected image:", n), i && d(null);
    }).finally(() => {
      i && f(!1);
    }), () => {
      i = !1, o && a(o);
    };
  }, [e.sourceType, e.wallpaperImage, r, a, y]), U(() => {
    if (e.sourceType !== "url" || !L(e.imageUrl) || T(e.imageUrl)) {
      m(null), h(!1);
      return;
    }
    let i = !0, o = null;
    h(!0);
    const n = Y(e.imageUrl);
    return fetch(n, {
      credentials: "omit",
      headers: {
        accept: "image/*",
        [v]: "image-cdn"
      },
      mode: "cors",
      redirect: "error",
      referrerPolicy: "no-referrer"
    }).then(async (t) => {
      if (!t.ok)
        throw new Error(`Image request failed: ${t.status}`);
      const p = t.headers.get("content-type") ?? "";
      if (M(p))
        return {
          kind: "url",
          url: O(await t.json())
        };
      if (p && !p.toLowerCase().startsWith("image/"))
        throw new Error(`URL does not point to an image: ${p}`);
      return {
        kind: "blob",
        blob: await t.blob()
      };
    }).then((t) => {
      if (t.kind === "url") {
        i && (m(t.url), c(null));
        return;
      }
      o = URL.createObjectURL(t.blob), i ? (m(o), c(null)) : URL.revokeObjectURL(o);
    }).catch((t) => {
      console.error("[ImageDisplay] Failed to load remote image:", t), i && m(null);
    }).finally(() => {
      i && h(!1);
    }), () => {
      i = !1, o && URL.revokeObjectURL(o);
    };
  }, [e.sourceType, e.imageUrl]);
  const u = e.sourceType === "url" ? T(e.imageUrl) ? e.imageUrl : w : R;
  return U(() => {
    c(null);
  }, [u]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ l(s, { reason: "missing-url" }) : e.sourceType === "url" && !L(e.imageUrl) ? /* @__PURE__ */ l(s, { reason: "invalid-url" }) : e.sourceType === "local" && E ? /* @__PURE__ */ l(s, { reason: "loading" }) : e.sourceType === "url" && x ? /* @__PURE__ */ l(s, { reason: "loading" }) : u ? S === u ? /* @__PURE__ */ l(s, { reason: "load-failed" }) : /* @__PURE__ */ l(
    "img",
    {
      src: u,
      alt: "",
      referrerPolicy: "no-referrer",
      onError: () => c(u),
      style: {
        ...I,
        objectFit: e.objectFit,
        display: "block"
      }
    }
  ) : /* @__PURE__ */ l(s, { reason: "missing-local" });
}
export {
  q as default
};
