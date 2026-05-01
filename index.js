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
const n = __canvasRuntimeSdk.useSettings;
const p = __canvasRuntimeSdk.useFiles;
const c = __canvasRuntimeReact.useState;
const u = __canvasRuntimeReact.useEffect;
function y() {
  const e = n(), { request: t, isFileReference: l } = p(), [i, o] = c(null);
  u(() => {
    e.sourceType === "local" && l(e.wallpaperImage) && t("wallpaperImage").then((s) => {
      s && o(s);
    });
  }, [e.sourceType, e.wallpaperImage, t, l]);
  const r = e.sourceType === "url" ? e.imageUrl : i;
  return r ? /* @__PURE__ */ a(
    "img",
    {
      src: r,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        pointerEvents: "none"
      }
    }
  ) : null;
}
export {
  y as default
};
