import{$ as A,r as n,j as o,v as F,w as H,_ as B,a1 as M,a2 as U}from"./index-CfjC4bUz.js";import{s as f,m as w,f as K,u as D,g as P,j as q,b as X,h as Z,R as G,F as J,d as N,T as Q,i as O,A as I}from"./index-B17NLaDm.js";import{C as V}from"./index-viMDWMa0.js";import"./bsc-h6XQHNT6.js";import"./createPublicClient-CX53cApO.js";import"./browser-gGyb-Xvf.js";const Y=f(w.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
`,oo=f(w.div)`
  position: absolute;
  inset: 0;
`,eo=f(w.div)`
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  --background: var(--ck-dropdown-background, var(--ck-tooltip-background));
  --border-radius: var(
    --ck-dropdown-border-radius,
    var(--ck-tooltip-border-radius, 12px)
  );

  pointer-events: auto;
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: fit-content;
  padding: 14px 16px 16px;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
  background: var(--background);
  box-shadow: var(
    --ck-dropdown-box-shadow,
    var(--ck-tooltip-shadow, var(--shadow))
  );
  border-radius: var(--border-radius);
`,to=f(w.div)`
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
`,no=({children:s,open:r,onClose:a,offsetX:g=0,offsetY:x=8})=>{var d,v,h;const e=A(),c=K(),m=D(),[p,T]=n.useState({x:0,y:0});P(r);const y=n.useRef(null);n.useEffect(()=>{const l=u=>{var E,j,C;if(r&&(u.key==="Escape"&&a(),u.key==="ArrowDown"||u.key==="ArrowUp")){if(!y.current)return;u.preventDefault();const S=(E=y.current)===null||E===void 0?void 0:E.querySelectorAll(`
            a[href]:not(:disabled),
            button:not(:disabled),
            textarea:not(:disabled),
            input[type="text"]:not(:disabled),
            input[type="radio"]:not(:disabled),
            input[type="checkbox"]:not(:disabled),
            select:not(:disabled)
          `),L=S[0],R=S[S.length-1];if(u.key==="ArrowUp")if(document.activeElement===L)R.focus();else{let t=(j=document?.activeElement)===null||j===void 0?void 0:j.previousSibling;for(t||(t=R);t.disabled;)t=t.previousSibling;t.focus()}else if(document.activeElement===R)L.focus();else{let t=(C=document?.activeElement)===null||C===void 0?void 0:C.nextSibling;for(t||(t=L);t.disabled;)t=t.nextSibling;t.focus()}}};return document.addEventListener("keydown",l),()=>{document.removeEventListener("keydown",l)}},[r]);const b=n.useRef(null),W=n.useCallback(l=>{l&&(b.current=l,k())},[r]),[$,i]=q({debounce:120,offsetSize:!0,scroll:!0}),k=()=>{if(!b.current||i.top+i.bottom+i.left+i.right+i.height+i.width===0)return;const l=i.left+g,u=i.top+i.height+x;b.current.style.left=`${l}px`,b.current.style.top=`${u}px`};(typeof window<"u"?n.useLayoutEffect:n.useEffect)(k,[b.current,i,r]),n.useEffect(k,[r,b.current]);const z=a,_=a;return n.useEffect(()=>(k(),window.addEventListener("scroll",z),window.addEventListener("resize",_),()=>{window.removeEventListener("scroll",z),window.removeEventListener("resize",_)}),[]),o.jsxs(o.Fragment,{children:[o.jsx("div",{ref:$,children:s}),o.jsx(X,{children:r&&o.jsx(Z,{children:o.jsx(G,{$useTheme:(d=c.theme)!==null&&d!==void 0?d:e.uiConfig.theme,$useMode:(v=c.mode)!==null&&v!==void 0?v:e.mode,$customTheme:(h=c.customTheme)!==null&&h!==void 0?h:c.customTheme,children:o.jsx(J,{children:o.jsxs(Y,{ref:y,children:[o.jsx(oo,{onClick:a}),o.jsxs(eo,{ref:W,style:{left:p.x,top:p.y},initial:"collapsed",animate:"open",exit:"collapsed",variants:{collapsed:{transformOrigin:"0 0",opacity:0,scale:.96,z:.01,y:-4,x:0,transition:{duration:.1}},open:{transformOrigin:"0 0",willChange:"opacity,transform",opacity:1,scale:1,z:.01,y:0,x:0,transition:{ease:[.76,0,.24,1],duration:.15}}},children:[o.jsx(to,{children:m.switchNetworks}),o.jsx(V,{})]})]})})})})})]})},ro=f(w.div)``,io=f(w.button)`
  --color: var(
    --ck-dropdown-button-color,
    var(--ck-button-primary-color, var(--ck-body-color))
  );
  --background: var(
    --ck-dropdown-button-background,
    var(--ck-secondary-button-background, var(--ck-body-background-secondary))
  );
  --box-shadow: var(
    --ck-dropdown-button-box-shadow,
    var(
      --ck-secondary-button-box-shadow,
      var(--ck-button-primary-box-shadow),
      none
    )
  );

  --hover-color: var(--ck-dropdown-button-hover-color, var(--color));
  --hover-background: var(
    --ck-dropdown-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-dropdown-button-hover-box-shadow,
    var(--box-shadow)
  );

  --active-color: var(--ck-dropdown-button-active-color, var(--hover-color));
  --active-background: var(
    --ck-dropdown-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-dropdown-button-active-box-shadow,
    var(--hover-box-shadow)
  );

  appearance: none;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transform: translateZ(0px);

  transition: 100ms ease;
  transition-property: transform, background-color, box-shadow, color;

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);

  svg {
    position: relative;
    display: block;
  }

  ${s=>s.disabled?I`
          width: auto;
          padding: 3px;
          position: relative;
          left: -22px;
        `:I`
          cursor: pointer;

          @media only screen and (min-width: ${N.mobileWidth+1}px) {
            &:hover,
            &:focus-visible {
              color: var(--hover-color);
              background: var(--hover-background);
              box-shadow: var(--hover-box-shadow);
            }
            &:active {
              color: var(--active-color);
              background: var(--active-background);
              box-shadow: var(--active-box-shadow);
            }
          }
        `}
`,so=({...s})=>o.jsx("svg",{"aria-hidden":"true",width:"11",height:"6",viewBox:"0 0 11 6",fill:"none",xmlns:"http://www.w3.org/2000/svg",...s,children:o.jsx("path",{d:"M1.5 1L5.5 5L9.5 1",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),bo=()=>{var s;const{open:r,triggerResize:a,setRoute:g}=A(),[x,d]=n.useState(!1),v=F(),{chains:h}=H(),e=h.find(T=>T.id===v),c=D({CHAIN:(s=e?.name)!==null&&s!==void 0?s:"UNKNOWN"}),m=B()||typeof window<"u"&&window?.innerWidth<N.mobileWidth;n.useEffect(()=>{r||d(!1)},[r]),n.useEffect(()=>{a()},[v,a]);const p=h.length<=1;return o.jsx(ro,{children:o.jsx(no,{offsetX:-12,open:!m&&x,onClose:()=>d(!1),children:e&&o.jsxs(io,{"aria-label":U(c.switchNetworks).toString(),disabled:p,onClick:()=>{m?g(M.ETH_SWITCH_NETWORK):d(!x)},children:[p?o.jsx(Q,{message:c.chainNetwork,xOffset:-6,delay:.01,children:o.jsx(O,{id:e?.id})}):o.jsx(O,{id:e?.id}),!p&&o.jsx(so,{style:{top:1,left:-3}})]})})})};export{bo as default};
