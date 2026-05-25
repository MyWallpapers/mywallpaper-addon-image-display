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
const a = __canvasRuntimeJsxRuntime.jsx;
const S = __canvasRuntimeJsxRuntime.jsxs;
const j = __canvasRuntimeSdk.useSettings;
const F = __canvasRuntimeSdk.useFiles;
const u = __canvasRuntimeReact.useState;
const h = __canvasRuntimeReact.useEffect;
const y = {
  sourceType: "local",
  wallpaperImage: null,
  imageUrl: "",
  objectFit: "cover"
}, L = {
  width: "100%",
  height: "100%",
  pointerEvents: "none"
}, _ = "x-mywallpaper-cache-mode", v = "https://cdn.mywallpaper.online", D = {
  ...L,
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
}, k = {
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
function A(e) {
  return {
    ...y,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? y.objectFit,
    sourceType: e.sourceType ?? y.sourceType
  };
}
function U(e) {
  if (!e) return !1;
  try {
    const t = new URL(e);
    return t.protocol === "https:" || t.protocol === "data:" || t.protocol === "blob:";
  } catch {
    return !1;
  }
}
function I(e) {
  try {
    const t = new URL(e);
    return t.protocol === "data:" || t.protocol === "blob:";
  } catch {
    return !1;
  }
}
function O(e) {
  return e.toLowerCase().split(";")[0]?.trim() === "application/json";
}
function Y(e) {
  if (!e || typeof e != "object")
    throw new Error("Image cache response is not an object");
  const t = e.cachedUrl;
  if (typeof t != "string")
    throw new Error("Image cache response is missing cachedUrl");
  const i = new URL(t);
  if (i.protocol !== "https:" || i.origin !== v)
    throw new Error("Image cache response returned an unexpected CDN URL");
  return i.href;
}
function n({ reason: e }) {
  const t = {
    "missing-local": {
      title: "Image Display is ready",
      hint: "Select an image in the layer settings to show it on the wallpaper."
    },
    "missing-url": {
      title: "Image Display is ready",
      hint: 'Choose "Online URL" and paste an image URL, or switch back to a local upload.'
    },
    "invalid-url": {
      title: "Image URL is invalid",
      hint: "Use an https, data, or blob URL."
    },
    "load-failed": {
      title: "Image could not be loaded",
      hint: "Check the selected file or URL, then update the layer settings."
    },
    loading: {
      title: "Loading image...",
      hint: "The selected image is being prepared by the host runtime."
    }
  }[e];
  return /* @__PURE__ */ a("div", { style: D, children: /* @__PURE__ */ S("div", { children: [
    /* @__PURE__ */ a("p", { style: k, children: t.title }),
    /* @__PURE__ */ a("p", { style: C, children: t.hint })
  ] }) });
}
function z() {
  const e = A(j()), { request: t, release: i, isFileReference: b } = F(), [T, p] = u(null), [w, g] = u(null), [E, d] = u(!1), [R, f] = u(!1), [x, s] = u(null);
  h(() => {
    if (e.sourceType !== "local" || !b(e.wallpaperImage)) {
      p(null), d(!1);
      return;
    }
    let l = !0, o = null;
    return d(!0), t("wallpaperImage").then((r) => {
      o = r, l ? (p(r), s(null)) : i(r);
    }).catch((r) => {
      console.error("[ImageDisplay] Failed to load selected image:", r), l && p(null);
    }).finally(() => {
      l && d(!1);
    }), () => {
      l = !1, o && i(o);
    };
  }, [e.sourceType, e.wallpaperImage, t, i, b]), h(() => {
    if (e.sourceType !== "url" || !U(e.imageUrl) || I(e.imageUrl)) {
      g(null), f(!1);
      return;
    }
    let l = !0, o = null;
    return f(!0), fetch(e.imageUrl, {
      credentials: "omit",
      headers: {
        accept: "image/*",
        [_]: "image-cdn"
      },
      mode: "cors",
      redirect: "error",
      referrerPolicy: "no-referrer"
    }).then(async (r) => {
      if (!r.ok)
        throw new Error(`Image request failed: ${r.status}`);
      const m = r.headers.get("content-type") ?? "";
      if (O(m))
        return {
          kind: "url",
          url: Y(await r.json())
        };
      if (m && !m.toLowerCase().startsWith("image/"))
        throw new Error(`URL does not point to an image: ${m}`);
      return {
        kind: "blob",
        blob: await r.blob()
      };
    }).then((r) => {
      if (r.kind === "url") {
        l && (g(r.url), s(null));
        return;
      }
      o = URL.createObjectURL(r.blob), l ? (g(o), s(null)) : URL.revokeObjectURL(o);
    }).catch((r) => {
      console.error("[ImageDisplay] Failed to load remote image:", r), l && g(null);
    }).finally(() => {
      l && f(!1);
    }), () => {
      l = !1, o && URL.revokeObjectURL(o);
    };
  }, [e.sourceType, e.imageUrl]);
  const c = e.sourceType === "url" ? I(e.imageUrl) ? e.imageUrl : w : T;
  return h(() => {
    s(null);
  }, [c]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ a(n, { reason: "missing-url" }) : e.sourceType === "url" && !U(e.imageUrl) ? /* @__PURE__ */ a(n, { reason: "invalid-url" }) : e.sourceType === "local" && E ? /* @__PURE__ */ a(n, { reason: "loading" }) : e.sourceType === "url" && R ? /* @__PURE__ */ a(n, { reason: "loading" }) : c ? x === c ? /* @__PURE__ */ a(n, { reason: "load-failed" }) : /* @__PURE__ */ a(
    "img",
    {
      src: c,
      alt: "",
      referrerPolicy: "no-referrer",
      onError: () => s(c),
      style: {
        ...L,
        objectFit: e.objectFit,
        display: "block"
      }
    }
  ) : /* @__PURE__ */ a(n, { reason: "missing-local" });
}
export {
  z as default
};
