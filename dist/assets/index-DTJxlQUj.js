(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))p(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&p(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function p(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const m={imageUrl:"",objectFit:"cover"},c=window.MyWallpaper?.layer,a=c?.root??document.getElementById("app")??document.body;a.classList.add("mwa-image-display-root");const g=document.createElement("style");g.textContent=`
  .mwa-image-display-root {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    background: transparent;
  }

  .mwa-image-display-root .image {
    width: 100%;
    height: 100%;
    display: block;
    max-width: none;
    max-height: none;
    object-position: center;
    pointer-events: none;
  }

  .mwa-image-display-root .empty {
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

  .mwa-image-display-root .empty-title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  .mwa-image-display-root .empty-hint {
    margin: 8px 0 0;
    max-width: 34rem;
    font-size: 14px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.68);
  }
`;document.head.append(g);let d=null,r=null;function f(e){return{...m,...e,imageUrl:typeof e.imageUrl=="string"?e.imageUrl.trim():"",objectFit:e.objectFit??m.objectFit}}function y(e){if(!e)return!1;try{const n=new URL(e);return["https:","http:","data:","blob:"].includes(n.protocol)}catch{return!1}}function l(e,n){r=null,a.innerHTML="";const o=document.createElement("div");o.className="empty",o.innerHTML=`
    <div>
      <p class="empty-title"></p>
      <p class="empty-hint"></p>
    </div>
  `,o.querySelector(".empty-title").textContent=e,o.querySelector(".empty-hint").textContent=n,a.append(o)}function b(e){if(!e.imageUrl){l("Paste an image URL","Any public HTTP(S), data, or blob image URL is accepted.");return}if(!y(e.imageUrl)){l("Image URL is invalid","Use a public HTTP(S) image URL, or a data/blob URL.");return}if(d===e.imageUrl){l("Image could not be loaded","Check that the URL points directly to an image.");return}r||(a.innerHTML="",r=document.createElement("img"),r.className="image",r.alt="",r.referrerPolicy="no-referrer",r.addEventListener("error",()=>{d=r?.src??e.imageUrl,l("Image could not be loaded","Check that the URL points directly to an image.")}),a.append(r)),r.style.objectFit=e.objectFit,r.src!==e.imageUrl&&(d=null,r.src=e.imageUrl)}function u(e){b(f(e))}u(c?.settings.get()??m);const h=c?.settings.subscribe(u);c?.lifecycle?.onDispose(()=>{h?.(),r=null});
