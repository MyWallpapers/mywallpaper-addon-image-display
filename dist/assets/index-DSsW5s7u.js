(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&m(c)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const d={imageUrl:"",objectFit:"cover"},l=document.getElementById("app")??document.body,p=document.createElement("style");p.textContent=`
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
`;document.head.append(p);let s=null,r=null;function g(e){return{...d,...e,imageUrl:typeof e.imageUrl=="string"?e.imageUrl.trim():"",objectFit:e.objectFit??d.objectFit}}function f(e){if(!e)return!1;try{const i=new URL(e);return["https:","http:","data:","blob:"].includes(i.protocol)}catch{return!1}}function a(e,i){r=null,l.innerHTML="";const o=document.createElement("div");o.className="empty",o.innerHTML=`
    <div>
      <p class="empty-title"></p>
      <p class="empty-hint"></p>
    </div>
  `,o.querySelector(".empty-title").textContent=e,o.querySelector(".empty-hint").textContent=i,l.append(o)}function y(e){if(!e.imageUrl){a("Paste an image URL","Any public HTTP(S), data, or blob image URL is accepted.");return}if(!f(e.imageUrl)){a("Image URL is invalid","Use a public HTTP(S) image URL, or a data/blob URL.");return}if(s===e.imageUrl){a("Image could not be loaded","Check that the URL points directly to an image.");return}r||(l.innerHTML="",r=document.createElement("img"),r.className="image",r.alt="",r.referrerPolicy="no-referrer",r.addEventListener("error",()=>{s=r?.src??e.imageUrl,a("Image could not be loaded","Check that the URL points directly to an image.")}),l.append(r)),r.style.objectFit=e.objectFit,r.src!==e.imageUrl&&(s=null,r.src=e.imageUrl)}function u(e){y(g(e))}u(window.MyWallpaper?.settings.get()??d);const b=window.MyWallpaper?.settings.subscribe(u);window.MyWallpaper?.lifecycle?.onDispose(()=>{b?.(),r=null});
