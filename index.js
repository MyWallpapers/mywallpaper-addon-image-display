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
const p = __canvasRuntimeJsxRuntime.jsx;
const m = __canvasRuntimeSdk.useSettings;
const f = __canvasRuntimeSdk.useFiles;
const g = __canvasRuntimeReact.useState;
const y = __canvasRuntimeReact.useEffect;
const i = {
  sourceType: "local",
  wallpaperImage: null,
  imageUrl: "",
  objectFit: "cover"
};
function F(e) {
  return {
    ...i,
    ...e,
    imageUrl: typeof e.imageUrl == "string" ? e.imageUrl.trim() : "",
    objectFit: e.objectFit ?? i.objectFit,
    sourceType: e.sourceType ?? i.sourceType
  };
}
function b() {
  const e = F(m()), { request: c, release: r, isFileReference: s } = f(), [u, t] = g(null);
  y(() => {
    if (e.sourceType !== "local" || !s(e.wallpaperImage)) {
      t(null);
      return;
    }
    let o = !0, a = null;
    return c("wallpaperImage").then((l) => {
      a = l, o ? t(l) : r(l);
    }).catch((l) => {
      console.error("[ImageDisplay] Failed to load selected image:", l), o && t(null);
    }), () => {
      o = !1, a && r(a);
    };
  }, [e.sourceType, e.wallpaperImage, c, r, s]);
  const n = e.sourceType === "url" ? e.imageUrl : u;
  return n ? /* @__PURE__ */ p(
    "img",
    {
      src: n,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: e.objectFit,
        display: "block",
        pointerEvents: "none"
      }
    }
  ) : null;
}
export {
  b as default
};
