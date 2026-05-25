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
const E = __canvasRuntimeJsxRuntime.jsxs;
const F = __canvasRuntimeSdk.useSettings;
const v = __canvasRuntimeSdk.useFiles;
const s = __canvasRuntimeReact.useState;
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
}, j = {
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
}, _ = {
  margin: 0,
  fontSize: "clamp(16px, 2.3vw, 28px)",
  fontWeight: 700,
  letterSpacing: "0.01em"
}, k = {
  margin: "8px 0 0",
  maxWidth: "34rem",
  fontSize: "clamp(12px, 1.35vw, 16px)",
  lineHeight: 1.45,
  color: "rgba(255, 255, 255, 0.68)"
};
function D(e) {
  return {
    ...y,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? y.objectFit,
    sourceType: e.sourceType ?? y.sourceType
  };
}
function b(e) {
  if (!e) return !1;
  try {
    const t = new URL(e);
    return t.protocol === "https:" || t.protocol === "data:" || t.protocol === "blob:";
  } catch {
    return !1;
  }
}
function T(e) {
  try {
    const t = new URL(e);
    return t.protocol === "data:" || t.protocol === "blob:";
  } catch {
    return !1;
  }
}
function o({ reason: e }) {
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
      hint: "The selected local image is being prepared by the host runtime."
    }
  }[e];
  return /* @__PURE__ */ l("div", { style: j, children: /* @__PURE__ */ E("div", { children: [
    /* @__PURE__ */ l("p", { style: _, children: t.title }),
    /* @__PURE__ */ l("p", { style: k, children: t.hint })
  ] }) });
}
function z() {
  const e = D(F()), { request: t, release: g, isFileReference: U } = v(), [I, u] = s(null), [R, m] = s(null), [x, p] = s(!1), [S, d] = s(!1), [w, c] = s(null);
  h(() => {
    if (e.sourceType !== "local" || !U(e.wallpaperImage)) {
      u(null), p(!1);
      return;
    }
    let a = !0, i = null;
    return p(!0), t("wallpaperImage").then((r) => {
      i = r, a ? (u(r), c(null)) : g(r);
    }).catch((r) => {
      console.error("[ImageDisplay] Failed to load selected image:", r), a && u(null);
    }).finally(() => {
      a && p(!1);
    }), () => {
      a = !1, i && g(i);
    };
  }, [e.sourceType, e.wallpaperImage, t, g, U]), h(() => {
    if (e.sourceType !== "url" || !b(e.imageUrl) || T(e.imageUrl)) {
      m(null), d(!1);
      return;
    }
    let a = !0, i = null;
    return d(!0), fetch(e.imageUrl, {
      credentials: "omit",
      mode: "cors",
      redirect: "error",
      referrerPolicy: "no-referrer"
    }).then((r) => {
      if (!r.ok)
        throw new Error(`Image request failed: ${r.status}`);
      const f = r.headers.get("content-type") ?? "";
      if (f && !f.toLowerCase().startsWith("image/"))
        throw new Error(`URL does not point to an image: ${f}`);
      return r.blob();
    }).then((r) => {
      i = URL.createObjectURL(r), a ? (m(i), c(null)) : URL.revokeObjectURL(i);
    }).catch((r) => {
      console.error("[ImageDisplay] Failed to load remote image:", r), a && m(null);
    }).finally(() => {
      a && d(!1);
    }), () => {
      a = !1, i && URL.revokeObjectURL(i);
    };
  }, [e.sourceType, e.imageUrl]);
  const n = e.sourceType === "url" ? T(e.imageUrl) ? e.imageUrl : R : I;
  return h(() => {
    c(null);
  }, [n]), e.sourceType === "url" && !e.imageUrl ? /* @__PURE__ */ l(o, { reason: "missing-url" }) : e.sourceType === "url" && !b(e.imageUrl) ? /* @__PURE__ */ l(o, { reason: "invalid-url" }) : e.sourceType === "local" && x ? /* @__PURE__ */ l(o, { reason: "loading" }) : e.sourceType === "url" && S ? /* @__PURE__ */ l(o, { reason: "loading" }) : n ? w === n ? /* @__PURE__ */ l(o, { reason: "load-failed" }) : /* @__PURE__ */ l(
    "img",
    {
      src: n,
      alt: "",
      referrerPolicy: "no-referrer",
      onError: () => c(n),
      style: {
        ...L,
        objectFit: e.objectFit,
        display: "block"
      }
    }
  ) : /* @__PURE__ */ l(o, { reason: "missing-local" });
}
export {
  z as default
};
