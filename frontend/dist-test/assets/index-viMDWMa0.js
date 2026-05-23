import{a as z,v as W,w as _,r as m,_ as A,$ as E,j as i,a0 as k}from"./index-CfjC4bUz.js";import{d as r,s as t,m as e,A as $,u as L,c as O,C as R,b as C,e as U}from"./index-B17NLaDm.js";const P=t.div`
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: ${r.mobileWidth}px) {
    flex-direction: column-reverse;
  }
`,V=t(e.div)`
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--ck-body-background);
  svg {
    border-radius: inherit;
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: auto;
  }
  ${o=>o.$empty&&$`
      display: flex;
      align-items: center;
      justify-content: center;
      &:before {
        content: '?';
        color: var(--ck-body-color-muted);
        font-weight: bold;
        font-family: var(--ck-font-family);
      }
    `}
  @media only screen and (max-width: ${r.mobileWidth}px) {
    border-radius: 16px;
    width: 32px;
    height: 32px;
  }
`,Z=t(e.div)`
  position: relative;
`,F=t(e.div)`
  position: absolute;
  inset: -6px;
  animation: rotateSpinner 1200ms linear infinite;
  pointer-events: none;
  svg {
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: auto;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,M=t.div`
  position: relative;
  margin: -8px -8px;
  &:after {
    border-radius: var(--border-radius, 0);
    z-index: 2;
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0 2px;
    box-shadow: inset 0 16px 8px -12px var(--background, var(--ck-body-background)),
      inset 0 -16px 8px -12px var(--background, var(--ck-body-background));
  }
`,N=t(e.div)`
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 242px;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  @media only screen and (max-width: ${r.mobileWidth}px) {
    padding: 8px 14px;
    margin: 2px -2px 0;
    max-height: 60vh;
  }
`,T=t(e.button)`
  appearance: none;
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 11px;
  margin: 0 0 1px;
  padding: 8px 0;
  padding-right: 154px;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  text-decoration: none;
  color: var(--ck-body-color);
  background: none;
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  transform: translateZ(0px);
  &:before {
    content: '';
    background: currentColor;
    position: absolute;
    z-index: -1;
    inset: 0 var(--ck-dropdown-active-inset, -8px);
    border-radius: var(--ck-dropdown-active-border-radius, 12px);
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0 var(--ck-dropdown-active-inset, -8px);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 180ms ease;
    outline: 2px solid var(--ck-focus-color);
  }
  @media only screen and (max-width: ${r.mobileWidth}px) {
    font-size: 17px;
    padding: 8px 0;
  }
  @media only screen and (min-width: ${r.mobileWidth}px) {
    &:hover {
      &:before {
        transition-duration: 80ms;
        opacity: 0.05;
      }
    }
  }
  &:active {
    transform: scale(0.99) translateZ(0px);
  }
  &:disabled {
    //opacity: 0.4;
    pointer-events: none;
  }
  &:focus-visible {
    outline: none !important;
    &:after {
      opacity: 1;
    }
  }
  ${o=>o.$variant==="secondary"&&$`
      padding: 12px 4px;
      margin: 0 0 8px;
      &:last-child {
        margin-bottom: 0;
      }
      &:before {
        opacity: 0.05;
      }
      &:hover:before {
        opacity: 0.1;
      }
    `}
