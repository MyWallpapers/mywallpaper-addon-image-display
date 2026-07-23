const h={objectFit:"cover"};function w({layer:a}){const e=a.root;e.classList.add("mwa-image-display-root");const l=document.createElement("style");l.textContent=`
    .mwa-image-display-root {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: transparent;
    }

    .mwa-image-display-root .mwa-image-display-image {
      width: 100%;
      height: 100%;
      display: block;
      max-width: none;
      max-height: none;
      object-position: center;
      pointer-events: none;
    }

    .mwa-image-display-root .mwa-image-display-empty {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      padding: 24px;
      color: rgba(255, 255, 255, 0.88);
      background:
        linear-gradient(135deg, rgba(23, 33, 48, 0.92), rgba(5, 10, 18, 0.84)),
        repeating-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.08) 0 12px,
          rgba(255, 255, 255, 0.02) 12px 24px
        );
      text-align: center;
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }

    .mwa-image-display-root .mwa-image-display-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }

    .mwa-image-display-root .mwa-image-display-hint {
      margin: 8px 0 0;
      max-width: 34rem;
      font-size: 14px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.68);
    }
  `,document.head.append(l);let m=null,o=null,n=null;function r(t,i){n=null,o=null;const c=document.createElement("div");c.className="mwa-image-display-empty";const p=document.createElement("div"),s=document.createElement("p");s.className="mwa-image-display-title",s.textContent=t;const d=document.createElement("p");d.className="mwa-image-display-hint",d.textContent=i,p.append(s,d),c.append(p),e.replaceChildren(c)}function u(t){if(!t.imageUrl){r("Paste an image URL","Any public HTTP(S), data or blob image URL is accepted.");return}if(!f(t.imageUrl)){r("Image URL is invalid","Use a public HTTP(S), data or blob image URL.");return}if(m===t.imageUrl){r("Image could not be loaded","Check that the URL points directly to an image.");return}if(!n){const i=document.createElement("img");i.className="mwa-image-display-image",i.alt="",i.referrerPolicy="no-referrer",i.addEventListener("error",()=>{m=o??t.imageUrl,r("Image could not be loaded","Check that the URL points directly to an image.")}),n=i,e.replaceChildren(i)}n.style.objectFit=t.objectFit,o!==t.imageUrl&&(m=null,o=t.imageUrl,n.src=t.imageUrl)}function g(t){u(y(t))}g(a.settings.get());const b=a.settings.subscribe(g);return()=>{b(),l.remove(),e.classList.remove("mwa-image-display-root"),e.replaceChildren(),n=null,o=null}}function y(a){const e=a.objectFit;return{imageUrl:typeof a.imageUrl=="string"?a.imageUrl.trim():"",objectFit:e==="contain"||e==="fill"||e==="cover"?e:h.objectFit}}function f(a){try{const e=new URL(a);return e.protocol==="https:"||e.protocol==="http:"||e.protocol==="data:"||e.protocol==="blob:"}catch{return!1}}export{w as mount};