`,G=t(e.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  padding-right: 4px;
  span {
    display: block;
    position: relative;
  }
  @media only screen and (max-width: ${r.mobileWidth}px) {
    font-size: 17px;
    padding: 0;
  }
`,j=t(e.div)`
  position: absolute;
  z-index: -1;
  inset: 0 var(--ck-dropdown-active-inset, -8px);
  background: var(--ck-dropdown-active-background, rgba(26, 136, 248, 0.1));
  box-shadow var(--ck-dropdown-active-box-shadow);
  border-radius: var(--ck-dropdown-active-border-radius, 12px);
  
  @media only screen and (max-width: ${r.mobileWidth}px) {
    inset: 0 var(--ck-dropdown-active-inset, -8px);
  }
`,q=()=>{const o=m.useId();return i.jsxs("svg",{"aria-hidden":"true",width:"36",height:"36",viewBox:"0 0 36 36",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M2 16.75C2.69036 16.75 3.25 17.3096 3.25 18V19C3.25 26.5939 9.40609 32.75 17 32.75V35.25C8.02537 35.25 0.75 27.9746 0.75 19V18C0.75 17.3096 1.30964 16.75 2 16.75Z",fill:`url(#paint0_linear_${o})`}),i.jsx("defs",{children:i.jsxs("linearGradient",{id:`paint0_linear_${o}`,x1:"2",y1:"19.4884",x2:"16.8752",y2:"33.7485",gradientUnits:"userSpaceOnUse",children:[i.jsx("stop",{stopColor:"var(--ck-spinner-color)"}),i.jsx("stop",{offset:"1",stopColor:"var(--ck-spinner-color)",stopOpacity:"0"})]})})]})},K=({variant:o})=>{const{connector:s}=z(),d=W(),{chains:S,isPending:c,switchChain:l,error:h}=_(),[p,y]=m.useState(void 0),x=L({}),g=A(),{triggerResize:b}=E(),I=S.map(a=>({id:a.id,name:a.name}));m.useEffect(()=>{c||y(void 0)},[c]);const f=h?.code===4902,w=f||!l,u=a=>{l&&(y(a),l({chainId:a}))};return i.jsxs(P,{style:{marginBottom:l!==void 0?-8:0},children:[i.jsx(M,{children:i.jsx(N,{children:I.map(a=>{var v;const n={...O.find(B=>B.id===a.id),...a};return i.jsxs(T,{$variant:o,disabled:w||n.id===d||c&&p===n.id,onClick:()=>u?.(n.id),style:{opacity:w&&n.id!==d?.4:void 0},children:[i.jsxs("span",{style:{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:12,color:n.id===d?"var(--ck-dropdown-active-color, inherit)":"var(--ck-dropdown-color, inherit)"},children:[i.jsxs(Z,{children:[i.jsx(F,{initial:{opacity:0},animate:{opacity:c&&p===n.id?1:0},transition:{ease:[.76,0,.24,1],duration:.15,delay:.1},children:i.jsx(e.div,{animate:g&&k(s?.id)&&c&&p===n.id?{opacity:[1,0],transition:{delay:4,duration:3}}:{opacity:1},children:i.jsx(q,{})},`${n?.id}-${n?.name}`)}),i.jsx(V,{children:(v=n.logo)!==null&&v!==void 0?v:i.jsx(R.UnknownChain,{})})]}),n.name]}),o!=="secondary"&&i.jsx(G,{children:i.jsxs(C,{initial:!1,exitBeforeEnter:!0,children:[n.id===d&&i.jsx(e.span,{style:{color:"var(--ck-dropdown-active-color, var(--ck-focus-color))",display:"block",position:"relative"},initial:{opacity:0,x:-4},animate:{opacity:1,x:0},exit:{opacity:0,x:4,transition:{duration:.1,delay:0}},transition:{ease:[.76,0,.24,1],duration:.3,delay:.2},children:x.connected},`connected-${n.id}`),c&&p===n.id&&i.jsx(e.span,{style:{color:"var(--ck-dropdown-pending-color, inherit)",display:"block",position:"relative"},initial:{opacity:0,x:-4},animate:{opacity:1,x:0},exit:{opacity:0,x:4},transition:{ease:[.76,0,.24,1],duration:.3,delay:.1},children:i.jsx(e.span,{animate:g&&k(s?.id)?{opacity:[1,0],transition:{delay:4,duration:4}}:void 0,children:x.approveInWallet})},`approve-${n.id}`)]})}),o==="secondary"?i.jsx(j,{initial:!1,animate:{opacity:n.id===d?1:0},transition:{duration:.3,ease:"easeOut"}}):n.id===d&&i.jsx(j,{layoutId:"activeChain",layout:"position",transition:{duration:.3,ease:"easeOut"}})]},`${n?.id}-${n?.name}`)})})}),i.jsx(C,{children:f&&i.jsx(e.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{ease:[.76,0,.24,1],duration:.3},onAnimationStart:b,onAnimationComplete:b,children:i.jsx("div",{style:{paddingTop:10,paddingBottom:8},children:i.jsxs(U,{children:[x.warnings_walletSwitchingUnsupported," ",x.warnings_walletSwitchingUnsupportedResolve]})})})})]})};export{K as C};
