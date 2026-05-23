const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DMmefASG.js","assets/index-CfjC4bUz.js","assets/index-BgAjtoMw.css","assets/index-viMDWMa0.js","assets/bsc-h6XQHNT6.js","assets/createPublicClient-CX53cApO.js","assets/browser-gGyb-Xvf.js","assets/index-CHbOYlJd.js"])))=>i.map(i=>d[i]);
import{J as Ql,d as u1,c0 as p1,r as v,br as z,c1 as $e,c2 as Jl,bj as fe,bp as ct,bv as St,c3 as h1,aj as ed,$ as U,c4 as Wo,c5 as ot,j as n,l as Z,c6 as Ye,m as ne,c7 as gr,bD as Wi,bA as vr,c8 as f1,c9 as g1,ca as v1,aB as Na,cb as m1,cc as x1,x as ve,cd as Fa,ce as Ee,cf as Ne,cg as st,ch as Vi,ci as Tn,cj as Ma,ck as b1,b5 as y1,aJ as Ui,b4 as Rs,b8 as C1,bQ as w1,cl as k1,u as He,aa as Rr,cm as E1,g as vn,bl as S1,_ as zi,cn as an,a2 as er,a1 as L,co as Pa,cp as j1,cq as Da,cr as _1,cs as ho,ct as Ls,bH as Is,bG as Ns,cu as Fs,bF as Ms,bB as Ps,bC as Ds,bE as $s,cv as Xe,cw as $a,cx as A1,cy as td,cz as T1,cA as _t,cB as O1,cC as R1,cD as Ba,e as tr,cE as L1,cF as ge,cG as oi,E as mr,cH as nd,cI as ln,cJ as Je,cK as Hi,cL as rd,cM as Jt,cN as I1,cO as bn,aE as od,cP as N1,aw as Bs,bR as ii,cQ as id,cR as F1,cS as M1,cT as P1}from"./index-CfjC4bUz.js";import{a as Ws,b as Vs}from"./bsc-h6XQHNT6.js";import{c as xr}from"./createPublicClient-CX53cApO.js";import{Q as D1}from"./browser-gGyb-Xvf.js";class $1 extends Ql{constructor({value:t}){super(`Number \`${t}\` is not a valid decimal number.`,{name:"InvalidDecimalNumberError"})}}function ad(e,t){if(!/^(-?)([0-9]*)\.?([0-9]*)$/.test(e))throw new $1({value:e});let[r,o="0"]=e.split(".");const i=r.startsWith("-");if(i&&(r=r.slice(1)),o=o.replace(/(0+)$/,""),t===0)Math.round(+`.${o}`)===1&&(r=`${BigInt(r)+1n}`),o="";else if(o.length>t){const[a,c,s]=[o.slice(0,t-1),o.slice(t-1,t),o.slice(t)],l=Math.round(+`${c}.${s}`);l>9?o=`${BigInt(a)+BigInt(1)}0`.padStart(a.length+1,"0"):o=`${a}${l}`,o.length>t&&(o=o.slice(1),r=`${BigInt(r)+1n}`),o=o.slice(0,t)}else o=o.padEnd(t,"0");return BigInt(`${i?"-":""}${r}${o}`)}function B1(e){const{key:t="wallet",name:r="Wallet Client",transport:o}=e;return u1({...e,key:t,name:r,transport:o,type:"walletClient"}).extend(p1)}function sd(){const[e,t]=v.useState(!1);return v.useEffect(()=>t(!0),[]),e}var Pt=function(e){return{isEnabled:function(t){return e.some(function(r){return!!t[r]})}}},br={measureLayout:Pt(["layout","layoutId","drag"]),animation:Pt(["animate","exit","variants","whileHover","whileTap","whileFocus","whileDrag","whileInView"]),exit:Pt(["exit"]),drag:Pt(["drag","dragControls"]),focus:Pt(["whileFocus"]),hover:Pt(["whileHover","onHoverStart","onHoverEnd"]),tap:Pt(["whileTap","onTap","onTapStart","onTapCancel"]),pan:Pt(["onPan","onPanStart","onPanSessionStart","onPanEnd"]),inView:Pt(["whileInView","onViewportEnter","onViewportLeave"])};function W1(e){for(var t in e)e[t]!==null&&(t==="projectionNodeConstructor"?br.projectionNodeConstructor=e[t]:br[t].Component=e[t])}var fo=function(){},cd=v.createContext({strict:!1}),ld=Object.keys(br),V1=ld.length;function U1(e,t,r){var o=[];if(v.useContext(cd),!t)return null;for(var i=0;i<V1;i++){var a=ld[i],c=br[a],s=c.isEnabled,l=c.Component;s(e)&&l&&o.push(v.createElement(l,z({key:a},e,{visualElement:t})))}return o}var yr=v.createContext({transformPagePoint:function(e){return e},isStatic:!1,reducedMotion:"never"}),Vo=v.createContext({});function z1(){return v.useContext(Vo).visualElement}var Lr=v.createContext(null),Bn=typeof document<"u",go=Bn?v.useLayoutEffect:v.useEffect,Gi={current:null},dd=!1;function H1(){if(dd=!0,!!Bn)if(window.matchMedia){var e=window.matchMedia("(prefers-reduced-motion)"),t=function(){return Gi.current=e.matches};e.addListener(t),t()}else Gi.current=!1}function G1(){!dd&&H1();var e=$e(v.useState(Gi.current),1),t=e[0];return t}function q1(){var e=G1(),t=v.useContext(yr).reducedMotion;return t==="never"?!1:t==="always"?!0:e}function Z1(e,t,r,o){var i=v.useContext(cd),a=z1(),c=v.useContext(Lr),s=q1(),l=v.useRef(void 0);o||(o=i.renderer),!l.current&&o&&(l.current=o(e,{visualState:t,parent:a,props:r,presenceId:c?.id,blockInitialAnimation:c?.initial===!1,shouldReduceMotion:s}));var d=l.current;return go(function(){d?.syncRender()}),v.useEffect(function(){var u;(u=d?.animationState)===null||u===void 0||u.animateChanges()}),go(function(){return function(){return d?.notifyUnmount()}},[]),d}function Sn(e){return typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function K1(e,t,r){return v.useCallback(function(o){var i;o&&((i=e.mount)===null||i===void 0||i.call(e,o)),t&&(o?t.mount(o):t.unmount()),r&&(typeof r=="function"?r(o):Sn(r)&&(r.current=o))},[t])}function ud(e){return Array.isArray(e)}function wt(e){return typeof e=="string"||ud(e)}function Y1(e){var t={};return e.forEachValue(function(r,o){return t[o]=r.get()}),t}function X1(e){var t={};return e.forEachValue(function(r,o){return t[o]=r.getVelocity()}),t}function pd(e,t,r,o,i){var a;return o===void 0&&(o={}),i===void 0&&(i={}),typeof t=="function"&&(t=t(r??e.custom,o,i)),typeof t=="string"&&(t=(a=e.variants)===null||a===void 0?void 0:a[t]),typeof t=="function"&&(t=t(r??e.custom,o,i)),t}function Uo(e,t,r){var o=e.getProps();return pd(o,t,r??o.custom,Y1(e),X1(e))}function zo(e){var t;return typeof((t=e.animate)===null||t===void 0?void 0:t.start)=="function"||wt(e.initial)||wt(e.animate)||wt(e.whileHover)||wt(e.whileDrag)||wt(e.whileTap)||wt(e.whileFocus)||wt(e.exit)}function hd(e){return!!(zo(e)||e.variants)}function Q1(e,t){if(zo(e)){var r=e.initial,o=e.animate;return{initial:r===!1||wt(r)?r:void 0,animate:wt(o)?o:void 0}}return e.inherit!==!1?t:{}}function J1(e){var t=Q1(e,v.useContext(Vo)),r=t.initial,o=t.animate;return v.useMemo(function(){return{initial:r,animate:o}},[Us(r),Us(o)])}function Us(e){return Array.isArray(e)?e.join(" "):e}function Wn(e){var t=v.useRef(null);return t.current===null&&(t.current=e()),t.current}var nr={hasAnimatedSinceResize:!0,hasEverUpdated:!1},ep=1;function tp(){return Wn(function(){if(nr.hasEverUpdated)return ep++})}var Wa=v.createContext({}),fd=v.createContext({});function np(e,t,r,o){var i,a=t.layoutId,c=t.layout,s=t.drag,l=t.dragConstraints,d=t.layoutScroll,u=v.useContext(fd);!o||!r||r?.projection||(r.projection=new o(e,r.getLatestValues(),(i=r.parent)===null||i===void 0?void 0:i.projection),r.projection.setOptions({layoutId:a,layout:c,alwaysMeasureLayout:!!s||l&&Sn(l),visualElement:r,scheduleRender:function(){return r.scheduleRender()},animationType:typeof c=="string"?c:"both",initialPromotionConfig:u,layoutScroll:d}))}var rp=(function(e){Jl(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.getSnapshotBeforeUpdate=function(){return this.updateProps(),null},t.prototype.componentDidUpdate=function(){},t.prototype.updateProps=function(){var r=this.props,o=r.visualElement,i=r.props;o&&o.setProps(i)},t.prototype.render=function(){return this.props.children},t})(fe.Component);function op(e){var t=e.preloadedFeatures,r=e.createVisualElement,o=e.projectionNodeConstructor,i=e.useRender,a=e.useVisualState,c=e.Component;t&&W1(t);function s(l,d){var u=ip(l);l=z(z({},l),{layoutId:u});var p=v.useContext(yr),h=null,f=J1(l),g=p.isStatic?void 0:tp(),m=a(l,p.isStatic);return!p.isStatic&&Bn&&(f.visualElement=Z1(c,m,z(z({},p),l),r),np(g,l,f.visualElement,o||br.projectionNodeConstructor),h=U1(l,f.visualElement)),v.createElement(rp,{visualElement:f.visualElement,props:z(z({},p),l)},h,v.createElement(Vo.Provider,{value:f},i(c,l,g,K1(m,f.visualElement,d),m,p.isStatic,f.visualElement)))}return v.forwardRef(s)}function ip(e){var t,r=e.layoutId,o=(t=v.useContext(Wa))===null||t===void 0?void 0:t.id;return o&&r!==void 0?o+"-"+r:r}function ap(e){function t(o,i){return i===void 0&&(i={}),op(e(o,i))}if(typeof Proxy>"u")return t;var r=new Map;return new Proxy(t,{get:function(o,i){return r.has(i)||r.set(i,t(i)),r.get(i)}})}var sp=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","svg","switch","symbol","text","tspan","use","view"];function Va(e){return typeof e!="string"||e.includes("-")?!1:!!(sp.indexOf(e)>-1||/[A-Z]/.test(e))}var vo={};function cp(e){Object.assign(vo,e)}var qi=["","X","Y","Z"],lp=["translate","scale","rotate","skew"],Cr=["transformPerspective","x","y","z"];lp.forEach(function(e){return qi.forEach(function(t){return Cr.push(e+t)})});function dp(e,t){return Cr.indexOf(e)-Cr.indexOf(t)}var up=new Set(Cr);function Ir(e){return up.has(e)}var pp=new Set(["originX","originY","originZ"]);function gd(e){return pp.has(e)}function vd(e,t){var r=t.layout,o=t.layoutId;return Ir(e)||gd(e)||(r||o!==void 0)&&(!!vo[e]||e==="opacity")}var Ut=function(e){return!!(e!==null&&typeof e=="object"&&e.getVelocity)},hp={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"};function fp(e,t,r,o){var i=e.transform,a=e.transformKeys,c=t.enableHardwareAcceleration,s=c===void 0?!0:c,l=t.allowTransformNone,d=l===void 0?!0:l,u="";a.sort(dp);for(var p=!1,h=a.length,f=0;f<h;f++){var g=a[f];u+="".concat(hp[g]||g,"(").concat(i[g],") "),g==="z"&&(p=!0)}return!p&&s?u+="translateZ(0)":u=u.trim(),o?u=o(i,r?"":u):d&&r&&(u="none"),u}function gp(e){var t=e.originX,r=t===void 0?"50%":t,o=e.originY,i=o===void 0?"50%":o,a=e.originZ,c=a===void 0?0:a;return"".concat(r," ").concat(i," ").concat(c)}function md(e){return e.startsWith("--")}var vp=function(e,t){return t&&typeof e=="number"?t.transform(e):e};const xd=(e,t)=>r=>Math.max(Math.min(r,t),e),rr=e=>e%1?Number(e.toFixed(5)):e,wr=/(-)?([\d]*\.?[\d])+/g,Zi=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))/gi,mp=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))$/i;function Nr(e){return typeof e=="string"}const mn={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},or=Object.assign(Object.assign({},mn),{transform:xd(0,1)}),Ur=Object.assign(Object.assign({},mn),{default:1}),Fr=e=>({test:t=>Nr(t)&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Yt=Fr("deg"),It=Fr("%"),le=Fr("px"),xp=Fr("vh"),bp=Fr("vw"),zs=Object.assign(Object.assign({},It),{parse:e=>It.parse(e)/100,transform:e=>It.transform(e*100)}),Ua=(e,t)=>r=>!!(Nr(r)&&mp.test(r)&&r.startsWith(e)||t&&Object.prototype.hasOwnProperty.call(r,t)),bd=(e,t,r)=>o=>{if(!Nr(o))return o;const[i,a,c,s]=o.match(wr);return{[e]:parseFloat(i),[t]:parseFloat(a),[r]:parseFloat(c),alpha:s!==void 0?parseFloat(s):1}},pn={test:Ua("hsl","hue"),parse:bd("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:r,alpha:o=1})=>"hsla("+Math.round(e)+", "+It.transform(rr(t))+", "+It.transform(rr(r))+", "+rr(or.transform(o))+")"},yp=xd(0,255),ai=Object.assign(Object.assign({},mn),{transform:e=>Math.round(yp(e))}),en={test:Ua("rgb","red"),parse:bd("red","green","blue"),transform:({red:e,green:t,blue:r,alpha:o=1})=>"rgba("+ai.transform(e)+", "+ai.transform(t)+", "+ai.transform(r)+", "+rr(or.transform(o))+")"};function Cp(e){let t="",r="",o="",i="";return e.length>5?(t=e.substr(1,2),r=e.substr(3,2),o=e.substr(5,2),i=e.substr(7,2)):(t=e.substr(1,1),r=e.substr(2,1),o=e.substr(3,1),i=e.substr(4,1),t+=t,r+=r,o+=o,i+=i),{red:parseInt(t,16),green:parseInt(r,16),blue:parseInt(o,16),alpha:i?parseInt(i,16)/255:1}}const Ki={test:Ua("#"),parse:Cp,transform:en.transform},nt={test:e=>en.test(e)||Ki.test(e)||pn.test(e),parse:e=>en.test(e)?en.parse(e):pn.test(e)?pn.parse(e):Ki.parse(e),transform:e=>Nr(e)?e:e.hasOwnProperty("red")?en.transform(e):pn.transform(e)},yd="${c}",Cd="${n}";function wp(e){var t,r,o,i;return isNaN(e)&&Nr(e)&&((r=(t=e.match(wr))===null||t===void 0?void 0:t.length)!==null&&r!==void 0?r:0)+((i=(o=e.match(Zi))===null||o===void 0?void 0:o.length)!==null&&i!==void 0?i:0)>0}function wd(e){typeof e=="number"&&(e=`${e}`);const t=[];let r=0;const o=e.match(Zi);o&&(r=o.length,e=e.replace(Zi,yd),t.push(...o.map(nt.parse)));const i=e.match(wr);return i&&(e=e.replace(wr,Cd),t.push(...i.map(mn.parse))),{values:t,numColors:r,tokenised:e}}function kd(e){return wd(e).values}function Ed(e){const{values:t,numColors:r,tokenised:o}=wd(e),i=t.length;return a=>{let c=o;for(let s=0;s<i;s++)c=c.replace(s<r?yd:Cd,s<r?nt.transform(a[s]):rr(a[s]));return c}}const kp=e=>typeof e=="number"?0:e;function Ep(e){const t=kd(e);return Ed(e)(t.map(kp))}const zt={test:wp,parse:kd,createTransformer:Ed,getAnimatableNone:Ep},Sp=new Set(["brightness","contrast","saturate","opacity"]);function jp(e){let[t,r]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[o]=r.match(wr)||[];if(!o)return e;const i=r.replace(o,"");let a=Sp.has(t)?1:0;return o!==r&&(a*=100),t+"("+a+i+")"}const _p=/([a-z-]*)\(.*?\)/g,Yi=Object.assign(Object.assign({},zt),{getAnimatableNone:e=>{const t=e.match(_p);return t?t.map(jp).join(" "):e}});var Hs=z(z({},mn),{transform:Math.round}),Sd={borderWidth:le,borderTopWidth:le,borderRightWidth:le,borderBottomWidth:le,borderLeftWidth:le,borderRadius:le,radius:le,borderTopLeftRadius:le,borderTopRightRadius:le,borderBottomRightRadius:le,borderBottomLeftRadius:le,width:le,maxWidth:le,height:le,maxHeight:le,size:le,top:le,right:le,bottom:le,left:le,padding:le,paddingTop:le,paddingRight:le,paddingBottom:le,paddingLeft:le,margin:le,marginTop:le,marginRight:le,marginBottom:le,marginLeft:le,rotate:Yt,rotateX:Yt,rotateY:Yt,rotateZ:Yt,scale:Ur,scaleX:Ur,scaleY:Ur,scaleZ:Ur,skew:Yt,skewX:Yt,skewY:Yt,distance:le,translateX:le,translateY:le,translateZ:le,x:le,y:le,z:le,perspective:le,transformPerspective:le,opacity:or,originX:zs,originY:zs,originZ:le,zIndex:Hs,fillOpacity:or,strokeOpacity:or,numOctaves:Hs};function za(e,t,r,o){var i,a=e.style,c=e.vars,s=e.transform,l=e.transformKeys,d=e.transformOrigin;l.length=0;var u=!1,p=!1,h=!0;for(var f in t){var g=t[f];if(md(f)){c[f]=g;continue}var m=Sd[f],b=vp(g,m);if(Ir(f)){if(u=!0,s[f]=b,l.push(f),!h)continue;g!==((i=m.default)!==null&&i!==void 0?i:0)&&(h=!1)}else gd(f)?(d[f]=b,p=!0):a[f]=b}u?a.transform=fp(e,r,h,o):o?a.transform=o({},""):!t.transform&&a.transform&&(a.transform="none"),p&&(a.transformOrigin=gp(d))}var Ha=function(){return{style:{},transform:{},transformKeys:[],transformOrigin:{},vars:{}}};function jd(e,t,r){for(var o in t)!Ut(t[o])&&!vd(o,r)&&(e[o]=t[o])}function Ap(e,t,r){var o=e.transformTemplate;return v.useMemo(function(){var i=Ha();za(i,t,{enableHardwareAcceleration:!r},o);var a=i.vars,c=i.style;return z(z({},a),c)},[t])}function Tp(e,t,r){var o=e.style||{},i={};return jd(i,o,e),Object.assign(i,Ap(e,t,r)),e.transformValues&&(i=e.transformValues(i)),i}function Op(e,t,r){var o={},i=Tp(e,t,r);return e.drag&&e.dragListener!==!1&&(o.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":"pan-".concat(e.drag==="x"?"y":"x")),o.style=i,o}var Rp=new Set(["initial","animate","exit","style","variants","transition","transformTemplate","transformValues","custom","inherit","layout","layoutId","layoutDependency","onLayoutAnimationStart","onLayoutAnimationComplete","onLayoutMeasure","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","drag","dragControls","dragListener","dragConstraints","dragDirectionLock","dragSnapToOrigin","_dragX","_dragY","dragElastic","dragMomentum","dragPropagation","dragTransition","whileDrag","onPan","onPanStart","onPanEnd","onPanSessionStart","onTap","onTapStart","onTapCancel","onHoverStart","onHoverEnd","whileFocus","whileTap","whileHover","whileInView","onViewportEnter","onViewportLeave","viewport","layoutScroll"]);function mo(e){return Rp.has(e)}var _d=function(e){return!mo(e)};function Ad(e){e&&(_d=function(t){return t.startsWith("on")?!mo(t):e(t)})}try{Ad(require("@emotion/is-prop-valid").default)}catch{}function Lp(e,t,r){var o={};for(var i in e)(_d(i)||r===!0&&mo(i)||!t&&!mo(i)||e.draggable&&i.startsWith("onDrag"))&&(o[i]=e[i]);return o}function Gs(e,t,r){return typeof e=="string"?e:le.transform(t+r*e)}function Ip(e,t,r){var o=Gs(t,e.x,e.width),i=Gs(r,e.y,e.height);return"".concat(o," ").concat(i)}var Np={offset:"strokeDashoffset",array:"strokeDasharray"};function Fp(e,t,r,o,i){r===void 0&&(r=1),o===void 0&&(o=0),e.pathLength=1;var a=Np;e[a.offset]=le.transform(-o);var c=le.transform(t),s=le.transform(r);e[a.array]="".concat(c," ").concat(s)}function Ga(e,t,r,o){var i=t.attrX,a=t.attrY,c=t.originX,s=t.originY,l=t.pathLength,d=t.pathSpacing,u=d===void 0?1:d,p=t.pathOffset,h=p===void 0?0:p,f=ct(t,["attrX","attrY","originX","originY","pathLength","pathSpacing","pathOffset"]);za(e,f,r,o),e.attrs=e.style,e.style={};var g=e.attrs,m=e.style,b=e.dimensions;g.transform&&(b&&(m.transform=g.transform),delete g.transform),b&&(c!==void 0||s!==void 0||m.transform)&&(m.transformOrigin=Ip(b,c!==void 0?c:.5,s!==void 0?s:.5)),i!==void 0&&(g.x=i),a!==void 0&&(g.y=a),l!==void 0&&Fp(g,l,u,h)}var Td=function(){return z(z({},Ha()),{attrs:{}})};function Mp(e,t){var r=v.useMemo(function(){var i=Td();return Ga(i,t,{enableHardwareAcceleration:!1},e.transformTemplate),z(z({},i.attrs),{style:z({},i.style)})},[t]);if(e.style){var o={};jd(o,e.style,e),r.style=z(z({},o),r.style)}return r}function Pp(e){e===void 0&&(e=!1);var t=function(r,o,i,a,c,s){var l=c.latestValues,d=Va(r)?Mp:Op,u=d(o,l,s),p=Lp(o,typeof r=="string",e),h=z(z(z({},p),u),{ref:a});return i&&(h["data-projection-id"]=i),v.createElement(r,h)};return t}var Dp=/([a-z])([A-Z])/g,$p="$1-$2",Od=function(e){return e.replace(Dp,$p).toLowerCase()};function Rd(e,t,r,o){var i=t.style,a=t.vars;Object.assign(e.style,i,o&&o.getProjectionStyles(r));for(var c in a)e.style.setProperty(c,a[c])}var Ld=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength"]);function Id(e,t,r,o){Rd(e,t,void 0,o);for(var i in t.attrs)e.setAttribute(Ld.has(i)?i:Od(i),t.attrs[i])}function qa(e){var t=e.style,r={};for(var o in t)(Ut(t[o])||vd(o,e))&&(r[o]=t[o]);return r}function Nd(e){var t=qa(e);for(var r in e)if(Ut(e[r])){var o=r==="x"||r==="y"?"attr"+r.toUpperCase():r;t[o]=e[r]}return t}function Za(e){return typeof e=="object"&&typeof e.start=="function"}var kr=function(e){return Array.isArray(e)},Bp=function(e){return!!(e&&typeof e=="object"&&e.mix&&e.toValue)},Fd=function(e){return kr(e)?e[e.length-1]||0:e};function oo(e){var t=Ut(e)?e.get():e;return Bp(t)?t.toValue():t}function qs(e,t,r,o){var i=e.scrapeMotionValuesFromProps,a=e.createRenderState,c=e.onMount,s={latestValues:Wp(t,r,o,i),renderState:a()};return c&&(s.mount=function(l){return c(t,l,s)}),s}var Md=function(e){return function(t,r){var o=v.useContext(Vo),i=v.useContext(Lr);return r?qs(e,t,o,i):Wn(function(){return qs(e,t,o,i)})}};function Wp(e,t,r,o){var i={},a=r?.initial===!1,c=o(e);for(var s in c)i[s]=oo(c[s]);var l=e.initial,d=e.animate,u=zo(e),p=hd(e);t&&p&&!u&&e.inherit!==!1&&(l??(l=t.initial),d??(d=t.animate));var h=a||l===!1,f=h?d:l;if(f&&typeof f!="boolean"&&!Za(f)){var g=Array.isArray(f)?f:[f];g.forEach(function(m){var b=pd(e,m);if(b){var y=b.transitionEnd;b.transition;var w=ct(b,["transitionEnd","transition"]);for(var C in w){var k=w[C];if(Array.isArray(k)){var x=h?k.length-1:0;k=k[x]}k!==null&&(i[C]=k)}for(var C in y)i[C]=y[C]}})}return i}var Vp={useVisualState:Md({scrapeMotionValuesFromProps:Nd,createRenderState:Td,onMount:function(e,t,r){var o=r.renderState,i=r.latestValues;try{o.dimensions=typeof t.getBBox=="function"?t.getBBox():t.getBoundingClientRect()}catch{o.dimensions={x:0,y:0,width:0,height:0}}Ga(o,i,{enableHardwareAcceleration:!1},e.transformTemplate),Id(t,o)}})},Up={useVisualState:Md({scrapeMotionValuesFromProps:qa,createRenderState:Ha})};function zp(e,t,r,o,i){var a=t.forwardMotionProps,c=a===void 0?!1:a,s=Va(e)?Vp:Up;return z(z({},s),{preloadedFeatures:r,useRender:Pp(c),createVisualElement:o,projectionNodeConstructor:i,Component:e})}var Ie;(function(e){e.Animate="animate",e.Hover="whileHover",e.Tap="whileTap",e.Drag="whileDrag",e.Focus="whileFocus",e.InView="whileInView",e.Exit="exit"})(Ie||(Ie={}));function Ho(e,t,r,o){return o===void 0&&(o={passive:!0}),e.addEventListener(t,r,o),function(){return e.removeEventListener(t,r)}}function Xi(e,t,r,o){v.useEffect(function(){var i=e.current;if(r&&i)return Ho(i,t,r,o)},[e,t,r,o])}function Hp(e){var t=e.whileFocus,r=e.visualElement,o=function(){var a;(a=r.animationState)===null||a===void 0||a.setActive(Ie.Focus,!0)},i=function(){var a;(a=r.animationState)===null||a===void 0||a.setActive(Ie.Focus,!1)};Xi(r,"focus",t?o:void 0),Xi(r,"blur",t?i:void 0)}function Pd(e){return typeof PointerEvent<"u"&&e instanceof PointerEvent?e.pointerType==="mouse":e instanceof MouseEvent}function Dd(e){var t=!!e.touches;return t}function Gp(e){return function(t){var r=t instanceof MouseEvent,o=!r||r&&t.button===0;o&&e(t)}}var qp={pageX:0,pageY:0};function Zp(e,t){t===void 0&&(t="page");var r=e.touches[0]||e.changedTouches[0],o=r||qp;return{x:o[t+"X"],y:o[t+"Y"]}}function Kp(e,t){return t===void 0&&(t="page"),{x:e[t+"X"],y:e[t+"Y"]}}function Ka(e,t){return t===void 0&&(t="page"),{point:Dd(e)?Zp(e,t):Kp(e,t)}}var $d=function(e,t){t===void 0&&(t=!1);var r=function(o){return e(o,Ka(o))};return t?Gp(r):r},Yp=function(){return Bn&&window.onpointerdown===null},Xp=function(){return Bn&&window.ontouchstart===null},Qp=function(){return Bn&&window.onmousedown===null},Jp={pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointercancel:"mousecancel",pointerover:"mouseover",pointerout:"mouseout",pointerenter:"mouseenter",pointerleave:"mouseleave"},eh={pointerdown:"touchstart",pointermove:"touchmove",pointerup:"touchend",pointercancel:"touchcancel"};function Bd(e){return Yp()?e:Xp()?eh[e]:Qp()?Jp[e]:e}function On(e,t,r,o){return Ho(e,Bd(t),$d(r,t==="pointerdown"),o)}function xo(e,t,r,o){return Xi(e,Bd(t),r&&$d(r,t==="pointerdown"),o)}function Wd(e){var t=null;return function(){var r=function(){t=null};return t===null?(t=e,r):!1}}var Zs=Wd("dragHorizontal"),Ks=Wd("dragVertical");function Vd(e){var t=!1;if(e==="y")t=Ks();else if(e==="x")t=Zs();else{var r=Zs(),o=Ks();r&&o?t=function(){r(),o()}:(r&&r(),o&&o())}return t}function Ud(){var e=Vd(!0);return e?(e(),!1):!0}function Ys(e,t,r){return function(o,i){var a;!Pd(o)||Ud()||((a=e.animationState)===null||a===void 0||a.setActive(Ie.Hover,t),r?.(o,i))}}function th(e){var t=e.onHoverStart,r=e.onHoverEnd,o=e.whileHover,i=e.visualElement;xo(i,"pointerenter",t||o?Ys(i,!0,t):void 0,{passive:!t}),xo(i,"pointerleave",r||o?Ys(i,!1,r):void 0,{passive:!r})}var zd=function(e,t){return t?e===t?!0:zd(e,t.parentElement):!1};function Ya(e){return v.useEffect(function(){return function(){return e()}},[])}const bo=(e,t,r)=>Math.min(Math.max(r,e),t),si=.001,nh=.01,rh=10,oh=.05,ih=1;function ah({duration:e=800,bounce:t=.25,velocity:r=0,mass:o=1}){let i,a,c=1-t;c=bo(oh,ih,c),e=bo(nh,rh,e/1e3),c<1?(i=d=>{const u=d*c,p=u*e,h=u-r,f=Qi(d,c),g=Math.exp(-p);return si-h/f*g},a=d=>{const p=d*c*e,h=p*r+r,f=Math.pow(c,2)*Math.pow(d,2)*e,g=Math.exp(-p),m=Qi(Math.pow(d,2),c);return(-i(d)+si>0?-1:1)*((h-f)*g)/m}):(i=d=>{const u=Math.exp(-d*e),p=(d-r)*e+1;return-si+u*p},a=d=>{const u=Math.exp(-d*e),p=(r-d)*(e*e);return u*p});const s=5/e,l=ch(i,a,s);if(e=e*1e3,isNaN(l))return{stiffness:100,damping:10,duration:e};{const d=Math.pow(l,2)*o;return{stiffness:d,damping:c*2*Math.sqrt(o*d),duration:e}}}const sh=12;function ch(e,t,r){let o=r;for(let i=1;i<sh;i++)o=o-e(o)/t(o);return o}function Qi(e,t){return e*Math.sqrt(1-t*t)}const lh=["duration","bounce"],dh=["stiffness","damping","mass"];function Xs(e,t){return t.some(r=>e[r]!==void 0)}function uh(e){let t=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},e);if(!Xs(e,dh)&&Xs(e,lh)){const r=ah(e);t=Object.assign(Object.assign(Object.assign({},t),r),{velocity:0,mass:1}),t.isResolvedFromDuration=!0}return t}function Xa(e){var{from:t=0,to:r=1,restSpeed:o=2,restDelta:i}=e,a=ct(e,["from","to","restSpeed","restDelta"]);const c={done:!1,value:t};let{stiffness:s,damping:l,mass:d,velocity:u,duration:p,isResolvedFromDuration:h}=uh(a),f=Qs,g=Qs;function m(){const b=u?-(u/1e3):0,y=r-t,w=l/(2*Math.sqrt(s*d)),C=Math.sqrt(s/d)/1e3;if(i===void 0&&(i=Math.min(Math.abs(r-t)/100,.4)),w<1){const k=Qi(C,w);f=x=>{const S=Math.exp(-w*C*x);return r-S*((b+w*C*y)/k*Math.sin(k*x)+y*Math.cos(k*x))},g=x=>{const S=Math.exp(-w*C*x);return w*C*S*(Math.sin(k*x)*(b+w*C*y)/k+y*Math.cos(k*x))-S*(Math.cos(k*x)*(b+w*C*y)-k*y*Math.sin(k*x))}}else if(w===1)f=k=>r-Math.exp(-C*k)*(y+(b+C*y)*k);else{const k=C*Math.sqrt(w*w-1);f=x=>{const S=Math.exp(-w*C*x),O=Math.min(k*x,300);return r-S*((b+w*C*y)*Math.sinh(O)+k*y*Math.cosh(O))/k}}}return m(),{next:b=>{const y=f(b);if(h)c.done=b>=p;else{const w=g(b)*1e3,C=Math.abs(w)<=o,k=Math.abs(r-y)<=i;c.done=C&&k}return c.value=c.done?r:y,c},flipTarget:()=>{u=-u,[t,r]=[r,t],m()}}}Xa.needsInterpolation=(e,t)=>typeof e=="string"||typeof t=="string";const Qs=e=>0,Er=(e,t,r)=>{const o=t-e;return o===0?1:(r-e)/o},De=(e,t,r)=>-r*e+r*t+e;function ci(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+(t-e)*6*r:r<1/2?t:r<2/3?e+(t-e)*(2/3-r)*6:e}function Js({hue:e,saturation:t,lightness:r,alpha:o}){e/=360,t/=100,r/=100;let i=0,a=0,c=0;if(!t)i=a=c=r;else{const s=r<.5?r*(1+t):r+t-r*t,l=2*r-s;i=ci(l,s,e+1/3),a=ci(l,s,e),c=ci(l,s,e-1/3)}return{red:Math.round(i*255),green:Math.round(a*255),blue:Math.round(c*255),alpha:o}}const ph=(e,t,r)=>{const o=e*e,i=t*t;return Math.sqrt(Math.max(0,r*(i-o)+o))},hh=[Ki,en,pn],ec=e=>hh.find(t=>t.test(e)),Hd=(e,t)=>{let r=ec(e),o=ec(t),i=r.parse(e),a=o.parse(t);r===pn&&(i=Js(i),r=en),o===pn&&(a=Js(a),o=en);const c=Object.assign({},i);return s=>{for(const l in c)l!=="alpha"&&(c[l]=ph(i[l],a[l],s));return c.alpha=De(i.alpha,a.alpha,s),r.transform(c)}},Ji=e=>typeof e=="number",fh=(e,t)=>r=>t(e(r)),Go=(...e)=>e.reduce(fh);function Gd(e,t){return Ji(e)?r=>De(e,t,r):nt.test(e)?Hd(e,t):Zd(e,t)}const qd=(e,t)=>{const r=[...e],o=r.length,i=e.map((a,c)=>Gd(a,t[c]));return a=>{for(let c=0;c<o;c++)r[c]=i[c](a);return r}},gh=(e,t)=>{const r=Object.assign(Object.assign({},e),t),o={};for(const i in r)e[i]!==void 0&&t[i]!==void 0&&(o[i]=Gd(e[i],t[i]));return i=>{for(const a in o)r[a]=o[a](i);return r}};function tc(e){const t=zt.parse(e),r=t.length;let o=0,i=0,a=0;for(let c=0;c<r;c++)o||typeof t[c]=="number"?o++:t[c].hue!==void 0?a++:i++;return{parsed:t,numNumbers:o,numRGB:i,numHSL:a}}const Zd=(e,t)=>{const r=zt.createTransformer(t),o=tc(e),i=tc(t);return o.numHSL===i.numHSL&&o.numRGB===i.numRGB&&o.numNumbers>=i.numNumbers?Go(qd(o.parsed,i.parsed),r):c=>`${c>0?t:e}`},vh=(e,t)=>r=>De(e,t,r);function mh(e){if(typeof e=="number")return vh;if(typeof e=="string")return nt.test(e)?Hd:Zd;if(Array.isArray(e))return qd;if(typeof e=="object")return gh}function xh(e,t,r){const o=[],i=r||mh(e[0]),a=e.length-1;for(let c=0;c<a;c++){let s=i(e[c],e[c+1]);if(t){const l=Array.isArray(t)?t[c]:t;s=Go(l,s)}o.push(s)}return o}function bh([e,t],[r]){return o=>r(Er(e,t,o))}function yh(e,t){const r=e.length,o=r-1;return i=>{let a=0,c=!1;if(i<=e[0]?c=!0:i>=e[o]&&(a=o-1,c=!0),!c){let l=1;for(;l<r&&!(e[l]>i||l===o);l++);a=l-1}const s=Er(e[a],e[a+1],i);return t[a](s)}}function Kd(e,t,{clamp:r=!0,ease:o,mixer:i}={}){const a=e.length;fo(a===t.length),fo(!o||!Array.isArray(o)||o.length===a-1),e[0]>e[a-1]&&(e=[].concat(e),t=[].concat(t),e.reverse(),t.reverse());const c=xh(t,o,i),s=a===2?bh(e,c):yh(e,c);return r?l=>s(bo(e[0],e[a-1],l)):s}const qo=e=>t=>1-e(1-t),Qa=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Ch=e=>t=>Math.pow(t,e),Yd=e=>t=>t*t*((e+1)*t-e),wh=e=>{const t=Yd(e);return r=>(r*=2)<1?.5*t(r):.5*(2-Math.pow(2,-10*(r-1)))},Xd=1.525,kh=4/11,Eh=8/11,Sh=9/10,Ja=e=>e,es=Ch(2),jh=qo(es),Qd=Qa(es),Jd=e=>1-Math.sin(Math.acos(e)),ts=qo(Jd),_h=Qa(ts),ns=Yd(Xd),Ah=qo(ns),Th=Qa(ns),Oh=wh(Xd),Rh=4356/361,Lh=35442/1805,Ih=16061/1805,yo=e=>{if(e===1||e===0)return e;const t=e*e;return e<kh?7.5625*t:e<Eh?9.075*t-9.9*e+3.4:e<Sh?Rh*t-Lh*e+Ih:10.8*e*e-20.52*e+10.72},Nh=qo(yo),Fh=e=>e<.5?.5*(1-yo(1-e*2)):.5*yo(e*2-1)+.5;function Mh(e,t){return e.map(()=>t||Qd).splice(0,e.length-1)}function Ph(e){const t=e.length;return e.map((r,o)=>o!==0?o/(t-1):0)}function Dh(e,t){return e.map(r=>r*t)}function io({from:e=0,to:t=1,ease:r,offset:o,duration:i=300}){const a={done:!1,value:e},c=Array.isArray(t)?t:[e,t],s=Dh(o&&o.length===c.length?o:Ph(c),i);function l(){return Kd(s,c,{ease:Array.isArray(r)?r:Mh(c,r)})}let d=l();return{next:u=>(a.value=d(u),a.done=u>=i,a),flipTarget:()=>{c.reverse(),d=l()}}}function $h({velocity:e=0,from:t=0,power:r=.8,timeConstant:o=350,restDelta:i=.5,modifyTarget:a}){const c={done:!1,value:t};let s=r*e;const l=t+s,d=a===void 0?l:a(l);return d!==l&&(s=d-t),{next:u=>{const p=-s*Math.exp(-u/o);return c.done=!(p>i||p<-i),c.value=c.done?d:d+p,c},flipTarget:()=>{}}}const nc={keyframes:io,spring:Xa,decay:$h};function Bh(e){if(Array.isArray(e.to))return io;if(nc[e.type])return nc[e.type];const t=new Set(Object.keys(e));return t.has("ease")||t.has("duration")&&!t.has("dampingRatio")?io:t.has("dampingRatio")||t.has("stiffness")||t.has("mass")||t.has("damping")||t.has("restSpeed")||t.has("restDelta")?Xa:io}const eu=1/60*1e3,Wh=typeof performance<"u"?()=>performance.now():()=>Date.now(),tu=typeof window<"u"?e=>window.requestAnimationFrame(e):e=>setTimeout(()=>e(Wh()),eu);function Vh(e){let t=[],r=[],o=0,i=!1,a=!1;const c=new WeakSet,s={schedule:(l,d=!1,u=!1)=>{const p=u&&i,h=p?t:r;return d&&c.add(l),h.indexOf(l)===-1&&(h.push(l),p&&i&&(o=t.length)),l},cancel:l=>{const d=r.indexOf(l);d!==-1&&r.splice(d,1),c.delete(l)},process:l=>{if(i){a=!0;return}if(i=!0,[t,r]=[r,t],r.length=0,o=t.length,o)for(let d=0;d<o;d++){const u=t[d];u(l),c.has(u)&&(s.schedule(u),e())}i=!1,a&&(a=!1,s.process(l))}};return s}const Uh=40;let ea=!0,Sr=!1,ta=!1;const Rn={delta:0,timestamp:0},Mr=["read","update","preRender","render","postRender"],Zo=Mr.reduce((e,t)=>(e[t]=Vh(()=>Sr=!0),e),{}),jt=Mr.reduce((e,t)=>{const r=Zo[t];return e[t]=(o,i=!1,a=!1)=>(Sr||Hh(),r.schedule(o,i,a)),e},{}),In=Mr.reduce((e,t)=>(e[t]=Zo[t].cancel,e),{}),li=Mr.reduce((e,t)=>(e[t]=()=>Zo[t].process(Rn),e),{}),zh=e=>Zo[e].process(Rn),nu=e=>{Sr=!1,Rn.delta=ea?eu:Math.max(Math.min(e-Rn.timestamp,Uh),1),Rn.timestamp=e,ta=!0,Mr.forEach(zh),ta=!1,Sr&&(ea=!1,tu(nu))},Hh=()=>{Sr=!0,ea=!0,ta||tu(nu)},Co=()=>Rn;function ru(e,t,r=0){return e-t-r}function Gh(e,t,r=0,o=!0){return o?ru(t+-e,t,r):t-(e-t)+r}function qh(e,t,r,o){return o?e>=t+r:e<=-r}const Zh=e=>{const t=({delta:r})=>e(r);return{start:()=>jt.update(t,!0),stop:()=>In.update(t)}};function ou(e){var t,r,{from:o,autoplay:i=!0,driver:a=Zh,elapsed:c=0,repeat:s=0,repeatType:l="loop",repeatDelay:d=0,onPlay:u,onStop:p,onComplete:h,onRepeat:f,onUpdate:g}=e,m=ct(e,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let{to:b}=m,y,w=0,C=m.duration,k,x=!1,S=!0,O;const j=Bh(m);!((r=(t=j).needsInterpolation)===null||r===void 0)&&r.call(t,o,b)&&(O=Kd([0,100],[o,b],{clamp:!1}),o=0,b=100);const A=j(Object.assign(Object.assign({},m),{from:o,to:b}));function _(){w++,l==="reverse"?(S=w%2===0,c=Gh(c,C,d,S)):(c=ru(c,C,d),l==="mirror"&&A.flipTarget()),x=!1,f&&f()}function P(){y.stop(),h&&h()}function D(q){if(S||(q=-q),c+=q,!x){const B=A.next(Math.max(0,c));k=B.value,O&&(k=O(k)),x=S?B.done:c<=0}g?.(k),x&&(w===0&&(C??(C=c)),w<s?qh(c,C,d,S)&&_():P())}function $(){u?.(),y=a(D),y.start()}return i&&$(),{stop:()=>{p?.(),y.stop()}}}function iu(e,t){return t?e*(1e3/t):0}function Kh({from:e=0,velocity:t=0,min:r,max:o,power:i=.8,timeConstant:a=750,bounceStiffness:c=500,bounceDamping:s=10,restDelta:l=1,modifyTarget:d,driver:u,onUpdate:p,onComplete:h,onStop:f}){let g;function m(C){return r!==void 0&&C<r||o!==void 0&&C>o}function b(C){return r===void 0?o:o===void 0||Math.abs(r-C)<Math.abs(o-C)?r:o}function y(C){g?.stop(),g=ou(Object.assign(Object.assign({},C),{driver:u,onUpdate:k=>{var x;p?.(k),(x=C.onUpdate)===null||x===void 0||x.call(C,k)},onComplete:h,onStop:f}))}function w(C){y(Object.assign({type:"spring",stiffness:c,damping:s,restDelta:l},C))}if(m(e))w({from:e,velocity:t,to:b(e)});else{let C=i*t+e;typeof d<"u"&&(C=d(C));const k=b(C),x=k===r?-1:1;let S,O;const j=A=>{S=O,O=A,t=iu(A-S,Co().delta),(x===1&&A>k||x===-1&&A<k)&&w({from:A,to:k,velocity:t})};y({type:"decay",from:e,velocity:t,timeConstant:a,power:i,restDelta:l,modifyTarget:d,onUpdate:m(C)?j:void 0})}return{stop:()=>g?.stop()}}const na=e=>e.hasOwnProperty("x")&&e.hasOwnProperty("y"),rc=e=>na(e)&&e.hasOwnProperty("z"),zr=(e,t)=>Math.abs(e-t);function au(e,t){if(Ji(e)&&Ji(t))return zr(e,t);if(na(e)&&na(t)){const r=zr(e.x,t.x),o=zr(e.y,t.y),i=rc(e)&&rc(t)?zr(e.z,t.z):0;return Math.sqrt(Math.pow(r,2)+Math.pow(o,2)+Math.pow(i,2))}}const su=(e,t)=>1-3*t+3*e,cu=(e,t)=>3*t-6*e,lu=e=>3*e,wo=(e,t,r)=>((su(t,r)*e+cu(t,r))*e+lu(t))*e,du=(e,t,r)=>3*su(t,r)*e*e+2*cu(t,r)*e+lu(t),Yh=1e-7,Xh=10;function Qh(e,t,r,o,i){let a,c,s=0;do c=t+(r-t)/2,a=wo(c,o,i)-e,a>0?r=c:t=c;while(Math.abs(a)>Yh&&++s<Xh);return c}const Jh=8,e2=.001;function t2(e,t,r,o){for(let i=0;i<Jh;++i){const a=du(t,r,o);if(a===0)return t;const c=wo(t,r,o)-e;t-=c/a}return t}const ao=11,Hr=1/(ao-1);function n2(e,t,r,o){if(e===t&&r===o)return Ja;const i=new Float32Array(ao);for(let c=0;c<ao;++c)i[c]=wo(c*Hr,e,r);function a(c){let s=0,l=1;const d=ao-1;for(;l!==d&&i[l]<=c;++l)s+=Hr;--l;const u=(c-i[l])/(i[l+1]-i[l]),p=s+u*Hr,h=du(p,e,r);return h>=e2?t2(c,p,e,r):h===0?p:Qh(c,s,s+Hr,e,r)}return c=>c===0||c===1?c:wo(a(c),t,o)}function r2(e){var t=e.onTap,r=e.onTapStart,o=e.onTapCancel,i=e.whileTap,a=e.visualElement,c=t||r||o||i,s=v.useRef(!1),l=v.useRef(null),d={passive:!(r||t||o||g)};function u(){var m;(m=l.current)===null||m===void 0||m.call(l),l.current=null}function p(){var m;return u(),s.current=!1,(m=a.animationState)===null||m===void 0||m.setActive(Ie.Tap,!1),!Ud()}function h(m,b){p()&&(zd(a.getInstance(),m.target)?t?.(m,b):o?.(m,b))}function f(m,b){p()&&o?.(m,b)}function g(m,b){var y;u(),!s.current&&(s.current=!0,l.current=Go(On(window,"pointerup",h,d),On(window,"pointercancel",f,d)),(y=a.animationState)===null||y===void 0||y.setActive(Ie.Tap,!0),r?.(m,b))}xo(a,"pointerdown",c?g:void 0,d),Ya(u)}var ra=new WeakMap,di=new WeakMap,o2=function(e){var t;(t=ra.get(e.target))===null||t===void 0||t(e)},i2=function(e){e.forEach(o2)};function a2(e){var t=e.root,r=ct(e,["root"]),o=t||document;di.has(o)||di.set(o,{});var i=di.get(o),a=JSON.stringify(r);return i[a]||(i[a]=new IntersectionObserver(i2,z({root:t},r))),i[a]}function s2(e,t,r){var o=a2(t);return ra.set(e,r),o.observe(e),function(){ra.delete(e),o.unobserve(e)}}function c2(e){var t=e.visualElement,r=e.whileInView,o=e.onViewportEnter,i=e.onViewportLeave,a=e.viewport,c=a===void 0?{}:a,s=v.useRef({hasEnteredView:!1,isInView:!1}),l=!!(r||o||i);c.once&&s.current.hasEnteredView&&(l=!1);var d=typeof IntersectionObserver>"u"?u2:d2;d(l,s.current,t,c)}var l2={some:0,all:1};function d2(e,t,r,o){var i=o.root,a=o.margin,c=o.amount,s=c===void 0?"some":c,l=o.once;v.useEffect(function(){if(e){var d={root:i?.current,rootMargin:a,threshold:typeof s=="number"?s:l2[s]},u=function(p){var h,f=p.isIntersecting;if(t.isInView!==f&&(t.isInView=f,!(l&&!f&&t.hasEnteredView))){f&&(t.hasEnteredView=!0),(h=r.animationState)===null||h===void 0||h.setActive(Ie.InView,f);var g=r.getProps(),m=f?g.onViewportEnter:g.onViewportLeave;m?.(p)}};return s2(r.getInstance(),d,u)}},[e,i,a,s])}function u2(e,t,r,o){var i=o.fallback,a=i===void 0?!0:i;v.useEffect(function(){!e||!a||requestAnimationFrame(function(){var c;t.hasEnteredView=!0;var s=r.getProps().onViewportEnter;s?.(null),(c=r.animationState)===null||c===void 0||c.setActive(Ie.InView,!0)})},[e])}var tn=function(e){return function(t){return e(t),null}},p2={inView:tn(c2),tap:tn(r2),focus:tn(Hp),hover:tn(th)},h2=0,f2=function(){return h2++},uu=function(){return Wn(f2)};function pu(){var e=v.useContext(Lr);if(e===null)return[!0,null];var t=e.isPresent,r=e.onExitComplete,o=e.register,i=uu();v.useEffect(function(){return o(i)},[]);var a=function(){return r?.(i)};return!t&&r?[!1,a]:[!0]}function hu(e,t){if(!Array.isArray(t))return!1;var r=t.length;if(r!==e.length)return!1;for(var o=0;o<r;o++)if(t[o]!==e[o])return!1;return!0}var ko=function(e){return e*1e3},g2={linear:Ja,easeIn:es,easeInOut:Qd,easeOut:jh,circIn:Jd,circInOut:_h,circOut:ts,backIn:ns,backInOut:Th,backOut:Ah,anticipate:Oh,bounceIn:Nh,bounceInOut:Fh,bounceOut:yo},oc=function(e){if(Array.isArray(e)){fo(e.length===4);var t=$e(e,4),r=t[0],o=t[1],i=t[2],a=t[3];return n2(r,o,i,a)}else if(typeof e=="string")return g2[e];return e},v2=function(e){return Array.isArray(e)&&typeof e[0]!="number"},ic=function(e,t){return e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&zt.test(t)&&!t.startsWith("url("))},sn=function(){return{type:"spring",stiffness:500,damping:25,restSpeed:10}},Gr=function(e){return{type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}},ui=function(){return{type:"keyframes",ease:"linear",duration:.3}},m2=function(e){return{type:"keyframes",duration:.8,values:e}},ac={x:sn,y:sn,z:sn,rotate:sn,rotateX:sn,rotateY:sn,rotateZ:sn,scaleX:Gr,scaleY:Gr,scale:Gr,opacity:ui,backgroundColor:ui,color:ui,default:Gr},x2=function(e,t){var r;return kr(t)?r=m2:r=ac[e]||ac.default,z({to:t},r(t))},b2=z(z({},Sd),{color:nt,backgroundColor:nt,outlineColor:nt,fill:nt,stroke:nt,borderColor:nt,borderTopColor:nt,borderRightColor:nt,borderBottomColor:nt,borderLeftColor:nt,filter:Yi,WebkitFilter:Yi}),rs=function(e){return b2[e]};function os(e,t){var r,o=rs(e);return o!==Yi&&(o=zt),(r=o.getAnimatableNone)===null||r===void 0?void 0:r.call(o,t)}function y2(e){e.when,e.delay,e.delayChildren,e.staggerChildren,e.staggerDirection,e.repeat,e.repeatType,e.repeatDelay,e.from;var t=ct(e,["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from"]);return!!Object.keys(t).length}function C2(e){var t=e.ease,r=e.times,o=e.yoyo,i=e.flip,a=e.loop,c=ct(e,["ease","times","yoyo","flip","loop"]),s=z({},c);return r&&(s.offset=r),c.duration&&(s.duration=ko(c.duration)),c.repeatDelay&&(s.repeatDelay=ko(c.repeatDelay)),t&&(s.ease=v2(t)?t.map(oc):oc(t)),c.type==="tween"&&(s.type="keyframes"),(o||a||i)&&(o?s.repeatType="reverse":a?s.repeatType="loop":i&&(s.repeatType="mirror"),s.repeat=a||o||i||c.repeat),c.type!=="spring"&&(s.type="keyframes"),s}function w2(e,t){var r,o,i=is(e,t)||{};return(o=(r=i.delay)!==null&&r!==void 0?r:e.delay)!==null&&o!==void 0?o:0}function k2(e){return Array.isArray(e.to)&&e.to[0]===null&&(e.to=St([],$e(e.to),!1),e.to[0]=e.from),e}function E2(e,t,r){var o;return Array.isArray(t.to)&&((o=e.duration)!==null&&o!==void 0||(e.duration=.8)),k2(t),y2(e)||(e=z(z({},e),x2(r,t.to))),z(z({},t),C2(e))}function S2(e,t,r,o,i){var a,c=is(o,e),s=(a=c.from)!==null&&a!==void 0?a:t.get(),l=ic(e,r);s==="none"&&l&&typeof r=="string"?s=os(e,r):sc(s)&&typeof r=="string"?s=cc(r):!Array.isArray(r)&&sc(r)&&typeof s=="string"&&(r=cc(s));var d=ic(e,s);function u(){var h={from:s,to:r,velocity:t.getVelocity(),onComplete:i,onUpdate:function(f){return t.set(f)}};return c.type==="inertia"||c.type==="decay"?Kh(z(z({},h),c)):ou(z(z({},E2(c,h,e)),{onUpdate:function(f){var g;h.onUpdate(f),(g=c.onUpdate)===null||g===void 0||g.call(c,f)},onComplete:function(){var f;h.onComplete(),(f=c.onComplete)===null||f===void 0||f.call(c)}}))}function p(){var h,f,g=Fd(r);return t.set(g),i(),(h=c?.onUpdate)===null||h===void 0||h.call(c,g),(f=c?.onComplete)===null||f===void 0||f.call(c),{stop:function(){}}}return!d||!l||c.type===!1?p:u}function sc(e){return e===0||typeof e=="string"&&parseFloat(e)===0&&e.indexOf(" ")===-1}function cc(e){return typeof e=="number"?0:os("",e)}function is(e,t){return e[t]||e.default||e}function as(e,t,r,o){return o===void 0&&(o={}),t.start(function(i){var a,c,s=S2(e,t,r,o,i),l=w2(o,e),d=function(){return c=s()};return l?a=window.setTimeout(d,ko(l)):d(),function(){clearTimeout(a),c?.stop()}})}var j2=function(e){return/^\-?\d*\.?\d+$/.test(e)},_2=function(e){return/^0[^.\s]+$/.test(e)};function ss(e,t){e.indexOf(t)===-1&&e.push(t)}function cs(e,t){var r=e.indexOf(t);r>-1&&e.splice(r,1)}var ir=(function(){function e(){this.subscriptions=[]}return e.prototype.add=function(t){var r=this;return ss(this.subscriptions,t),function(){return cs(r.subscriptions,t)}},e.prototype.notify=function(t,r,o){var i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](t,r,o);else for(var a=0;a<i;a++){var c=this.subscriptions[a];c&&c(t,r,o)}},e.prototype.getSize=function(){return this.subscriptions.length},e.prototype.clear=function(){this.subscriptions.length=0},e})(),A2=function(e){return!isNaN(parseFloat(e))},T2=(function(){function e(t){var r=this;this.version="6.5.1",this.timeDelta=0,this.lastUpdated=0,this.updateSubscribers=new ir,this.velocityUpdateSubscribers=new ir,this.renderSubscribers=new ir,this.canTrackVelocity=!1,this.updateAndNotify=function(o,i){i===void 0&&(i=!0),r.prev=r.current,r.current=o;var a=Co(),c=a.delta,s=a.timestamp;r.lastUpdated!==s&&(r.timeDelta=c,r.lastUpdated=s,jt.postRender(r.scheduleVelocityCheck)),r.prev!==r.current&&r.updateSubscribers.notify(r.current),r.velocityUpdateSubscribers.getSize()&&r.velocityUpdateSubscribers.notify(r.getVelocity()),i&&r.renderSubscribers.notify(r.current)},this.scheduleVelocityCheck=function(){return jt.postRender(r.velocityCheck)},this.velocityCheck=function(o){var i=o.timestamp;i!==r.lastUpdated&&(r.prev=r.current,r.velocityUpdateSubscribers.notify(r.getVelocity()))},this.hasAnimated=!1,this.prev=this.current=t,this.canTrackVelocity=A2(this.current)}return e.prototype.onChange=function(t){return this.updateSubscribers.add(t)},e.prototype.clearListeners=function(){this.updateSubscribers.clear()},e.prototype.onRenderRequest=function(t){return t(this.get()),this.renderSubscribers.add(t)},e.prototype.attach=function(t){this.passiveEffect=t},e.prototype.set=function(t,r){r===void 0&&(r=!0),!r||!this.passiveEffect?this.updateAndNotify(t,r):this.passiveEffect(t,this.updateAndNotify)},e.prototype.get=function(){return this.current},e.prototype.getPrevious=function(){return this.prev},e.prototype.getVelocity=function(){return this.canTrackVelocity?iu(parseFloat(this.current)-parseFloat(this.prev),this.timeDelta):0},e.prototype.start=function(t){var r=this;return this.stop(),new Promise(function(o){r.hasAnimated=!0,r.stopAnimation=t(o)}).then(function(){return r.clearAnimation()})},e.prototype.stop=function(){this.stopAnimation&&this.stopAnimation(),this.clearAnimation()},e.prototype.isAnimating=function(){return!!this.stopAnimation},e.prototype.clearAnimation=function(){this.stopAnimation=null},e.prototype.destroy=function(){this.updateSubscribers.clear(),this.renderSubscribers.clear(),this.stop()},e})();function Nn(e){return new T2(e)}var fu=function(e){return function(t){return t.test(e)}},O2={test:function(e){return e==="auto"},parse:function(e){return e}},gu=[mn,le,It,Yt,bp,xp,O2],Kn=function(e){return gu.find(fu(e))},R2=St(St([],$e(gu),!1),[nt,zt],!1),L2=function(e){return R2.find(fu(e))};function I2(e,t,r){e.hasValue(t)?e.getValue(t).set(r):e.addValue(t,Nn(r))}function N2(e,t){var r=Uo(e,t),o=r?e.makeTargetAnimatable(r,!1):{},i=o.transitionEnd,a=i===void 0?{}:i;o.transition;var c=ct(o,["transitionEnd","transition"]);c=z(z({},c),a);for(var s in c){var l=Fd(c[s]);I2(e,s,l)}}function F2(e,t,r){var o,i,a,c,s=Object.keys(t).filter(function(f){return!e.hasValue(f)}),l=s.length;if(l)for(var d=0;d<l;d++){var u=s[d],p=t[u],h=null;Array.isArray(p)&&(h=p[0]),h===null&&(h=(i=(o=r[u])!==null&&o!==void 0?o:e.readValue(u))!==null&&i!==void 0?i:t[u]),h!=null&&(typeof h=="string"&&(j2(h)||_2(h))?h=parseFloat(h):!L2(h)&&zt.test(p)&&(h=os(u,p)),e.addValue(u,Nn(h)),(a=(c=r)[u])!==null&&a!==void 0||(c[u]=h),e.setBaseTarget(u,h))}}function M2(e,t){if(t){var r=t[e]||t.default||t;return r.from}}function P2(e,t,r){var o,i,a={};for(var c in e)a[c]=(o=M2(c,t))!==null&&o!==void 0?o:(i=r.getValue(c))===null||i===void 0?void 0:i.get();return a}function D2(e,t,r){r===void 0&&(r={}),e.notifyAnimationStart(t);var o;if(Array.isArray(t)){var i=t.map(function(c){return oa(e,c,r)});o=Promise.all(i)}else if(typeof t=="string")o=oa(e,t,r);else{var a=typeof t=="function"?Uo(e,t,r.custom):t;o=vu(e,a,r)}return o.then(function(){return e.notifyAnimationComplete(t)})}function oa(e,t,r){var o;r===void 0&&(r={});var i=Uo(e,t,r.custom),a=(i||{}).transition,c=a===void 0?e.getDefaultTransition()||{}:a;r.transitionOverride&&(c=r.transitionOverride);var s=i?function(){return vu(e,i,r)}:function(){return Promise.resolve()},l=!((o=e.variantChildren)===null||o===void 0)&&o.size?function(f){f===void 0&&(f=0);var g=c.delayChildren,m=g===void 0?0:g,b=c.staggerChildren,y=c.staggerDirection;return $2(e,t,m+f,b,y,r)}:function(){return Promise.resolve()},d=c.when;if(d){var u=$e(d==="beforeChildren"?[s,l]:[l,s],2),p=u[0],h=u[1];return p().then(h)}else return Promise.all([s(),l(r.delay)])}function vu(e,t,r){var o,i=r===void 0?{}:r,a=i.delay,c=a===void 0?0:a,s=i.transitionOverride,l=i.type,d=e.makeTargetAnimatable(t),u=d.transition,p=u===void 0?e.getDefaultTransition():u,h=d.transitionEnd,f=ct(d,["transition","transitionEnd"]);s&&(p=s);var g=[],m=l&&((o=e.animationState)===null||o===void 0?void 0:o.getState()[l]);for(var b in f){var y=e.getValue(b),w=f[b];if(!(!y||w===void 0||m&&W2(m,b))){var C=z({delay:c},p);e.shouldReduceMotion&&Ir(b)&&(C=z(z({},C),{type:!1,delay:0}));var k=as(b,y,w,C);g.push(k)}}return Promise.all(g).then(function(){h&&N2(e,h)})}function $2(e,t,r,o,i,a){r===void 0&&(r=0),o===void 0&&(o=0),i===void 0&&(i=1);var c=[],s=(e.variantChildren.size-1)*o,l=i===1?function(d){return d===void 0&&(d=0),d*o}:function(d){return d===void 0&&(d=0),s-d*o};return Array.from(e.variantChildren).sort(B2).forEach(function(d,u){c.push(oa(d,t,z(z({},a),{delay:r+l(u)})).then(function(){return d.notifyAnimationComplete(t)}))}),Promise.all(c)}function B2(e,t){return e.sortNodePosition(t)}function W2(e,t){var r=e.protectedKeys,o=e.needsAnimating,i=r.hasOwnProperty(t)&&o[t]!==!0;return o[t]=!1,i}var ls=[Ie.Animate,Ie.InView,Ie.Focus,Ie.Hover,Ie.Tap,Ie.Drag,Ie.Exit],V2=St([],$e(ls),!1).reverse(),U2=ls.length;function z2(e){return function(t){return Promise.all(t.map(function(r){var o=r.animation,i=r.options;return D2(e,o,i)}))}}function H2(e){var t=z2(e),r=q2(),o={},i=!0,a=function(u,p){var h=Uo(e,p);if(h){h.transition;var f=h.transitionEnd,g=ct(h,["transition","transitionEnd"]);u=z(z(z({},u),g),f)}return u};function c(u){return o[u]!==void 0}function s(u){t=u(e)}function l(u,p){for(var h,f=e.getProps(),g=e.getVariantContext(!0)||{},m=[],b=new Set,y={},w=1/0,C=function(O){var j=V2[O],A=r[j],_=(h=f[j])!==null&&h!==void 0?h:g[j],P=wt(_),D=j===p?A.isActive:null;D===!1&&(w=O);var $=_===g[j]&&_!==f[j]&&P;if($&&i&&e.manuallyAnimateOnMount&&($=!1),A.protectedKeys=z({},y),!A.isActive&&D===null||!_&&!A.prevProp||Za(_)||typeof _=="boolean")return"continue";var q=G2(A.prevProp,_),B=q||j===p&&A.isActive&&!$&&P||O>w&&P,W=Array.isArray(_)?_:[_],H=W.reduce(a,{});D===!1&&(H={});var K=A.prevResolvedValues,Y=K===void 0?{}:K,ue=z(z({},Y),H),G=function(M){B=!0,b.delete(M),A.needsAnimating[M]=!0};for(var I in ue){var N=H[I],R=Y[I];y.hasOwnProperty(I)||(N!==R?kr(N)&&kr(R)?!hu(N,R)||q?G(I):A.protectedKeys[I]=!0:N!==void 0?G(I):b.add(I):N!==void 0&&b.has(I)?G(I):A.protectedKeys[I]=!0)}A.prevProp=_,A.prevResolvedValues=H,A.isActive&&(y=z(z({},y),H)),i&&e.blockInitialAnimation&&(B=!1),B&&!$&&m.push.apply(m,St([],$e(W.map(function(M){return{animation:M,options:z({type:j},u)}})),!1))},k=0;k<U2;k++)C(k);if(o=z({},y),b.size){var x={};b.forEach(function(O){var j=e.getBaseTarget(O);j!==void 0&&(x[O]=j)}),m.push({animation:x})}var S=!!m.length;return i&&f.initial===!1&&!e.manuallyAnimateOnMount&&(S=!1),i=!1,S?t(m):Promise.resolve()}function d(u,p,h){var f;if(r[u].isActive===p)return Promise.resolve();(f=e.variantChildren)===null||f===void 0||f.forEach(function(b){var y;return(y=b.animationState)===null||y===void 0?void 0:y.setActive(u,p)}),r[u].isActive=p;var g=l(h,u);for(var m in r)r[m].protectedKeys={};return g}return{isAnimated:c,animateChanges:l,setActive:d,setAnimateFunction:s,getState:function(){return r}}}function G2(e,t){return typeof t=="string"?t!==e:ud(t)?!hu(t,e):!1}function cn(e){return e===void 0&&(e=!1),{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function q2(){var e;return e={},e[Ie.Animate]=cn(!0),e[Ie.InView]=cn(),e[Ie.Hover]=cn(),e[Ie.Tap]=cn(),e[Ie.Drag]=cn(),e[Ie.Focus]=cn(),e[Ie.Exit]=cn(),e}var Z2={animation:tn(function(e){var t=e.visualElement,r=e.animate;t.animationState||(t.animationState=H2(t)),Za(r)&&v.useEffect(function(){return r.subscribe(t)},[r])}),exit:tn(function(e){var t=e.custom,r=e.visualElement,o=$e(pu(),2),i=o[0],a=o[1],c=v.useContext(Lr);v.useEffect(function(){var s,l;r.isPresent=i;var d=(s=r.animationState)===null||s===void 0?void 0:s.setActive(Ie.Exit,!i,{custom:(l=c?.custom)!==null&&l!==void 0?l:t});!i&&d?.then(a)},[i])})},mu=(function(){function e(t,r,o){var i=this,a=o===void 0?{}:o,c=a.transformPagePoint;if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.updatePoint=function(){if(i.lastMoveEvent&&i.lastMoveEventInfo){var h=hi(i.lastMoveEventInfo,i.history),f=i.startEvent!==null,g=au(h.offset,{x:0,y:0})>=3;if(!(!f&&!g)){var m=h.point,b=Co().timestamp;i.history.push(z(z({},m),{timestamp:b}));var y=i.handlers,w=y.onStart,C=y.onMove;f||(w&&w(i.lastMoveEvent,h),i.startEvent=i.lastMoveEvent),C&&C(i.lastMoveEvent,h)}}},this.handlePointerMove=function(h,f){if(i.lastMoveEvent=h,i.lastMoveEventInfo=pi(f,i.transformPagePoint),Pd(h)&&h.buttons===0){i.handlePointerUp(h,f);return}jt.update(i.updatePoint,!0)},this.handlePointerUp=function(h,f){i.end();var g=i.handlers,m=g.onEnd,b=g.onSessionEnd,y=hi(pi(f,i.transformPagePoint),i.history);i.startEvent&&m&&m(h,y),b&&b(h,y)},!(Dd(t)&&t.touches.length>1)){this.handlers=r,this.transformPagePoint=c;var s=Ka(t),l=pi(s,this.transformPagePoint),d=l.point,u=Co().timestamp;this.history=[z(z({},d),{timestamp:u})];var p=r.onSessionStart;p&&p(t,hi(l,this.history)),this.removeListeners=Go(On(window,"pointermove",this.handlePointerMove),On(window,"pointerup",this.handlePointerUp),On(window,"pointercancel",this.handlePointerUp))}}return e.prototype.updateHandlers=function(t){this.handlers=t},e.prototype.end=function(){this.removeListeners&&this.removeListeners(),In.update(this.updatePoint)},e})();function pi(e,t){return t?{point:t(e.point)}:e}function lc(e,t){return{x:e.x-t.x,y:e.y-t.y}}function hi(e,t){var r=e.point;return{point:r,delta:lc(r,xu(t)),offset:lc(r,K2(t)),velocity:Y2(t,.1)}}function K2(e){return e[0]}function xu(e){return e[e.length-1]}function Y2(e,t){if(e.length<2)return{x:0,y:0};for(var r=e.length-1,o=null,i=xu(e);r>=0&&(o=e[r],!(i.timestamp-o.timestamp>ko(t)));)r--;if(!o)return{x:0,y:0};var a=(i.timestamp-o.timestamp)/1e3;if(a===0)return{x:0,y:0};var c={x:(i.x-o.x)/a,y:(i.y-o.y)/a};return c.x===1/0&&(c.x=0),c.y===1/0&&(c.y=0),c}function Ht(e){return e.max-e.min}function dc(e,t,r){return t===void 0&&(t=0),r===void 0&&(r=.01),au(e,t)<r}function uc(e,t,r,o){o===void 0&&(o=.5),e.origin=o,e.originPoint=De(t.min,t.max,e.origin),e.scale=Ht(r)/Ht(t),(dc(e.scale,1,1e-4)||isNaN(e.scale))&&(e.scale=1),e.translate=De(r.min,r.max,e.origin)-e.originPoint,(dc(e.translate)||isNaN(e.translate))&&(e.translate=0)}function ar(e,t,r,o){uc(e.x,t.x,r.x,o?.originX),uc(e.y,t.y,r.y,o?.originY)}function pc(e,t,r){e.min=r.min+t.min,e.max=e.min+Ht(t)}function X2(e,t,r){pc(e.x,t.x,r.x),pc(e.y,t.y,r.y)}function hc(e,t,r){e.min=t.min-r.min,e.max=e.min+Ht(t)}function sr(e,t,r){hc(e.x,t.x,r.x),hc(e.y,t.y,r.y)}function Q2(e,t,r){var o=t.min,i=t.max;return o!==void 0&&e<o?e=r?De(o,e,r.min):Math.max(e,o):i!==void 0&&e>i&&(e=r?De(i,e,r.max):Math.min(e,i)),e}function fc(e,t,r){return{min:t!==void 0?e.min+t:void 0,max:r!==void 0?e.max+r-(e.max-e.min):void 0}}function J2(e,t){var r=t.top,o=t.left,i=t.bottom,a=t.right;return{x:fc(e.x,o,a),y:fc(e.y,r,i)}}function gc(e,t){var r,o=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&(r=$e([i,o],2),o=r[0],i=r[1]),{min:o,max:i}}function ef(e,t){return{x:gc(e.x,t.x),y:gc(e.y,t.y)}}function tf(e,t){var r=.5,o=Ht(e),i=Ht(t);return i>o?r=Er(t.min,t.max-o,e.min):o>i&&(r=Er(e.min,e.max-i,t.min)),bo(0,1,r)}function nf(e,t){var r={};return t.min!==void 0&&(r.min=t.min-e.min),t.max!==void 0&&(r.max=t.max-e.min),r}var ia=.35;function rf(e){return e===void 0&&(e=ia),e===!1?e=0:e===!0&&(e=ia),{x:vc(e,"left","right"),y:vc(e,"top","bottom")}}function vc(e,t,r){return{min:mc(e,t),max:mc(e,r)}}function mc(e,t){var r;return typeof e=="number"?e:(r=e[t])!==null&&r!==void 0?r:0}var xc=function(){return{translate:0,scale:1,origin:0,originPoint:0}},cr=function(){return{x:xc(),y:xc()}},bc=function(){return{min:0,max:0}},Qe=function(){return{x:bc(),y:bc()}};function Rt(e){return[e("x"),e("y")]}function bu(e){var t=e.top,r=e.left,o=e.right,i=e.bottom;return{x:{min:r,max:o},y:{min:t,max:i}}}function of(e){var t=e.x,r=e.y;return{top:r.min,right:t.max,bottom:r.max,left:t.min}}function af(e,t){if(!t)return e;var r=t({x:e.left,y:e.top}),o=t({x:e.right,y:e.bottom});return{top:r.y,left:r.x,bottom:o.y,right:o.x}}function fi(e){return e===void 0||e===1}function yu(e){var t=e.scale,r=e.scaleX,o=e.scaleY;return!fi(t)||!fi(r)||!fi(o)}function Xt(e){return yu(e)||yc(e.x)||yc(e.y)||e.z||e.rotate||e.rotateX||e.rotateY}function yc(e){return e&&e!=="0%"}function Eo(e,t,r){var o=e-r,i=t*o;return r+i}function Cc(e,t,r,o,i){return i!==void 0&&(e=Eo(e,i,o)),Eo(e,r,o)+t}function aa(e,t,r,o,i){t===void 0&&(t=0),r===void 0&&(r=1),e.min=Cc(e.min,t,r,o,i),e.max=Cc(e.max,t,r,o,i)}function Cu(e,t){var r=t.x,o=t.y;aa(e.x,r.translate,r.scale,r.originPoint),aa(e.y,o.translate,o.scale,o.originPoint)}function sf(e,t,r,o){var i,a;o===void 0&&(o=!1);var c=r.length;if(c){t.x=t.y=1;for(var s,l,d=0;d<c;d++)s=r[d],l=s.projectionDelta,((a=(i=s.instance)===null||i===void 0?void 0:i.style)===null||a===void 0?void 0:a.display)!=="contents"&&(o&&s.options.layoutScroll&&s.scroll&&s!==s.root&&jn(e,{x:-s.scroll.x,y:-s.scroll.y}),l&&(t.x*=l.x.scale,t.y*=l.y.scale,Cu(e,l)),o&&Xt(s.latestValues)&&jn(e,s.latestValues))}}function Qt(e,t){e.min=e.min+t,e.max=e.max+t}function wc(e,t,r){var o=$e(r,3),i=o[0],a=o[1],c=o[2],s=t[c]!==void 0?t[c]:.5,l=De(e.min,e.max,s);aa(e,t[i],t[a],l,t.scale)}var cf=["x","scaleX","originX"],lf=["y","scaleY","originY"];function jn(e,t){wc(e.x,t,cf),wc(e.y,t,lf)}function wu(e,t){return bu(af(e.getBoundingClientRect(),t))}function df(e,t,r){var o=wu(e,r),i=t.scroll;return i&&(Qt(o.x,i.x),Qt(o.y,i.y)),o}var uf=new WeakMap,pf=(function(){function e(t){this.openGlobalLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Qe(),this.visualElement=t}return e.prototype.start=function(t,r){var o=this,i=r===void 0?{}:r,a=i.snapToCursor,c=a===void 0?!1:a;if(this.visualElement.isPresent!==!1){var s=function(p){o.stopAnimation(),c&&o.snapToCursor(Ka(p,"page").point)},l=function(p,h){var f,g=o.getProps(),m=g.drag,b=g.dragPropagation,y=g.onDragStart;m&&!b&&(o.openGlobalLock&&o.openGlobalLock(),o.openGlobalLock=Vd(m),!o.openGlobalLock)||(o.isDragging=!0,o.currentDirection=null,o.resolveConstraints(),o.visualElement.projection&&(o.visualElement.projection.isAnimationBlocked=!0,o.visualElement.projection.target=void 0),Rt(function(w){var C,k,x=o.getAxisMotionValue(w).get()||0;if(It.test(x)){var S=(k=(C=o.visualElement.projection)===null||C===void 0?void 0:C.layout)===null||k===void 0?void 0:k.actual[w];if(S){var O=Ht(S);x=O*(parseFloat(x)/100)}}o.originPoint[w]=x}),y?.(p,h),(f=o.visualElement.animationState)===null||f===void 0||f.setActive(Ie.Drag,!0))},d=function(p,h){var f=o.getProps(),g=f.dragPropagation,m=f.dragDirectionLock,b=f.onDirectionLock,y=f.onDrag;if(!(!g&&!o.openGlobalLock)){var w=h.offset;if(m&&o.currentDirection===null){o.currentDirection=hf(w),o.currentDirection!==null&&b?.(o.currentDirection);return}o.updateAxis("x",h.point,w),o.updateAxis("y",h.point,w),o.visualElement.syncRender(),y?.(p,h)}},u=function(p,h){return o.stop(p,h)};this.panSession=new mu(t,{onSessionStart:s,onStart:l,onMove:d,onSessionEnd:u},{transformPagePoint:this.visualElement.getTransformPagePoint()})}},e.prototype.stop=function(t,r){var o=this.isDragging;if(this.cancel(),!!o){var i=r.velocity;this.startAnimation(i);var a=this.getProps().onDragEnd;a?.(t,r)}},e.prototype.cancel=function(){var t,r;this.isDragging=!1,this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!1),(t=this.panSession)===null||t===void 0||t.end(),this.panSession=void 0;var o=this.getProps().dragPropagation;!o&&this.openGlobalLock&&(this.openGlobalLock(),this.openGlobalLock=null),(r=this.visualElement.animationState)===null||r===void 0||r.setActive(Ie.Drag,!1)},e.prototype.updateAxis=function(t,r,o){var i=this.getProps().drag;if(!(!o||!qr(t,i,this.currentDirection))){var a=this.getAxisMotionValue(t),c=this.originPoint[t]+o[t];this.constraints&&this.constraints[t]&&(c=Q2(c,this.constraints[t],this.elastic[t])),a.set(c)}},e.prototype.resolveConstraints=function(){var t=this,r=this.getProps(),o=r.dragConstraints,i=r.dragElastic,a=(this.visualElement.projection||{}).layout,c=this.constraints;o&&Sn(o)?this.constraints||(this.constraints=this.resolveRefConstraints()):o&&a?this.constraints=J2(a.actual,o):this.constraints=!1,this.elastic=rf(i),c!==this.constraints&&a&&this.constraints&&!this.hasMutatedConstraints&&Rt(function(s){t.getAxisMotionValue(s)&&(t.constraints[s]=nf(a.actual[s],t.constraints[s]))})},e.prototype.resolveRefConstraints=function(){var t=this.getProps(),r=t.dragConstraints,o=t.onMeasureDragConstraints;if(!r||!Sn(r))return!1;var i=r.current,a=this.visualElement.projection;if(!a||!a.layout)return!1;var c=df(i,a.root,this.visualElement.getTransformPagePoint()),s=ef(a.layout.actual,c);if(o){var l=o(of(s));this.hasMutatedConstraints=!!l,l&&(s=bu(l))}return s},e.prototype.startAnimation=function(t){var r=this,o=this.getProps(),i=o.drag,a=o.dragMomentum,c=o.dragElastic,s=o.dragTransition,l=o.dragSnapToOrigin,d=o.onDragTransitionEnd,u=this.constraints||{},p=Rt(function(h){var f;if(qr(h,i,r.currentDirection)){var g=(f=u?.[h])!==null&&f!==void 0?f:{};l&&(g={min:0,max:0});var m=c?200:1e6,b=c?40:1e7,y=z(z({type:"inertia",velocity:a?t[h]:0,bounceStiffness:m,bounceDamping:b,timeConstant:750,restDelta:1,restSpeed:10},s),g);return r.startAxisValueAnimation(h,y)}});return Promise.all(p).then(d)},e.prototype.startAxisValueAnimation=function(t,r){var o=this.getAxisMotionValue(t);return as(t,o,0,r)},e.prototype.stopAnimation=function(){var t=this;Rt(function(r){return t.getAxisMotionValue(r).stop()})},e.prototype.getAxisMotionValue=function(t){var r,o,i="_drag"+t.toUpperCase(),a=this.visualElement.getProps()[i];return a||this.visualElement.getValue(t,(o=(r=this.visualElement.getProps().initial)===null||r===void 0?void 0:r[t])!==null&&o!==void 0?o:0)},e.prototype.snapToCursor=function(t){var r=this;Rt(function(o){var i=r.getProps().drag;if(qr(o,i,r.currentDirection)){var a=r.visualElement.projection,c=r.getAxisMotionValue(o);if(a&&a.layout){var s=a.layout.actual[o],l=s.min,d=s.max;c.set(t[o]-De(l,d,.5))}}})},e.prototype.scalePositionWithinConstraints=function(){var t=this,r,o=this.getProps(),i=o.drag,a=o.dragConstraints,c=this.visualElement.projection;if(!(!Sn(a)||!c||!this.constraints)){this.stopAnimation();var s={x:0,y:0};Rt(function(d){var u=t.getAxisMotionValue(d);if(u){var p=u.get();s[d]=tf({min:p,max:p},t.constraints[d])}});var l=this.visualElement.getProps().transformTemplate;this.visualElement.getInstance().style.transform=l?l({},""):"none",(r=c.root)===null||r===void 0||r.updateScroll(),c.updateLayout(),this.resolveConstraints(),Rt(function(d){if(qr(d,i,null)){var u=t.getAxisMotionValue(d),p=t.constraints[d],h=p.min,f=p.max;u.set(De(h,f,s[d]))}})}},e.prototype.addListeners=function(){var t=this,r;uf.set(this.visualElement,this);var o=this.visualElement.getInstance(),i=On(o,"pointerdown",function(d){var u=t.getProps(),p=u.drag,h=u.dragListener,f=h===void 0?!0:h;p&&f&&t.start(d)}),a=function(){var d=t.getProps().dragConstraints;Sn(d)&&(t.constraints=t.resolveRefConstraints())},c=this.visualElement.projection,s=c.addEventListener("measure",a);c&&!c.layout&&((r=c.root)===null||r===void 0||r.updateScroll(),c.updateLayout()),a();var l=Ho(window,"resize",function(){return t.scalePositionWithinConstraints()});return c.addEventListener("didUpdate",(function(d){var u=d.delta,p=d.hasLayoutChanged;t.isDragging&&p&&(Rt(function(h){var f=t.getAxisMotionValue(h);f&&(t.originPoint[h]+=u[h].translate,f.set(f.get()+u[h].translate))}),t.visualElement.syncRender())})),function(){l(),i(),s()}},e.prototype.getProps=function(){var t=this.visualElement.getProps(),r=t.drag,o=r===void 0?!1:r,i=t.dragDirectionLock,a=i===void 0?!1:i,c=t.dragPropagation,s=c===void 0?!1:c,l=t.dragConstraints,d=l===void 0?!1:l,u=t.dragElastic,p=u===void 0?ia:u,h=t.dragMomentum,f=h===void 0?!0:h;return z(z({},t),{drag:o,dragDirectionLock:a,dragPropagation:s,dragConstraints:d,dragElastic:p,dragMomentum:f})},e})();function qr(e,t,r){return(t===!0||t===e)&&(r===null||r===e)}function hf(e,t){t===void 0&&(t=10);var r=null;return Math.abs(e.y)>t?r="y":Math.abs(e.x)>t&&(r="x"),r}function ff(e){var t=e.dragControls,r=e.visualElement,o=Wn(function(){return new pf(r)});v.useEffect(function(){return t&&t.subscribe(o)},[o,t]),v.useEffect(function(){return o.addListeners()},[o])}function gf(e){var t=e.onPan,r=e.onPanStart,o=e.onPanEnd,i=e.onPanSessionStart,a=e.visualElement,c=t||r||o||i,s=v.useRef(null),l=v.useContext(yr).transformPagePoint,d={onSessionStart:i,onStart:r,onMove:t,onEnd:function(p,h){s.current=null,o&&o(p,h)}};v.useEffect(function(){s.current!==null&&s.current.updateHandlers(d)});function u(p){s.current=new mu(p,d,{transformPagePoint:l})}xo(a,"pointerdown",c&&u),Ya(function(){return s.current&&s.current.end()})}var vf={pan:tn(gf),drag:tn(ff)},Zr=["LayoutMeasure","BeforeLayoutMeasure","LayoutUpdate","ViewportBoxUpdate","Update","Render","AnimationComplete","LayoutAnimationComplete","AnimationStart","LayoutAnimationStart","SetAxisTarget","Unmount"];function mf(){var e=Zr.map(function(){return new ir}),t={},r={clearAllListeners:function(){return e.forEach(function(o){return o.clear()})},updatePropListeners:function(o){Zr.forEach(function(i){var a,c="on"+i,s=o[c];(a=t[i])===null||a===void 0||a.call(t),s&&(t[i]=r[c](s))})}};return e.forEach(function(o,i){r["on"+Zr[i]]=function(a){return o.add(a)},r["notify"+Zr[i]]=function(){for(var a=[],c=0;c<arguments.length;c++)a[c]=arguments[c];return o.notify.apply(o,St([],$e(a),!1))}}),r}function xf(e,t,r){var o;for(var i in t){var a=t[i],c=r[i];if(Ut(a))e.addValue(i,a);else if(Ut(c))e.addValue(i,Nn(a));else if(c!==a)if(e.hasValue(i)){var s=e.getValue(i);!s.hasAnimated&&s.set(a)}else e.addValue(i,Nn((o=e.getStaticValue(i))!==null&&o!==void 0?o:a))}for(var i in r)t[i]===void 0&&e.removeValue(i);return t}var ku=function(e){var t=e.treeType,r=t===void 0?"":t,o=e.build,i=e.getBaseTarget,a=e.makeTargetAnimatable,c=e.measureViewportBox,s=e.render,l=e.readValueFromInstance,d=e.removeValueFromRenderState,u=e.sortNodePosition,p=e.scrapeMotionValuesFromProps;return function(h,f){var g=h.parent,m=h.props,b=h.presenceId,y=h.blockInitialAnimation,w=h.visualState,C=h.shouldReduceMotion;f===void 0&&(f={});var k=!1,x=w.latestValues,S=w.renderState,O,j=mf(),A=new Map,_=new Map,P={},D=z({},x),$;function q(){!O||!k||(B(),s(O,S,m.style,N.projection))}function B(){o(N,S,x,f,m)}function W(){j.notifyUpdate(x)}function H(R,M){var T=M.onChange(function(V){x[R]=V,m.onUpdate&&jt.update(W,!1,!0)}),oe=M.onRenderRequest(N.scheduleRender);_.set(R,function(){T(),oe()})}var K=p(m);for(var Y in K){var ue=K[Y];x[Y]!==void 0&&Ut(ue)&&ue.set(x[Y],!1)}var G=zo(m),I=hd(m),N=z(z({treeType:r,current:null,depth:g?g.depth+1:0,parent:g,children:new Set,presenceId:b,shouldReduceMotion:C,variantChildren:I?new Set:void 0,isVisible:void 0,manuallyAnimateOnMount:!!g?.isMounted(),blockInitialAnimation:y,isMounted:function(){return!!O},mount:function(R){k=!0,O=N.current=R,N.projection&&N.projection.mount(R),I&&g&&!G&&($=g?.addVariantChild(N)),A.forEach(function(M,T){return H(T,M)}),g?.children.add(N),N.setProps(m)},unmount:function(){var R;(R=N.projection)===null||R===void 0||R.unmount(),In.update(W),In.render(q),_.forEach(function(M){return M()}),$?.(),g?.children.delete(N),j.clearAllListeners(),O=void 0,k=!1},addVariantChild:function(R){var M,T=N.getClosestVariantNode();if(T)return(M=T.variantChildren)===null||M===void 0||M.add(R),function(){return T.variantChildren.delete(R)}},sortNodePosition:function(R){return!u||r!==R.treeType?0:u(N.getInstance(),R.getInstance())},getClosestVariantNode:function(){return I?N:g?.getClosestVariantNode()},getLayoutId:function(){return m.layoutId},getInstance:function(){return O},getStaticValue:function(R){return x[R]},setStaticValue:function(R,M){return x[R]=M},getLatestValues:function(){return x},setVisibility:function(R){N.isVisible!==R&&(N.isVisible=R,N.scheduleRender())},makeTargetAnimatable:function(R,M){return M===void 0&&(M=!0),a(N,R,m,M)},measureViewportBox:function(){return c(O,m)},addValue:function(R,M){N.hasValue(R)&&N.removeValue(R),A.set(R,M),x[R]=M.get(),H(R,M)},removeValue:function(R){var M;A.delete(R),(M=_.get(R))===null||M===void 0||M(),_.delete(R),delete x[R],d(R,S)},hasValue:function(R){return A.has(R)},getValue:function(R,M){var T=A.get(R);return T===void 0&&M!==void 0&&(T=Nn(M),N.addValue(R,T)),T},forEachValue:function(R){return A.forEach(R)},readValue:function(R){var M;return(M=x[R])!==null&&M!==void 0?M:l(O,R,f)},setBaseTarget:function(R,M){D[R]=M},getBaseTarget:function(R){if(i){var M=i(m,R);if(M!==void 0&&!Ut(M))return M}return D[R]}},j),{build:function(){return B(),S},scheduleRender:function(){jt.render(q,!1,!0)},syncRender:q,setProps:function(R){(R.transformTemplate||m.transformTemplate)&&N.scheduleRender(),m=R,j.updatePropListeners(R),P=xf(N,p(m),P)},getProps:function(){return m},getVariant:function(R){var M;return(M=m.variants)===null||M===void 0?void 0:M[R]},getDefaultTransition:function(){return m.transition},getTransformPagePoint:function(){return m.transformPagePoint},getVariantContext:function(R){if(R===void 0&&(R=!1),R)return g?.getVariantContext();if(!G){var M=g?.getVariantContext()||{};return m.initial!==void 0&&(M.initial=m.initial),M}for(var T={},oe=0;oe<bf;oe++){var V=Eu[oe],de=m[V];(wt(de)||de===!1)&&(T[V]=de)}return T}});return N}},Eu=St(["initial"],$e(ls),!1),bf=Eu.length;function sa(e){return typeof e=="string"&&e.startsWith("var(--")}var Su=/var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;function yf(e){var t=Su.exec(e);if(!t)return[,];var r=$e(t,3),o=r[1],i=r[2];return[o,i]}function ca(e,t,r){var o=$e(yf(e),2),i=o[0],a=o[1];if(i){var c=window.getComputedStyle(t).getPropertyValue(i);return c?c.trim():sa(a)?ca(a,t):a}}function Cf(e,t,r){var o,i=ct(t,[]),a=e.getInstance();if(!(a instanceof Element))return{target:i,transitionEnd:r};r&&(r=z({},r)),e.forEachValue(function(d){var u=d.get();if(sa(u)){var p=ca(u,a);p&&d.set(p)}});for(var c in i){var s=i[c];if(sa(s)){var l=ca(s,a);l&&(i[c]=l,r&&((o=r[c])!==null&&o!==void 0||(r[c]=s)))}}return{target:i,transitionEnd:r}}var wf=new Set(["width","height","top","left","right","bottom","x","y"]),ju=function(e){return wf.has(e)},kf=function(e){return Object.keys(e).some(ju)},_u=function(e,t){e.set(t,!1),e.set(t)},kc=function(e){return e===mn||e===le},Ec;(function(e){e.width="width",e.height="height",e.left="left",e.right="right",e.top="top",e.bottom="bottom"})(Ec||(Ec={}));var Sc=function(e,t){return parseFloat(e.split(", ")[t])},jc=function(e,t){return function(r,o){var i=o.transform;if(i==="none"||!i)return 0;var a=i.match(/^matrix3d\((.+)\)$/);if(a)return Sc(a[1],t);var c=i.match(/^matrix\((.+)\)$/);return c?Sc(c[1],e):0}},Ef=new Set(["x","y","z"]),Sf=Cr.filter(function(e){return!Ef.has(e)});function jf(e){var t=[];return Sf.forEach(function(r){var o=e.getValue(r);o!==void 0&&(t.push([r,o.get()]),o.set(r.startsWith("scale")?1:0))}),t.length&&e.syncRender(),t}var _c={width:function(e,t){var r=e.x,o=t.paddingLeft,i=o===void 0?"0":o,a=t.paddingRight,c=a===void 0?"0":a;return r.max-r.min-parseFloat(i)-parseFloat(c)},height:function(e,t){var r=e.y,o=t.paddingTop,i=o===void 0?"0":o,a=t.paddingBottom,c=a===void 0?"0":a;return r.max-r.min-parseFloat(i)-parseFloat(c)},top:function(e,t){var r=t.top;return parseFloat(r)},left:function(e,t){var r=t.left;return parseFloat(r)},bottom:function(e,t){var r=e.y,o=t.top;return parseFloat(o)+(r.max-r.min)},right:function(e,t){var r=e.x,o=t.left;return parseFloat(o)+(r.max-r.min)},x:jc(4,13),y:jc(5,14)},_f=function(e,t,r){var o=t.measureViewportBox(),i=t.getInstance(),a=getComputedStyle(i),c=a.display,s={};c==="none"&&t.setStaticValue("display",e.display||"block"),r.forEach(function(d){s[d]=_c[d](o,a)}),t.syncRender();var l=t.measureViewportBox();return r.forEach(function(d){var u=t.getValue(d);_u(u,s[d]),e[d]=_c[d](l,a)}),e},Af=function(e,t,r,o){r===void 0&&(r={}),o===void 0&&(o={}),t=z({},t),o=z({},o);var i=Object.keys(t).filter(ju),a=[],c=!1,s=[];if(i.forEach(function(u){var p=e.getValue(u);if(e.hasValue(u)){var h=r[u],f=Kn(h),g=t[u],m;if(kr(g)){var b=g.length,y=g[0]===null?1:0;h=g[y],f=Kn(h);for(var w=y;w<b;w++)m?fo(Kn(g[w])===m):m=Kn(g[w])}else m=Kn(g);if(f!==m)if(kc(f)&&kc(m)){var C=p.get();typeof C=="string"&&p.set(parseFloat(C)),typeof g=="string"?t[u]=parseFloat(g):Array.isArray(g)&&m===le&&(t[u]=g.map(parseFloat))}else f?.transform&&m?.transform&&(h===0||g===0)?h===0?p.set(m.transform(h)):t[u]=f.transform(g):(c||(a=jf(e),c=!0),s.push(u),o[u]=o[u]!==void 0?o[u]:t[u],_u(p,g))}}),s.length){var l=s.indexOf("height")>=0?window.pageYOffset:null,d=_f(t,e,s);return a.length&&a.forEach(function(u){var p=$e(u,2),h=p[0],f=p[1];e.getValue(h).set(f)}),e.syncRender(),l!==null&&window.scrollTo({top:l}),{target:d,transitionEnd:o}}else return{target:t,transitionEnd:o}};function Tf(e,t,r,o){return kf(t)?Af(e,t,r,o):{target:t,transitionEnd:o}}var Of=function(e,t,r,o){var i=Cf(e,t,o);return t=i.target,o=i.transitionEnd,Tf(e,t,r,o)};function Rf(e){return window.getComputedStyle(e)}var Au={treeType:"dom",readValueFromInstance:function(e,t){if(Ir(t)){var r=rs(t);return r&&r.default||0}else{var o=Rf(e);return(md(t)?o.getPropertyValue(t):o[t])||0}},sortNodePosition:function(e,t){return e.compareDocumentPosition(t)&2?1:-1},getBaseTarget:function(e,t){var r;return(r=e.style)===null||r===void 0?void 0:r[t]},measureViewportBox:function(e,t){var r=t.transformPagePoint;return wu(e,r)},resetTransform:function(e,t,r){var o=r.transformTemplate;t.style.transform=o?o({},""):"none",e.scheduleRender()},restoreTransform:function(e,t){e.style.transform=t.style.transform},removeValueFromRenderState:function(e,t){var r=t.vars,o=t.style;delete r[e],delete o[e]},makeTargetAnimatable:function(e,t,r,o){var i=r.transformValues;o===void 0&&(o=!0);var a=t.transition,c=t.transitionEnd,s=ct(t,["transition","transitionEnd"]),l=P2(s,a||{},e);if(i&&(c&&(c=i(c)),s&&(s=i(s)),l&&(l=i(l))),o){F2(e,s,l);var d=Of(e,s,l,c);c=d.transitionEnd,s=d.target}return z({transition:a,transitionEnd:c},s)},scrapeMotionValuesFromProps:qa,build:function(e,t,r,o,i){e.isVisible!==void 0&&(t.style.visibility=e.isVisible?"visible":"hidden"),za(t,r,o,i.transformTemplate)},render:Rd},Lf=ku(Au),If=ku(z(z({},Au),{getBaseTarget:function(e,t){return e[t]},readValueFromInstance:function(e,t){var r;return Ir(t)?((r=rs(t))===null||r===void 0?void 0:r.default)||0:(t=Ld.has(t)?t:Od(t),e.getAttribute(t))},scrapeMotionValuesFromProps:Nd,build:function(e,t,r,o,i){Ga(t,r,o,i.transformTemplate)},render:Id})),Nf=function(e,t){return Va(e)?If(t,{enableHardwareAcceleration:!1}):Lf(t,{enableHardwareAcceleration:!0})};function Ac(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}var Yn={correct:function(e,t){if(!t.target)return e;if(typeof e=="string")if(le.test(e))e=parseFloat(e);else return e;var r=Ac(e,t.target.x),o=Ac(e,t.target.y);return"".concat(r,"% ").concat(o,"%")}},Tc="_$css",Ff={correct:function(e,t){var r=t.treeScale,o=t.projectionDelta,i=e,a=e.includes("var("),c=[];a&&(e=e.replace(Su,function(m){return c.push(m),Tc}));var s=zt.parse(e);if(s.length>5)return i;var l=zt.createTransformer(e),d=typeof s[0]!="number"?1:0,u=o.x.scale*r.x,p=o.y.scale*r.y;s[0+d]/=u,s[1+d]/=p;var h=De(u,p,.5);typeof s[2+d]=="number"&&(s[2+d]/=h),typeof s[3+d]=="number"&&(s[3+d]/=h);var f=l(s);if(a){var g=0;f=f.replace(Tc,function(){var m=c[g];return g++,m})}return f}},Mf=(function(e){Jl(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.componentDidMount=function(){var r=this,o=this.props,i=o.visualElement,a=o.layoutGroup,c=o.switchLayoutGroup,s=o.layoutId,l=i.projection;cp(Df),l&&(a?.group&&a.group.add(l),c?.register&&s&&c.register(l),l.root.didUpdate(),l.addEventListener("animationComplete",function(){r.safeToRemove()}),l.setOptions(z(z({},l.options),{onExitComplete:function(){return r.safeToRemove()}}))),nr.hasEverUpdated=!0},t.prototype.getSnapshotBeforeUpdate=function(r){var o=this,i=this.props,a=i.layoutDependency,c=i.visualElement,s=i.drag,l=i.isPresent,d=c.projection;return d&&(d.isPresent=l,s||r.layoutDependency!==a||a===void 0?d.willUpdate():this.safeToRemove(),r.isPresent!==l&&(l?d.promote():d.relegate()||jt.postRender(function(){var u;!((u=d.getStack())===null||u===void 0)&&u.members.length||o.safeToRemove()}))),null},t.prototype.componentDidUpdate=function(){var r=this.props.visualElement.projection;r&&(r.root.didUpdate(),!r.currentAnimation&&r.isLead()&&this.safeToRemove())},t.prototype.componentWillUnmount=function(){var r=this.props,o=r.visualElement,i=r.layoutGroup,a=r.switchLayoutGroup,c=o.projection;c&&(c.scheduleCheckAfterUnmount(),i?.group&&i.group.remove(c),a?.deregister&&a.deregister(c))},t.prototype.safeToRemove=function(){var r=this.props.safeToRemove;r?.()},t.prototype.render=function(){return null},t})(fe.Component);function Pf(e){var t=$e(pu(),2),r=t[0],o=t[1],i=v.useContext(Wa);return fe.createElement(Mf,z({},e,{layoutGroup:i,switchLayoutGroup:v.useContext(fd),isPresent:r,safeToRemove:o}))}var Df={borderRadius:z(z({},Yn),{applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]}),borderTopLeftRadius:Yn,borderTopRightRadius:Yn,borderBottomLeftRadius:Yn,borderBottomRightRadius:Yn,boxShadow:Ff},$f={measureLayout:Pf};function Bf(e,t,r){r===void 0&&(r={});var o=Ut(e)?e:Nn(e);return as("",o,t,r),{stop:function(){return o.stop()},isAnimating:function(){return o.isAnimating()}}}var Tu=["TopLeft","TopRight","BottomLeft","BottomRight"],Wf=Tu.length,Oc=function(e){return typeof e=="string"?parseFloat(e):e},Rc=function(e){return typeof e=="number"||le.test(e)};function Vf(e,t,r,o,i,a){var c,s,l,d;i?(e.opacity=De(0,(c=r.opacity)!==null&&c!==void 0?c:1,Uf(o)),e.opacityExit=De((s=t.opacity)!==null&&s!==void 0?s:1,0,zf(o))):a&&(e.opacity=De((l=t.opacity)!==null&&l!==void 0?l:1,(d=r.opacity)!==null&&d!==void 0?d:1,o));for(var u=0;u<Wf;u++){var p="border".concat(Tu[u],"Radius"),h=Lc(t,p),f=Lc(r,p);if(!(h===void 0&&f===void 0)){h||(h=0),f||(f=0);var g=h===0||f===0||Rc(h)===Rc(f);g?(e[p]=Math.max(De(Oc(h),Oc(f),o),0),(It.test(f)||It.test(h))&&(e[p]+="%")):e[p]=f}}(t.rotate||r.rotate)&&(e.rotate=De(t.rotate||0,r.rotate||0,o))}function Lc(e,t){var r;return(r=e[t])!==null&&r!==void 0?r:e.borderRadius}var Uf=Ou(0,.5,ts),zf=Ou(.5,.95,Ja);function Ou(e,t,r){return function(o){return o<e?0:o>t?1:r(Er(e,t,o))}}function Ic(e,t){e.min=t.min,e.max=t.max}function yt(e,t){Ic(e.x,t.x),Ic(e.y,t.y)}function Nc(e,t,r,o,i){return e-=t,e=Eo(e,1/r,o),i!==void 0&&(e=Eo(e,1/i,o)),e}function Hf(e,t,r,o,i,a,c){if(t===void 0&&(t=0),r===void 0&&(r=1),o===void 0&&(o=.5),a===void 0&&(a=e),c===void 0&&(c=e),It.test(t)){t=parseFloat(t);var s=De(c.min,c.max,t/100);t=s-c.min}if(typeof t=="number"){var l=De(a.min,a.max,o);e===a&&(l-=t),e.min=Nc(e.min,t,r,l,i),e.max=Nc(e.max,t,r,l,i)}}function Fc(e,t,r,o,i){var a=$e(r,3),c=a[0],s=a[1],l=a[2];Hf(e,t[c],t[s],t[l],t.scale,o,i)}var Gf=["x","scaleX","originX"],qf=["y","scaleY","originY"];function Mc(e,t,r,o){Fc(e.x,t,Gf,r?.x,o?.x),Fc(e.y,t,qf,r?.y,o?.y)}function Pc(e){return e.translate===0&&e.scale===1}function Ru(e){return Pc(e.x)&&Pc(e.y)}function Lu(e,t){return e.x.min===t.x.min&&e.x.max===t.x.max&&e.y.min===t.y.min&&e.y.max===t.y.max}var Zf=(function(){function e(){this.members=[]}return e.prototype.add=function(t){ss(this.members,t),t.scheduleRender()},e.prototype.remove=function(t){if(cs(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){var r=this.members[this.members.length-1];r&&this.promote(r)}},e.prototype.relegate=function(t){var r=this.members.findIndex(function(c){return t===c});if(r===0)return!1;for(var o,i=r;i>=0;i--){var a=this.members[i];if(a.isPresent!==!1){o=a;break}}return o?(this.promote(o),!0):!1},e.prototype.promote=function(t,r){var o,i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.instance&&i.scheduleRender(),t.scheduleRender(),t.resumeFrom=i,r&&(t.resumeFrom.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues,t.snapshot.isShared=!0),!((o=t.root)===null||o===void 0)&&o.isUpdating&&(t.isLayoutDirty=!0);var a=t.options.crossfade;a===!1&&i.hide()}},e.prototype.exitAnimationComplete=function(){this.members.forEach(function(t){var r,o,i,a,c;(o=(r=t.options).onExitComplete)===null||o===void 0||o.call(r),(c=(i=t.resumingFrom)===null||i===void 0?void 0:(a=i.options).onExitComplete)===null||c===void 0||c.call(a)})},e.prototype.scheduleRender=function(){this.members.forEach(function(t){t.instance&&t.scheduleRender(!1)})},e.prototype.removeLeadSnapshot=function(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)},e})(),Kf="translate3d(0px, 0px, 0) scale(1, 1) scale(1, 1)";function Dc(e,t,r){var o=e.x.translate/t.x,i=e.y.translate/t.y,a="translate3d(".concat(o,"px, ").concat(i,"px, 0) ");if(a+="scale(".concat(1/t.x,", ").concat(1/t.y,") "),r){var c=r.rotate,s=r.rotateX,l=r.rotateY;c&&(a+="rotate(".concat(c,"deg) ")),s&&(a+="rotateX(".concat(s,"deg) ")),l&&(a+="rotateY(".concat(l,"deg) "))}var d=e.x.scale*t.x,u=e.y.scale*t.y;return a+="scale(".concat(d,", ").concat(u,")"),a===Kf?"none":a}var Yf=function(e,t){return e.depth-t.depth},Xf=(function(){function e(){this.children=[],this.isDirty=!1}return e.prototype.add=function(t){ss(this.children,t),this.isDirty=!0},e.prototype.remove=function(t){cs(this.children,t),this.isDirty=!0},e.prototype.forEach=function(t){this.isDirty&&this.children.sort(Yf),this.isDirty=!1,this.children.forEach(t)},e})(),$c=1e3;function Iu(e){var t=e.attachResizeListener,r=e.defaultParent,o=e.measureScroll,i=e.checkIsScrollRoot,a=e.resetTransform;return(function(){function c(s,l,d){var u=this;l===void 0&&(l={}),d===void 0&&(d=r?.()),this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.potentialNodes=new Map,this.checkUpdateFailed=function(){u.isUpdating&&(u.isUpdating=!1,u.clearAllSnapshots())},this.updateProjection=function(){u.nodes.forEach(r5),u.nodes.forEach(o5)},this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.id=s,this.latestValues=l,this.root=d?d.root||d:this,this.path=d?St(St([],$e(d.path),!1),[d],!1):[],this.parent=d,this.depth=d?d.depth+1:0,s&&this.root.registerPotentialNode(s,this);for(var p=0;p<this.path.length;p++)this.path[p].shouldResetTransform=!0;this.root===this&&(this.nodes=new Xf)}return c.prototype.addEventListener=function(s,l){return this.eventHandlers.has(s)||this.eventHandlers.set(s,new ir),this.eventHandlers.get(s).add(l)},c.prototype.notifyListeners=function(s){for(var l=[],d=1;d<arguments.length;d++)l[d-1]=arguments[d];var u=this.eventHandlers.get(s);u?.notify.apply(u,St([],$e(l),!1))},c.prototype.hasListeners=function(s){return this.eventHandlers.has(s)},c.prototype.registerPotentialNode=function(s,l){this.potentialNodes.set(s,l)},c.prototype.mount=function(s,l){var d=this,u;if(l===void 0&&(l=!1),!this.instance){this.isSVG=s instanceof SVGElement&&s.tagName!=="svg",this.instance=s;var p=this.options,h=p.layoutId,f=p.layout,g=p.visualElement;if(g&&!g.getInstance()&&g.mount(s),this.root.nodes.add(this),(u=this.parent)===null||u===void 0||u.children.add(this),this.id&&this.root.potentialNodes.delete(this.id),l&&(f||h)&&(this.isLayoutDirty=!0),t){var m,b=function(){return d.root.updateBlockedByResize=!1};t(s,function(){d.root.updateBlockedByResize=!0,clearTimeout(m),m=window.setTimeout(b,250),nr.hasAnimatedSinceResize&&(nr.hasAnimatedSinceResize=!1,d.nodes.forEach(n5))})}h&&this.root.registerSharedNode(h,this),this.options.animate!==!1&&g&&(h||f)&&this.addEventListener("didUpdate",function(y){var w,C,k,x,S,O=y.delta,j=y.hasLayoutChanged,A=y.hasRelativeTargetChanged,_=y.layout;if(d.isTreeAnimationBlocked()){d.target=void 0,d.relativeTarget=void 0;return}var P=(C=(w=d.options.transition)!==null&&w!==void 0?w:g.getDefaultTransition())!==null&&C!==void 0?C:l5,D=g.getProps(),$=D.onLayoutAnimationStart,q=D.onLayoutAnimationComplete,B=!d.targetLayout||!Lu(d.targetLayout,_)||A,W=!j&&A;if(!((k=d.resumeFrom)===null||k===void 0)&&k.instance||W||j&&(B||!d.currentAnimation)){d.resumeFrom&&(d.resumingFrom=d.resumeFrom,d.resumingFrom.resumingFrom=void 0),d.setAnimationOrigin(O,W);var H=z(z({},is(P,"layout")),{onPlay:$,onComplete:q});g.shouldReduceMotion&&(H.delay=0,H.type=!1),d.startAnimation(H)}else!j&&d.animationProgress===0&&d.finishAnimation(),d.isLead()&&((S=(x=d.options).onExitComplete)===null||S===void 0||S.call(x));d.targetLayout=_})}},c.prototype.unmount=function(){var s,l;this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this),(s=this.getStack())===null||s===void 0||s.remove(this),(l=this.parent)===null||l===void 0||l.children.delete(this),this.instance=void 0,In.preRender(this.updateProjection)},c.prototype.blockUpdate=function(){this.updateManuallyBlocked=!0},c.prototype.unblockUpdate=function(){this.updateManuallyBlocked=!1},c.prototype.isUpdateBlocked=function(){return this.updateManuallyBlocked||this.updateBlockedByResize},c.prototype.isTreeAnimationBlocked=function(){var s;return this.isAnimationBlocked||((s=this.parent)===null||s===void 0?void 0:s.isTreeAnimationBlocked())||!1},c.prototype.startUpdate=function(){var s;this.isUpdateBlocked()||(this.isUpdating=!0,(s=this.nodes)===null||s===void 0||s.forEach(i5))},c.prototype.willUpdate=function(s){var l,d,u;if(s===void 0&&(s=!0),this.root.isUpdateBlocked()){(d=(l=this.options).onExitComplete)===null||d===void 0||d.call(l);return}if(!this.root.isUpdating&&this.root.startUpdate(),!this.isLayoutDirty){this.isLayoutDirty=!0;for(var p=0;p<this.path.length;p++){var h=this.path[p];h.shouldResetTransform=!0,h.updateScroll()}var f=this.options,g=f.layoutId,m=f.layout;if(!(g===void 0&&!m)){var b=(u=this.options.visualElement)===null||u===void 0?void 0:u.getProps().transformTemplate;this.prevTransformTemplateValue=b?.(this.latestValues,""),this.updateSnapshot(),s&&this.notifyListeners("willUpdate")}}},c.prototype.didUpdate=function(){var s=this.isUpdateBlocked();if(s){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(Bc);return}this.isUpdating&&(this.isUpdating=!1,this.potentialNodes.size&&(this.potentialNodes.forEach(d5),this.potentialNodes.clear()),this.nodes.forEach(t5),this.nodes.forEach(Qf),this.nodes.forEach(Jf),this.clearAllSnapshots(),li.update(),li.preRender(),li.render())},c.prototype.clearAllSnapshots=function(){this.nodes.forEach(e5),this.sharedNodes.forEach(a5)},c.prototype.scheduleUpdateProjection=function(){jt.preRender(this.updateProjection,!1,!0)},c.prototype.scheduleCheckAfterUnmount=function(){var s=this;jt.postRender(function(){s.isLayoutDirty?s.root.didUpdate():s.root.checkUpdateFailed()})},c.prototype.updateSnapshot=function(){if(!(this.snapshot||!this.instance)){var s=this.measure(),l=this.removeTransform(this.removeElementScroll(s));zc(l),this.snapshot={measured:s,layout:l,latestValues:{}}}},c.prototype.updateLayout=function(){var s;if(this.instance&&(this.updateScroll(),!(!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))){if(this.resumeFrom&&!this.resumeFrom.instance)for(var l=0;l<this.path.length;l++){var d=this.path[l];d.updateScroll()}var u=this.measure();zc(u);var p=this.layout;this.layout={measured:u,actual:this.removeElementScroll(u)},this.layoutCorrected=Qe(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.actual),(s=this.options.visualElement)===null||s===void 0||s.notifyLayoutMeasure(this.layout.actual,p?.actual)}},c.prototype.updateScroll=function(){this.options.layoutScroll&&this.instance&&(this.isScrollRoot=i(this.instance),this.scroll=o(this.instance))},c.prototype.resetTransform=function(){var s;if(a){var l=this.isLayoutDirty||this.shouldResetTransform,d=this.projectionDelta&&!Ru(this.projectionDelta),u=(s=this.options.visualElement)===null||s===void 0?void 0:s.getProps().transformTemplate,p=u?.(this.latestValues,""),h=p!==this.prevTransformTemplateValue;l&&(d||Xt(this.latestValues)||h)&&(a(this.instance,p),this.shouldResetTransform=!1,this.scheduleRender())}},c.prototype.measure=function(){var s=this.options.visualElement;if(!s)return Qe();var l=s.measureViewportBox(),d=this.root.scroll;return d&&(Qt(l.x,d.x),Qt(l.y,d.y)),l},c.prototype.removeElementScroll=function(s){var l=Qe();yt(l,s);for(var d=0;d<this.path.length;d++){var u=this.path[d],p=u.scroll,h=u.options,f=u.isScrollRoot;if(u!==this.root&&p&&h.layoutScroll){if(f){yt(l,s);var g=this.root.scroll;g&&(Qt(l.x,-g.x),Qt(l.y,-g.y))}Qt(l.x,p.x),Qt(l.y,p.y)}}return l},c.prototype.applyTransform=function(s,l){l===void 0&&(l=!1);var d=Qe();yt(d,s);for(var u=0;u<this.path.length;u++){var p=this.path[u];!l&&p.options.layoutScroll&&p.scroll&&p!==p.root&&jn(d,{x:-p.scroll.x,y:-p.scroll.y}),Xt(p.latestValues)&&jn(d,p.latestValues)}return Xt(this.latestValues)&&jn(d,this.latestValues),d},c.prototype.removeTransform=function(s){var l,d=Qe();yt(d,s);for(var u=0;u<this.path.length;u++){var p=this.path[u];if(p.instance&&Xt(p.latestValues)){yu(p.latestValues)&&p.updateSnapshot();var h=Qe(),f=p.measure();yt(h,f),Mc(d,p.latestValues,(l=p.snapshot)===null||l===void 0?void 0:l.layout,h)}}return Xt(this.latestValues)&&Mc(d,this.latestValues),d},c.prototype.setTargetDelta=function(s){this.targetDelta=s,this.root.scheduleUpdateProjection()},c.prototype.setOptions=function(s){var l;this.options=z(z(z({},this.options),s),{crossfade:(l=s.crossfade)!==null&&l!==void 0?l:!0})},c.prototype.clearMeasurements=function(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1},c.prototype.resolveTargetDelta=function(){var s,l=this.options,d=l.layout,u=l.layoutId;!this.layout||!(d||u)||(!this.targetDelta&&!this.relativeTarget&&(this.relativeParent=this.getClosestProjectingParent(),this.relativeParent&&this.relativeParent.layout&&(this.relativeTarget=Qe(),this.relativeTargetOrigin=Qe(),sr(this.relativeTargetOrigin,this.layout.actual,this.relativeParent.layout.actual),yt(this.relativeTarget,this.relativeTargetOrigin))),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=Qe(),this.targetWithTransforms=Qe()),this.relativeTarget&&this.relativeTargetOrigin&&(!((s=this.relativeParent)===null||s===void 0)&&s.target)?X2(this.target,this.relativeTarget,this.relativeParent.target):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.actual):yt(this.target,this.layout.actual),Cu(this.target,this.targetDelta)):yt(this.target,this.layout.actual),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.relativeParent=this.getClosestProjectingParent(),this.relativeParent&&!!this.relativeParent.resumingFrom==!!this.resumingFrom&&!this.relativeParent.options.layoutScroll&&this.relativeParent.target&&(this.relativeTarget=Qe(),this.relativeTargetOrigin=Qe(),sr(this.relativeTargetOrigin,this.target,this.relativeParent.target),yt(this.relativeTarget,this.relativeTargetOrigin)))))},c.prototype.getClosestProjectingParent=function(){if(!(!this.parent||Xt(this.parent.latestValues)))return(this.parent.relativeTarget||this.parent.targetDelta)&&this.parent.layout?this.parent:this.parent.getClosestProjectingParent()},c.prototype.calcProjection=function(){var s,l=this.options,d=l.layout,u=l.layoutId;if(this.isTreeAnimating=!!(!((s=this.parent)===null||s===void 0)&&s.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!(!this.layout||!(d||u))){var p=this.getLead();yt(this.layoutCorrected,this.layout.actual),sf(this.layoutCorrected,this.treeScale,this.path,!!this.resumingFrom||this!==p);var h=p.target;if(h){this.projectionDelta||(this.projectionDelta=cr(),this.projectionDeltaWithTransform=cr());var f=this.treeScale.x,g=this.treeScale.y,m=this.projectionTransform;ar(this.projectionDelta,this.layoutCorrected,h,this.latestValues),this.projectionTransform=Dc(this.projectionDelta,this.treeScale),(this.projectionTransform!==m||this.treeScale.x!==f||this.treeScale.y!==g)&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",h))}}},c.prototype.hide=function(){this.isVisible=!1},c.prototype.show=function(){this.isVisible=!0},c.prototype.scheduleRender=function(s){var l,d,u;s===void 0&&(s=!0),(d=(l=this.options).scheduleRender)===null||d===void 0||d.call(l),s&&((u=this.getStack())===null||u===void 0||u.scheduleRender()),this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)},c.prototype.setAnimationOrigin=function(s,l){var d=this,u;l===void 0&&(l=!1);var p=this.snapshot,h=p?.latestValues||{},f=z({},this.latestValues),g=cr();this.relativeTarget=this.relativeTargetOrigin=void 0,this.attemptToResolveRelativeTarget=!l;var m=Qe(),b=p?.isShared,y=(((u=this.getStack())===null||u===void 0?void 0:u.members.length)||0)<=1,w=!!(b&&!y&&this.options.crossfade===!0&&!this.path.some(c5));this.animationProgress=0,this.mixTargetDelta=function(C){var k,x=C/1e3;Wc(g.x,s.x,x),Wc(g.y,s.y,x),d.setTargetDelta(g),d.relativeTarget&&d.relativeTargetOrigin&&d.layout&&(!((k=d.relativeParent)===null||k===void 0)&&k.layout)&&(sr(m,d.layout.actual,d.relativeParent.layout.actual),s5(d.relativeTarget,d.relativeTargetOrigin,m,x)),b&&(d.animationValues=f,Vf(f,h,d.latestValues,x,w,y)),d.root.scheduleUpdateProjection(),d.scheduleRender(),d.animationProgress=x},this.mixTargetDelta(0)},c.prototype.startAnimation=function(s){var l=this,d,u;this.notifyListeners("animationStart"),(d=this.currentAnimation)===null||d===void 0||d.stop(),this.resumingFrom&&((u=this.resumingFrom.currentAnimation)===null||u===void 0||u.stop()),this.pendingAnimation&&(In.update(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=jt.update(function(){nr.hasAnimatedSinceResize=!0,l.currentAnimation=Bf(0,$c,z(z({},s),{onUpdate:function(p){var h;l.mixTargetDelta(p),(h=s.onUpdate)===null||h===void 0||h.call(s,p)},onComplete:function(){var p;(p=s.onComplete)===null||p===void 0||p.call(s),l.completeAnimation()}})),l.resumingFrom&&(l.resumingFrom.currentAnimation=l.currentAnimation),l.pendingAnimation=void 0})},c.prototype.completeAnimation=function(){var s;this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0),(s=this.getStack())===null||s===void 0||s.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")},c.prototype.finishAnimation=function(){var s;this.currentAnimation&&((s=this.mixTargetDelta)===null||s===void 0||s.call(this,$c),this.currentAnimation.stop()),this.completeAnimation()},c.prototype.applyTransformsToTarget=function(){var s=this.getLead(),l=s.targetWithTransforms,d=s.target,u=s.layout,p=s.latestValues;!l||!d||!u||(yt(l,d),jn(l,p),ar(this.projectionDeltaWithTransform,this.layoutCorrected,l,p))},c.prototype.registerSharedNode=function(s,l){var d,u,p;this.sharedNodes.has(s)||this.sharedNodes.set(s,new Zf);var h=this.sharedNodes.get(s);h.add(l),l.promote({transition:(d=l.options.initialPromotionConfig)===null||d===void 0?void 0:d.transition,preserveFollowOpacity:(p=(u=l.options.initialPromotionConfig)===null||u===void 0?void 0:u.shouldPreserveFollowOpacity)===null||p===void 0?void 0:p.call(u,l)})},c.prototype.isLead=function(){var s=this.getStack();return s?s.lead===this:!0},c.prototype.getLead=function(){var s,l=this.options.layoutId;return l?((s=this.getStack())===null||s===void 0?void 0:s.lead)||this:this},c.prototype.getPrevLead=function(){var s,l=this.options.layoutId;return l?(s=this.getStack())===null||s===void 0?void 0:s.prevLead:void 0},c.prototype.getStack=function(){var s=this.options.layoutId;if(s)return this.root.sharedNodes.get(s)},c.prototype.promote=function(s){var l=s===void 0?{}:s,d=l.needsReset,u=l.transition,p=l.preserveFollowOpacity,h=this.getStack();h&&h.promote(this,p),d&&(this.projectionDelta=void 0,this.needsReset=!0),u&&this.setOptions({transition:u})},c.prototype.relegate=function(){var s=this.getStack();return s?s.relegate(this):!1},c.prototype.resetRotation=function(){var s=this.options.visualElement;if(s){for(var l=!1,d={},u=0;u<qi.length;u++){var p=qi[u],h="rotate"+p;s.getStaticValue(h)&&(l=!0,d[h]=s.getStaticValue(h),s.setStaticValue(h,0))}if(l){s?.syncRender();for(var h in d)s.setStaticValue(h,d[h]);s.scheduleRender()}}},c.prototype.getProjectionStyles=function(s){var l,d,u,p,h,f;s===void 0&&(s={});var g={};if(!this.instance||this.isSVG)return g;if(this.isVisible)g.visibility="";else return{visibility:"hidden"};var m=(l=this.options.visualElement)===null||l===void 0?void 0:l.getProps().transformTemplate;if(this.needsReset)return this.needsReset=!1,g.opacity="",g.pointerEvents=oo(s.pointerEvents)||"",g.transform=m?m(this.latestValues,""):"none",g;var b=this.getLead();if(!this.projectionDelta||!this.layout||!b.target){var y={};return this.options.layoutId&&(y.opacity=(d=this.latestValues.opacity)!==null&&d!==void 0?d:1,y.pointerEvents=oo(s.pointerEvents)||""),this.hasProjected&&!Xt(this.latestValues)&&(y.transform=m?m({},""):"none",this.hasProjected=!1),y}var w=b.animationValues||b.latestValues;this.applyTransformsToTarget(),g.transform=Dc(this.projectionDeltaWithTransform,this.treeScale,w),m&&(g.transform=m(w,g.transform));var C=this.projectionDelta,k=C.x,x=C.y;g.transformOrigin="".concat(k.origin*100,"% ").concat(x.origin*100,"% 0"),b.animationValues?g.opacity=b===this?(p=(u=w.opacity)!==null&&u!==void 0?u:this.latestValues.opacity)!==null&&p!==void 0?p:1:this.preserveOpacity?this.latestValues.opacity:w.opacityExit:g.opacity=b===this?(h=w.opacity)!==null&&h!==void 0?h:"":(f=w.opacityExit)!==null&&f!==void 0?f:0;for(var S in vo)if(w[S]!==void 0){var O=vo[S],j=O.correct,A=O.applyTo,_=j(w[S],b);if(A)for(var P=A.length,D=0;D<P;D++)g[A[D]]=_;else g[S]=_}return this.options.layoutId&&(g.pointerEvents=b===this?oo(s.pointerEvents)||"":"none"),g},c.prototype.clearSnapshot=function(){this.resumeFrom=this.snapshot=void 0},c.prototype.resetTree=function(){this.root.nodes.forEach(function(s){var l;return(l=s.currentAnimation)===null||l===void 0?void 0:l.stop()}),this.root.nodes.forEach(Bc),this.root.sharedNodes.clear()},c})()}function Qf(e){e.updateLayout()}function Jf(e){var t,r,o,i,a=(r=(t=e.resumeFrom)===null||t===void 0?void 0:t.snapshot)!==null&&r!==void 0?r:e.snapshot;if(e.isLead()&&e.layout&&a&&e.hasListeners("didUpdate")){var c=e.layout,s=c.actual,l=c.measured;e.options.animationType==="size"?Rt(function(w){var C=a.isShared?a.measured[w]:a.layout[w],k=Ht(C);C.min=s[w].min,C.max=C.min+k}):e.options.animationType==="position"&&Rt(function(w){var C=a.isShared?a.measured[w]:a.layout[w],k=Ht(s[w]);C.max=C.min+k});var d=cr();ar(d,s,a.layout);var u=cr();a.isShared?ar(u,e.applyTransform(l,!0),a.measured):ar(u,s,a.layout);var p=!Ru(d),h=!1;if(!e.resumeFrom&&(e.relativeParent=e.getClosestProjectingParent(),e.relativeParent&&!e.relativeParent.resumeFrom)){var f=e.relativeParent,g=f.snapshot,m=f.layout;if(g&&m){var b=Qe();sr(b,a.layout,g.layout);var y=Qe();sr(y,s,m.actual),Lu(b,y)||(h=!0)}}e.notifyListeners("didUpdate",{layout:s,snapshot:a,delta:u,layoutDelta:d,hasLayoutChanged:p,hasRelativeTargetChanged:h})}else e.isLead()&&((i=(o=e.options).onExitComplete)===null||i===void 0||i.call(o));e.options.transition=void 0}function e5(e){e.clearSnapshot()}function Bc(e){e.clearMeasurements()}function t5(e){var t=e.options.visualElement;t?.getProps().onBeforeLayoutMeasure&&t.notifyBeforeLayoutMeasure(),e.resetTransform()}function n5(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0}function r5(e){e.resolveTargetDelta()}function o5(e){e.calcProjection()}function i5(e){e.resetRotation()}function a5(e){e.removeLeadSnapshot()}function Wc(e,t,r){e.translate=De(t.translate,0,r),e.scale=De(t.scale,1,r),e.origin=t.origin,e.originPoint=t.originPoint}function Vc(e,t,r,o){e.min=De(t.min,r.min,o),e.max=De(t.max,r.max,o)}function s5(e,t,r,o){Vc(e.x,t.x,r.x,o),Vc(e.y,t.y,r.y,o)}function c5(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}var l5={duration:.45,ease:[.4,0,.1,1]};function d5(e,t){for(var r=e.root,o=e.path.length-1;o>=0;o--)if(e.path[o].instance){r=e.path[o];break}var i=r&&r!==e.root?r.instance:document,a=i.querySelector('[data-projection-id="'.concat(t,'"]'));a&&e.mount(a,!0)}function Uc(e){e.min=Math.round(e.min),e.max=Math.round(e.max)}function zc(e){Uc(e.x),Uc(e.y)}var u5=Iu({attachResizeListener:function(e,t){return Ho(e,"resize",t)},measureScroll:function(){return{x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}},checkIsScrollRoot:function(){return!0}}),gi={current:void 0},p5=Iu({measureScroll:function(e){return{x:e.scrollLeft,y:e.scrollTop}},defaultParent:function(){if(!gi.current){var e=new u5(0,{});e.mount(window),e.setOptions({layoutScroll:!0}),gi.current=e}return gi.current},resetTransform:function(e,t){e.style.transform=t??"none"},checkIsScrollRoot:function(e){return window.getComputedStyle(e).position==="fixed"}}),h5=z(z(z(z({},Z2),p2),vf),$f),F=ap(function(e,t){return zp(e,t,h5,Nf,p5)});function Nu(){var e=v.useRef(!1);return go(function(){return e.current=!0,function(){e.current=!1}},[]),e}function f5(){var e=Nu(),t=$e(v.useState(0),2),r=t[0],o=t[1],i=v.useCallback(function(){e.current&&o(r+1)},[r]),a=v.useCallback(function(){return jt.postRender(i)},[i]);return[a,r]}var vi=function(e){var t=e.children,r=e.initial,o=e.isPresent,i=e.onExitComplete,a=e.custom,c=e.presenceAffectsLayout,s=Wn(g5),l=uu(),d=v.useMemo(function(){return{id:l,initial:r,isPresent:o,custom:a,onExitComplete:function(u){var p,h;s.set(u,!0);try{for(var f=h1(s.values()),g=f.next();!g.done;g=f.next()){var m=g.value;if(!m)return}}catch(b){p={error:b}}finally{try{g&&!g.done&&(h=f.return)&&h.call(f)}finally{if(p)throw p.error}}i?.()},register:function(u){return s.set(u,!1),function(){return s.delete(u)}}}},c?void 0:[o]);return v.useMemo(function(){s.forEach(function(u,p){return s.set(p,!1)})},[o]),v.useEffect(function(){!o&&!s.size&&i?.()},[o]),v.createElement(Lr.Provider,{value:d},t)};function g5(){return new Map}var yn=function(e){return e.key||""};function v5(e,t){e.forEach(function(r){var o=yn(r);t.set(o,r)})}function m5(e){var t=[];return v.Children.forEach(e,function(r){v.isValidElement(r)&&t.push(r)}),t}var Ve=function(e){var t=e.children,r=e.custom,o=e.initial,i=o===void 0?!0:o,a=e.onExitComplete,c=e.exitBeforeEnter,s=e.presenceAffectsLayout,l=s===void 0?!0:s,d=$e(f5(),1),u=d[0],p=v.useContext(Wa).forceRender;p&&(u=p);var h=Nu(),f=m5(t),g=f,m=new Set,b=v.useRef(g),y=v.useRef(new Map).current,w=v.useRef(!0);if(go(function(){w.current=!1,v5(f,y),b.current=g}),Ya(function(){w.current=!0,y.clear(),m.clear()}),w.current)return v.createElement(v.Fragment,null,g.map(function(j){return v.createElement(vi,{key:yn(j),isPresent:!0,initial:i?void 0:!1,presenceAffectsLayout:l},j)}));g=St([],$e(g),!1);for(var C=b.current.map(yn),k=f.map(yn),x=C.length,S=0;S<x;S++){var O=C[S];k.indexOf(O)===-1&&m.add(O)}return c&&m.size&&(g=[]),m.forEach(function(j){if(k.indexOf(j)===-1){var A=y.get(j);if(A){var _=C.indexOf(j),P=function(){y.delete(j),m.delete(j);var D=b.current.findIndex(function($){return $.key===j});if(b.current.splice(D,1),!m.size){if(b.current=f,h.current===!1)return;u(),a&&a()}};g.splice(_,0,v.createElement(vi,{key:yn(A),isPresent:!1,onExitComplete:P,custom:r,presenceAffectsLayout:l},A))}}}),g=g.map(function(j){var A=j.key;return m.has(A)?j:v.createElement(vi,{key:yn(j),isPresent:!0,presenceAffectsLayout:l},j)}),v.createElement(v.Fragment,null,m.size?g:g.map(function(j){return v.cloneElement(j)}))};function Hc(e){var t=e.children,r=e.isValidProp,o=ct(e,["children","isValidProp"]);r&&Ad(r),o=z(z({},v.useContext(yr)),o),o.isStatic=Wn(function(){return o.isStatic});var i=v.useMemo(function(){return o},[JSON.stringify(o.transition),o.transformPagePoint,o.reducedMotion]);return v.createElement(yr.Provider,{value:i},t)}var mi={exports:{}},Re={};var Gc;function x5(){if(Gc)return Re;Gc=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),r=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),i=Symbol.for("react.profiler"),a=Symbol.for("react.consumer"),c=Symbol.for("react.context"),s=Symbol.for("react.forward_ref"),l=Symbol.for("react.suspense"),d=Symbol.for("react.suspense_list"),u=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),h=Symbol.for("react.view_transition"),f=Symbol.for("react.client.reference");function g(m){if(typeof m=="object"&&m!==null){var b=m.$$typeof;switch(b){case e:switch(m=m.type,m){case r:case i:case o:case l:case d:case h:return m;default:switch(m=m&&m.$$typeof,m){case c:case s:case p:case u:return m;case a:return m;default:return b}}case t:return b}}}return Re.ContextConsumer=a,Re.ContextProvider=c,Re.Element=e,Re.ForwardRef=s,Re.Fragment=r,Re.Lazy=p,Re.Memo=u,Re.Portal=t,Re.Profiler=i,Re.StrictMode=o,Re.Suspense=l,Re.SuspenseList=d,Re.isContextConsumer=function(m){return g(m)===a},Re.isContextProvider=function(m){return g(m)===c},Re.isElement=function(m){return typeof m=="object"&&m!==null&&m.$$typeof===e},Re.isForwardRef=function(m){return g(m)===s},Re.isFragment=function(m){return g(m)===r},Re.isLazy=function(m){return g(m)===p},Re.isMemo=function(m){return g(m)===u},Re.isPortal=function(m){return g(m)===t},Re.isProfiler=function(m){return g(m)===i},Re.isStrictMode=function(m){return g(m)===o},Re.isSuspense=function(m){return g(m)===l},Re.isSuspenseList=function(m){return g(m)===d},Re.isValidElementType=function(m){return typeof m=="string"||typeof m=="function"||m===r||m===i||m===o||m===l||m===d||typeof m=="object"&&m!==null&&(m.$$typeof===p||m.$$typeof===u||m.$$typeof===c||m.$$typeof===a||m.$$typeof===s||m.$$typeof===f||m.getModuleId!==void 0)},Re.typeOf=g,Re}var qc;function b5(){return qc||(qc=1,mi.exports=x5()),mi.exports}var Fu=b5();function y5(e){function t(I,N,R,M,T){for(var oe=0,V=0,de=0,ce=0,se,J,me=0,ae=0,ie,Fe=ie=se=0,he=0,Oe=0,ye=0,xe=0,qe=R.length,ke=qe-1,Le,ee="",Se="",tt="",Ge="",We;he<qe;){if(J=R.charCodeAt(he),he===ke&&V+ce+de+oe!==0&&(V!==0&&(J=V===47?10:47),ce=de=oe=0,qe++,ke++),V+ce+de+oe===0){if(he===ke&&(0<Oe&&(ee=ee.replace(h,"")),0<ee.trim().length)){switch(J){case 32:case 9:case 59:case 13:case 10:break;default:ee+=R.charAt(he)}J=59}switch(J){case 123:for(ee=ee.trim(),se=ee.charCodeAt(0),ie=1,xe=++he;he<qe;){switch(J=R.charCodeAt(he)){case 123:ie++;break;case 125:ie--;break;case 47:switch(J=R.charCodeAt(he+1)){case 42:case 47:e:{for(Fe=he+1;Fe<ke;++Fe)switch(R.charCodeAt(Fe)){case 47:if(J===42&&R.charCodeAt(Fe-1)===42&&he+2!==Fe){he=Fe+1;break e}break;case 10:if(J===47){he=Fe+1;break e}}he=Fe}}break;case 91:J++;case 40:J++;case 34:case 39:for(;he++<ke&&R.charCodeAt(he)!==J;);}if(ie===0)break;he++}switch(ie=R.substring(xe,he),se===0&&(se=(ee=ee.replace(p,"").trim()).charCodeAt(0)),se){case 64:switch(0<Oe&&(ee=ee.replace(h,"")),J=ee.charCodeAt(1),J){case 100:case 109:case 115:case 45:Oe=N;break;default:Oe=W}if(ie=t(N,Oe,ie,J,T+1),xe=ie.length,0<K&&(Oe=r(W,ee,ye),We=s(3,ie,Oe,N,$,D,xe,J,T,M),ee=Oe.join(""),We!==void 0&&(xe=(ie=We.trim()).length)===0&&(J=0,ie="")),0<xe)switch(J){case 115:ee=ee.replace(S,c);case 100:case 109:case 45:ie=ee+"{"+ie+"}";break;case 107:ee=ee.replace(w,"$1 $2"),ie=ee+"{"+ie+"}",ie=B===1||B===2&&a("@"+ie,3)?"@-webkit-"+ie+"@"+ie:"@"+ie;break;default:ie=ee+ie,M===112&&(ie=(Se+=ie,""))}else ie="";break;default:ie=t(N,r(N,ee,ye),ie,M,T+1)}tt+=ie,ie=ye=Oe=Fe=se=0,ee="",J=R.charCodeAt(++he);break;case 125:case 59:if(ee=(0<Oe?ee.replace(h,""):ee).trim(),1<(xe=ee.length))switch(Fe===0&&(se=ee.charCodeAt(0),se===45||96<se&&123>se)&&(xe=(ee=ee.replace(" ",":")).length),0<K&&(We=s(1,ee,N,I,$,D,Se.length,M,T,M))!==void 0&&(xe=(ee=We.trim()).length)===0&&(ee="\0\0"),se=ee.charCodeAt(0),J=ee.charCodeAt(1),se){case 0:break;case 64:if(J===105||J===99){Ge+=ee+R.charAt(he);break}default:ee.charCodeAt(xe-1)!==58&&(Se+=i(ee,se,J,ee.charCodeAt(2)))}ye=Oe=Fe=se=0,ee="",J=R.charCodeAt(++he)}}switch(J){case 13:case 10:V===47?V=0:1+se===0&&M!==107&&0<ee.length&&(Oe=1,ee+="\0"),0<K*ue&&s(0,ee,N,I,$,D,Se.length,M,T,M),D=1,$++;break;case 59:case 125:if(V+ce+de+oe===0){D++;break}default:switch(D++,Le=R.charAt(he),J){case 9:case 32:if(ce+oe+V===0)switch(me){case 44:case 58:case 9:case 32:Le="";break;default:J!==32&&(Le=" ")}break;case 0:Le="\\0";break;case 12:Le="\\f";break;case 11:Le="\\v";break;case 38:ce+V+oe===0&&(Oe=ye=1,Le="\f"+Le);break;case 108:if(ce+V+oe+q===0&&0<Fe)switch(he-Fe){case 2:me===112&&R.charCodeAt(he-3)===58&&(q=me);case 8:ae===111&&(q=ae)}break;case 58:ce+V+oe===0&&(Fe=he);break;case 44:V+de+ce+oe===0&&(Oe=1,Le+="\r");break;case 34:case 39:V===0&&(ce=ce===J?0:ce===0?J:ce);break;case 91:ce+V+de===0&&oe++;break;case 93:ce+V+de===0&&oe--;break;case 41:ce+V+oe===0&&de--;break;case 40:ce+V+oe===0&&(se===0&&(2*me+3*ae===533||(se=1)),de++);break;case 64:V+de+ce+oe+Fe+ie===0&&(ie=1);break;case 42:case 47:if(!(0<ce+oe+de))switch(V){case 0:switch(2*J+3*R.charCodeAt(he+1)){case 235:V=47;break;case 220:xe=he,V=42}break;case 42:J===47&&me===42&&xe+2!==he&&(R.charCodeAt(xe+2)===33&&(Se+=R.substring(xe,he+1)),Le="",V=0)}}V===0&&(ee+=Le)}ae=me,me=J,he++}if(xe=Se.length,0<xe){if(Oe=N,0<K&&(We=s(2,Se,Oe,I,$,D,xe,M,T,M),We!==void 0&&(Se=We).length===0))return Ge+Se+tt;if(Se=Oe.join(",")+"{"+Se+"}",B*q!==0){switch(B!==2||a(Se,2)||(q=0),q){case 111:Se=Se.replace(k,":-moz-$1")+Se;break;case 112:Se=Se.replace(C,"::-webkit-input-$1")+Se.replace(C,"::-moz-$1")+Se.replace(C,":-ms-input-$1")+Se}q=0}}return Ge+Se+tt}function r(I,N,R){var M=N.trim().split(b);N=M;var T=M.length,oe=I.length;switch(oe){case 0:case 1:var V=0;for(I=oe===0?"":I[0]+" ";V<T;++V)N[V]=o(I,N[V],R).trim();break;default:var de=V=0;for(N=[];V<T;++V)for(var ce=0;ce<oe;++ce)N[de++]=o(I[ce]+" ",M[V],R).trim()}return N}function o(I,N,R){var M=N.charCodeAt(0);switch(33>M&&(M=(N=N.trim()).charCodeAt(0)),M){case 38:return N.replace(y,"$1"+I.trim());case 58:return I.trim()+N.replace(y,"$1"+I.trim());default:if(0<1*R&&0<N.indexOf("\f"))return N.replace(y,(I.charCodeAt(0)===58?"":"$1")+I.trim())}return I+N}function i(I,N,R,M){var T=I+";",oe=2*N+3*R+4*M;if(oe===944){I=T.indexOf(":",9)+1;var V=T.substring(I,T.length-1).trim();return V=T.substring(0,I).trim()+V+";",B===1||B===2&&a(V,1)?"-webkit-"+V+V:V}if(B===0||B===2&&!a(T,1))return T;switch(oe){case 1015:return T.charCodeAt(10)===97?"-webkit-"+T+T:T;case 951:return T.charCodeAt(3)===116?"-webkit-"+T+T:T;case 963:return T.charCodeAt(5)===110?"-webkit-"+T+T:T;case 1009:if(T.charCodeAt(4)!==100)break;case 969:case 942:return"-webkit-"+T+T;case 978:return"-webkit-"+T+"-moz-"+T+T;case 1019:case 983:return"-webkit-"+T+"-moz-"+T+"-ms-"+T+T;case 883:if(T.charCodeAt(8)===45)return"-webkit-"+T+T;if(0<T.indexOf("image-set(",11))return T.replace(P,"$1-webkit-$2")+T;break;case 932:if(T.charCodeAt(4)===45)switch(T.charCodeAt(5)){case 103:return"-webkit-box-"+T.replace("-grow","")+"-webkit-"+T+"-ms-"+T.replace("grow","positive")+T;case 115:return"-webkit-"+T+"-ms-"+T.replace("shrink","negative")+T;case 98:return"-webkit-"+T+"-ms-"+T.replace("basis","preferred-size")+T}return"-webkit-"+T+"-ms-"+T+T;case 964:return"-webkit-"+T+"-ms-flex-"+T+T;case 1023:if(T.charCodeAt(8)!==99)break;return V=T.substring(T.indexOf(":",15)).replace("flex-","").replace("space-between","justify"),"-webkit-box-pack"+V+"-webkit-"+T+"-ms-flex-pack"+V+T;case 1005:return g.test(T)?T.replace(f,":-webkit-")+T.replace(f,":-moz-")+T:T;case 1e3:switch(V=T.substring(13).trim(),N=V.indexOf("-")+1,V.charCodeAt(0)+V.charCodeAt(N)){case 226:V=T.replace(x,"tb");break;case 232:V=T.replace(x,"tb-rl");break;case 220:V=T.replace(x,"lr");break;default:return T}return"-webkit-"+T+"-ms-"+V+T;case 1017:if(T.indexOf("sticky",9)===-1)break;case 975:switch(N=(T=I).length-10,V=(T.charCodeAt(N)===33?T.substring(0,N):T).substring(I.indexOf(":",7)+1).trim(),oe=V.charCodeAt(0)+(V.charCodeAt(7)|0)){case 203:if(111>V.charCodeAt(8))break;case 115:T=T.replace(V,"-webkit-"+V)+";"+T;break;case 207:case 102:T=T.replace(V,"-webkit-"+(102<oe?"inline-":"")+"box")+";"+T.replace(V,"-webkit-"+V)+";"+T.replace(V,"-ms-"+V+"box")+";"+T}return T+";";case 938:if(T.charCodeAt(5)===45)switch(T.charCodeAt(6)){case 105:return V=T.replace("-items",""),"-webkit-"+T+"-webkit-box-"+V+"-ms-flex-"+V+T;case 115:return"-webkit-"+T+"-ms-flex-item-"+T.replace(j,"")+T;default:return"-webkit-"+T+"-ms-flex-line-pack"+T.replace("align-content","").replace(j,"")+T}break;case 973:case 989:if(T.charCodeAt(3)!==45||T.charCodeAt(4)===122)break;case 931:case 953:if(_.test(I)===!0)return(V=I.substring(I.indexOf(":")+1)).charCodeAt(0)===115?i(I.replace("stretch","fill-available"),N,R,M).replace(":fill-available",":stretch"):T.replace(V,"-webkit-"+V)+T.replace(V,"-moz-"+V.replace("fill-",""))+T;break;case 962:if(T="-webkit-"+T+(T.charCodeAt(5)===102?"-ms-"+T:"")+T,R+M===211&&T.charCodeAt(13)===105&&0<T.indexOf("transform",10))return T.substring(0,T.indexOf(";",27)+1).replace(m,"$1-webkit-$2")+T}return T}function a(I,N){var R=I.indexOf(N===1?":":"{"),M=I.substring(0,N!==3?R:10);return R=I.substring(R+1,I.length-1),Y(N!==2?M:M.replace(A,"$1"),R,N)}function c(I,N){var R=i(N,N.charCodeAt(0),N.charCodeAt(1),N.charCodeAt(2));return R!==N+";"?R.replace(O," or ($1)").substring(4):"("+N+")"}function s(I,N,R,M,T,oe,V,de,ce,se){for(var J=0,me=N,ae;J<K;++J)switch(ae=H[J].call(u,I,me,R,M,T,oe,V,de,ce,se)){case void 0:case!1:case!0:case null:break;default:me=ae}if(me!==N)return me}function l(I){switch(I){case void 0:case null:K=H.length=0;break;default:if(typeof I=="function")H[K++]=I;else if(typeof I=="object")for(var N=0,R=I.length;N<R;++N)l(I[N]);else ue=!!I|0}return l}function d(I){return I=I.prefix,I!==void 0&&(Y=null,I?typeof I!="function"?B=1:(B=2,Y=I):B=0),d}function u(I,N){var R=I;if(33>R.charCodeAt(0)&&(R=R.trim()),G=R,R=[G],0<K){var M=s(-1,N,R,R,$,D,0,0,0,0);M!==void 0&&typeof M=="string"&&(N=M)}var T=t(W,R,N,0,0);return 0<K&&(M=s(-2,T,R,R,$,D,T.length,0,0,0),M!==void 0&&(T=M)),G="",q=0,D=$=1,T}var p=/^\0+/g,h=/[\0\r\f]/g,f=/: */g,g=/zoo|gra/,m=/([,: ])(transform)/g,b=/,\r+?/g,y=/([\t\r\n ])*\f?&/g,w=/@(k\w+)\s*(\S*)\s*/,C=/::(place)/g,k=/:(read-only)/g,x=/[svh]\w+-[tblr]{2}/,S=/\(\s*(.*)\s*\)/g,O=/([\s\S]*?);/g,j=/-self|flex-/g,A=/[^]*?(:[rp][el]a[\w-]+)[^]*/,_=/stretch|:\s*\w+\-(?:conte|avail)/,P=/([^-])(image-set\()/,D=1,$=1,q=0,B=1,W=[],H=[],K=0,Y=null,ue=0,G="";return u.use=l,u.set=d,e!==void 0&&d(e),u}var C5={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function w5(e){var t=Object.create(null);return function(r){return t[r]===void 0&&(t[r]=e(r)),t[r]}}var k5=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|popover|popoverTarget|popoverTargetAction|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,Zc=w5(function(e){return k5.test(e)||e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)<91}),xi={exports:{}},_e={};var Kc;function E5(){if(Kc)return _e;Kc=1;var e=typeof Symbol=="function"&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,o=e?Symbol.for("react.fragment"):60107,i=e?Symbol.for("react.strict_mode"):60108,a=e?Symbol.for("react.profiler"):60114,c=e?Symbol.for("react.provider"):60109,s=e?Symbol.for("react.context"):60110,l=e?Symbol.for("react.async_mode"):60111,d=e?Symbol.for("react.concurrent_mode"):60111,u=e?Symbol.for("react.forward_ref"):60112,p=e?Symbol.for("react.suspense"):60113,h=e?Symbol.for("react.suspense_list"):60120,f=e?Symbol.for("react.memo"):60115,g=e?Symbol.for("react.lazy"):60116,m=e?Symbol.for("react.block"):60121,b=e?Symbol.for("react.fundamental"):60117,y=e?Symbol.for("react.responder"):60118,w=e?Symbol.for("react.scope"):60119;function C(x){if(typeof x=="object"&&x!==null){var S=x.$$typeof;switch(S){case t:switch(x=x.type,x){case l:case d:case o:case a:case i:case p:return x;default:switch(x=x&&x.$$typeof,x){case s:case u:case g:case f:case c:return x;default:return S}}case r:return S}}}function k(x){return C(x)===d}return _e.AsyncMode=l,_e.ConcurrentMode=d,_e.ContextConsumer=s,_e.ContextProvider=c,_e.Element=t,_e.ForwardRef=u,_e.Fragment=o,_e.Lazy=g,_e.Memo=f,_e.Portal=r,_e.Profiler=a,_e.StrictMode=i,_e.Suspense=p,_e.isAsyncMode=function(x){return k(x)||C(x)===l},_e.isConcurrentMode=k,_e.isContextConsumer=function(x){return C(x)===s},_e.isContextProvider=function(x){return C(x)===c},_e.isElement=function(x){return typeof x=="object"&&x!==null&&x.$$typeof===t},_e.isForwardRef=function(x){return C(x)===u},_e.isFragment=function(x){return C(x)===o},_e.isLazy=function(x){return C(x)===g},_e.isMemo=function(x){return C(x)===f},_e.isPortal=function(x){return C(x)===r},_e.isProfiler=function(x){return C(x)===a},_e.isStrictMode=function(x){return C(x)===i},_e.isSuspense=function(x){return C(x)===p},_e.isValidElementType=function(x){return typeof x=="string"||typeof x=="function"||x===o||x===d||x===a||x===i||x===p||x===h||typeof x=="object"&&x!==null&&(x.$$typeof===g||x.$$typeof===f||x.$$typeof===c||x.$$typeof===s||x.$$typeof===u||x.$$typeof===b||x.$$typeof===y||x.$$typeof===w||x.$$typeof===m)},_e.typeOf=C,_e}var Yc;function S5(){return Yc||(Yc=1,xi.exports=E5()),xi.exports}var bi,Xc;function j5(){if(Xc)return bi;Xc=1;var e=S5(),t={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},r={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},o={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},i={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},a={};a[e.ForwardRef]=o,a[e.Memo]=i;function c(g){return e.isMemo(g)?i:a[g.$$typeof]||t}var s=Object.defineProperty,l=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,u=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,h=Object.prototype;function f(g,m,b){if(typeof m!="string"){if(h){var y=p(m);y&&y!==h&&f(g,y,b)}var w=l(m);d&&(w=w.concat(d(m)));for(var C=c(g),k=c(m),x=0;x<w.length;++x){var S=w[x];if(!r[S]&&!(b&&b[S])&&!(k&&k[S])&&!(C&&C[S])){var O=u(m,S);try{s(g,S,O)}catch{}}}}return g}return bi=f,bi}var _5=j5();const A5=ed(_5);var ft={};function Wt(){return(Wt=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e}).apply(this,arguments)}var Qc=function(e,t){for(var r=[e[0]],o=0,i=t.length;o<i;o+=1)r.push(t[o],e[o+1]);return r},la=function(e){return e!==null&&typeof e=="object"&&(e.toString?e.toString():Object.prototype.toString.call(e))==="[object Object]"&&!Fu.typeOf(e)},So=Object.freeze([]),nn=Object.freeze({});function jr(e){return typeof e=="function"}function Jc(e){return e.displayName||e.name||"Component"}function ds(e){return e&&typeof e.styledComponentId=="string"}var Fn=typeof process<"u"&&ft!==void 0&&(ft.REACT_APP_SC_ATTR||ft.SC_ATTR)||"data-styled",us=typeof window<"u"&&"HTMLElement"in window,T5=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&ft!==void 0&&(ft.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&ft.REACT_APP_SC_DISABLE_SPEEDY!==""?ft.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&ft.REACT_APP_SC_DISABLE_SPEEDY:ft.SC_DISABLE_SPEEDY!==void 0&&ft.SC_DISABLE_SPEEDY!==""&&ft.SC_DISABLE_SPEEDY!=="false"&&ft.SC_DISABLE_SPEEDY));function Pr(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];throw new Error("An error occurred. See https://git.io/JUIaE#"+e+" for more information."+(r.length>0?" Args: "+r.join(", "):""))}var O5=(function(){function e(r){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=r}var t=e.prototype;return t.indexOfGroup=function(r){for(var o=0,i=0;i<r;i++)o+=this.groupSizes[i];return o},t.insertRules=function(r,o){if(r>=this.groupSizes.length){for(var i=this.groupSizes,a=i.length,c=a;r>=c;)(c<<=1)<0&&Pr(16,""+r);this.groupSizes=new Uint32Array(c),this.groupSizes.set(i),this.length=c;for(var s=a;s<c;s++)this.groupSizes[s]=0}for(var l=this.indexOfGroup(r+1),d=0,u=o.length;d<u;d++)this.tag.insertRule(l,o[d])&&(this.groupSizes[r]++,l++)},t.clearGroup=function(r){if(r<this.length){var o=this.groupSizes[r],i=this.indexOfGroup(r),a=i+o;this.groupSizes[r]=0;for(var c=i;c<a;c++)this.tag.deleteRule(i)}},t.getGroup=function(r){var o="";if(r>=this.length||this.groupSizes[r]===0)return o;for(var i=this.groupSizes[r],a=this.indexOfGroup(r),c=a+i,s=a;s<c;s++)o+=this.tag.getRule(s)+`/*!sc*/
`;return o},e})(),so=new Map,jo=new Map,lr=1,Kr=function(e){if(so.has(e))return so.get(e);for(;jo.has(lr);)lr++;var t=lr++;return so.set(e,t),jo.set(t,e),t},R5=function(e){return jo.get(e)},L5=function(e,t){t>=lr&&(lr=t+1),so.set(e,t),jo.set(t,e)},I5="style["+Fn+'][data-styled-version="5.3.11"]',N5=new RegExp("^"+Fn+'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)'),F5=function(e,t,r){for(var o,i=r.split(","),a=0,c=i.length;a<c;a++)(o=i[a])&&e.registerName(t,o)},M5=function(e,t){for(var r=(t.textContent||"").split(`/*!sc*/
`),o=[],i=0,a=r.length;i<a;i++){var c=r[i].trim();if(c){var s=c.match(N5);if(s){var l=0|parseInt(s[1],10),d=s[2];l!==0&&(L5(d,l),F5(e,d,s[3]),e.getTag().insertRules(l,o)),o.length=0}else o.push(c)}}},P5=function(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null},Mu=function(e){var t=document.head,r=e||t,o=document.createElement("style"),i=(function(s){for(var l=s.childNodes,d=l.length;d>=0;d--){var u=l[d];if(u&&u.nodeType===1&&u.hasAttribute(Fn))return u}})(r),a=i!==void 0?i.nextSibling:null;o.setAttribute(Fn,"active"),o.setAttribute("data-styled-version","5.3.11");var c=P5();return c&&o.setAttribute("nonce",c),r.insertBefore(o,a),o},D5=(function(){function e(r){var o=this.element=Mu(r);o.appendChild(document.createTextNode("")),this.sheet=(function(i){if(i.sheet)return i.sheet;for(var a=document.styleSheets,c=0,s=a.length;c<s;c++){var l=a[c];if(l.ownerNode===i)return l}Pr(17)})(o),this.length=0}var t=e.prototype;return t.insertRule=function(r,o){try{return this.sheet.insertRule(o,r),this.length++,!0}catch{return!1}},t.deleteRule=function(r){this.sheet.deleteRule(r),this.length--},t.getRule=function(r){var o=this.sheet.cssRules[r];return o!==void 0&&typeof o.cssText=="string"?o.cssText:""},e})(),$5=(function(){function e(r){var o=this.element=Mu(r);this.nodes=o.childNodes,this.length=0}var t=e.prototype;return t.insertRule=function(r,o){if(r<=this.length&&r>=0){var i=document.createTextNode(o),a=this.nodes[r];return this.element.insertBefore(i,a||null),this.length++,!0}return!1},t.deleteRule=function(r){this.element.removeChild(this.nodes[r]),this.length--},t.getRule=function(r){return r<this.length?this.nodes[r].textContent:""},e})(),B5=(function(){function e(r){this.rules=[],this.length=0}var t=e.prototype;return t.insertRule=function(r,o){return r<=this.length&&(this.rules.splice(r,0,o),this.length++,!0)},t.deleteRule=function(r){this.rules.splice(r,1),this.length--},t.getRule=function(r){return r<this.length?this.rules[r]:""},e})(),el=us,W5={isServer:!us,useCSSOMInjection:!T5},Pu=(function(){function e(r,o,i){r===void 0&&(r=nn),o===void 0&&(o={}),this.options=Wt({},W5,{},r),this.gs=o,this.names=new Map(i),this.server=!!r.isServer,!this.server&&us&&el&&(el=!1,(function(a){for(var c=document.querySelectorAll(I5),s=0,l=c.length;s<l;s++){var d=c[s];d&&d.getAttribute(Fn)!=="active"&&(M5(a,d),d.parentNode&&d.parentNode.removeChild(d))}})(this))}e.registerId=function(r){return Kr(r)};var t=e.prototype;return t.reconstructWithOptions=function(r,o){return o===void 0&&(o=!0),new e(Wt({},this.options,{},r),this.gs,o&&this.names||void 0)},t.allocateGSInstance=function(r){return this.gs[r]=(this.gs[r]||0)+1},t.getTag=function(){return this.tag||(this.tag=(i=(o=this.options).isServer,a=o.useCSSOMInjection,c=o.target,r=i?new B5(c):a?new D5(c):new $5(c),new O5(r)));var r,o,i,a,c},t.hasNameForId=function(r,o){return this.names.has(r)&&this.names.get(r).has(o)},t.registerName=function(r,o){if(Kr(r),this.names.has(r))this.names.get(r).add(o);else{var i=new Set;i.add(o),this.names.set(r,i)}},t.insertRules=function(r,o,i){this.registerName(r,o),this.getTag().insertRules(Kr(r),i)},t.clearNames=function(r){this.names.has(r)&&this.names.get(r).clear()},t.clearRules=function(r){this.getTag().clearGroup(Kr(r)),this.clearNames(r)},t.clearTag=function(){this.tag=void 0},t.toString=function(){return(function(r){for(var o=r.getTag(),i=o.length,a="",c=0;c<i;c++){var s=R5(c);if(s!==void 0){var l=r.names.get(s),d=o.getGroup(c);if(l&&d&&l.size){var u=Fn+".g"+c+'[id="'+s+'"]',p="";l!==void 0&&l.forEach((function(h){h.length>0&&(p+=h+",")})),a+=""+d+u+'{content:"'+p+`"}/*!sc*/
`}}}return a})(this)},e})(),V5=/(a)(d)/gi,tl=function(e){return String.fromCharCode(e+(e>25?39:97))};function da(e){var t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=tl(t%52)+r;return(tl(t%52)+r).replace(V5,"$1-$2")}var _n=function(e,t){for(var r=t.length;r;)e=33*e^t.charCodeAt(--r);return e},Du=function(e){return _n(5381,e)};function U5(e){for(var t=0;t<e.length;t+=1){var r=e[t];if(jr(r)&&!ds(r))return!1}return!0}var z5=Du("5.3.11"),H5=(function(){function e(t,r,o){this.rules=t,this.staticRulesId="",this.isStatic=(o===void 0||o.isStatic)&&U5(t),this.componentId=r,this.baseHash=_n(z5,r),this.baseStyle=o,Pu.registerId(r)}return e.prototype.generateAndInjectStyles=function(t,r,o){var i=this.componentId,a=[];if(this.baseStyle&&a.push(this.baseStyle.generateAndInjectStyles(t,r,o)),this.isStatic&&!o.hash)if(this.staticRulesId&&r.hasNameForId(i,this.staticRulesId))a.push(this.staticRulesId);else{var c=Mn(this.rules,t,r,o).join(""),s=da(_n(this.baseHash,c)>>>0);if(!r.hasNameForId(i,s)){var l=o(c,"."+s,void 0,i);r.insertRules(i,s,l)}a.push(s),this.staticRulesId=s}else{for(var d=this.rules.length,u=_n(this.baseHash,o.hash),p="",h=0;h<d;h++){var f=this.rules[h];if(typeof f=="string")p+=f;else if(f){var g=Mn(f,t,r,o),m=Array.isArray(g)?g.join(""):g;u=_n(u,m+h),p+=m}}if(p){var b=da(u>>>0);if(!r.hasNameForId(i,b)){var y=o(p,"."+b,void 0,i);r.insertRules(i,b,y)}a.push(b)}}return a.join(" ")},e})(),G5=/^\s*\/\/.*$/gm,q5=[":","[",".","#"];function Z5(e){var t,r,o,i,a=nn,c=a.options,s=c===void 0?nn:c,l=a.plugins,d=l===void 0?So:l,u=new y5(s),p=[],h=(function(m){function b(y){if(y)try{m(y+"}")}catch{}}return function(y,w,C,k,x,S,O,j,A,_){switch(y){case 1:if(A===0&&w.charCodeAt(0)===64)return m(w+";"),"";break;case 2:if(j===0)return w+"/*|*/";break;case 3:switch(j){case 102:case 112:return m(C[0]+w),"";default:return w+(_===0?"/*|*/":"")}case-2:w.split("/*|*/}").forEach(b)}}})((function(m){p.push(m)})),f=function(m,b,y){return b===0&&q5.indexOf(y[r.length])!==-1||y.match(i)?m:"."+t};function g(m,b,y,w){w===void 0&&(w="&");var C=m.replace(G5,""),k=b&&y?y+" "+b+" { "+C+" }":C;return t=w,r=b,o=new RegExp("\\"+r+"\\b","g"),i=new RegExp("(\\"+r+"\\b){2,}"),u(y||!b?"":b,k)}return u.use([].concat(d,[function(m,b,y){m===2&&y.length&&y[0].lastIndexOf(r)>0&&(y[0]=y[0].replace(o,f))},h,function(m){if(m===-2){var b=p;return p=[],b}}])),g.hash=d.length?d.reduce((function(m,b){return b.name||Pr(15),_n(m,b.name)}),5381).toString():"",g}var $u=fe.createContext();$u.Consumer;var Bu=fe.createContext(),K5=(Bu.Consumer,new Pu),ua=Z5();function Y5(){return v.useContext($u)||K5}function X5(){return v.useContext(Bu)||ua}var Wu=(function(){function e(t,r){var o=this;this.inject=function(i,a){a===void 0&&(a=ua);var c=o.name+a.hash;i.hasNameForId(o.id,c)||i.insertRules(o.id,c,a(o.rules,c,"@keyframes"))},this.toString=function(){return Pr(12,String(o.name))},this.name=t,this.id="sc-keyframes-"+t,this.rules=r}return e.prototype.getName=function(t){return t===void 0&&(t=ua),this.name+t.hash},e})(),Q5=/([A-Z])/,J5=/([A-Z])/g,e3=/^ms-/,t3=function(e){return"-"+e.toLowerCase()};function nl(e){return Q5.test(e)?e.replace(J5,t3).replace(e3,"-ms-"):e}var rl=function(e){return e==null||e===!1||e===""};function Mn(e,t,r,o){if(Array.isArray(e)){for(var i,a=[],c=0,s=e.length;c<s;c+=1)(i=Mn(e[c],t,r,o))!==""&&(Array.isArray(i)?a.push.apply(a,i):a.push(i));return a}if(rl(e))return"";if(ds(e))return"."+e.styledComponentId;if(jr(e)){if(typeof(d=e)!="function"||d.prototype&&d.prototype.isReactComponent||!t)return e;var l=e(t);return Mn(l,t,r,o)}var d;return e instanceof Wu?r?(e.inject(r,o),e.getName(o)):e:la(e)?(function u(p,h){var f,g,m=[];for(var b in p)p.hasOwnProperty(b)&&!rl(p[b])&&(Array.isArray(p[b])&&p[b].isCss||jr(p[b])?m.push(nl(b)+":",p[b],";"):la(p[b])?m.push.apply(m,u(p[b],b)):m.push(nl(b)+": "+(f=b,(g=p[b])==null||typeof g=="boolean"||g===""?"":typeof g!="number"||g===0||f in C5||f.startsWith("--")?String(g).trim():g+"px")+";"));return h?[h+" {"].concat(m,["}"]):m})(e):e.toString()}var ol=function(e){return Array.isArray(e)&&(e.isCss=!0),e};function pe(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return jr(e)||la(e)?ol(Mn(Qc(So,[e].concat(r)))):r.length===0&&e.length===1&&typeof e[0]=="string"?e:ol(Mn(Qc(e,r)))}var n3=function(e,t,r){return r===void 0&&(r=nn),e.theme!==r.theme&&e.theme||t||r.theme},r3=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,o3=/(^-|-$)/g;function yi(e){return e.replace(r3,"-").replace(o3,"")}var Vu=function(e){return da(Du(e)>>>0)};function Yr(e){return typeof e=="string"&&!0}var pa=function(e){return typeof e=="function"||typeof e=="object"&&e!==null&&!Array.isArray(e)},i3=function(e){return e!=="__proto__"&&e!=="constructor"&&e!=="prototype"};function a3(e,t,r){var o=e[r];pa(t)&&pa(o)?Uu(o,t):e[r]=t}function Uu(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];for(var i=0,a=r;i<a.length;i++){var c=a[i];if(pa(c))for(var s in c)i3(s)&&a3(e,c[s],s)}return e}var zu=fe.createContext();zu.Consumer;var Ci={};function Hu(e,t,r){var o=ds(e),i=!Yr(e),a=t.attrs,c=a===void 0?So:a,s=t.componentId,l=s===void 0?(function(w,C){var k=typeof w!="string"?"sc":yi(w);Ci[k]=(Ci[k]||0)+1;var x=k+"-"+Vu("5.3.11"+k+Ci[k]);return C?C+"-"+x:x})(t.displayName,t.parentComponentId):s,d=t.displayName,u=d===void 0?(function(w){return Yr(w)?"styled."+w:"Styled("+Jc(w)+")"})(e):d,p=t.displayName&&t.componentId?yi(t.displayName)+"-"+t.componentId:t.componentId||l,h=o&&e.attrs?Array.prototype.concat(e.attrs,c).filter(Boolean):c,f=t.shouldForwardProp;o&&e.shouldForwardProp&&(f=t.shouldForwardProp?function(w,C,k){return e.shouldForwardProp(w,C,k)&&t.shouldForwardProp(w,C,k)}:e.shouldForwardProp);var g,m=new H5(r,p,o?e.componentStyle:void 0),b=m.isStatic&&c.length===0,y=function(w,C){return(function(k,x,S,O){var j=k.attrs,A=k.componentStyle,_=k.defaultProps,P=k.foldedComponentIds,D=k.shouldForwardProp,$=k.styledComponentId,q=k.target,B=(function(M,T,oe){M===void 0&&(M=nn);var V=Wt({},T,{theme:M}),de={};return oe.forEach((function(ce){var se,J,me,ae=ce;for(se in jr(ae)&&(ae=ae(V)),ae)V[se]=de[se]=se==="className"?(J=de[se],me=ae[se],J&&me?J+" "+me:J||me):ae[se]})),[V,de]})(n3(x,v.useContext(zu),_)||nn,x,j),W=B[0],H=B[1],K=(function(M,T,oe,V){var de=Y5(),ce=X5(),se=T?M.generateAndInjectStyles(nn,de,ce):M.generateAndInjectStyles(oe,de,ce);return se})(A,O,W),Y=S,ue=H.$as||x.$as||H.as||x.as||q,G=Yr(ue),I=H!==x?Wt({},x,{},H):x,N={};for(var R in I)R[0]!=="$"&&R!=="as"&&(R==="forwardedAs"?N.as=I[R]:(D?D(R,Zc,ue):!G||Zc(R))&&(N[R]=I[R]));return x.style&&H.style!==x.style&&(N.style=Wt({},x.style,{},H.style)),N.className=Array.prototype.concat(P,$,K!==$?K:null,x.className,H.className).filter(Boolean).join(" "),N.ref=Y,v.createElement(ue,N)})(g,w,C,b)};return y.displayName=u,(g=fe.forwardRef(y)).attrs=h,g.componentStyle=m,g.displayName=u,g.shouldForwardProp=f,g.foldedComponentIds=o?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):So,g.styledComponentId=p,g.target=o?e.target:e,g.withComponent=function(w){var C=t.componentId,k=(function(S,O){if(S==null)return{};var j,A,_={},P=Object.keys(S);for(A=0;A<P.length;A++)j=P[A],O.indexOf(j)>=0||(_[j]=S[j]);return _})(t,["componentId"]),x=C&&C+"-"+(Yr(w)?w:yi(Jc(w)));return Hu(w,Wt({},k,{attrs:h,componentId:x}),r)},Object.defineProperty(g,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(w){this._foldedDefaultProps=o?Uu({},e.defaultProps,w):w}}),Object.defineProperty(g,"toString",{value:function(){return"."+g.styledComponentId}}),i&&A5(g,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0,withComponent:!0}),g}var dr=function(e){return(function t(r,o,i){if(i===void 0&&(i=nn),!Fu.isValidElementType(o))return Pr(1,String(o));var a=function(){return r(o,i,pe.apply(void 0,arguments))};return a.withConfig=function(c){return t(r,o,Wt({},i,{},c))},a.attrs=function(c){return t(r,o,Wt({},i,{attrs:Array.prototype.concat(i.attrs,c).filter(Boolean)}))},a})(Hu,e)};["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","textPath","tspan"].forEach((function(e){dr[e]=dr(e)}));function je(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];var i=pe.apply(void 0,[e].concat(r)).join(""),a=Vu(i);return new Wu(a,i)}const s3=e=>{const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);if(t==null)return e;const r={r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)};return`color(display-p3 ${r.r/255} ${r.g/255} ${r.b/255})`};var E=typeof dr.div=="function"?dr:dr.default;const c3={light:{"--ck-connectbutton-font-size":"15px","--ck-connectbutton-color":"#373737","--ck-connectbutton-background":"#F6F7F9","--ck-connectbutton-background-secondary":"#FFFFFF","--ck-connectbutton-hover-color":"#373737","--ck-connectbutton-hover-background":"#F0F2F5","--ck-connectbutton-active-color":"#373737","--ck-connectbutton-active-background":"#EAECF1","--ck-connectbutton-balance-color":"#373737","--ck-connectbutton-balance-background":"#fff","--ck-connectbutton-balance-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-background)","--ck-connectbutton-balance-hover-background":"#F6F7F9","--ck-connectbutton-balance-hover-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-hover-background)","--ck-connectbutton-balance-active-background":"#F0F2F5","--ck-connectbutton-balance-active-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-active-background)","--ck-primary-button-border-radius":"16px","--ck-primary-button-color":"#373737","--ck-primary-button-background":"#F6F7F9","--ck-primary-button-font-weight":"600","--ck-primary-button-hover-color":"#373737","--ck-primary-button-hover-background":"#F0F2F5","--ck-secondary-button-border-radius":"16px","--ck-secondary-button-color":"#373737","--ck-secondary-button-background":"#F6F7F9","--ck-tertiary-button-background":"#FFFFFF","--ck-secondary-button-hover-background":"#e0e4eb","--ck-input-background":"#e0e4eb","--ck-input-hover-background":"#F6F7F9","--ck-modal-box-shadow":"0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-overlay-background":"rgba(71, 88, 107, 0.24)","--ck-body-color":"#373737","--ck-body-color-muted":"#999999","--ck-body-color-muted-hover":"#111111","--ck-body-background":"#ffffff","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"#f6f7f9","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-secondary-hover-outline":"#4282FF","--ck-body-background-tertiary":"#F3F4F7","--ck-body-action-color":"#999999","--ck-body-divider":"#f7f6f8","--ck-body-divider-secondary":"rgba(0, 0, 0, 0.06)","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-siwe-border":"#F0F0F0","--ck-body-disclaimer-color":"#AAAAAB","--ck-body-disclaimer-link-color":"#838485","--ck-body-disclaimer-link-hover-color":"#000000","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#ffffff","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":"0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 1px rgba(0,0,0,0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-dropdown-button-background":"#fff","--ck-dropdown-button-hover-color":"#8B8B8B","--ck-dropdown-button-hover-background":"#F5F7F9","--ck-qr-dot-color":"#000000","--ck-qr-border-color":"#f7f6f8","--ck-focus-color":"#1A88F8","--ck-spinner-color":"var(--ck-focus-color)","--ck-copytoclipboard-stroke":"#CCCCCC"},dark:{"--ck-connectbutton-font-size":"15px","--ck-connectbutton-color":"#ffffff","--ck-connectbutton-background":"#383838","--ck-connectbutton-background-secondary":"#282828","--ck-connectbutton-hover-background":"#404040","--ck-connectbutton-active-background":"#4D4D4D","--ck-connectbutton-balance-color":"#fff","--ck-connectbutton-balance-background":"#282828","--ck-connectbutton-balance-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-background)","--ck-connectbutton-balance-hover-background":"#383838","--ck-connectbutton-balance-hover-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-hover-background)","--ck-connectbutton-balance-active-background":"#404040","--ck-connectbutton-balance-active-box-shadow":"inset 0 0 0 1px var(--ck-connectbutton-active-background)","--ck-primary-button-color":"#ffffff","--ck-primary-button-background":"#383838","--ck-primary-button-border-radius":"16px","--ck-primary-button-font-weight":"600","--ck-primary-button-hover-background":"#404040","--ck-primary-button-active-border-radius":"16px","--ck-secondary-button-color":"#ffffff","--ck-secondary-button-background":"#333333","--ck-secondary-button-hover-background":"#4D4D4D","--ck-input-background":"#4D4D4D","--ck-input-hover-background":"#333333","--ck-tertiary-button-background":"#424242","--ck-focus-color":"#1A88F8","--ck-overlay-background":"rgba(0,0,0,0.4)","--ck-body-color":"#ffffff","--ck-body-color-muted":"rgba(255, 255, 255, 0.4)","--ck-body-color-muted-hover":"rgba(255, 255, 255, 0.8)","--ck-body-background":"#2B2B2B","--ck-body-background-transparent":"rgba(0,0,0,0)","--ck-body-background-secondary":"#333333","--ck-body-background-secondary-hover-background":"#4D4D4D","--ck-body-background-secondary-hover-outline":"#ffffff","--ck-body-background-tertiary":"#333333","--ck-body-action-color":"#808080","--ck-body-divider":"#383838","--ck-body-color-danger":"#FF4E4E","--ck-body-disclaimer-color":"#858585","--ck-body-disclaimer-link-color":"#ADADAD","--ck-body-disclaimer-link-hover-color":"#FFFFFF","--ck-modal-box-shadow":"0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-copytoclipboard-stroke":"#555555","--ck-tooltip-background":"#323232ff","--ck-tooltip-background-secondary":"#333333","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":"0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-dropdown-button-color":"#6C7381","--ck-spinner-color":"var(--ck-focus-color)","--ck-qr-dot-color":"#ffffff","--ck-qr-border-color":"#3d3d3d"}},l3={"--ck-font-family":'"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',"--ck-border-radius":"10px","--ck-connectbutton-font-size":"17px","--ck-connectbutton-border-radius":"8px","--ck-connectbutton-color":"#ffffff","--ck-connectbutton-background":"#313235","--ck-connectbutton-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.05)","--ck-connectbutton-hover-background":"#414144","--ck-connectbutton-active-background":"#4C4D4F","--ck-connectbutton-balance-color":"#ffffff","--ck-connectbutton-balance-background":"#1F2023","--ck-connectbutton-balance-box-shadow":"inset 0 0 0 1px #313235","--ck-connectbutton-balance-hover-background":"#313235","--ck-connectbutton-balance-active-background":"#414144","--ck-primary-button-border-radius":"8px","--ck-primary-button-color":"#ffffff","--ck-primary-button-background":"rgba(255, 255, 255, 0.08)","--ck-primary-button-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.05)","--ck-primary-button-hover-background":"rgba(255, 255, 255, 0.2)","--ck-secondary-button-border-radius":"8px","--ck-secondary-button-color":"#ffffff","--ck-secondary-button-background":"#363638","--ck-secondary-button-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.05)","--ck-secondary-button-hover-background":"#3c3c3e","--ck-input-background":"#3c3c3e","--ck-input-hover-background":"#363638","--ck-overlay-background":"rgba(0,0,0,0.4)","--ck-modal-box-shadow":"inset 0 0 0 1px #38393C, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-focus-color":"#1A88F8","--ck-body-color":"#ffffff","--ck-body-color-muted":"#8B8F97","--ck-body-color-muted-hover":"#ffffff","--ck-body-background":"#1F2023","--ck-body-background-transparent":"rgba(31, 32, 35, 0)","--ck-body-background-secondary":"#313235","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-secondary-hover-outline":"rgba(255, 255, 255, 0.02)","--ck-body-background-tertiary":"#313235","--ck-tertiary-border-radius":"12px","--ck-tertiary-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.02)","--ck-body-action-color":"#8B8F97","--ck-body-divider":"rgba(255,255,255,0.1)","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-body-disclaimer-background":"#2B2D31","--ck-body-disclaimer-box-shadow":"none","--ck-body-disclaimer-color":"#808183","--ck-body-disclaimer-link-color":"#AAABAD","--ck-body-disclaimer-link-hover-color":"#ffffff","--ck-copytoclipboard-stroke":"#CCCCCC","--ck-tooltip-background":"#1F2023","--ck-tooltip-background-secondary":"#1F2023","--ck-tooltip-color":"#ffffff","--ck-tooltip-shadow":" 0 0 0 1px rgba(255, 255, 255, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-button-color":"#6C7381","--ck-dropdown-button-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.05)","--ck-dropdown-button-background":"#313235","--ck-dropdown-pending-color":"#8B8F97","--ck-dropdown-active-color":"#FFF","--ck-dropdown-active-static-color":"#FFF","--ck-dropdown-active-background":"rgba(255, 255, 255, 0.07)","--ck-dropdown-color":"#8B8F97","--ck-dropdown-background":"#313235","--ck-dropdown-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.03)","--ck-dropdown-border-radius":"8px","--ck-alert-color":"#8B8F97","--ck-alert-background":"#404145","--ck-alert-box-shadow":"inset 0 0 0 1px rgba(255, 255, 255, 0.02)","--ck-qr-border-radius":"12px","--ck-qr-dot-color":"#ffffff","--ck-qr-border-color":"rgba(255,255,255,0.1)","--ck-recent-badge-border-radius":"32px"},d3={"--ck-font-family":'"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',"--ck-border-radius":"0px","--ck-connectbutton-font-size":"17px","--ck-connectbutton-border-radius":"0px","--ck-connectbutton-color":"#414451","--ck-connectbutton-background":"#ffffff","--ck-connectbutton-box-shadow":"inset 0 0 0 1px #EBEBEB","--ck-connectbutton-hover-color":"#111","--ck-connectbutton-hover-box-shadow":"inset 0 0 0 1px #111","--ck-connectbutton-balance-color":"#111111","--ck-connectbutton-balance-background":"#F7F7F7","--ck-connectbutton-balance-box-shadow":"inset 0 0 0 1px #F7F7F7","--ck-connectbutton-balance-hover-background":"#f1f1f3","--ck-connectbutton-balance-hover-box-shadow":"inset 0 0 0 1px #111","--ck-primary-button-border-radius":"0px","--ck-primary-button-color":"#111111","--ck-primary-button-background":"#ffffff","--ck-primary-button-box-shadow":"inset 0 0 0 1px #EBEBEB","--ck-primary-button-hover-box-shadow":"inset 0 0 0 1px #111111","--ck-secondary-button-border-radius":"0px","--ck-secondary-button-color":"#111111","--ck-secondary-button-background":"#ffffff","--ck-secondary-button-box-shadow":"inset 0 0 0 1px #EBEBEB","--ck-secondary-button-hover-box-shadow":"inset 0 0 0 1px #111111","--ck-input-background":"","--ck-input-hover-background":"#ffffff","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-dropdown-button-background":"#fff","--ck-dropdown-button-hover-color":"#8B8B8B","--ck-dropdown-button-hover-background":"#E7E7E7","--ck-focus-color":"#1A88F8","--ck-modal-box-shadow":"0px 3px 16px rgba(0, 0, 0, 0.08)","--ck-body-color":"#111111","--ck-body-color-muted":"#A0A0A0","--ck-body-color-muted-hover":"#000000","--ck-body-background":"#ffffff","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"#f6f7f9","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-secondary-hover-outline":"#4282FF","--ck-body-background-tertiary":"#ffffff","--ck-tertiary-border-radius":"0px","--ck-tertiary-box-shadow":"inset 0 0 0 1px rgba(0, 0, 0, 0.04)","--ck-body-action-color":"#A0A0A0","--ck-body-divider":"#EBEBEB","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-body-disclaimer-background":"#FAFAFA","--ck-body-disclaimer-box-shadow":"inset 0 1px 0 0 #ECECEC","--ck-body-disclaimer-color":"#9D9D9D","--ck-body-disclaimer-link-color":"#6E6E6E","--ck-body-disclaimer-link-hover-color":"#000000","--ck-copytoclipboard-stroke":"#CCCCCC","--ck-tooltip-border-radius":"0px","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#ffffff","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":"0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-active-border-radius":"0","--ck-dropdown-box-shadow":"0px 2px 15px rgba(0, 0, 0, 0.15)","--ck-dropdown-border-radius":"0","--ck-alert-color":"rgba(17, 17, 17, 0.4)","--ck-alert-background":"#fff","--ck-alert-box-shadow":"inset 0 0 0 1px #EBEBEB","--ck-alert-border-radius":"0","--ck-qr-border-radius":"0px","--ck-qr-dot-color":"#111111","--ck-qr-border-color":"#EBEBEB","--ck-modal-h1-font-weight":"400","--ck-modal-heading-font-weight":"400","--ck-primary-button-font-weight":"400","--ck-recent-badge-top-offset":"0px","--ck-siwe-border":"#EBEBEB"},u3={"--ck-font-family":'"PT Root UI",ui-rounded,"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',"--ck-border-radius":"24px","--ck-connectbutton-font-size":"16px","--ck-connectbutton-font-weight":"700","--ck-connectbutton-border-radius":"10px","--ck-connectbutton-color":"#151C3B","--ck-connectbutton-background":"#ffffff","--ck-connectbutton-box-shadow":"inset 0 0 0 1px #D6D8E1","--ck-connectbutton-hover-background":"#E9EBF3","--ck-connectbutton-hover-box-shadow":"inset 0 0 0 1px #D4D8E8","--ck-connectbutton-active-background":"#D4D8E8","--ck-connectbutton-active-box-shadow":"inset 0 0 0 1px #D4D8E8","--ck-connectbutton-balance-color":"#373737","--ck-connectbutton-balance-background":"#F6F7F9","--ck-connectbutton-balance-box-shadow":"none","--ck-connectbutton-balance-hover-background":"#f1f1f3","--ck-primary-button-border-radius":"16px","--ck-primary-button-color":"#151C3B","--ck-primary-button-background":"#ffffff","--ck-primary-button-font-weight":"700","--ck-primary-button-hover-background":"#DEE1ED","--ck-secondary-button-border-radius":"16px","--ck-secondary-button-color":"#151C3B","--ck-secondary-button-background":"#ffffff","--ck-secondary-button-font-weight":"700","--ck-secondary-button-hover-background":"#DEE1ED","--ck-input-background":"#DEE1ED","--ck-input-hover-background":"#ffffff","--ck-focus-color":"#1A88F8","--ck-modal-box-shadow":"0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-overlay-background":"rgba(213, 215, 225, 0.8)","--ck-overlay-backdrop-filter":"blur(6px)","--ck-body-color":"#151C3B","--ck-body-color-muted":"#757A8E","--ck-body-color-muted-hover":"#000000","--ck-body-background":"#F4F4F8","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"#E9E9F1","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-tertiary":"#E9E9F1","--ck-tertiary-border-radius":"24px","--ck-body-action-color":"#79809C","--ck-body-divider":"#D9DBE3","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-body-disclaimer-background":"#F9FAFA","--ck-body-disclaimer-color":"#AFB1B6","--ck-body-disclaimer-link-color":"#787B84","--ck-body-disclaimer-link-hover-color":"#000000","--ck-copytoclipboard-stroke":"#79809C","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#ffffff","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":"0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-dropdown-button-background":"#fff","--ck-dropdown-button-hover-color":"#8B8B8B","--ck-dropdown-button-hover-background":"#DEE1ED","--ck-dropdown-button-hover-box-shadow":"0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-dropdown-color":"#757A8E","--ck-dropdown-box-shadow":"0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-alert-color":"#9196A1","--ck-alert-background":"#F6F8FA","--ck-alert-box-shadow":"inset 0 0 0 1px rgba(0, 0, 0, 0.04)","--ck-alert-border-radius":"8px","--ck-qr-border-radius":"24px","--ck-qr-dot-color":"#000000","--ck-qr-background":"#ffffff","--ck-recent-badge-color":"#79809C","--ck-recent-badge-background":"#F4F4F8","--ck-recent-badge-box-shadow":"none","--ck-siwe-border":"#DFE4EC","--ck-graphic-primary-background":"#fff","--ck-graphic-compass-background":"#fff","--ck-graphic-primary-box-shadow":"0px 2.94737px 14.7368px rgba(0, 0, 0, 0.1)","--ck-graphic-compass-box-shadow":"0px 2px 9px rgba(0, 0, 0, 0.15)"},p3={"--ck-font-family":'"SF Pro Rounded",ui-rounded,"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',"--ck-border-radius":"8px","--ck-connectbutton-font-size":"17px","--ck-connectbutton-color":"#000000","--ck-connectbutton-background":"#ffffff","--ck-connectbutton-box-shadow":"-4px 4px 0px #000000, inset 0 0 0 2px #000000","--ck-connectbutton-border-radius":"8px","--ck-connectbutton-hover-background":"#F3EDE8","--ck-connectbutton-active-box-shadow":"0 0 0 0 #000000, inset 0 0 0 2px #000000","--ck-connectbutton-balance-color":"#000000","--ck-connectbutton-balance-background":"#F3EDE8","--ck-connectbutton-balance-box-shadow":"-4px 4px 0px #000000, inset 0 0 0 2px #000000","--ck-connectbutton-balance-hover-background":"#eee5dd","--ck-connectbutton-balance-connectbutton-box-shadow":"-4px 8px 0px -4px #000000, inset 0 0 0 2px #000000","--ck-connectbutton-balance-connectbutton-border-radius":"0px 8px 8px 0","--ck-primary-button-color":"#373737","--ck-primary-button-background":"#ffffff","--ck-primary-button-box-shadow":"inset 0 0 0 2px #000000, -4px 4px 0 0 #000000","--ck-primary-button-border-radius":"8px","--ck-primary-button-hover-background":"#F3EDE8","--ck-primary-button-hover-box-shadow":"inset 0 0 0 2px #000000, -0px 0px 0 0 #000000","--ck-secondary-button-border-radius":"8px","--ck-secondary-button-color":"#373737","--ck-secondary-button-background":"#ffffff","--ck-secondary-button-box-shadow":"-4px 4px 0 0 #000000, inset 0 0 0 2px #000000","--ck-secondary-button-hover-background":"#F3EDE8","--ck-secondary-button-hover-box-shadow":"0 0 0 0 #000000, inset 0 0 0 2px #000000","--ck-input-background":"#F3EDE8","--ck-input-hover-background":"#ffffff","--ck-focus-color":"#3B99FC","--ck-overlay-background":"rgba(133, 120, 122, 0.8)","--ck-body-color":"#373737","--ck-body-color-muted":"rgba(0, 0, 0, 0.5)","--ck-body-color-muted-hover":"#000000","--ck-body-background":"#EBE1D8","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"rgba(0,0,0,0.1)","--ck-body-background-secondary-hover-background":"#4D4D4D","--ck-body-background-secondary-hover-outline":"#373737","--ck-body-background-tertiary":"#ffffff","--ck-tertiary-border-radius":"8px","--ck-tertiary-box-shadow":"-4px 4px 0 0 #000000, inset 0 0 0 2px #000000","--ck-body-action-color":"#373737","--ck-body-divider":"#373737","--ck-body-color-danger":"#FF4E4E","--ck-body-disclaimer-background":"#E3D6C9","--ck-body-disclaimer-box-shadow":"-4px 4px 0 0 #000000, inset 2px 0 0 0 #000000, inset -2px 0 0 0 #000000, inset 0 -2px 0 0 #000000","--ck-body-disclaimer-font-weight":"500","--ck-body-disclaimer-color":"#888079","--ck-body-disclaimer-link-color":"#5B5650","--ck-body-disclaimer-link-hover-color":"#000000","--ck-modal-box-shadow":"-10px 10px 0px #000000, inset 0 0 0 2px #000000","--ck-copytoclipboard-stroke":"#555555","--ck-tooltip-border-radius":"8px","--ck-tooltip-color":"#373737","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#EBE1D8","--ck-tooltip-shadow":"-6px 6px 0 0 #000000, 0 0 0 2px #000000","--ck-spinner-color":"#1A88F8","--ck-dropdown-button-color":"#000","--ck-dropdown-button-box-shadow":"-2px 2px 0 2px #000000,  0 0 0 2px #000000","--ck-dropdown-button-background":"#ffffff","--ck-dropdown-button-hover-background":"#F3EDE8","--ck-dropdown-button-hover-box-shadow":"-2px 2px 0 0 #000000,  0 0 0 2px #000000","--ck-dropdown-pending-color":"rgba(0, 0, 0, 0.5)","--ck-dropdown-active-color":"#FFFFFF","--ck-dropdown-active-static-color":"rgba(0, 0, 0, 0.5)","--ck-dropdown-active-background":"#3B99FC","--ck-dropdown-active-box-shadow":"inset 0 0 0 2px #000000","--ck-dropdown-active-border-radius":"8px","--ck-dropdown-color":"rgba(0, 0, 0, 0.5)","--ck-dropdown-background":"#FFFFFF","--ck-dropdown-box-shadow":"-4px 4px 0 0 #000000, inset 0 0 0 2px #000000","--ck-dropdown-border-radius":"8px","--ck-alert-color":"rgba(0, 0, 0, 0.5)","--ck-alert-background":" #F5F5F5","--ck-alert-border-radius":"8px","--ck-qr-border-radius":"8px","--ck-qr-dot-color":"#000000","--ck-qr-border-color":"#000000","--ck-qr-background":"#ffffff","--ck-recent-badge-border-radius":"32px","--ck-recent-badge-box-shadow":"inset 0 0 0 2px currentColor","--ck-graphic-primary-color":"#000000","--ck-graphic-primary-background":"#ffffff","--ck-graphic-compass-background":"#FFFFFF","--ck-siwe-border":"#8E8985"},h3={"--ck-font-family":'"Nunito",ui-rounded,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',"--ck-border-radius":"24px","--ck-connectbutton-font-size":"17px","--ck-connectbutton-font-weight":"700","--ck-connectbutton-border-radius":"14px","--ck-connectbutton-color":"#000000","--ck-connectbutton-background":"#ffffff","--ck-connectbutton-box-shadow":"inset 0 0 0 2px #DFE4EC, 0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-hover-background":"#F9FAFB","--ck-connectbutton-balance-color":"#414451","--ck-connectbutton-balance-background":"#F9FAFB","--ck-connectbutton-balance-box-shadow":"0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-balance-hover-background":"#F5F7F9","--ck-connectbutton-balance-hover-box-shadow":"0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-balance-active-box-shadow":"0 0 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-active-background":"#F5F7F9","--ck-connectbutton-active-box-shadow":"inset 0 0 0 2px #CFD7E2, 0 0px 0 0 #CFD7E2, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-primary-button-border-radius":"18px","--ck-primary-button-color":"#000000","--ck-primary-button-background":"#ffffff","--ck-primary-button-box-shadow":"inset 0 0 0 2px #DFE4EC, inset  0 -4px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-primary-button-hover-background":"#F5F7F9","--ck-primary-button-hover-box-shadow":"inset 0 0 0 2px #DFE4EC, inset  0 -2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-secondary-button-border-radius":"16px","--ck-secondary-button-color":"#000000","--ck-secondary-button-background":"#ffffff","--ck-secondary-button-box-shadow":"inset 0 0 0 2px #DFE4EC, inset  0 -4px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-secondary-button-hover-background":"#F5F7F9","--ck-secondary-button-hover-box-shadow":"inset 0 0 0 2px #DFE4EC, inset  0 -2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-input-background":"#F5F7F9","--ck-input-hover-background":"#ffffff","--ck-focus-color":"#1A88F8","--ck-modal-box-shadow":"0px 3px 16px rgba(0, 0, 0, 0.08)","--ck-body-color":"#000000","--ck-body-color-muted":"#93989F","--ck-body-color-muted-hover":"#000000","--ck-body-background":"#ffffff","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"#f6f7f9","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-secondary-hover-outline":"#4282FF","--ck-body-background-tertiary":"#ffffff","--ck-tertiary-border-radius":"22px","--ck-tertiary-box-shadow":"inset 0 0 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-body-action-color":"#93989F","--ck-body-divider":"#DFE4EC","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-body-disclaimer-background":"#F9FAFB","--ck-body-disclaimer-font-size":"14px","--ck-body-disclaimer-font-weight":"700","--ck-body-disclaimer-color":"#959697","--ck-body-disclaimer-link-color":"#646464","--ck-body-disclaimer-link-hover-color":"#000000","--ck-copytoclipboard-stroke":"#CCCCCC","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#ffffff","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":" 0 0 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 2px #DFE4EC,  0 2px 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-dropdown-button-background":"#fff","--ck-dropdown-button-hover-color":"#8B8B8B","--ck-dropdown-button-hover-background":"#F5F7F9","--ck-dropdown-pending-color":"#848D9A","--ck-dropdown-active-color":"#000000","--ck-dropdown-active-static-color":"#848D9A","--ck-dropdown-active-background":"#F5F7F9","--ck-dropdown-color":"#848D9A","--ck-dropdown-background":"#FFFFFF","--ck-dropdown-box-shadow":"0px 2px 15px rgba(0, 0, 0, 0.15)","--ck-dropdown-border-radius":"16px","--ck-alert-color":"#848D9A","--ck-alert-background":"#F5F7F9","--ck-qr-border-radius":"24px","--ck-qr-dot-color":"#111111","--ck-qr-border-color":"#DFE4EC","--ck-modal-h1-font-weight":"700","--ck-modal-heading-font-weight":"700","--ck-primary-button-font-weight":"700","--ck-recent-badge-box-shadow":"inset 0 0 0 2px currentColor","--ck-recent-badge-top-offset":"0px","--ck-siwe-border":"#DFE4EC"},f3={"--ck-border-radius":"12px","--ck-connectbutton-font-size":"17px","--ck-connectbutton-border-radius":"12px","--ck-connectbutton-color":"#414451","--ck-connectbutton-background":"#ffffff","--ck-connectbutton-box-shadow":"inset 0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-hover-background":"#F6F7F9","--ck-connectbutton-hover-box-shadow":"inset 0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-connectbutton-balance-color":"#373737","--ck-connectbutton-balance-background":"#F6F7F9","--ck-connectbutton-balance-box-shadow":"none","--ck-connectbutton-balance-hover-background":"#f1f1f3","--ck-primary-button-border-radius":"12px","--ck-primary-button-color":"#414451","--ck-primary-button-background":"#ffffff","--ck-primary-button-box-shadow":"0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-primary-button-hover-background":"#F6F7F9","--ck-primary-button-hover-box-shadow":"0 0 0 1px #D9DBDD, 0px 0 0 rgba(0, 0, 0, 0.02)","--ck-secondary-button-border-radius":"12px","--ck-secondary-button-color":"#414451","--ck-secondary-button-background":"#ffffff","--ck-secondary-button-box-shadow":"0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)","--ck-secondary-button-hover-background":"#F6F7F9","--ck-secondary-button-hover-box-shadow":"0 0 0 1px #D9DBDD, 0px 0 0 rgba(0, 0, 0, 0.02)","--ck-input-background":"#F6F7F9","--ck-input-hover-background":"#ffffff","--ck-focus-color":"#1A88F8","--ck-modal-box-shadow":"0px 3px 16px rgba(0, 0, 0, 0.08)","--ck-body-color":"#414451","--ck-body-color-muted":"#9196A1","--ck-body-color-muted-hover":"#000000","--ck-body-background":"#ffffff","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary":"#f6f7f9","--ck-body-background-secondary-hover-background":"#e0e4eb","--ck-body-background-secondary-hover-outline":"#4282FF","--ck-body-background-tertiary":"#F6F8FA","--ck-tertiary-border-radius":"13px","--ck-tertiary-box-shadow":"inset 0 0 0 1px rgba(0, 0, 0, 0.04)","--ck-body-action-color":"#999999","--ck-body-divider":"#f7f6f8","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B","--ck-body-disclaimer-background":"#F9FAFA","--ck-body-disclaimer-color":"#AFB1B6","--ck-body-disclaimer-link-color":"#787B84","--ck-body-disclaimer-link-hover-color":"#000000","--ck-copytoclipboard-stroke":"#CCCCCC","--ck-tooltip-background":"#ffffff","--ck-tooltip-background-secondary":"#ffffff","--ck-tooltip-color":"#999999","--ck-tooltip-shadow":"0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)","--ck-dropdown-button-background":"#fff","--ck-dropdown-button-hover-color":"#8B8B8B","--ck-dropdown-button-hover-background":"#E7E7E7","--ck-dropdown-color":"rgba(55, 55, 55, 0.4)","--ck-dropdown-box-shadow":"0px 2px 15px rgba(0, 0, 0, 0.15)","--ck-alert-color":"#9196A1","--ck-alert-background":"#F6F8FA","--ck-alert-box-shadow":"inset 0 0 0 1px rgba(0, 0, 0, 0.04)","--ck-alert-border-radius":"8px","--ck-qr-border-radius":"12px","--ck-qr-dot-color":"#2E3138","--ck-qr-border-color":"#E9EAEC","--ck-siwe-border":"#EAEBED"},g3={"--ck-font-family":"Lato","--ck-border-radius":"0px","--ck-connectbutton-color":"#373737","--ck-connectbutton-background":"linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 100% / 200% 200%, #F5F5F1","--ck-connectbutton-box-shadow":" 0 0 0 1px #003C74, 2px 2px 0px rgba(255, 255, 255, 0.75), -2px -2px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-connectbutton-border-radius":"4.5px","--ck-connectbutton-hover-color":"#373737","--ck-connectbutton-hover-background":"linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 0% / 200% 200%, #F5F5F1","--ck-connectbutton-active-background":"linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 100% / 200% 200%, #F5F5F1","--ck-connectbutton-balance-color":"#373737","--ck-connectbutton-balance-background":"#fff","--ck-connectbutton-balance-box-shadow":"0 0 0 1px #E4E7E7","--ck-connectbutton-balance-hover-box-shadow":"0 0 0 1px #d7dbdb","--ck-connectbutton-balance-active-box-shadow":"0 0 0 1px #bbc0c0","--ck-focus-color":"#1A88F8","--ck-overlay-background":"rgba(0, 127,  128, 0.8)","--ck-body-color":"#373737","--ck-body-color-muted":"#808080","--ck-body-color-muted-hover":"#111111","--ck-body-background":"#F0EDE2","--ck-body-background-transparent":"rgba(255,255,255,0)","--ck-body-background-secondary-hover-background":"#FAFAFA","--ck-body-background-secondary-hover-outline":"#4282FF","--ck-body-action-color":"#373737","--ck-body-color-danger":"#FC6464","--ck-body-color-valid":"#32D74B","--ck-body-divider":"#919B9C","--ck-body-divider-box-shadow":"0px 1px 0px #FBFBF8","--ck-primary-button-background":"linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1","--ck-primary-button-box-shadow":"inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-primary-button-border-radius":"6px","--ck-primary-button-hover-box-shadow":"inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 5px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-primary-button-hover-border-radius":"6px","--ck-modal-heading-font-weight":400,"--ck-modal-box-shadow":`
    inset 0px -3px 0px #0F37A9,
    inset -2px 0px 0px #0F37A9,
    inset 0px -4px 0px #0D5DDF,
    inset -4px 0px 0px #0D5DDF,
    inset 2px 0px 0px #0453DD,
    inset 0px 2px 0px #044FD1,
    inset 4px 0px 0px #4283EB,
    inset 0px 4px 0px #4283EB
  `,"--ck-modal-h1-font-weight":400,"--ck-secondary-button-color":"#373737","--ck-secondary-button-border-radius":"6px","--ck-secondary-button-box-shadow":"inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-secondary-button-background":"linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1","--ck-secondary-button-hover-box-shadow":"inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 4px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-input-background":"","--ck-input-hover-background":"linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1","--ck-body-background-secondary":"rgba(0, 0, 0, 0.1)","--ck-body-background-tertiary":"linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)","--ck-tertiary-border-radius":"0px","--ck-tertiary-box-shadow":"inset 0 0 0 1px #919B9C, 1px 1px 2px rgba(0, 0, 0, 0.15), inset -2px -2px 0px #FFFFFF","--ck-body-button-text-align":"left","--ck-body-button-box-shadow":"0 2px 4px rgba(0, 0, 0, 0.05 )","--ck-body-disclaimer-background":"linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)","--ck-body-disclaimer-box-shadow":`
    inset 0px -3px 0px #0F37A9,
    inset -2px 0px 0px #0F37A9,
    inset 0px -4px 0px #0D5DDF,
    inset -4px 0px 0px #0D5DDF,
    inset 2px 0px 0px #0453DD,
    inset 4px 0px 0px #4283EB,
    inset 0 1px 0 0 #919B9C`,"--ck-body-disclaimer-font-size":"14px","--ck-body-disclaimer-color":"#959594","--ck-body-disclaimer-link-color":"#626262","--ck-body-disclaimer-link-hover-color":"#000000","--ck-qr-dot-color":"#000000","--ck-qr-border-color":"#919B9C","--ck-qr-border-radius":"0","--ck-qr-background":"#FFFFFF","--ck-copytoclipboard-stroke":"rgba(55, 55, 55, 0.4)","--ck-tooltip-background":"linear-gradient(270deg, #F7F3E6 7.69%, #F5F7DA 100%)","--ck-tooltip-background-secondary":"#f6f7f9","--ck-tooltip-color":"#000000","--ck-tooltip-shadow":" 0 0 0 1.5px #2b2622, 0px 2px 10px rgba(0, 0, 0, 0.08)","--ck-spinner-color":"var(--ck-focus-color)","--ck-dropdown-button-color":"#999999","--ck-dropdown-button-box-shadow":"0 0 0 1px #A0A0A0, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset -1px -2px 2px rgba(0, 0, 0, 0.2)","--ck-dropdown-button-background":"linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1","--ck-dropdown-button-hover-background":"linear-gradient(0deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1","--ck-dropdown-pending-color":"#ACA899","--ck-dropdown-active-color":"#FFFFFF","--ck-dropdown-active-static-color":"#ACA899","--ck-dropdown-active-background":"#3F69BF","--ck-dropdown-active-border-radius":"0","--ck-dropdown-active-inset":"-12px","--ck-dropdown-color":"#ACA899","--ck-dropdown-background":"#FFFFFF","--ck-dropdown-box-shadow":"inset 0 0 0 1px #ACA899, 2px 2px 7px rgba(0, 0, 0, 0.15)","--ck-dropdown-border-radius":"0","--ck-alert-color":"#ACA899","--ck-alert-background":"linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)","--ck-alert-box-shadow":"inset 0 0 0 1px #919B9C, 1px 1px 2px rgba(0, 0, 0, 0.15), inset -2px -2px 0px #FFFFFF","--ck-alert-border-radius":"0","--ck-recent-badge-border-radius":"32px","--ck-recent-badge-top-offset":"0px","--ck-graphic-primary-color":"#333333","--ck-graphic-primary-background":"#FFFFFF","--ck-graphic-compass-background":"#FFFFFF","--ck-siwe-border":"#919B9C"};var Dt={base:c3,web95:g3,retro:p3,soft:f3,midnight:l3,minimal:d3,rounded:h3,nouns:u3};const Cn={default:{"--ck-font-family":`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji',
    'Segoe UI Symbol'`,"--ck-border-radius":"20px","--ck-secondary-button-border-radius":"16px"},graphics:{light:{"--ck-graphic-wave-stop-01":"#E8F17D","--ck-graphic-wave-stop-02":"#A8ECDE","--ck-graphic-wave-stop-03":"#7AA1F2","--ck-graphic-wave-stop-04":"#DEA1E8","--ck-graphic-wave-stop-05":"#F46D98","--ck-graphic-scaniconwithlogos-01":"#4E4E4E","--ck-graphic-scaniconwithlogos-02":"#272727","--ck-graphic-scaniconwithlogos-03":"#F8D74A","--ck-graphic-scaniconwithlogos-04":"#F6F7F9","--ck-chain-ethereum-01":"#25292E","--ck-chain-ethereum-02":"#ffffff","--ck-chain-ethereum-03":"#DFE0E0","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B"},dark:{"--ck-graphic-wave-stop-01":"#E8F17D","--ck-graphic-wave-stop-02":"#A8ECDE","--ck-graphic-wave-stop-03":"#7AA1F2","--ck-graphic-wave-stop-04":"#DEA1E8","--ck-graphic-wave-stop-05":"#F46D98","--ck-graphic-scaniconwithlogos-01":"#AFAFAF","--ck-graphic-scaniconwithlogos-02":"#696969","--ck-graphic-scaniconwithlogos-03":"#F8D74A","--ck-graphic-scaniconwithlogos-04":"#3D3D3D","--ck-body-color-danger":"#FF4E4E","--ck-body-color-valid":"#32D74B"}},ens:{light:{"--ck-ens-01-start":"#FF3B30","--ck-ens-01-stop":"#FF9500","--ck-ens-02-start":"#FF9500","--ck-ens-02-stop":"#FFCC00","--ck-ens-03-start":"#FFCC00","--ck-ens-03-stop":"#34C759","--ck-ens-04-start":"#5856D6","--ck-ens-04-stop":"#AF52DE","--ck-ens-05-start":"#5AC8FA","--ck-ens-05-stop":"#007AFF","--ck-ens-06-start":"#007AFF","--ck-ens-06-stop":"#5856D6","--ck-ens-07-start":"#5856D6","--ck-ens-07-stop":"#AF52DE","--ck-ens-08-start":"#AF52DE","--ck-ens-08-stop":"#FF2D55"},dark:{"--ck-ens-01-start":"#FF453A","--ck-ens-01-stop":"#FF9F0A","--ck-ens-02-start":"#FF9F0A","--ck-ens-02-stop":"#FFD60A","--ck-ens-03-start":"#FFD60A","--ck-ens-03-stop":"#32D74B","--ck-ens-04-start":"#32D74B","--ck-ens-04-stop":"#64D2FF","--ck-ens-05-start":"#64D2FF","--ck-ens-05-stop":"#0A84FF","--ck-ens-06-start":"#0A84FF","--ck-ens-06-stop":"#5E5CE6","--ck-ens-07-start":"#5E5CE6","--ck-ens-07-stop":"#BF5AF2","--ck-ens-08-start":"#BF5AF2","--ck-ens-08-stop":"#FF2D55"}},brand:{"--ck-family-accounts-brand":"#0090ff","--ck-family-brand":"#1A88F8","--ck-brand-walletConnect":"#3B99FC","--ck-brand-coinbaseWallet":"#0052FF","--ck-brand-metamask":"#FF5C16","--ck-brand-metamask-bg":"#FFF2EB","--ck-brand-metamask-01":"#FF5C16","--ck-brand-metamask-02":"#E34807","--ck-brand-metamask-03":"#FF8D5D","--ck-brand-metamask-04":"#661800","--ck-brand-metamask-05":"#C0C4CD","--ck-brand-metamask-06":"#E7EBF6","--ck-brand-trust-01":"#3375BB","--ck-brand-trust-02":"#ffffff","--ck-brand-trust-01b":"#ffffff","--ck-brand-trust-02b":"#3375BB","--ck-brand-argent":"#f36a3d","--ck-brand-imtoken-01":"#11C4D1","--ck-brand-imtoken-02":"#0062AD","--ck-brand-safe":"#12FF80","--ck-brand-dawn":"#000000"}},$t={light:Dt.base.light,dark:Dt.base.dark,web95:Dt.web95,retro:Dt.retro,soft:Dt.soft,midnight:Dt.midnight,minimal:Dt.minimal,rounded:Dt.rounded,nouns:Dt.nouns},v3=(e,t)=>pe`
    ${Object.keys(e).map(r=>{const o=e[r];return o&&`${r}:${o};`})}
  `,rt=(e,t)=>{const r=t?" !important":"";return pe`
    ${Object.keys(e).map(o=>{const i=e[o];return i&&`${o}:${i}${r};`})}
    @supports (color: color(display-p3 1 1 1)) {
      ${Object.keys(e).map(o=>{const i=e[o];return`${o}:${s3(i)}${r};`})}
    }
  `},ht={default:v3(Cn.default),light:rt($t.light),dark:rt($t.dark),web95:rt($t.web95),retro:rt($t.retro),soft:rt($t.soft),midnight:rt($t.midnight),minimal:rt($t.minimal),rounded:rt($t.rounded),nouns:rt($t.nouns)},Ln={brand:rt(Cn.brand),ensLight:rt(Cn.ens.light),ensDark:rt(Cn.ens.dark),graphicsLight:rt(Cn.graphics.light),graphicsDark:rt(Cn.graphics.dark)},il=pe`
  ${Ln.brand}
  ${Ln.ensLight}
  ${Ln.graphicsLight}
`,al=pe`
  ${Ln.brand}
  ${Ln.ensDark}
  ${Ln.graphicsDark}
`;let Tt="auto";const _o=E(F.div)`
  ${ht.default}

  ${e=>{switch(e.$useTheme){case"web95":return Tt="light",ht.web95;case"retro":return Tt="light",ht.retro;case"soft":return Tt="light",ht.soft;case"midnight":return Tt="dark",ht.midnight;case"minimal":return Tt="light",ht.minimal;case"rounded":return Tt="light",ht.rounded;case"nouns":return Tt="light",ht.nouns;default:return e.$useMode==="light"?(Tt="light",ht.light):e.$useMode==="dark"?(Tt="dark",ht.dark):pe`
            @media (prefers-color-scheme: light) {
              ${ht.light}
            }
            @media (prefers-color-scheme: dark) {
              ${ht.dark}
            }
          `}}}

  ${e=>{switch(Tt){case"light":return il;case"dark":return al;default:return pe`
          ${il}
          @media (prefers-color-scheme: dark) {
            ${al}
          }
        `}}}

  ${e=>{var t,r;if(!((t=e.$customTheme)===null||t===void 0)&&t["--ck-accent-color"]&&["light","dark","auto","",void 0].includes(e.$useTheme)){const o=e.$customTheme["--ck-accent-color"],i=(r=e.$customTheme["--ck-accent-text-color"])!==null&&r!==void 0?r:"#ffffff";return{"--ck-accent-color":o,"--ck-accent-text-color":i,"--ck-secondary-button-background":o,"--ck-secondary-button-hover-background":o,"--ck-secondary-button-color":i,"--ck-button-primary-color":i,"--ck-focus-color":o}}if(e.$customTheme)return rt(e.$customTheme,!0)}}

  all: initial;
  text-align: left;
  text-direction: ltr;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-stroke: 0.001px transparent;
  text-size-adjust: none;
  font-size: 16px;

  button {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-text-stroke: 0.001px transparent;
  }

  &,
  * {
    font-family: var(--ck-font-family);
    box-sizing: border-box;
    outline: none;
    border: none;
  }
  /*
  @media (prefers-reduced-motion) {
    * {
      animation-duration: 60ms !important;
      transition-duration: 60ms !important;
    }
  }
  */
  img,
  svg {
    max-width: 100%;
  }
  strong {
    font-weight: 600;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--ck-focus-color);
  }
`;function m3(e){return e.split("").map(t=>t.charCodeAt(0)).reduce((t,r)=>t+r)%100/100}const sl=E(F.div)`
  will-change: transform; // Needed for Safari
  pointer-events: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: ${e=>`${e.$radius}px`};
  width: ${e=>`${e.$size}px`};
  height: ${e=>`${e.$size}px`};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  &:before {
    content: '';
    z-index: 1;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  }
  ${e=>{if(e.$seed){const t=Math.ceil(m3(e.$seed)*8),r=`0${t===0?1:t}`;return pe`
        background: var(--ck-ens-${r}-start);
        background: linear-gradient(
          180deg,
          var(--ck-ens-${r}-start) 0%,
          var(--ck-ens-${r}-stop) 100%
        );
      `}}}
`,x3=E(F.img)`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${e=>e.$loaded?1:0};
  will-change: opacity; // Needed for Safari
  transition: opacity 500ms ease;
  transform: scale(1.01); // fixes background color bleeding
`,Gu=({address:e,name:t,size:r=96,radius:o=96})=>{var i;const a=sd(),c=U(),s=Wo(),l=ot(),d=s?.kind==="bridge"&&!!l&&((i=l.chainId)!==null&&i!==void 0?i:0)===1,u=v.useRef(null),[p,h]=v.useState(!0),[f,g]=v.useState({});return v.useEffect(()=>{if(!d){g({address:e,name:t});return}(async()=>{var b,y,w,C,k,x;let S=e,O=t;const j=e?.startsWith("0x")?e:void 0;try{if(t&&l.getEnsAddress&&(S=(b=await l.getEnsAddress(t))!==null&&b!==void 0?b:e),j&&l.getEnsName&&(O=(y=await l.getEnsName({address:j}))!==null&&y!==void 0?y:t),((w=l.account)===null||w===void 0?void 0:w.address)===e&&(!((C=l.account)===null||C===void 0)&&C.ensName)&&(O=l.account.ensName),((k=l.account)===null||k===void 0?void 0:k.address)===e&&(!((x=l.account)===null||x===void 0)&&x.ensAvatar)){g({address:S??e,name:O??t,avatar:l.account.ensAvatar});return}let A;O&&l.getEnsAvatar&&(A=await l.getEnsAvatar(O)),g({address:S??e,name:O??t,avatar:A})}catch{g({address:S??e,name:O??t})}})()},[d,l,e,t]),v.useEffect(()=>{var m;!((m=u.current)===null||m===void 0)&&m.complete&&u.current.naturalHeight!==0||h(!1)},[f.avatar]),a?c.uiConfig.customAvatar?n.jsx("div",{style:{width:r,height:r,borderRadius:o,overflow:"hidden"},children:c.uiConfig.customAvatar({address:e??f?.address,ensName:t??f?.name,ensImage:f?.avatar,size:r,radius:o})}):!f.name||!f.avatar?n.jsx(_o,{style:{pointerEvents:"none"},children:n.jsx(sl,{$size:r,$seed:f.address,$radius:o})}):n.jsx(_o,{style:{pointerEvents:"none"},children:n.jsx(sl,{$size:r,$seed:f.address,$radius:o,children:n.jsx(x3,{ref:u,src:f.avatar,alt:f.name,onLoad:()=>h(!0),$loaded:p})})}):n.jsx("div",{style:{width:r,height:r,borderRadius:o}})},wn=({testnet:e,...t})=>n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"black"},children:[n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M20.5611 8.12948C21.0082 7.90729 21.5007 7.79167 22 7.79167C22.4993 7.79167 22.9919 7.90729 23.439 8.12948L23.4408 8.1304L33.0387 12.9293C33.577 13.197 34.031 13.61 34.3478 14.121C34.6649 14.6323 34.833 15.2218 34.8333 15.8234V27.2595C34.833 27.8611 34.6649 28.4511 34.3478 28.9624C34.031 29.4733 33.578 29.8858 33.0398 30.1535L23.4411 34.9528C22.9919 35.1775 22.4963 35.2947 21.994 35.2947C21.4918 35.2947 20.9964 35.1777 20.5472 34.9529L10.9475 30.1531L10.9452 30.1519C10.4071 29.8808 9.95535 29.4646 9.6411 28.9504C9.32739 28.437 9.16312 27.8464 9.16673 27.2448L9.16675 27.2417L10.0004 27.2475H9.16673V27.2448V15.8239C9.16705 15.2223 9.33518 14.6322 9.65222 14.121C9.96906 13.61 10.4221 13.1976 10.9604 12.9298L20.5592 8.1304L20.5611 8.12948ZM21.3031 9.62267L11.8706 14.3389L22 19.4036L32.1294 14.3389L22.697 9.62267C22.4806 9.51531 22.2416 9.45905 22 9.45905C21.7585 9.45905 21.5194 9.51534 21.3031 9.62267ZM10.8341 15.8241C10.8341 15.7785 10.8362 15.733 10.8401 15.6878L21.1663 20.8509V33.3983L11.6955 28.6629C11.4352 28.5315 11.2159 28.3297 11.0638 28.0809C10.9116 27.8318 10.8321 27.5452 10.8341 27.2533L10.8341 27.2475V15.8241ZM22.8337 33.3923L32.2967 28.6608C32.5576 28.5312 32.7772 28.3313 32.9308 28.0836C33.0844 27.836 33.1658 27.5504 33.166 27.259V15.8243C33.1659 15.7786 33.1639 15.7331 33.1599 15.6878L22.8337 20.8509V33.3923Z",fill:"url(#paint0_linear_3546_7073)"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M10.8341 15.8241C10.8341 15.7785 10.8362 15.733 10.8401 15.6878L21.1663 20.8509V33.3983L11.6955 28.6629C11.4352 28.5315 11.2159 28.3297 11.0638 28.0809C10.9116 27.8318 10.8321 27.5452 10.8341 27.2533L10.8341 27.2475V15.8241Z",fill:"url(#paint1_linear_3546_7073)",fillOpacity:"0.3"}),n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"paint0_linear_3546_7073",x1:"22",y1:"7.79167",x2:"22",y2:"35.2947",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"white"}),n.jsx("stop",{offset:"1",stopColor:"white",stopOpacity:"0.7"})]}),n.jsxs("linearGradient",{id:"paint1_linear_3546_7073",x1:"22",y1:"7.79167",x2:"22",y2:"35.2947",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"white"}),n.jsx("stop",{offset:"1",stopColor:"white",stopOpacity:"0.7"})]})]})]}),b3=({testnet:e,...t})=>n.jsx(wn,{testnet:!0,...t}),y3=({testnet:e,...t})=>{let r="var(--ck-chain-ethereum-01, #25292E)",o="var(--ck-chain-ethereum-02, #ffffff)";return e&&(r="linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)",o="#fff"),n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:r},children:[n.jsx("path",{d:"M21.9967 6.99621L21.7955 7.67987V27.5163L21.9967 27.7171L31.2044 22.2744L21.9967 6.99621Z",fill:o}),n.jsx("path",{d:"M21.9957 6.99621L12.7878 22.2744L21.9957 27.7171V18.0891V6.99621Z",fill:o}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M21.9959 36.9996L21.9959 36.9997V36.9995L31.2091 24.0243L21.9959 29.4642L12.788 24.0243L21.9957 36.9993L21.9958 36.9997L21.9959 36.9996Z",fill:o}),n.jsx("path",{d:"M21.996 27.7181L31.2037 22.2753L21.996 18.09V27.7181Z",fill:o}),n.jsx("path",{d:"M12.7878 22.2753L21.9957 27.7181V18.09L12.7878 22.2753Z",fill:o})]})},C3=({testnet:e,...t})=>n.jsx("svg",{...t,width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#2C2D30"},children:n.jsx("path",{d:"M30.4076 17.2002C29.1337 17.2002 27.9906 17.6998 27.1194 18.506L27.0299 18.4612C26.8302 15.8187 24.6817 13.7344 21.9891 13.7344C19.2966 13.7344 17.1481 15.8187 16.9484 18.4612L16.8589 18.506C15.9877 17.6998 14.8446 17.2002 13.5706 17.2002C10.7438 17.2002 8.45068 19.4947 8.45068 22.3267C8.45068 24.7727 10.8781 26.8709 11.4807 27.3532C14.3144 29.6098 18.0054 30.9293 21.9891 30.9293C25.9729 30.9293 29.6639 29.6098 32.4976 27.3532C33.1036 26.8709 35.5276 24.7762 35.5276 22.3267C35.5276 19.4947 33.2345 17.2002 30.4042 17.2002H30.4076Z",fill:"white"})}),w3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#6F41D8"},children:n.jsx("path",{d:"M29.0015 17.4529C28.4941 17.1572 27.8355 17.1572 27.2773 17.4529L23.3186 19.7271L20.6305 21.2094L16.6719 23.4822C16.1645 23.7792 15.5059 23.7792 14.9476 23.4822L11.8016 21.703C11.2943 21.4074 10.9395 20.8642 10.9395 20.2702V16.7612C10.9395 16.1686 11.2434 15.6255 11.8016 15.3285L14.8954 13.5988C15.4041 13.3018 16.0641 13.3018 16.6224 13.5988L19.7161 15.3285C20.2249 15.6255 20.5796 16.1686 20.5796 16.7612V19.0355L23.2678 17.5024V15.2295C23.2707 14.9343 23.1917 14.6441 23.0395 14.3911C22.8873 14.1381 22.6679 13.9324 22.4056 13.7968L16.6719 10.5353C16.1645 10.2382 15.5059 10.2382 14.9476 10.5353L9.11214 13.7968C8.84992 13.9324 8.63049 14.1381 8.47828 14.3911C8.32607 14.6441 8.24705 14.9343 8.25002 15.2295V21.802C8.25002 22.396 8.55389 22.9391 9.11214 23.2361L14.9476 26.4976C15.455 26.7932 16.115 26.7932 16.6719 26.4976L20.6305 24.2729L23.3186 22.7411L27.2773 20.5177C27.7846 20.2207 28.4433 20.2207 29.0015 20.5177L32.0966 22.2475C32.6054 22.5431 32.9588 23.0863 32.9588 23.6803V27.1893C32.9588 27.7819 32.6563 28.325 32.0966 28.622L29.0029 30.4013C28.4941 30.6983 27.8341 30.6983 27.2773 30.4013L24.1821 28.6715C23.6734 28.3745 23.3186 27.8314 23.3186 27.2387V24.9645L20.6305 26.4976V28.7705C20.6305 29.3631 20.9344 29.9076 21.4926 30.2032L27.3281 33.4647C27.8355 33.7617 28.4941 33.7617 29.0524 33.4647L34.8879 30.2032C35.3953 29.9076 35.75 29.3645 35.75 28.7705V22.198C35.753 21.9028 35.674 21.6126 35.5218 21.3596C35.3695 21.1066 35.1501 20.9009 34.8879 20.7653L29.0029 17.4529H29.0015Z",fill:"white"})}),k3=({testnet:e,...t})=>n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#FF0420"},children:[n.jsx("path",{d:"M15.5877 27.8473C14.2777 27.8473 13.2045 27.539 12.3679 26.9226C11.5422 26.2952 11.1294 25.4035 11.1294 24.2477C11.1294 24.0055 11.157 23.7082 11.212 23.356C11.3552 22.5634 11.5588 21.6112 11.823 20.4994C12.5715 17.4722 14.5034 15.9586 17.6187 15.9586C18.4664 15.9586 19.2259 16.1017 19.8974 16.3879C20.5689 16.663 21.0973 17.0814 21.4826 17.6428C21.8678 18.1932 22.0605 18.8537 22.0605 19.6242C22.0605 19.8554 22.033 20.1471 21.9779 20.4994C21.8128 21.4791 21.6146 22.4313 21.3835 23.356C20.9982 24.8641 20.3322 25.9924 19.3855 26.741C18.4388 27.4785 17.1729 27.8473 15.5877 27.8473ZM15.8189 25.4695C16.4354 25.4695 16.9582 25.2879 17.3876 24.9247C17.8279 24.5614 18.1416 24.0055 18.3287 23.257C18.5819 22.2222 18.7746 21.3195 18.9067 20.5489C18.9507 20.3178 18.9727 20.0811 18.9727 19.8389C18.9727 18.8372 18.4498 18.3363 17.4041 18.3363C16.7876 18.3363 16.2592 18.5179 15.8189 18.8812C15.3896 19.2445 15.0813 19.8004 14.8943 20.5489C14.6961 21.2865 14.4979 22.1892 14.2998 23.257C14.2557 23.477 14.2337 23.7082 14.2337 23.9504C14.2337 24.9632 14.7622 25.4695 15.8189 25.4695Z",fill:"white"}),n.jsx("path",{d:"M22.8188 27.6815C22.6977 27.6815 22.6041 27.6429 22.5381 27.5659C22.483 27.4778 22.4665 27.3788 22.4885 27.2687L24.7672 16.5358C24.7892 16.4147 24.8498 16.3156 24.9489 16.2385C25.0479 16.1615 25.1525 16.1229 25.2626 16.1229H29.6548C30.8767 16.1229 31.8564 16.3761 32.5939 16.8825C33.3426 17.3889 33.7168 18.1209 33.7168 19.0786C33.7168 19.3538 33.6838 19.64 33.6177 19.9372C33.3426 21.2032 32.7867 22.1389 31.95 22.7443C31.1244 23.3498 29.9905 23.6525 28.5485 23.6525H26.3194L25.5598 27.2687C25.5377 27.3898 25.4772 27.4888 25.3782 27.5659C25.2791 27.6429 25.1745 27.6815 25.0645 27.6815H22.8188ZM28.6641 21.3738C29.1264 21.3738 29.5282 21.2472 29.8695 20.994C30.2217 20.7408 30.4529 20.3776 30.563 19.9042C30.596 19.717 30.6125 19.552 30.6125 19.4089C30.6125 19.0896 30.519 18.8474 30.3318 18.6823C30.1446 18.5062 29.8255 18.4182 29.3741 18.4182H27.3926L26.7652 21.3738H28.6641Z",fill:"white"}),n.jsx("rect",{x:"5.5",y:"5.5",width:"33",height:"33",rx:"16.5",fill:"white"}),n.jsx("path",{d:"M38.5 22C38.5 12.8924 31.0968 5.52416 22 5.5C12.879 5.5 5.5 12.8924 5.5 22C5.5 31.1076 12.9032 38.4758 22 38.5C31.121 38.5 38.5 31.1076 38.5 22ZM21.9758 30.2379V37.7994C15.3226 37.7994 9.92742 32.4122 9.92742 25.7687C9.92742 19.1252 15.3226 13.7379 21.9758 13.7379V6.17643C28.629 6.17643 34.0242 11.5637 34.0242 18.2072C34.0242 24.8507 28.629 30.2379 21.9758 30.2379Z",fill:"#FF0420"}),n.jsx("path",{d:"M22.0239 16.3223H21.9271C20.6691 18.8347 18.8062 20.6949 16.29 21.9511V22.0477C18.8062 23.304 20.6691 25.1641 21.9271 27.6766H22.0239C23.282 25.1641 25.1449 23.304 27.661 22.0477V21.9511C25.1449 20.6949 23.282 18.8347 22.0239 16.3223Z",fill:"#FF0420"})]}),E3=({testnet:e,...t})=>{const r=e?"#ffffff":"#28A0F0",o=e?"#ffffff":"#96BEDC";return n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#2C364F"},children:[!e&&n.jsx("path",{d:"M25.7948 20.5826L28.2683 16.3854L34.9355 26.7696L34.9386 28.7625L34.9168 15.0491C34.9011 14.7137 34.7231 14.407 34.4391 14.2261L22.4357 7.32182C22.1551 7.1838 21.7989 7.18546 21.5187 7.32618C21.4807 7.34524 21.4453 7.36576 21.4113 7.38835L21.3694 7.41467L9.71816 14.1664L9.67298 14.1871C9.61474 14.2137 9.55609 14.2479 9.50076 14.2872C9.27983 14.4456 9.1331 14.68 9.08564 14.9425C9.07859 14.9823 9.0732 15.023 9.07092 15.064L9.08916 26.239L15.2994 16.6138C16.0811 15.3376 17.7847 14.9262 19.3662 14.9488L21.2221 14.9977L10.2862 32.5356L11.5753 33.2778L22.6422 15.0155L27.5338 14.9977L16.4956 33.7209L21.0955 36.3668L21.6451 36.6827C21.8776 36.7772 22.1516 36.7819 22.386 36.6972L34.5581 29.6433L32.2309 30.9918L25.7948 20.5826ZM26.7384 34.175L22.0925 26.8829L24.9287 22.0702L31.0303 31.6876L26.7384 34.175Z",fill:"#2D374B"}),n.jsx("path",{d:"M22.0924 26.8832L26.7385 34.1751L31.0302 31.6879L24.9286 22.0705L22.0924 26.8832Z",fill:r}),n.jsx("path",{d:"M34.9387 28.7627L34.9356 26.7698L28.2684 16.3856L25.7949 20.5828L32.2312 30.992L34.5584 29.6435C34.7866 29.4582 34.9248 29.1861 34.9393 28.8926L34.9387 28.7627Z",fill:r}),n.jsx("path",{d:"M7 30.642L10.2863 32.5356L21.2222 14.9976L19.3663 14.9487C17.785 14.9263 16.0814 15.3375 15.2995 16.6137L9.08927 26.239L7 29.449V30.642V30.642Z",fill:"white"}),n.jsx("path",{d:"M27.534 14.9977L22.6423 15.0155L11.5754 33.2778L15.4437 35.5049L16.4955 33.7209L27.534 14.9977Z",fill:"white"}),n.jsx("path",{d:"M37 14.9723C36.9592 13.9493 36.4052 13.013 35.5377 12.4677L23.377 5.47434C22.5187 5.04223 21.4466 5.04161 20.5868 5.47414C20.4852 5.52533 8.76078 12.3251 8.76078 12.3251C8.5985 12.4029 8.44224 12.4955 8.2953 12.6008C7.52081 13.156 7.0487 14.0186 7 14.9661V29.4492L9.08927 26.2392L9.07103 15.0639C9.07352 15.0231 9.0787 14.9827 9.08575 14.9431C9.133 14.6801 9.27994 14.4457 9.50086 14.2872C9.5562 14.2478 21.4806 7.34517 21.5186 7.32611C21.799 7.18538 22.155 7.18373 22.4356 7.32175L34.439 14.226C34.723 14.4069 34.901 14.7137 34.9167 15.049V28.8921C34.9022 29.1856 34.7862 29.4577 34.558 29.643L32.2308 30.9916L31.03 31.6875L26.7383 34.1747L22.3859 36.6969C22.1515 36.7817 21.8773 36.7769 21.645 36.6824L16.4955 33.7206L15.4435 35.5046L20.0713 38.169C20.2243 38.256 20.3607 38.3331 20.4726 38.3961C20.6458 38.4933 20.764 38.5582 20.8056 38.5785C21.1345 38.7383 21.6077 38.8311 22.0342 38.8311C22.4251 38.8311 22.8064 38.7594 23.1672 38.6181L35.8092 31.2971C36.5347 30.7348 36.9617 29.8869 37 28.9686V14.9723Z",fill:o})]})},S3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#571AFF"},children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M26.1834 8.14754C25.6606 8.23504 25.3644 8.50235 24.9216 9.28591C24.5651 9.91722 24.4762 10.0244 24.2024 10.1592L23.9832 10.2668L19.2967 10.286L14.6097 10.3057L14.3875 10.3902C13.7059 10.6492 13.6192 10.7135 11.6291 12.4407C9.72243 14.0953 9.64893 14.1723 9.59249 14.5836C9.54437 14.9362 9.78981 15.6327 10.5191 17.2143C11.2847 18.8737 11.2839 18.8641 10.7444 19.5256C10.2645 20.1136 10.2269 20.2588 10.2041 21.5915C10.1717 23.502 10.2487 27.6023 10.3222 27.8591C10.3572 27.9816 10.7908 29.204 11.2861 30.5755C11.7813 31.9471 12.4192 33.715 12.704 34.5038C13.4281 36.5107 13.4814 36.5986 14.0392 36.7237C14.3066 36.7837 14.3206 36.781 18.9677 35.7258C24.4395 34.4837 23.7264 34.709 25.0739 33.7968C29.8732 30.5475 29.7337 30.66 29.8969 29.9083C30.0583 29.1642 30.1082 29.1379 31.8267 28.8999C34.6122 28.5145 34.6328 28.5083 34.8831 28.0109C35.0182 27.7423 35.7786 23.3406 35.8136 22.6209C35.8504 21.8828 36.042 22.221 33.3816 18.3395C30.022 13.4382 30.2381 13.7777 30.2399 13.4041C30.2407 13.1735 30.3366 12.9736 31.3236 11.1418C31.8236 10.2134 32.2742 9.35241 32.3254 9.22904C32.5236 8.74691 32.4204 8.3921 32.0301 8.21622L31.8267 8.12391L29.1102 8.11822C27.6048 8.11516 26.2997 8.12829 26.1834 8.14754ZM30.0474 9.4876C30.5623 9.72297 30.5382 9.82447 29.5119 11.7398C28.4317 13.7558 28.3157 13.2711 30.7154 16.7707C31.639 18.1173 32.8076 19.8218 33.3124 20.5581C34.6844 22.5592 34.6048 22.1799 34.1831 24.6903C33.7858 27.0602 33.7792 27.0817 33.3759 27.282C33.1506 27.394 33.2276 27.3813 30.8493 27.7117C28.9147 27.9803 28.8543 28.017 28.6719 29.0338C28.5778 29.557 28.4606 29.8169 28.2243 30.0247C28.0808 30.1512 24.8682 32.368 23.9451 32.9778C23.2587 33.4311 23.6861 33.3152 17.7471 34.6574C17.1997 34.7812 16.4079 34.9632 15.987 35.0617C14.4588 35.4195 14.4299 35.4033 13.8804 33.8948C12.9188 31.2528 11.6811 27.7957 11.6194 27.5787C11.5534 27.3463 11.549 27.1202 11.549 24.059V20.7878L11.6501 20.5966C11.7056 20.4912 11.8671 20.2759 12.0088 20.118C12.8418 19.19 12.8383 19.1183 11.8601 16.9907C10.7663 14.612 10.6797 14.9992 12.697 13.2501C14.2418 11.91 14.3048 11.8593 14.5905 11.7237L14.8394 11.6055L19.6983 11.5854C23.5417 11.5692 24.5891 11.5543 24.7103 11.515C25.1465 11.3728 25.4086 11.1094 25.7975 10.4203C26.3851 9.38041 26.3111 9.40797 28.4597 9.41891C29.6996 9.42547 29.9332 9.43554 30.0474 9.4876Z",fill:"#F7F5FC"})}),j3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#6CD544"},children:n.jsx("path",{d:"M22.0006 7.292C22.6198 7.29004 23.2271 7.46144 23.754 7.7868C24.2808 8.11216 24.706 8.57848 24.9816 9.133L34.3566 27.883C34.611 28.3912 34.7312 28.956 34.7058 29.5238C34.6805 30.0915 34.5103 30.6433 34.2116 31.1268C33.9129 31.6103 33.4956 32.0094 32.9992 32.2861C32.5028 32.5629 31.9439 32.7081 31.3756 32.708H12.6256C12.0573 32.7079 11.4985 32.5626 11.0023 32.2858C10.506 32.009 10.0888 31.6099 9.79022 31.1264C9.49163 30.6429 9.3216 30.0912 9.29628 29.5235C9.27096 28.9558 9.39119 28.3911 9.64556 27.883L19.0196 9.133C19.2951 8.57848 19.7203 8.11216 20.2472 7.7868C20.774 7.46144 21.3814 7.29004 22.0006 7.292ZM22.0006 5C20.9561 4.9999 19.9322 5.29059 19.0437 5.83952C18.1551 6.38846 17.4369 7.17394 16.9696 8.108L7.59456 26.858C7.16544 27.7156 6.96271 28.6687 7.00564 29.6268C7.04856 30.5848 7.33572 31.516 7.83982 32.3318C8.34392 33.1476 9.04823 33.821 9.88584 34.288C10.7235 34.755 11.6666 35.0001 12.6256 35H31.3756C32.3345 34.9999 33.2775 34.7547 34.1149 34.2876C34.9524 33.8206 35.6566 33.1472 36.1606 32.3314C36.6645 31.5156 36.9516 30.5845 36.9945 29.6265C37.0374 28.6686 36.8346 27.7156 36.4056 26.858L27.0316 8.108C26.5642 7.17394 25.846 6.38846 24.9574 5.83952C24.0689 5.29059 23.045 4.9999 22.0006 5Z",fill:"white"})}),_3=({testnet:e,...t})=>n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#E84142"},children:[n.jsx("path",{d:"M11.0188 32.1528H15.4825C16.5334 32.1528 17.0589 32.1528 17.5278 32.023C18.042 31.8701 18.511 31.5991 18.9009 31.2261C19.2589 30.885 19.5173 30.4328 20.0269 29.5409L20.0272 29.5404L20.0422 29.5142L25.8314 19.2804C26.3456 18.3821 26.5999 17.93 26.7129 17.4554C26.8372 16.9412 26.8372 16.3988 26.7129 15.8847C26.6007 15.4136 26.3439 14.9648 25.8373 14.0798L25.8258 14.0597L23.56 10.1045C23.0911 9.27958 22.8538 8.86711 22.5543 8.71456C22.2323 8.55071 21.848 8.55071 21.526 8.71456C21.2265 8.86711 20.9892 9.27958 20.5202 10.1045L9.49892 29.5311C9.03561 30.3447 8.80392 30.7517 8.82089 31.0849C8.84349 31.4466 9.02994 31.7743 9.33507 31.9721C9.61756 32.1528 10.0809 32.1528 11.0188 32.1528Z",fill:"white"}),n.jsx("path",{d:"M33.1506 32.1528H26.7547C25.8111 32.1528 25.3365 32.1528 25.0596 31.9721C24.7545 31.7743 24.5681 31.4411 24.5455 31.0794C24.5286 30.7486 24.7621 30.3456 25.2294 29.539L25.2295 29.5388L25.2404 29.5199L28.4328 24.0392C28.9018 23.2313 29.1391 22.8301 29.4329 22.6776C29.7548 22.5137 30.1336 22.5137 30.4555 22.6776C30.7472 22.8261 30.9744 23.2102 31.4241 23.9708L31.4248 23.9719L31.4613 24.0336L34.665 29.5143C34.6806 29.5413 34.696 29.5678 34.7113 29.5939L34.7113 29.594C35.1554 30.3603 35.382 30.7514 35.3657 31.0739C35.3486 31.4353 35.1566 31.7688 34.8515 31.9666C34.5689 32.1528 34.0942 32.1528 33.1506 32.1528Z",fill:"white"})]}),A3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#FCFE72"},children:n.jsx("path",{d:"M9 9H34.5183V18.112H30.3564C28.896 14.7687 25.6102 12.4171 21.777 12.4171C16.593 12.4171 12.3948 16.6422 12.3948 21.823C12.3948 27.0039 16.593 31.2654 21.777 31.2654C25.5373 31.2654 28.8231 28.9876 30.2829 25.7172H34.5178V34.682H9V9Z",fill:e?"#ffffff":"black"})}),T3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#009CB4"},children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.3439 11.8664C17.9374 6.53462 26.7953 6.74397 32.1271 12.3374C32.4738 12.7038 32.8075 13.0832 33.1084 13.4823L22 24.5972L10.8916 13.4823C11.1991 13.0832 11.5262 12.7038 11.8729 12.3374C12.0234 12.1804 12.1804 12.0234 12.3439 11.8664ZM30.6094 13.3972C28.3196 11.0944 25.271 9.83182 22 9.83182C18.729 9.83182 15.6804 11.0944 13.3907 13.3972L22 22.0066L30.6094 13.3972ZM33.9785 14.7446L31.7215 17.0016C33.5402 19.1801 33.2523 22.425 31.0738 24.2437C29.1636 25.84 26.3897 25.84 24.4794 24.2437L22 26.7231L19.5271 24.2502C17.3486 26.0689 14.1037 25.7811 12.285 23.6026C10.6888 21.6923 10.6888 18.9185 12.285 17.0082L11.1271 15.8502L10.028 14.7446C8.7 16.9297 8 19.4418 8 21.9998C8 29.7325 14.2673 35.9998 22 35.9998C29.7327 35.9998 36 29.7325 36 21.9998C36.0065 19.4418 35.3 16.9297 33.9785 14.7446ZM30.6486 18.0747C31.1392 18.7093 31.4075 19.4943 31.4075 20.299C31.4075 21.1037 31.1392 21.8887 30.6486 22.5233C29.4187 24.113 27.1355 24.4074 25.5458 23.1775L30.6486 18.0747ZM18.4542 23.1839C17.8196 23.6745 17.0346 23.9427 16.2299 23.9427C15.4252 23.9427 14.6467 23.6745 14.0056 23.1904C12.4159 21.9605 12.1215 19.6708 13.3514 18.0811L18.4542 23.1839Z",fill:"white"})}),O3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#2D2A25"},children:n.jsx("path",{d:"M18.4916 12.6668C12.9416 14.806 12.4332 20.2846 10.8418 22.8432C9.23155 25.4322 5.54251 26.8607 6.04698 28.1801C6.55143 29.4994 10.2449 28.0824 13.1669 28.9242C16.0543 29.7561 20.0831 33.4862 25.633 31.3469C28.4603 30.2573 30.5076 28.0143 31.449 25.3574C31.5502 25.0723 31.361 24.7673 31.0606 24.7391C30.874 24.7215 30.6948 24.8196 30.6106 24.9877C29.759 26.6908 28.2981 28.0934 26.3864 28.8301C23.2303 30.0465 19.777 29.0915 17.6562 26.6961C17.1746 26.1522 16.7626 25.533 16.4374 24.8487C16.348 24.6603 16.2629 24.4689 16.1875 24.2708C16.1117 24.0728 16.0473 23.8735 15.9881 23.6732C17.6562 22.8925 19.5812 22.0656 21.7635 21.2246C23.903 20.3999 25.8505 19.731 27.5841 19.1958C28.7571 18.8341 29.8322 18.5331 30.8029 18.2871C30.8732 18.2695 30.9423 18.2519 31.0112 18.2347C31.158 18.1982 31.3088 18.2769 31.363 18.4186L31.364 18.4213C31.396 18.5053 31.4236 18.5898 31.4535 18.6743C31.6453 19.2196 31.7892 19.7706 31.8841 20.3229C31.9258 20.5645 32.1888 20.6961 32.4044 20.5799C33.2014 20.1504 33.9302 19.7314 34.5814 19.3283C37.0083 17.8276 38.3538 16.5549 38.0776 15.8336C37.802 15.1119 35.9541 15.0705 33.1503 15.5854C32.2593 15.7491 31.2716 15.9691 30.207 16.2416C30.0229 16.2886 29.8365 16.3375 29.6481 16.3877C28.7522 16.6262 27.8073 16.8995 26.8234 17.2053C24.9936 17.7744 23.0305 18.4561 21.0038 19.2372C19.1078 19.9682 17.3109 20.726 15.6629 21.4812C15.6428 18.2761 17.5725 15.2461 20.7286 14.0297C22.6399 13.293 24.6605 13.3533 26.4285 14.0473C26.6029 14.116 26.8015 14.0684 26.9291 13.9298C27.1331 13.7076 27.0706 13.3537 26.8053 13.2094C24.3353 11.8685 21.319 11.5771 18.4916 12.6668Z",fill:"#FAF1E4"})}),R3=({testnet:e,...t})=>n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#16181A"},children:[n.jsx("path",{d:"M16.0445 19.6063L21.8705 13.7805L27.6996 19.6093L31.0896 16.2193L21.8705 7L12.6545 16.2163L16.0445 19.6063Z",fill:e?"#fff":"#F3BA2F"}),n.jsx("path",{d:"M13.6505 21.9995L10.2606 18.6096L6.87046 21.9997L10.2604 25.3896L13.6505 21.9995Z",fill:e?"#fff":"#F3BA2F"}),n.jsx("path",{d:"M16.0445 24.3937L21.8705 30.2195L27.6994 24.3909L31.0913 27.779L31.0896 27.7809L21.8705 37L12.6542 27.7839L12.6495 27.7792L16.0445 24.3937Z",fill:e?"#fff":"#F3BA2F"}),n.jsx("path",{d:"M33.4808 25.3911L36.8709 22.001L33.481 18.6111L30.0909 22.0012L33.4808 25.3911Z",fill:e?"#fff":"#F3BA2F"}),n.jsx("path",{d:"M25.3091 21.9982H25.3105L21.8705 18.5582L19.3283 21.1004H19.3281L19.0362 21.3926L18.4336 21.9951L18.4289 21.9999L18.4336 22.0048L21.8705 25.4418L25.3105 22.0018L25.3122 21.9999L25.3091 21.9982Z",fill:e?"#fff":"#F3BA2F"})]}),L3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"white"},children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M35 8V36H9L13.875 35.9998V31.0586H9V12.9412H13.875V8H35ZM17.9373 12.9414H30.1247V17.8826H17.9373V12.9414ZM30.1247 26.9414H17.9373V17.8826L13.0623 17.8828V26.9416L17.9373 26.9414V31.8826H30.1247V26.9414Z",fill:"#06FC99"})}),I3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#0090FF"},children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M23.75 19.3069L23.15 22.5069L28.85 23.3069L28.45 24.8069L22.85 24.0069C22.45 25.3069 22.25 26.7069 21.75 27.9069C21.25 29.3069 20.75 30.7069 20.15 32.0069C19.35 33.7069 17.95 34.9069 16.05 35.2069C14.95 35.4069 13.75 35.3069 12.85 34.6069C12.55 34.4069 12.25 34.0069 12.25 33.7069C12.25 33.3069 12.45 32.8069 12.75 32.6069C12.95 32.5069 13.45 32.6069 13.75 32.7069C14.05 33.0069 14.35 33.4069 14.55 33.8069C15.15 34.6069 15.95 34.7069 16.75 34.1069C17.65 33.3069 18.15 32.2069 18.45 31.1069C19.05 28.7069 19.65 26.4069 20.15 24.0069V23.6069L14.85 22.8069L15.05 21.3069L20.55 22.1069L21.25 19.0069L15.55 18.1069L15.75 16.5069L21.65 17.3069C21.85 16.7069 21.95 16.2069 22.15 15.7069C22.65 13.9069 23.15 12.1069 24.35 10.5069C25.55 8.90687 26.95 7.90687 29.05 8.00687C29.95 8.00687 30.85 8.30687 31.45 9.00687C31.55 9.10687 31.75 9.30687 31.75 9.50687C31.75 9.90687 31.75 10.4069 31.45 10.7069C31.05 11.0069 30.55 10.9069 30.15 10.5069C29.85 10.2069 29.65 9.90687 29.35 9.60687C28.75 8.80687 27.85 8.70687 27.15 9.40687C26.65 9.90687 26.15 10.6069 25.85 11.3069C25.15 13.4069 24.65 15.6069 23.95 17.8069L29.45 18.6069L29.05 20.1069L23.75 19.3069Z",fill:"white"})}),N3=({testnet:e,...t})=>n.jsxs("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#00D4D5"},children:[n.jsx("path",{d:"M23.7136 6.875V14.3784L30.2284 10.6315L23.7136 6.875Z",fill:"white"}),n.jsx("path",{opacity:"0.9",d:"M30.2284 10.6316V18.135L36.7418 14.3785L30.2284 10.6316Z",fill:"white"}),n.jsx("path",{opacity:"0.8",d:"M23.7136 14.3784V21.8818L30.2284 18.1349L23.7136 14.3784ZM30.2284 18.1349V25.6383L36.7417 21.8818L30.2284 18.1349Z",fill:"white"}),n.jsx("path",{opacity:"0.8",d:"M23.7136 21.8817V29.385L30.2284 25.6382L23.7136 21.8817Z",fill:"white"}),n.jsx("path",{d:"M30.2284 25.6382V33.1416L36.7418 29.3851L30.2284 25.6382Z",fill:"white"}),n.jsx("path",{opacity:"0.4",d:"M6.87537 14.1253V21.6287L13.3901 17.8722L6.87537 14.1253Z",fill:"white"}),n.jsx("path",{opacity:"0.2",d:"M15.0938 16.9153V24.4186L21.5975 20.6718L15.0938 16.9153Z",fill:"white"}),n.jsx("path",{opacity:"0.3",d:"M10.2648 21.6604V29.1638L16.7781 25.4073L10.2648 21.6604Z",fill:"white"}),n.jsx("path",{opacity:"0.9",d:"M14.5575 27.3226V34.826L21.0612 31.0695L14.5575 27.3226Z",fill:"white"}),n.jsx("path",{opacity:"0.7",d:"M23.66 30.5525V38.0572L30.1637 34.2993L23.66 30.5525Z",fill:"white"}),n.jsx("path",{opacity:"0.9",d:"M16.1786 13.2097V20.7145L22.6824 16.9676L16.1786 13.2097Z",fill:"white"}),n.jsx("path",{opacity:"0.8",d:"M23.7136 6.875V14.3784L17.1989 10.6315L23.7136 6.875Z",fill:"white"}),n.jsx("path",{opacity:"0.6",d:"M16.1786 10.0649V17.5669L9.66248 13.8104L16.1786 10.0649Z",fill:"white"}),n.jsx("path",{opacity:"0.6",d:"M22.6934 13.7775V21.2823L16.1786 17.5244L22.6934 13.7775Z",fill:"white"}),n.jsx("path",{opacity:"0.95",d:"M15.0635 16.9153V24.4186L8.54877 20.6718L15.0635 16.9153Z",fill:"white"}),n.jsx("path",{opacity:"0.6",d:"M23.7136 21.8817V29.385L17.2099 25.6382L23.7136 21.8817Z",fill:"white"}),n.jsx("path",{opacity:"0.55",d:"M10.2648 23.6295V31.1328L3.75 27.375L10.2648 23.6295Z",fill:"white"}),n.jsx("path",{d:"M36.7418 14.3784V21.8818L30.2284 18.1349L36.7418 14.3784Z",fill:"white"}),n.jsx("path",{opacity:"0.95",d:"M30.2284 18.1362V25.6382L23.7136 21.8817L30.2284 18.1362Z",fill:"white"}),n.jsx("path",{opacity:"0.9",d:"M36.7418 21.8817V29.385L30.2284 25.6382L36.7418 21.8817Z",fill:"white"}),n.jsx("path",{opacity:"0.7",d:"M30.2284 25.6382V33.1416L23.7136 29.3851L30.2284 25.6382Z",fill:"white"}),n.jsx("path",{opacity:"0.4",d:"M22.2712 28.7651V36.2684L15.7579 32.5216L22.2712 28.7651Z",fill:"white"}),n.jsx("path",{d:"M30.2284 10.6316V18.135L23.7136 14.3785L30.2284 10.6316Z",fill:"white"})]}),F3=({testnet:e,...t})=>n.jsx("svg",{...t,"aria-hidden":"true",width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#2F3140"},children:n.jsx("path",{d:"M37.5175 22.0531C37.4579 19.2923 36.6563 16.5985 35.1968 14.2542C33.7374 11.91 31.674 10.0017 29.223 8.72965C26.772 7.45759 24.0238 6.86863 21.2668 7.02455C18.5098 7.18047 15.8456 8.07553 13.5537 9.61582C11.2617 11.1561 9.42659 13.2849 8.24079 15.7787C7.05498 18.2725 6.56222 21.0396 6.81419 23.7895C7.06617 26.5394 8.05359 29.1708 9.67288 31.4076C11.2922 33.6444 13.4836 35.4042 16.0173 36.5023C16.7657 35.3775 17.3385 34.1453 17.716 32.848C18.0245 32.0632 18.3595 31.2913 18.7067 30.5446C19.5444 30.7955 20.4345 30.8143 21.282 30.5989C22.1295 30.3835 22.9026 29.942 23.5188 29.3215L23.5704 29.2699C22.8136 28.9884 21.9979 28.9032 21.1993 29.022C20.4006 29.1408 19.6451 29.4598 19.0029 29.9494C19.4276 29.0613 19.891 28.1997 20.3667 27.3632C21.189 27.6541 22.075 27.7156 22.9296 27.541C23.7842 27.3665 24.5751 26.9626 25.2175 26.3726L25.2692 26.3209C24.538 26.0116 23.7416 25.8885 22.9513 25.9626C22.1609 26.0368 21.4013 26.3058 20.7404 26.7456C21.216 25.9608 21.7053 25.1889 22.2203 24.468C23.0713 24.6915 23.9672 24.6777 24.811 24.4282C25.6547 24.1787 26.414 23.703 27.0066 23.0526L27.0453 23.001C26.3425 22.7718 25.5958 22.7106 24.8651 22.8224C24.1344 22.9341 23.4401 23.2157 22.838 23.6444C22.8767 23.5928 22.9283 23.5289 22.9664 23.4773C23.2749 23.0784 23.5969 22.6796 23.9177 22.2936C24.8969 21.9731 25.7703 21.3916 26.4436 20.6117C27.117 19.8318 27.5649 18.883 27.7391 17.8674L27.752 17.79H27.7391C26.7194 18.0552 25.7944 18.6007 25.0689 19.3648C24.3434 20.1288 23.8464 21.0808 23.6343 22.1129C23.3258 22.4859 23.0167 22.8603 22.7211 23.2449C22.9706 22.5925 23.0724 21.893 23.0191 21.1966C22.9657 20.5002 22.7586 19.8243 22.4126 19.2176L22.3739 19.2692C21.8489 19.9862 21.5326 20.8345 21.4599 21.7201C21.3873 22.6058 21.5611 23.4942 21.9621 24.2872C21.4729 24.9823 20.9972 25.6897 20.5467 26.4357C20.6918 25.6858 20.6542 24.9118 20.4369 24.1795C20.2196 23.4471 19.8291 22.7779 19.2985 22.2284L19.2727 22.2929C18.9445 23.1107 18.8477 24.0031 18.9929 24.8723C19.1382 25.7415 19.5199 26.5539 20.0962 27.2205C19.6457 28.0054 19.2211 28.816 18.8093 29.6524C18.9344 28.8712 18.8712 28.0715 18.6251 27.3196C18.3789 26.5677 17.9568 25.8855 17.3939 25.3295L17.3681 25.3941C17.0745 26.2514 17.0201 27.1724 17.2105 28.0583C17.401 28.9442 17.8292 29.7614 18.4492 30.4223C18.1774 31.0012 17.9219 31.5774 17.6773 32.1849C17.61 32.1231 17.5313 32.0751 17.4456 32.0435C17.0066 31.916 16.5867 31.7299 16.1974 31.4904C15.8754 31.2994 15.5337 31.144 15.1781 31.027C13.7886 30.5765 13.9945 29.9079 13.2756 28.5564C13.0416 28.2781 12.7931 28.0125 12.5309 27.7607C12.2876 27.603 12.0884 27.386 11.9519 27.1302C11.7934 26.8107 11.6931 26.4656 11.6557 26.1109C11.6514 25.9148 11.5858 25.7249 11.4681 25.5679C11.3504 25.4109 11.1864 25.2948 10.9993 25.2358C8.95338 24.5284 9.86728 21.8778 9.94406 21.5299C9.91262 21.08 9.81271 20.6375 9.64781 20.2178C9.63057 20.1632 9.61763 20.1073 9.60908 20.0506C9.55449 19.776 9.56444 19.4924 9.63813 19.2223C9.71183 18.9521 9.84726 18.7028 10.0338 18.4939C10.2784 18.2493 11.1277 17.8505 11.3078 17.6188C11.4879 17.387 11.6163 17.1295 11.797 16.9114C12.3687 16.3412 13.0291 15.8675 13.7526 15.509C14.3444 15.1876 14.4477 14.364 14.6787 14.1065C15.0647 13.6689 15.6565 13.6689 16.0941 13.283C16.3129 13.09 16.6377 12.9867 16.8415 12.7815C17.8692 11.8403 19.1644 11.2423 20.5474 11.0706C21.5064 10.9924 22.4717 11.0795 23.4012 11.3281C23.5358 11.3507 23.669 11.3809 23.8001 11.4185C25.9228 11.4959 28.4709 11.9328 29.397 12.8338C29.8555 13.2744 30.1961 13.8229 30.3877 14.4293C30.5382 14.8988 30.7456 15.3481 31.0054 15.7672L31.5714 16.6933C31.932 17.2773 32.0475 17.9801 31.8928 18.6489C31.7885 18.974 31.7795 19.3223 31.8669 19.6525C32.1655 20.1031 32.5152 20.5177 32.9093 20.8878C33.0658 21.0427 33.2382 21.1807 33.4236 21.2995C33.8592 21.5594 34.2802 21.8429 34.6848 22.1489C34.698 22.2729 34.6775 22.3982 34.6254 22.5115C34.5732 22.6247 34.4914 22.7218 34.3885 22.7924C34.0284 23.1137 33.3333 23.6159 33.3333 23.6159C33.3584 23.758 33.4016 23.8964 33.4617 24.0276C33.5643 24.2077 33.796 24.4911 33.7192 24.735C33.6424 24.9789 33.1403 25.1855 33.2816 25.4552C33.423 25.7386 33.7831 25.8154 33.6805 26.0729C33.5779 26.3175 33.0757 26.7524 33.1274 26.9352C33.179 27.1179 33.5908 28.8377 32.6382 29.1353C31.4592 29.3685 30.2627 29.5019 29.0614 29.5342C28.8675 29.5454 28.6797 29.6055 28.5155 29.709C28.3513 29.8125 28.216 29.956 28.1223 30.126C27.9399 30.4661 27.8222 30.837 27.7751 31.22C27.4275 32.5896 26.9671 33.928 26.3985 35.2215C26.3985 35.2215 26.3597 35.2989 26.3081 35.4144C26.1833 35.6687 26.1048 35.9432 26.0764 36.2251C26.1573 36.4321 26.2799 36.6204 26.4365 36.7782C26.519 36.8726 26.6271 36.9411 26.7477 36.9753C26.8683 37.0096 26.9962 37.0081 27.116 36.9711C30.1997 35.8965 32.8655 33.8757 34.7332 31.197C36.601 28.5182 37.5754 25.3182 37.5175 22.0531Z",fill:e?"#ffffff":"#00DACC"})}),M3=({testnet:e,...t})=>n.jsx("svg",{...t,width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{background:e?"linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)":"#0052FF"},children:n.jsx("path",{d:"M21.9756 36C29.721 36 36 29.732 36 22C36 14.268 29.721 8 21.9756 8C14.6271 8 8.59871 13.6419 8 20.8232H26.5371V23.1768H8C8.59871 30.3581 14.6271 36 21.9756 36Z",fill:"white"})}),P3=({testnet:e,...t})=>n.jsxs("svg",{...t,width:"44",height:"44",viewBox:"0 0 44 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{filter:e?"grayscale(1)":"none"},children:[n.jsx("mask",{id:"ck_zora_mask_a",style:{maskType:"alpha"},maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"44",height:"44",children:n.jsx("path",{d:"M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z",fill:"#D9D9D9"})}),n.jsxs("g",{mask:"url(#ck_zora_mask_a)",children:[n.jsx("path",{d:"M51.4558 -9.56445H-6.78906V48.6804H51.4558V-9.56445Z",fill:"#A1723A"}),n.jsx("g",{filter:"url(#ck_zora_filter_a)",children:n.jsx("path",{d:"M23.6807 43.0752C36.6464 43.0752 47.157 32.5675 47.157 19.6058C47.157 6.64397 36.6464 -3.86365 23.6807 -3.86365C10.7152 -3.86365 0.20459 6.64397 0.20459 19.6058C0.20459 32.5675 10.7152 43.0752 23.6807 43.0752Z",fill:"#531002"})}),n.jsx("g",{filter:"url(#ck_zora_filter_b)",children:n.jsx("path",{d:"M26.2112 35.6464C36.7271 35.6464 45.2521 27.1185 45.2521 16.5988C45.2521 6.07904 36.7271 -2.44885 26.2112 -2.44885C15.6953 -2.44885 7.17041 6.07904 7.17041 16.5988C7.17041 27.1185 15.6953 35.6464 26.2112 35.6464Z",fill:"#2B5DF0"})}),n.jsx("g",{filter:"url(#ck_zora_filter_c)",children:n.jsx("path",{d:"M25.8644 36.7348C36.8276 36.7348 45.7149 27.8444 45.7149 16.8777C45.7149 5.91084 36.8276 -2.97949 25.8644 -2.97949C14.9015 -2.97949 6.01416 5.91084 6.01416 16.8777C6.01416 27.8444 14.9015 36.7348 25.8644 36.7348Z",fill:"url(#paint0_radial_3914_1946)"})}),n.jsx("g",{filter:"url(#ck_zora_filter_d)",children:n.jsx("path",{d:"M29.1567 21.8779C34.6797 21.8779 39.1567 17.4008 39.1567 11.8779C39.1567 6.35509 34.6797 1.87793 29.1567 1.87793C23.6338 1.87793 19.1567 6.35509 19.1567 11.8779C19.1567 17.4008 23.6338 21.8779 29.1567 21.8779Z",fill:"#FCB8D4"})}),n.jsx("g",{filter:"url(#ck_zora_filter_e)",children:n.jsx("path",{d:"M29.15 15.8642C31.3555 15.8642 33.1432 14.0765 33.1432 11.871C33.1432 9.66562 31.3555 7.87781 29.15 7.87781C26.9445 7.87781 25.1567 9.66562 25.1567 11.871C25.1567 14.0765 26.9445 15.8642 29.15 15.8642Z",fill:"white"})}),n.jsx("g",{filter:"url(#ck_zora_filter_f)",children:n.jsx("path",{d:"M26.4967 51.7416C46.3151 51.7416 62.3811 35.6757 62.3811 15.8573C62.3811 -3.96109 46.3151 -20.0271 26.4967 -20.0271C6.67829 -20.0271 -9.3877 -3.96109 -9.3877 15.8573C-9.3877 35.6757 6.67829 51.7416 26.4967 51.7416Z",fill:"url(#paint1_radial_3914_1946)",fillOpacity:"0.9"})})]}),n.jsxs("defs",{children:[n.jsxs("filter",{id:"ck_zora_filter_a",x:"-5.23758",y:"-9.30581",width:"57.837",height:"57.8232",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"2.72108",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("filter",{id:"ck_zora_filter_b",x:"-3.71395",y:"-13.3332",width:"59.8503",height:"59.8639",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"5.44218",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("filter",{id:"ck_zora_filter_c",x:"1.93251",y:"-7.06114",width:"47.864",height:"47.8775",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"2.04082",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("filter",{id:"ck_zora_filter_d",x:"10.9935",y:"-6.28533",width:"36.3265",height:"36.3265",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"4.08163",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("filter",{id:"ck_zora_filter_e",x:"19.7146",y:"2.43564",width:"18.8707",height:"18.8708",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"2.72108",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("filter",{id:"ck_zora_filter_f",x:"-13.4693",y:"-24.1087",width:"79.9318",height:"79.9321",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:"0",result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feGaussianBlur",{stdDeviation:"2.04082",result:"effect1_foregroundBlur_3914_1946"})]}),n.jsxs("radialGradient",{id:"paint0_radial_3914_1946",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(29.2127 11.2756) rotate(128.228) scale(37.4897 37.4867)",children:[n.jsx("stop",{offset:"0.286458",stopColor:"#387AFA"}),n.jsx("stop",{offset:"0.647782",stopColor:"#387AFA",stopOpacity:"0"})]}),n.jsxs("radialGradient",{id:"paint1_radial_3914_1946",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(26.4967 15.8573) rotate(90) scale(35.8844 35.8844)",children:[n.jsx("stop",{offset:"0.598958",stopOpacity:"0"}),n.jsx("stop",{offset:"0.671875"}),n.jsx("stop",{offset:"0.734375",stopOpacity:"0"})]})]})]});var re={UnknownChain:b3,Base:M3,LensChain:C3,Ethereum:y3,Polygon:w3,Optimism:k3,Arbitrum:E3,Aurora:j3,Avalanche:_3,Celo:A3,Telos:S3,Gnosis:T3,Evmos:O3,BinanceSmartChain:R3,Foundry:wn,Sepolia:wn,Taraxa:wn,zkSync:wn,Flare:wn,Canto:L3,Filecoin:I3,Metis:F3,IoTeX:N3,Zora:P3};const D3=[{id:1,name:"Ethereum",logo:n.jsx(re.Ethereum,{}),rpcUrls:{alchemy:{http:["https://eth-mainnet.g.alchemy.com/v2"],webSocket:["wss://eth-mainnet.g.alchemy.com/v2"]},infura:{http:["https://mainnet.infura.io/v3"],webSocket:["wss://mainnet.infura.io/ws/v3"]}}},{id:232,name:"Lens Chain",logo:n.jsx(re.LensChain,{})},{id:37111,name:"Lens Chain Testnet",logo:n.jsx(re.LensChain,{testnet:!0})},{id:3,name:"Rinkeby",logo:n.jsx(re.Ethereum,{testnet:!0}),rpcUrls:{}},{id:4,name:"Ropsten",logo:n.jsx(re.Ethereum,{testnet:!0})},{id:5,name:"Görli",logo:n.jsx(re.Ethereum,{testnet:!0})},{id:42,name:"Kovan",logo:n.jsx(re.Ethereum,{testnet:!0})},{id:10,name:"Optimism",logo:n.jsx(re.Optimism,{})},{id:69,name:"Optimism Kovan",logo:n.jsx(re.Optimism,{testnet:!0})},{id:420,name:"Optimism Goerli",logo:n.jsx(re.Optimism,{testnet:!0})},{id:11155420,name:"Optimism Sepolia",logo:n.jsx(re.Optimism,{testnet:!0})},{id:137,name:"Polygon",logo:n.jsx(re.Polygon,{})},{id:80001,name:"Polygon Mumbai",logo:n.jsx(re.Polygon,{testnet:!0})},{id:80002,name:"Polygon Amoy",logo:n.jsx(re.Polygon,{testnet:!0})},{id:13337,name:"Beam Testnet",logo:n.jsx(re.Avalanche,{testnet:!0})},{id:31337,name:"Hardhat",logo:n.jsx(re.Ethereum,{testnet:!0})},{id:1337,name:"Localhost",logo:n.jsx(re.Ethereum,{testnet:!0})},{id:42161,name:"Arbitrum",logo:n.jsx(re.Arbitrum,{}),rpcUrls:{alchemy:{http:["https://arb-mainnet.g.alchemy.com/v2"],webSocket:["wss://arb-mainnet.g.alchemy.com/v2"]},infura:{http:["https://arbitrum-mainnet.infura.io/v3"],webSocket:["wss://arbitrum-mainnet.infura.io/ws/v3"]}}},{id:421611,name:"Arbitrum Rinkeby",logo:n.jsx(re.Arbitrum,{testnet:!0})},{id:421613,name:"Arbitrum Goerli",logo:n.jsx(re.Arbitrum,{testnet:!0}),rpcUrls:{alchemy:{http:["https://arb-goerli.g.alchemy.com/v2"],webSocket:["wss://arb-goerli.g.alchemy.com/v2"]},infura:{http:["https://arbitrum-goerli.infura.io/v3"],webSocket:["wss://arbitrum-goerli.infura.io/ws/v3"]}}},{id:40,name:"Telos",logo:n.jsx(re.Telos,{})},{id:41,name:"Telos Testnet",logo:n.jsx(re.Telos,{testnet:!0})},{id:1313161554,name:"Aurora",logo:n.jsx(re.Aurora,{})},{id:1313161555,name:"Aurora Testnet",logo:n.jsx(re.Aurora,{testnet:!0})},{id:43114,name:"Avalanche",logo:n.jsx(re.Avalanche,{})},{id:43113,name:"Avalanche Fuji",logo:n.jsx(re.Avalanche,{testnet:!0})},{id:31337,name:"Foundry",logo:n.jsx(re.Foundry,{testnet:!0})},{id:100,name:"Gnosis",logo:n.jsx(re.Gnosis,{})},{id:9001,name:"Evmos",logo:n.jsx(re.Evmos,{})},{id:9e3,name:"Evmos Testnet",logo:n.jsx(re.Evmos,{testnet:!0})},{id:56,name:"BNB Smart Chain",logo:n.jsx(re.BinanceSmartChain,{})},{id:97,name:"Binance Smart Chain Testnet",logo:n.jsx(re.BinanceSmartChain,{testnet:!0})},{id:11155111,name:"Sepolia",logo:n.jsx(re.Sepolia,{})},{id:841,name:"Taraxa",logo:n.jsx(re.Taraxa,{})},{id:842,name:"Taraxa Testnet",logo:n.jsx(re.Taraxa,{testnet:!0})},{id:324,name:"zkSync",logo:n.jsx(re.zkSync,{})},{id:280,name:"zkSync Testnet",logo:n.jsx(re.zkSync,{testnet:!0})},{id:42220,name:"Celo",logo:n.jsx(re.Celo,{})},{id:44787,name:"Celo Alfajores",logo:n.jsx(re.Celo,{testnet:!0})},{id:7700,name:"Canto",logo:n.jsx(re.Canto,{})},{id:14,name:"Flare",logo:n.jsx(re.Flare,{})},{id:114,name:"Coston2",logo:n.jsx(re.Flare,{})},{id:314,name:"Filecoin",logo:n.jsx(re.Filecoin,{})},{id:3141,name:"Filecoin Hyperspace",logo:n.jsx(re.Filecoin,{testnet:!0})},{id:314159,name:"Filecoin Calibration",logo:n.jsx(re.Filecoin,{testnet:!0})},{id:1088,name:"Metis",logo:n.jsx(re.Metis,{})},{id:599,name:"Metis Goerli",logo:n.jsx(re.Metis,{testnet:!0})},{id:4689,name:"IoTeX",logo:n.jsx(re.IoTeX,{})},{id:4690,name:"IoTeX Testnet",logo:n.jsx(re.IoTeX,{testnet:!0})},{id:8453,name:"Base",logo:n.jsx(re.Base,{})},{id:84531,name:"Base Goerli",logo:n.jsx(re.Base,{testnet:!0})},{id:84532,name:"Base Sepolia",logo:n.jsx(re.Base,{testnet:!0})},{id:7777777,name:"Zora",logo:n.jsx(re.Zora,{})},{id:999999999,name:"Zora Sepolia",logo:n.jsx(re.Zora,{testnet:!0})},{id:999,name:"Zora Goerli Testnet",logo:n.jsx(re.Zora,{testnet:!0})}],$3=E.div`
  --bg: transparent;
  --color: #333;
  ${e=>typeof e.size=="string"?pe`
          --width: ${e.size};
          --height: ${e.size};
        `:pe`
          --width: ${e.size&&e.size>=0?`${e.size}px`:"24px"};
          --height: ${e.size&&e.size>=0?`${e.size}px`:"24px"};
        `};
  ${e=>typeof e.radius=="string"?pe`
          --radius: ${e.radius};
        `:pe`
          --radius: ${e.radius&&e.radius>=0?`${e.radius}px`:"24px"};
        `};
  display: block;
  position: relative;
  width: var(--width);
  height: var(--height);
  min-width: var(--width);
  min-height: var(--height);
  border-radius: var(--radius);
  background: var(--ck-body-background-secondary);
  pointer-events: none;
  user-select: none;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,B3=E(F.div)`
  display: block;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`,W3=je`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`,V3=E(F.div)`
  position: absolute;
  inset: 0;
  animation: ${W3} 1s linear infinite;
  svg {
    display: block;
    position: absolute;
    inset: 0;
  }
`,U3=E(F.div)`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 40%;
  min-width: 13px;
  min-height: 13px;
  color: var(--ck-body-color-danger, red);
  svg {
    display: block;
    position: relative;
    top: -30%;
    right: -30%;
  }
`,z3=()=>{const e=v.useId();return n.jsxs("svg",{"aria-hidden":"true",width:"36",height:"36",viewBox:"0 0 36 36",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Loading spinner"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M11.3592 30.1654C10.0472 29.4491 8.85718 28.524 7.83713 27.424C6.81708 26.324 5.98425 25.0677 5.36889 23.7054C5.20157 23.335 5.05033 22.9567 4.91578 22.5717C4.51465 21.4237 4.26735 20.2308 4.17794 19.0239C4.16599 18.8626 4.13894 18.7041 4.09809 18.5507C3.85023 17.6197 3.09399 16.8738 2.11531 16.7999C0.975331 16.7138 -0.0310983 17.5702 0.0141657 18.7125C0.0223289 18.9185 0.0340286 19.1243 0.049253 19.3298C0.165374 20.8971 0.486545 22.4464 1.00749 23.9373C1.10424 24.2142 1.20764 24.4884 1.31755 24.7596C2.13617 26.7799 3.31595 28.6371 4.80146 30.239C6.28696 31.841 8.04998 33.1573 10.0029 34.1258C10.2651 34.2558 10.5307 34.3796 10.7995 34.4969C12.247 35.1287 13.7676 35.5656 15.3217 35.7995C15.5255 35.8301 15.7298 35.8573 15.9346 35.881C17.0703 36.0122 18.0001 35.0731 18.0001 33.9299C18.0001 32.9484 17.3133 32.1381 16.4036 31.8208C16.2537 31.7685 16.0977 31.7296 15.9377 31.7056C14.7411 31.5255 13.5702 31.1891 12.4556 30.7026C12.0818 30.5394 11.716 30.3601 11.3592 30.1654Z",fill:`url(#paint0_linear_${e})`}),n.jsx("defs",{children:n.jsxs("linearGradient",{id:`paint0_linear_${e}`,x1:"2",y1:"19.4884",x2:"16.8752",y2:"33.7485",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"var(--ck-connectbutton-balance-color,currentColor)",stopOpacity:"0.7"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-connectbutton-balance-color,currentColor)",stopOpacity:"0"})]})})]})},Ao=({id:e,unsupported:t,radius:r="50%",size:o=24})=>{var i;const{chains:a}=U(),c=e!=null&&a.some(u=>u.id===e),s=t??!c,l=D3.find(u=>u.id===e);return sd()?n.jsx($3,{size:o,radius:r,children:n.jsxs(Ve,{initial:!1,children:[s&&n.jsx(U3,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsxs("svg",{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Unsupported network warning"}),n.jsx("path",{d:"M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z",fill:"currentColor",stroke:"var(--ck-body-background, #fff)",strokeWidth:"1.5"}),n.jsx("path",{d:"M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z",fill:"white"})]})}),e?n.jsx(B3,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:(i=l?.logo)!==null&&i!==void 0?i:n.jsx(re.UnknownChain,{})},`${l?.id}-${l?.name}-${e}`):n.jsx(V3,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:n.jsx(z3,{})},"loading")]})}):n.jsx("div",{style:{width:o,height:o}})},lt={continueWithFamily:"Continue with Family",orSelectWallet:"or select a wallet from the list below",loginWithEmailOrPhone:"Login with Email or Phone",connectWithFamilyIOS:"Connect with Family iOS",connectWallet:"Connect Wallet",disconnect:"Disconnect",connected:"Connected",wrongNetwork:"Wrong Network",switchNetworks:"Switch Networks",switchWallets:"Switch Wallets",chainNetwork:"{{ CHAIN }} Network",copyToClipboard:"Copy to Clipboard",copyCode:"Copy Code",moreInformation:"More Information",back:"Back",close:"Close",or:"or",more:"More",tryAgain:"Try Again",tryAgainQuestion:"Try Again?",dontHaveTheApp:"Don't have the app?",scanTheQRCode:"Scan the QR code",useWalletConnectModal:"Use WalletConnect Modal",useModal:"Use Modal",installTheExtension:"Install the Extension",getWalletName:"Get {{ CONNECTORNAME }}",otherWallets:"Other Wallets",learnMore:"Learn More",getWallet:"Get a Wallet",approveInWallet:"Approve in Wallet",confirmInWallet:"Confirm in Wallet",awaitingConfirmation:"Awaiting Confirmation",signIn:"Sign In",signOut:"Sign Out",signedIn:"Signed In",signedOut:"Signed Out",walletNotConnected:"Wallet Not Connected",warnings_walletSwitchingUnsupported:"Your wallet does not support switching networks from this app.",warnings_walletSwitchingUnsupportedResolve:"Try switching networks from within your wallet instead.",warnings_chainUnsupported:"This app does not support the current connected network.",warnings_chainUnsupportedResolve:"Switch or disconnect to continue.",onboardingScreen_heading:"Get a Wallet",onboardingScreen_h1:"Start Exploring Web3",onboardingScreen_p:"Your wallet is the gateway to all things Ethereum, the magical technology that makes it possible to explore web3.",onboardingScreen_ctaText:"Choose Your First Wallet",onboardingScreen_ctaUrl:"https://ethereum.org/en/wallets/find-wallet/",aboutScreen_heading:"About Wallets",aboutScreen_a_h1:"For your digital assets",aboutScreen_a_p:"Wallets let you send, receive, store, and interact with digital assets like NFTs and other Ethereum tokens.",aboutScreen_b_h1:"A better way to login",aboutScreen_b_p:"With modern apps, your wallet can be used as an easy way to login, instead of having to remember a password.",aboutScreen_c_h1:"Explore the world of web3",aboutScreen_c_p:"Your wallet is an essential utility that lets you explore and participate in the fast evolving world of web3.",aboutScreen_ctaText:"Learn More",aboutScreen_ctaUrl:"https://ethereum.org/en/wallets/",connectorsScreen_heading:"Connect Wallet",connectorsScreen_newcomer:"I don’t have a wallet",connectorsScreen_h1:"What is a wallet?",connectorsScreen_p:"Wallets are used to send, receive, and store digital assets. Connecting a wallet lets you interact with apps.",mobileConnectorsScreen_heading:"Choose Wallet",scanScreen_heading:"Scan with Phone",scanScreen_heading_withConnector:"Scan with {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:`Open a [WALLETCONNECTLOGO] WalletConnect 
supported wallet to scan`,scanScreen_tooltip_default:`Open {{ CONNECTORNAME }} on 
your mobile phone to scan`,downloadAppScreen_heading:"Get {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Scan with your phone camera to download on iOS or Android.",downloadAppScreen_ios:"Scan with your phone camera to download on iOS.",downloadAppScreen_android:"Scan with your phone camera to download on Android.",injectionScreen_unavailable_h1:"Unsupported Browser",injectionScreen_unavailable_p:`To connect your {{ CONNECTORSHORTNAME }} wallet,
install the extension on {{ SUGGESTEDEXTENSIONBROWSER }}.`,injectionScreen_install_h1:"Install {{ CONNECTORNAME }}",injectionScreen_install_p:`To connect your {{ CONNECTORSHORTNAME }} wallet,
install the browser extension.`,injectionScreen_connecting_h1:"Requesting Connection",injectionScreen_connecting_p:`Open the {{ CONNECTORSHORTNAME }} browser 
extension to connect your wallet.`,injectionScreen_connecting_injected_h1:"Requesting Connection",injectionScreen_connecting_injected_p:"Accept the request through your wallet to connect to this app.",injectionScreen_connected_h1:"Already Connected",injectionScreen_connected_p:"It is now okay to close this popup",injectionScreen_rejected_h1:"Request Cancelled",injectionScreen_rejected_p:`You cancelled the request.
Click above to try again.`,injectionScreen_failed_h1:"Connection Failed",injectionScreen_failed_p:`Sorry, something went wrong.
Please try connecting again.`,injectionScreen_notconnected_h1:"Login to {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"To continue, please login to your {{ CONNECTORNAME }} extension.",profileScreen_heading:"Connected",buyScreen_heading:"Add funds",buyScreen_subheading:"Select an amount and token to top up.",buyScreen_payWithCard_title:"Pay with card",buyScreen_payWithCard_description:"Use Stripe or Google Pay for a quick card purchase.",buyScreen_payWithCard_url:"https://pay.coinbase.com/",buyScreen_exchange_title:"Buy from an exchange",buyScreen_exchange_description:"Purchase on Coinbase, MoonPay, or another exchange and send it here.",buyScreen_exchange_url:"https://www.coinbase.com/buy",buyScreen_wallet_title:"Transfer from wallet",buyScreen_wallet_description:"Send funds from MetaMask, Phantom, or any other wallet you already use.",buyScreen_help:"Having trouble or facing location restrictions?",buyScreen_help_cta:"Try a different provider.",buyScreen_help_url:"https://onramper.com/",switchNetworkScreen_heading:"Switch Networks",signInWithEthereumScreen_tooltip:`You’re not signed in to this app.
**Sign In With Ethereum** to continue.`,signInWithEthereumScreen_signedOut_heading:"Sign In With Ethereum",signInWithEthereumScreen_signedOut_h1:`This app would like to verify you 
 as the owner of this wallet.`,signInWithEthereumScreen_signedOut_p:`Please sign the message request 
 in your wallet to continue.`,signInWithEthereumScreen_signedOut_button:"Sign In",signInWithEthereumScreen_signedIn_heading:"Signed In With Ethereum",signInWithEthereumScreen_signedIn_h1:`You successfully verified yourself 
 as the owner of this wallet.`,signInWithEthereumScreen_signedIn_p:`Signing out will require you to 
 authenticate again in the future.`,signInWithEthereumScreen_signedIn_button:"Sign Out"},H3={...lt,connectWallet:"الاتصال بالمحفظة",disconnect:"قطع الاتصال",connected:"متصل",wrongNetwork:"شبكة خاطئة",switchNetworks:"تغيير الشبكات",chainNetwork:"شبكة {{ CHAIN }}",copyToClipboard:"نسخ إلى الحافظة",copyCode:"نسخ الكود",moreInformation:"مزيد من المعلومات",back:"عودة",close:"إغلاق",or:"أو",more:"المزيد",tryAgain:"حاول مجددًا",tryAgainQuestion:"هل نحاول مرة أخرى؟",dontHaveTheApp:"ليس لديك التطبيق؟",scanTheQRCode:"مسح رمز الاستجابة السريعة",useWalletConnectModal:"استخدم نموذج ولِيت‌كنيكت",useModal:"استخدم النموذج",installTheExtension:"تثبيت الإضافة",getWalletName:"الحصول على {{ CONNECTORNAME }}",otherWallets:"محافظ أخرى",learnMore:"تعرف على المزيد",getWallet:"الحصول على محفظة",approveInWallet:"الموافقة في المحفظة",confirmInWallet:"تأكيد في المحفظة",awaitingConfirmation:"بانتظار التأكيد",signIn:"تسجيل الدخول",signOut:"تسجيل الخروج",signedIn:"تم تسجيل الدخول",signedOut:"تم تسجيل الخروج",walletNotConnected:"المحفظة غير متصلة",warnings_walletSwitchingUnsupported:"عذرًا، لا تدعم محفظتك تغيير الشبكات من هذا التطبيق.",warnings_walletSwitchingUnsupportedResolve:"حاول تغيير الشبكات من داخل محفظتك بدلاً من ذلك.",warnings_chainUnsupported:"هذا التطبيق غير متوافق مع الشبكة المتصلة حاليًا.",warnings_chainUnsupportedResolve:"للمتابعة، قم بتغيير الشبكة أو قطع الاتصال.",onboardingScreen_heading:"الحصول على محفظة",onboardingScreen_h1:"ابدأ استكشاف الويب3",onboardingScreen_p:"تعتبر محفظتك بوابتك إلى عوالم إيثريوم، التكنولوجيا السحرية التي تمكن استكشاف الويب3.",onboardingScreen_ctaText:"اختر محفظتك الأولى",onboardingScreen_ctaUrl:"https://ethereum.org/ar/wallets/find-wallet/",aboutScreen_heading:"حول المحافظ",aboutScreen_a_h1:"حافظ على أصولك الرقمية",aboutScreen_a_p:"تمكنك المحافظ من إرسال واستقبال وتخزين والتفاعل مع الأصول الرقمية مثل NFTs ورموز إيثريوم الأخرى.",aboutScreen_b_h1:"وسيلة أفضل لتسجيل الدخول",aboutScreen_b_p:"في تطبيقات العصر الحديث، يمكن استخدام محفظتك كوسيلة سهلة لتسجيل الدخول بدلاً من الحاجة إلى تذكر كلمة مرور.",aboutScreen_c_h1:"استكشاف عالم الويب3",aboutScreen_c_p:"تعتبر محفظتك أداة أساسية تمكنك من استكشاف والمشاركة في عالم الويب3 الذي يتطور بسرعة.",aboutScreen_ctaText:"استزيد من المعرفة",aboutScreen_ctaUrl:"https://ethereum.org/ar/wallets/",connectorsScreen_heading:"الاتصال بالمحفظة",connectorsScreen_newcomer:"ليس لدي محفظة",connectorsScreen_h1:"ما هي المحافظ؟",connectorsScreen_p:"تُستخدم المحافظ لإرسال واستقبال وتخزين الأصول الرقمية. يمكنك الاتصال بمحفظة للتفاعل مع التطبيقات.",mobileConnectorsScreen_heading:"اختر محفظة",scanScreen_heading:"مسح باستخدام الهاتف",scanScreen_heading_withConnector:"مسح باستخدام {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:`افتح محفظة تدعم ولِيت‌كنيكت 
 لبدء المسح.`,scanScreen_tooltip_default:"افتح {{ CONNECTORNAME }} على هاتفك للمسح",downloadAppScreen_heading:"الحصول على {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:`استخدم كاميرا هاتفك للمسح وتنزيله على نظامي iOS أو Android

.`,downloadAppScreen_ios:"استخدم كاميرا هاتفك للمسح وتنزيله على نظام iOS.",downloadAppScreen_android:"استخدم كاميرا هاتفك للمسح وتنزيله على نظام Android.",injectionScreen_unavailable_h1:"المتصفح غير مدعوم",injectionScreen_unavailable_p:"لتوصيل محفظتك {{ CONNECTORSHORTNAME }}، قم بتثبيت الإضافة على متصفح {{ SUGGESTEDEXTENSIONBROWSER }}.",injectionScreen_install_h1:"تثبيت {{ CONNECTORNAME }}",injectionScreen_install_p:"لتوصيل محفظتك {{ CONNECTORSHORTNAME }}، قم بتثبيت الإضافة على المتصفح.",injectionScreen_connecting_h1:"طلب الاتصال",injectionScreen_connecting_p:"افتح إضافة المتصفح {{ CONNECTORSHORTNAME }} لتوصيل محفظتك.",injectionScreen_connecting_injected_h1:"طلب الاتصال",injectionScreen_connecting_injected_p:"قبل الطلب من خلال محفظتك للاتصال بتطبيقنا.",injectionScreen_connected_h1:"الاتصال بالفعل",injectionScreen_connected_p:"من الآمن الآن إغلاق هذه النافذة المنبثقة.",injectionScreen_rejected_h1:"تم رفض الطلب",injectionScreen_rejected_p:"لقد قمت برفض الطلب. انقر أعلى للمحاولة مرة أخرى.",injectionScreen_failed_h1:"فشل الاتصال",injectionScreen_failed_p:"عذرًا، حدث خطأ ما. يُرجى المحاولة مرة أخرى للاتصال.",injectionScreen_notconnected_h1:"تسجيل الدخول إلى {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"للمتابعة، يُرجى تسجيل الدخول إلى إضافة {{ CONNECTORNAME }}.",profileScreen_heading:"متصل",switchNetworkScreen_heading:"تبديل الشبكات",signInWithEthereumScreen_tooltip:`أنت غير مسجل الدخول حاليًا إلى هذا التطبيق.
**سجل الدخول باستخدام إثيريوم** للمتابعة.`,signInWithEthereumScreen_signedOut_heading:"سجل الدخول باستخدام إثيريوم",signInWithEthereumScreen_signedOut_h1:`يود هذا التطبيق التحقق منك 
 كصاحب لهذه المحفظة.`,signInWithEthereumScreen_signedOut_p:"يرجى تأكيد طلب الرسالة في محفظتك للمتابعة.",signInWithEthereumScreen_signedOut_button:"سجل الدخول",signInWithEthereumScreen_signedIn_heading:"تم تسجيل الدخول باستخدام إثيريوم",signInWithEthereumScreen_signedIn_h1:"لقد قمت بتأكيد نفسك كصاحب لهذه المحفظة بنجاح.",signInWithEthereumScreen_signedIn_p:"سيتطلب تسجيل الخروج منك إعادة المصادقة مرة أخرى في المستقبل.",signInWithEthereumScreen_signedIn_button:"تسجيل الخروج"},G3={...lt,connectWallet:"Connecta la cartera",disconnect:"Desconnectar",connected:"Connectat",wrongNetwork:"Xarxa incorrecta",switchNetworks:"Canvi de xarxa",chainNetwork:"Xarxa {{ CHAIN }}",copyToClipboard:"Copia al portapapers",copyCode:"Copia codi",moreInformation:"Més informació",back:"Enrere",close:"Tanca",or:"o",more:"Més",tryAgain:"Torna-ho a intentar",tryAgainQuestion:"Tornar a intentar-ho?",dontHaveTheApp:"No tens l'aplicació?",scanTheQRCode:"Escaneja el codi QR",useWalletConnectModal:"Utilitza WalletConnect Modal",useModal:"Utilitza Modal",installTheExtension:"Instal·la l'extensió",getWalletName:"Obté {{ CONNECTORNAME }}",otherWallets:"Altres carteres",learnMore:"Més informació",getWallet:"Obté una cartera",approveInWallet:"Aprova a la cartera",confirmInWallet:"Confirma a la cartera",awaitingConfirmation:"Esperant confirmació",signIn:"Inicia sessió",signOut:"Tanca sessió",signedIn:"Sessió iniciada",signedOut:"Sessió tancada",walletNotConnected:"Cartera no connectada",warnings_walletSwitchingUnsupported:"La teva cartera no permet canviar de xarxa des d'aquesta aplicació.",warnings_walletSwitchingUnsupportedResolve:"Prova a canviar de xarxa des de la teva cartera.",warnings_chainUnsupported:"Aquesta aplicació no és compatible amb la xarxa connectada actualment.",warnings_chainUnsupportedResolve:"Canvia o desconnecta per continuar.",onboardingScreen_heading:"Obté una cartera",onboardingScreen_h1:"Comença a explorar la Web3",onboardingScreen_p:"La teva cartera és el portal d'accés a tot el relacionat amb Ethereum, la tecnologia màgica que permet explorar la Web3.",onboardingScreen_ctaText:"Tria la teva primera cartera",onboardingScreen_ctaUrl:"https://ethereum.org/es/wallets/find-wallet/",aboutScreen_heading:"Sobre les carteres",aboutScreen_a_h1:"Per als teus actius digitals",aboutScreen_a_p:"Les carteres et permeten enviar, rebre, emmagatzemar i interactuar amb actius digitals com els NFT i altres tokens d'Ethereum.",aboutScreen_b_h1:"Una manera millor d'iniciar sessió",aboutScreen_b_p:"Amb les aplicacions modernes, pots utilitzar la teva cartera per iniciar sessió fàcilment, en lloc de haver de recordar una contrasenya.",aboutScreen_c_h1:"Explora el món de la Web3",aboutScreen_c_p:"La teva cartera és una eina essencial que et permet explorar i participar en el món en ràpida evolució de la Web3.",aboutScreen_ctaText:"Més informació",aboutScreen_ctaUrl:"https://ethereum.org/es/wallets/",connectorsScreen_heading:"Connecta una cartera",connectorsScreen_newcomer:"No tinc una cartera",connectorsScreen_h1:"Què és una cartera?",connectorsScreen_p:"Les carteres s'utilitzen per enviar, rebre i emmagatzemar actius digitals. Si connectes una cartera, podràs interactuar amb les aplicacions.",mobileConnectorsScreen_heading:"Tria una cartera",scanScreen_heading:"Escaneja amb el telèfon",scanScreen_heading_withConnector:"Escaneja amb {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"Obre una cartera compatible amb WalletConnect [WALLETCONNECTLOGO] per escanejar",scanScreen_tooltip_default:"Obre {{ CONNECTORNAME }} en el teu telèfon mòbil per escanejar",downloadAppScreen_heading:"Obté {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Escaneja amb la càmera del teu telèfon per descarregar-la en iOS o Android.",downloadAppScreen_ios:"Escaneja amb la càmera del teu telèfon per descarregar-la en iOS.",downloadAppScreen_android:"Escaneja amb la càmera del teu telèfon per descarregar-la en Android.",injectionScreen_unavailable_h1:"Navegador no compatible",injectionScreen_unavailable_p:"Per connectar la teva cartera de {{ CONNECTORSHORTNAME }}, instal·la l'extensió en {{ SUGGESTEDEXTENSIONBROWSER }}.",injectionScreen_install_h1:"Instal·la {{ CONNECTORNAME }}",injectionScreen_install_p:"Per connectar la teva cartera de {{ CONNECTORSHORTNAME }}, instal·la l'extensió del navegador.",injectionScreen_connecting_h1:"Sol·licitud de connexió",injectionScreen_connecting_p:"Obre l'extensió del navegador de {{ CONNECTORSHORTNAME }}  per connectar la teva cartera.",injectionScreen_connecting_injected_h1:"Sol·licitud de connexió",injectionScreen_connecting_injected_p:"Accepta la sol·licitud a través de la teva cartera per connectar-te a aquesta aplicació.",injectionScreen_connected_h1:"Ja connectada",injectionScreen_connected_p:"Ja pots tancar aquesta finestra emergent",injectionScreen_rejected_h1:"Sol·licitud cancel·lada",injectionScreen_rejected_p:"Has cancel·lat la sol·licitud. Fes clic a dalt per tornar-ho a intentar.",injectionScreen_failed_h1:"Error de connexió",injectionScreen_failed_p:"Ho sentim, hi ha hagut un problema. Intenta connectar-te de nou.",injectionScreen_notconnected_h1:"Inicia sessió en {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Per continuar, inicia sessió en la teva extensió de {{ CONNECTORNAME }}.",profileScreen_heading:"Connectat",switchNetworkScreen_heading:"Canvi de xarxa",signInWithEthereumScreen_tooltip:`No has iniciat sessió en aquesta aplicació.
**Inicia sessió amb Ethereum** per continuar.`,signInWithEthereumScreen_signedOut_heading:"Inicia sessió amb Ethereum",signInWithEthereumScreen_signedOut_h1:"Aquesta aplicació vol verificar que ets el propietari d'aquesta cartera.",signInWithEthereumScreen_signedOut_p:"Signa la sol·licitud de missatge en la teva cartera per continuar.",signInWithEthereumScreen_signedOut_button:"Inicia sessió",signInWithEthereumScreen_signedIn_heading:"Sessió iniciada amb Ethereum",signInWithEthereumScreen_signedIn_h1:"T'has verificat correctament com a propietari d'aquesta cartera.",signInWithEthereumScreen_signedIn_p:"Si tanques la sessió, hauràs de tornar a autenticar-te més endavant.",signInWithEthereumScreen_signedIn_button:"Tanca sessió"},q3={...lt,connectWallet:"Ühenda rahakott",disconnect:"Katkesta ühendus",connected:"Ühendatud",wrongNetwork:"Vale võrk",switchNetworks:"Vaheta võrke",chainNetwork:"{{ CHAIN }} Võrk",copyToClipboard:"Kopeeri lõikelauale",copyCode:"Kopeeri koodi",moreInformation:"Rohkem infot",back:"Tagasi",close:"Pane kinni",or:"või",more:"Rohkem",tryAgain:"Proovi uuesti",tryAgainQuestion:"Proovi uuesti?",dontHaveTheApp:"Kas teil pole rakendust?",scanTheQRCode:"Skaneeri QR-kood",useWalletConnectModal:"Kasuta WalletConnecti modalit",useModal:"Kasuta Modalit",installTheExtension:"Installi laiendust",getWalletName:"Hanki {{ CONNECTORNAME }}",otherWallets:"Teised rahakotid",learnMore:"Avasta rohkem",getWallet:"Lae alla rahakott",approveInWallet:"Kiita heaks rahakotis",confirmInWallet:"Kinnita rahakotis",awaitingConfirmation:"Kinnituse ootel",signIn:"Logi sisse",signOut:"Logi välja",signedIn:"Sisse logitud",signedOut:"Välja logitud",walletNotConnected:"Raakott pole ühendatud",warnings_walletSwitchingUnsupported:"Teie rahakott ei toeta võrgu vahetamist sellest rakendusest.",warnings_walletSwitchingUnsupportedResolve:"Proovige võrgu vahetamist teha oma rahakoti seest.",warnings_chainUnsupported:"See rakendus ei toeta praegu ühendatud võrku.",warnings_chainUnsupportedResolve:"Jätkamiseks vahetage või ühendage lahti.",onboardingScreen_heading:"Hankige rahakott",onboardingScreen_h1:"Alustage Web3 uurimist",onboardingScreen_p:"Teie rahakott on värav kõigele, mis puudutab Ethereumit, maagilist tehnoloogiat, mis võimaldab uurida Web3.",onboardingScreen_ctaText:"Valige oma esimene rahakott",onboardingScreen_ctaUrl:"https://ethereum.org/en/wallets/find-wallet/",aboutScreen_heading:"Rahakottidest",aboutScreen_a_h1:"Teie digitaalsetele varadele",aboutScreen_a_p:"Rahakotid võimaldavad teil saata, vastu võtta, salvestada ja suhelda digitaalsete varadega nagu NFT-d ja teised Ethereumi tokenid.",aboutScreen_b_h1:"Parem viis sisse logimiseks",aboutScreen_b_p:"Kaasaegsete rakendustega saab teie rahakotti kasutada lihtsa sisselogimisviisina, ilma et peaksite meeles pidama parooli.",aboutScreen_c_h1:"Uurige Web3 maailma",aboutScreen_c_p:"Teie rahakott on oluline tööriist, mis võimaldab teil uurida ja osaleda kiiresti arenevas Web3 maailmas.",aboutScreen_ctaText:"Lisateavet saamiseks",aboutScreen_ctaUrl:"https://ethereum.org/en/wallets/",connectorsScreen_heading:"Ühendage rahakott",connectorsScreen_newcomer:"Mul pole rahakotti",connectorsScreen_h1:"Mis on rahakott?",connectorsScreen_p:"Rahakotte kasutatakse digitaalsete varade saatmiseks, vastuvõtmiseks ja salvestamiseks. Rahakoti ühendamine võimaldab teil rakendustega suhelda.",mobileConnectorsScreen_heading:"Valige rahakott",scanScreen_heading:"Skaneerige telefoni abil",scanScreen_heading_withConnector:"Skaneerige koos {{ CONNECTORNAME }}-ga",scanScreen_tooltip_walletConnect:`Ava [WALLETCONNECTLOGO] WalletConnect 
toetatud rahakott skaneerimiseks`,scanScreen_tooltip_default:`Ava {{ CONNECTORNAME }} oma 
mobiiltelefonil skaneerimiseks`,downloadAppScreen_heading:"Hankige {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Skaneerige oma telefoni kaameraga allalaadimiseks iOS-i või Androidi jaoks.",downloadAppScreen_ios:"Skaneerige oma telefoni kaameraga allalaadimiseks iOS-i jaoks.",downloadAppScreen_android:"Skaneerige oma telefoni kaameraga Androidi allalaadimiseks.",injectionScreen_unavailable_h1:"Toetuseta brauser",injectionScreen_unavailable_p:`Teie {{ CONNECTORSHORTNAME }} rahakoti ühendamiseks
installige laiendus {{ SUGGESTEDEXTENSIONBROWSER }}-le.`,injectionScreen_install_h1:"Installige {{ CONNECTORNAME }}",injectionScreen_install_p:`Teie {{ CONNECTORSHORTNAME }} rahakoti ühendamiseks
installige brauseri laiendus.`,injectionScreen_connecting_h1:"Ühenduse taotlemine",injectionScreen_connecting_p:`Ava {{ CONNECTORSHORTNAME }} brauseri 
laiendus rahakoti ühendamiseks.`,injectionScreen_connecting_injected_h1:"Ühenduse taotlemine",injectionScreen_connecting_injected_p:"Nõustuge rakendusega ühendamiseks oma rahakotis.",injectionScreen_connected_h1:"Juba ühendatud",injectionScreen_connected_p:"Selle popup-i saab nüüd sulgeda",injectionScreen_rejected_h1:"Taotlus tühistatud",injectionScreen_rejected_p:`Tühistasite taotluse.
Klõpsake ülal, et uuesti proovida.`,injectionScreen_failed_h1:"Ühenduse loomine ebaõnnestus",injectionScreen_failed_p:`Vabandame, midagi läks valesti.
Proovige ühendust uuesti luua.`,injectionScreen_notconnected_h1:"Logige sisse {{ CONNECTORNAME }}-ga",injectionScreen_notconnected_p:"Jätkamiseks logige sisse oma {{ CONNECTORNAME }} laiendisse.",profileScreen_heading:"Ühendatud",switchNetworkScreen_heading:"Võrkude vahetamine",signInWithEthereumScreen_tooltip:`Te pole selle rakendusse sisse logitud.
**Logi sisse Ethereumiga** jätkamiseks.`,signInWithEthereumScreen_signedOut_heading:"Logi sisse Ethereumiga",signInWithEthereumScreen_signedOut_h1:`See rakendus soovib teid autentida 
 selle rahakoti omanikuna.`,signInWithEthereumScreen_signedOut_p:`Jätkamiseks allkirjastage sõnumipäring 
 oma rahakotis.`,signInWithEthereumScreen_signedOut_button:"Logi sisse",signInWithEthereumScreen_signedIn_heading:"Logi välja",signInWithEthereumScreen_signedIn_h1:`Olete edukalt autentinud end 
 selle rahakoti omanikuna.`,signInWithEthereumScreen_signedIn_p:`Välja logimine nõuab tulevikus 
 uuesti autentimist.`,signInWithEthereumScreen_signedIn_button:"Logi välja"},Z3={...lt,connectWallet:"Conecta una cartera",disconnect:"Desconectar",connected:"Conectado",wrongNetwork:"Red incorrecta",switchNetworks:"Cambio de red",chainNetwork:"Red {{ CHAIN }}",copyToClipboard:"Copiar al portapapeles",copyCode:"Copiar código",moreInformation:"Más información",back:"Atrás",close:"Cerrar",or:"o",more:"Más",tryAgain:"Intentar de nuevo",tryAgainQuestion:"¿Intentar de nuevo?",dontHaveTheApp:"¿No tienes la aplicación?",scanTheQRCode:"Escanea el código QR",useWalletConnectModal:"Utilizar WalletConnect Modal",useModal:"Utilizar Modal",installTheExtension:"Instalar la extensión",getWalletName:"Obtén {{ CONNECTORNAME }}",otherWallets:"Otras carteras",learnMore:"Más información",getWallet:"Obtén una cartera",approveInWallet:"Aprobar en la cartera",confirmInWallet:"Confirmar en la cartera",awaitingConfirmation:"A la espera de confirmación",signIn:"Iniciar sesión",signOut:"Cerrar sesión",signedIn:"Sesión iniciada",signedOut:"Sesión cerrada",walletNotConnected:"Cartera no conectada",warnings_walletSwitchingUnsupported:"Tu cartera no permite cambiar de red desde esta aplicación.",warnings_walletSwitchingUnsupportedResolve:"Prueba a cambiar de red desde tu cartera.",warnings_chainUnsupported:"Esta aplicación no es compatible con la red conectada actualmente.",warnings_chainUnsupportedResolve:"Cambia o desconecta para continuar.",onboardingScreen_heading:"Obtén una cartera",onboardingScreen_h1:"Comienza a explorar la Web3",onboardingScreen_p:"Tu cartera es el portal de acceso a todo lo relacionado con Ethereum, la tecnología mágica que permite explorar la Web3.",onboardingScreen_ctaText:"Elige tu primera cartera",onboardingScreen_ctaUrl:"https://ethereum.org/es/wallets/find-wallet/",aboutScreen_heading:"Acerca de las carteras",aboutScreen_a_h1:"Para tus activos digitales",aboutScreen_a_p:"Las carteras te permiten enviar, recibir, almacenar e interactuar con activos digitales como los NFT y otros tokens de Ethereum.",aboutScreen_b_h1:"Una manera mejor de iniciar sesión",aboutScreen_b_p:"Con las aplicaciones modernas, puedes utilizar tu cartera para iniciar sesión fácilmente, en vez de tener que recordar una contraseña.",aboutScreen_c_h1:"Explora el mundo de la Web3",aboutScreen_c_p:"Tu cartera es una herramienta esencial que te permite explorar y participar en el mundo en rápida evolución de la Web3.",aboutScreen_ctaText:"Más información",aboutScreen_ctaUrl:"https://ethereum.org/es/wallets/",connectorsScreen_heading:"Conecta una cartera",connectorsScreen_newcomer:"No tengo una cartera",connectorsScreen_h1:"¿Qué es una cartera?",connectorsScreen_p:"Las carteras se utilizan para enviar, recibir y almacenar activos digitales. Si conectas una cartera, podrás interactuar con las aplicaciones.",mobileConnectorsScreen_heading:"Elige una cartera",scanScreen_heading:"Escanea con el teléfono",scanScreen_heading_withConnector:"Escanea con {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"Abre una cartera compatible con WalletConnect [WALLETCONNECTLOGO] para escanear",scanScreen_tooltip_default:"Abre {{ CONNECTORNAME }} en tu teléfono móvil para escanear",downloadAppScreen_heading:"Obtén {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Escanea con la cámara de tu teléfono para descargarla en iOS o Android.",downloadAppScreen_ios:"Escanea con la cámara de tu teléfono para descargarla en iOS.",downloadAppScreen_android:"Escanea con la cámara de tu teléfono para descargarla en Android.",injectionScreen_unavailable_h1:"Navegador no compatible",injectionScreen_unavailable_p:"Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión en {{ SUGGESTEDEXTENSIONBROWSER }}.",injectionScreen_install_h1:"Instala {{ CONNECTORNAME }}",injectionScreen_install_p:"Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión del navegador.",injectionScreen_connecting_h1:"Solicitud de conexión",injectionScreen_connecting_p:"Abre la extensión del navegador de {{ CONNECTORSHORTNAME }}  para conectar tu cartera.",injectionScreen_connecting_injected_h1:"Solicitud de conexión",injectionScreen_connecting_injected_p:"Acepta la solicitud a través de tu cartera para conectarte a esta aplicación.",injectionScreen_connected_h1:"Ya conectada",injectionScreen_connected_p:"Ya puedes cerrar esta ventana emergente",injectionScreen_rejected_h1:"Solicitud cancelada",injectionScreen_rejected_p:"Has cancelado la solicitud. Haz clic arriba para intentarlo de nuevo.",injectionScreen_failed_h1:"Error de conexión",injectionScreen_failed_p:"Lo sentimos, ha habido un problema. Intenta conectarte de nuevo.",injectionScreen_notconnected_h1:"Inicia sesión en {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Para continuar, inicia sesión en tu extensión de {{ CONNECTORNAME }}.",profileScreen_heading:"Conectado",switchNetworkScreen_heading:"Cambio de red",signInWithEthereumScreen_tooltip:`No has iniciado sesión en esta aplicación.
**Inicia sesión con Ethereum** para continuar.`,signInWithEthereumScreen_signedOut_heading:"Inicia sesión con Ethereum",signInWithEthereumScreen_signedOut_h1:"Esta aplicación desea verificar que eres el propietario de esta cartera.",signInWithEthereumScreen_signedOut_p:"Firma la solicitud de mensaje en tu cartera para continuar.",signInWithEthereumScreen_signedOut_button:"Iniciar sesión",signInWithEthereumScreen_signedIn_heading:"Sesión iniciada con Ethereum",signInWithEthereumScreen_signedIn_h1:"Te has verificado correctamente como propietario de esta cartera.",signInWithEthereumScreen_signedIn_p:"Si cierras la sesión, tendrás que volver a autenticarte más adelante.",signInWithEthereumScreen_signedIn_button:"Cerrar sesión"},K3={...lt,connectWallet:"اتصال به کیف پول",disconnect:"قطع ارتباط",connected:"متصل شد",wrongNetwork:"شبکه نادرست",switchNetworks:"تغییر شبکه‌ها",chainNetwork:"{{ CHAIN }} شبکه",copyToClipboard:"کپی به کلیپ‌بورد",copyCode:"کپی کد",moreInformation:"اطلاعات بیشتر",back:"بازگشت",close:"بستن",or:"یا",more:"بیشتر",tryAgain:"تلاش دوباره",tryAgainQuestion:"آیا دوباره تلاش کنیم؟",dontHaveTheApp:"اپلیکیشن را ندارید؟",scanTheQRCode:"اسکن کیو‌آر کد",useWalletConnectModal:"استفاده از مودال والت‌‌کانکت",useModal:"استفاده از مودال",installTheExtension:"نصب افزونه",getWalletName:"دریافت {{ CONNECTORNAME }}",otherWallets:"کیف پول‌های دیگر",learnMore:"بیشتر بدانید",getWallet:"یک کیف پول دریافت کنید",approveInWallet:"در کیف پول تأیید کنید",confirmInWallet:"در کیف پول تأیید کنید",awaitingConfirmation:"در انتظار تأیید",signIn:"ورود",signOut:"خروج",signedIn:"وارد شده",signedOut:"خارج شده",walletNotConnected:"کیف پول متصل نیست",warnings_walletSwitchingUnsupported:"متاسفانه، کیف پول شما از تغییر شبکه در این برنامه پشتیبانی نمی‌کند.",warnings_walletSwitchingUnsupportedResolve:"بهتر است از داخل کیف پول خود تغییر شبکه دهید.",warnings_chainUnsupported:"این برنامه با شبکه‌ای که در حال حاضر متصل است، سازگاری ندارد.",warnings_chainUnsupportedResolve:"برای ادامه، شبکه را تغییر دهید یا اتصال را قطع کنید.",onboardingScreen_heading:"دریافت کیف پول",onboardingScreen_h1:"آغاز کاوش در وب3",onboardingScreen_p:"کیف پول شما دروازه‌ای است به دنیای اتریوم، فناوری جادویی که ممکن می‌سازد تا وب3 را کاوش کنید.",onboardingScreen_ctaText:"کیف پول نخست خود را انتخاب کنید",onboardingScreen_ctaUrl:"https://ethereum.org/fa/wallets/find-wallet/",aboutScreen_heading:"درباره کیف پول‌ها",aboutScreen_a_h1:"نگهبان دارایی‌های دیجیتالی شما",aboutScreen_a_p:"کیف پول‌ها به شما اجازه می‌دهند دارایی‌های دیجیتالی مانند ان‌اف‌تی و توکن‌های اتریومی دیگر را ارسال، دریافت، ذخیره و تعامل دهید.",aboutScreen_b_h1:"یک روش بهتر برای ورود",aboutScreen_b_p:"در برنامه‌های مدرن، کیف پول شما می‌تواند به عنوان یک راه ورود آسان به جای به یادآوری یک رمز عبور مورد استفاده قرار گیرد.",aboutScreen_c_h1:"جهان وب3 را کاوش کنید",aboutScreen_c_p:"کیف پول شما یک ابزار ضروری است که به شما اجازه می‌دهد جهان در حال تغییر سریع وب3 را کاوش و در آن شرکت کنید.",aboutScreen_ctaText:"دانش بیشتری بیافزایید",aboutScreen_ctaUrl:"https://ethereum.org/fa/wallets/",connectorsScreen_heading:"برقراری ارتباط با کیف پول",connectorsScreen_newcomer:"کیف پول ندارم",connectorsScreen_h1:"چیستی رمزگذاری کیف پول؟",connectorsScreen_p:"کیف پول‌ها برای ارسال، دریافت و نگهداری دارایی‌های دیجیتال استفاده می‌شوند. برقراری ارتباط با یک کیف پول به شما امکان تعامل با برنامه‌ها را می‌دهد.",mobileConnectorsScreen_heading:"انتخاب کیف پول",scanScreen_heading:"اسکن با گوشی",scanScreen_heading_withConnector:"اسکن با {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"یک کیف پول با پشتیبانی از والت‌‌کانکت را باز کنید تا اسکن را آغاز کنید",scanScreen_tooltip_default:"{{ CONNECTORNAME }} را روی گوشی خود باز کنید تا اسکن شود",downloadAppScreen_heading:"دریافت {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"از دوربین گوشی خود برای اسکن و دریافت نسخه iOS یا Android استفاده کنید.",downloadAppScreen_ios:"از دوربین گوشی خود برای دریافت نسخه iOS استفاده کنید.",downloadAppScreen_android:"از دوربین گوشی خود برای دریافت نسخه Android استفاده کنید.",injectionScreen_unavailable_h1:"مرورگر پشتیبانی نمی‌شود",injectionScreen_unavailable_p:"برای برقراری ارتباط با کیف پول {{ CONNECTORSHORTNAME }}، افزونه مرورگر را در {{ SUGGESTEDEXTENSIONBROWSER }} نصب کنید.",injectionScreen_install_h1:"نصب {{ CONNECTORNAME }}",injectionScreen_install_p:"برای برقراری ارتباط با کیف پول {{ CONNECTORSHORTNAME }}، افزونه مرورگر را نصب کنید.",injectionScreen_connecting_h1:"درخواست اتصال",injectionScreen_connecting_p:"افزونه مرورگر {{ CONNECTORSHORTNAME }} را باز کنید تا ارتباط با کیف پول ایجاد شود.",injectionScreen_connecting_injected_h1:"درخواست اتصال",injectionScreen_connecting_injected_p:"درخواست را از طریق کیف پول خود بپذیرید تا به این برنامه متصل شوید.",injectionScreen_connected_h1:"اتصال از قبل برقرار است",injectionScreen_connected_p:"اکنون می‌توانید این پنجره‌ی بازشو را ببندید.",injectionScreen_rejected_h1:"درخواست لغو شد",injectionScreen_rejected_p:"شما درخواست را لغو کرده‌اید. برای تلاش مجدد، بالا کلیک کنید.",injectionScreen_failed_h1:"ارتباط ناموفق",injectionScreen_failed_p:"متاسفانه، مشکلی بوجود آمد. لطفاً مجدداً اتصال برقرار کنید.",injectionScreen_notconnected_h1:"با ورود به {{ CONNECTORNAME }} وارد شوید",injectionScreen_notconnected_p:"برای ادامه، لطفاً وارد افزونه {{ CONNECTORNAME }} خود شوید.",profileScreen_heading:"اتصال‌ها",switchNetworkScreen_heading:"تغییر شبکه‌ها",signInWithEthereumScreen_tooltip:`شما در حال حاضر به این برنامه وارد نشده‌اید.
**با اتریوم وارد شوید** تا ادامه دهید.`,signInWithEthereumScreen_signedOut_heading:"با اتریوم وارد شوید",signInWithEthereumScreen_signedOut_h1:`این برنامه می‌خواهد هویت شما 
 به عنوان صاحب این کیف پول را تأیید کند.`,signInWithEthereumScreen_signedOut_p:"لطفاً درخواست پیام را در کیف پول خود تأیید کنید تا ادامه دهید.",signInWithEthereumScreen_signedOut_button:"با اتریوم وارد شوید",signInWithEthereumScreen_signedIn_heading:"با اتریوم وارد شده‌اید",signInWithEthereumScreen_signedIn_h1:"شما به عنوان صاحب این کیف پول هویت خود را با موفقیت تأیید کرده‌اید.",signInWithEthereumScreen_signedIn_p:"خروج از حساب کاربری شما در آینده نیاز به تأیید دوباره دارد.",signInWithEthereumScreen_signedIn_button:"خروج"},Y3={...lt,connectWallet:"Connecter le portefeuille",disconnect:"Déconnecter",connected:"Connecté",wrongNetwork:"Réseau incorrect",switchNetworks:"Changer de réseau",chainNetwork:"Réseau {{ CHAIN }}",copyToClipboard:"Copier dans le presse-papiers",copyCode:"Copier le code",moreInformation:"Plus d’informations",back:"Retour",close:"Fermer",or:"ou",more:"Plus",tryAgain:"Réessayer",tryAgainQuestion:"Réessayer ?",dontHaveTheApp:"Vous n’avez pas l’application ?",scanTheQRCode:"Scannez le code QR",useWalletConnectModal:"Utiliser la modale WalletConnect",useModal:"Utiliser la modale",installTheExtension:"Installer l’extension",getWalletName:"Obtenez {{ CONNECTORNAME }}",otherWallets:"Autres portefeuilles",learnMore:"En savoir plus",getWallet:"Obtenir un portefeuille",approveInWallet:"Approuver dans le portefeuille",confirmInWallet:"Confirmer dans le portefeuille",awaitingConfirmation:"En attente de confirmation",signIn:"Se connecter",signOut:"Se déconnecter",signedIn:"Connecté",signedOut:"Déconnecté",walletNotConnected:"Portefeuille non connecté",warnings_walletSwitchingUnsupported:"Votre portefeuille ne prend pas en charge le changement de réseau à partir de cette application.",warnings_walletSwitchingUnsupportedResolve:"Essayez plutôt de changer de réseau à partir de votre portefeuille.",warnings_chainUnsupported:"Cette application ne prend pas en charge le réseau connecté actuel.",warnings_chainUnsupportedResolve:"Changez ou déconnectez-vous pour continuer.",onboardingScreen_heading:"Obtenez un portefeuille",onboardingScreen_h1:"Commencez à explorer le Web3",onboardingScreen_p:"Votre portefeuille est la porte d'entrée vers tout ce qui concerne l'Ethereum, la technologie magique qui permet d'explorer le Web3.",onboardingScreen_ctaText:"Choisissez votre premier portefeuille",onboardingScreen_ctaUrl:"https://ethereum.org/fr/wallets/find-wallet/",aboutScreen_heading:"À propos des portefeuilles",aboutScreen_a_h1:"Pour vos actifs numériques",aboutScreen_a_p:"Les portefeuilles vous permettent d'envoyer, de recevoir, de stocker et d'interagir avec des actifs numériques tels que des NFT et d'autres jetons Ethereum.",aboutScreen_b_h1:"Une meilleure façon de se connecter",aboutScreen_b_p:"Avec les applications modernes, votre portefeuille peut s'utiliser pour vous connecter facilement, au lieu d'avoir à mémoriser un mot de passe.",aboutScreen_c_h1:"Explorez le monde du Web3",aboutScreen_c_p:"Votre portefeuille est un utilitaire essentiel qui vous permet d'explorer et de participer au monde en évolution rapide du Web3.",aboutScreen_ctaText:"En savoir plus",aboutScreen_ctaUrl:"https://ethereum.org/fr/wallets/",connectorsScreen_heading:"Connectez le portefeuille",connectorsScreen_newcomer:"Je n’ai pas de portefeuille",connectorsScreen_h1:"Qu’est-ce qu’un portefeuille ?",connectorsScreen_p:"Les portefeuilles s'utilisent pour envoyer, recevoir et stocker des actifs numériques. La connexion d'un portefeuille vous permet d'interagir avec les applications.",mobileConnectorsScreen_heading:"Choisissez le portefeuille",scanScreen_heading:"Scannez avec le téléphone",scanScreen_heading_withConnector:"Scannez avec {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"Ouvrez un portefeuille pris en charge par WalletConnect [WALLETCONNECTLOGO] pour scanner",scanScreen_tooltip_default:"Ouvrez {{ CONNECTORNAME }} sur votre téléphone mobile pour scanner",downloadAppScreen_heading:"Obtenez {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS ou Android.",downloadAppScreen_ios:"Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS.",downloadAppScreen_android:"Scannez avec l'appareil photo de votre téléphone pour le télécharger sur Android.",injectionScreen_unavailable_h1:"Navigateur non pris en charge",injectionScreen_unavailable_p:"Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension sur {{ SUGGESTEDEXTENSIONBROWSER }}.",injectionScreen_install_h1:"Installez {{ CONNECTORNAME }}",injectionScreen_install_p:"Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension de navigateur.",injectionScreen_connecting_h1:"Demande de connexion",injectionScreen_connecting_p:"Ouvrez l’extension de navigateur {{ CONNECTORSHORTNAME }} pour connecter votre portefeuille.",injectionScreen_connecting_injected_h1:"Demande de connexion",injectionScreen_connecting_injected_p:"Acceptez la demande via votre portefeuille pour vous connecter à cette application.",injectionScreen_connected_h1:"Déjà connecté",injectionScreen_connected_p:"Vous pouvez maintenant fermer ce pop-up",injectionScreen_rejected_h1:"Demande annulée",injectionScreen_rejected_p:"Vous avez annulé la demande. Cliquez ci-dessus pour réessayer.",injectionScreen_failed_h1:"Échec de la connexion",injectionScreen_failed_p:"Malheureusement, un problème est survenu. Veuillez réessayer de vous connecter.",injectionScreen_notconnected_h1:"Connectez-vous à {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Pour continuer, veuillez vous connecter à votre extension {{ CONNECTORNAME }} .",profileScreen_heading:"Connecté",switchNetworkScreen_heading:"Changer de réseau",signInWithEthereumScreen_tooltip:`Vous n’êtes pas connecté à cette application.
**Connectez-vous avec Ethereum** pour continuer.`,signInWithEthereumScreen_signedOut_heading:"Connectez-vous avec Ethereum",signInWithEthereumScreen_signedOut_h1:"Cette application souhaite vérifier que vous êtes bien le propriétaire de ce portefeuille.",signInWithEthereumScreen_signedOut_p:"Veuillez signer la demande de message dans votre portefeuille pour continuer.",signInWithEthereumScreen_signedOut_button:"Se connecter",signInWithEthereumScreen_signedIn_heading:"Connecté avec Ethereum",signInWithEthereumScreen_signedIn_h1:"Vous avez réussi à vous identifier en tant que propriétaire de ce portefeuille.",signInWithEthereumScreen_signedIn_p:"La déconnexion vous obligera à vous authentifier à nouveau à l'avenir.",signInWithEthereumScreen_signedIn_button:"Se déconnecter"},X3={...lt,connectWallet:"ウォレットの接続",disconnect:"切断",connected:"接続されました",wrongNetwork:"間違ったネットワーク",switchNetworks:"ネットワークの切り替え",chainNetwork:"{{ CHAIN }} ネットワーク",copyToClipboard:"クリップボードにコピー",copyCode:"コードをコピー",moreInformation:"詳細情報",back:"戻る",close:"閉じる",or:"または",more:"その他",tryAgain:"再試行",tryAgainQuestion:"もう一度試しますか？",dontHaveTheApp:"アプリをお持ちではありませんか？",scanTheQRCode:"QR コードをスキャン",useWalletConnectModal:"WalletConnect モーダルを使用",useModal:"モーダルを使用",installTheExtension:"拡張機能をインストール",getWalletName:"{{ CONNECTORNAME }} を取得",otherWallets:"その他のウォレット",learnMore:"詳細情報",getWallet:"ウォレットを入手",approveInWallet:"ウォレットで承認",confirmInWallet:"ウォレットで確認",awaitingConfirmation:"確認を待っています",signIn:"サインイン",signOut:"サインアウト",signedIn:"サインインしました",signedOut:"サインアウトしました",walletNotConnected:"ウォレットが接続されていません",warnings_walletSwitchingUnsupported:"お使いのウォレットは、このアプリからのネットワークの切り替えをサポートしていません。",warnings_walletSwitchingUnsupportedResolve:"代わりにウォレット内からネットワークを切り替えてみてください。",warnings_chainUnsupported:"このアプリは、現在接続されているネットワークをサポートしていません。",warnings_chainUnsupportedResolve:"切り替えるか切断して続行します。",onboardingScreen_heading:"ウォレットを入手",onboardingScreen_h1:"Web3 の探索を開始",onboardingScreen_p:"ウォレットは、web3 の探索を可能にする魔法のテクノロジーであるイーサリアムのすべてへのゲートウェイです。",onboardingScreen_ctaText:"最初のウォレットを選択してください",onboardingScreen_ctaUrl:"https://ethereum.org/ja/wallets/find-wallet/",aboutScreen_heading:"ウォレットについて",aboutScreen_a_h1:"デジタル資産用",aboutScreen_a_p:"ウォレットを使用すると、NFT やその他のイーサリアム トークンなどのデジタル資産を送信、受信、保存、および操作できます。",aboutScreen_b_h1:"より良いログイン方法",aboutScreen_b_p:"最新のアプリでは、パスワードを覚える必要がなく、ウォレットを簡単なログイン方法として使用できます。",aboutScreen_c_h1:"web3 の世界を探索",aboutScreen_c_p:"ウォレットは、急速に進化する web3 の世界を探索し、参加するために不可欠なユーティリティです。",aboutScreen_ctaText:"詳細情報",aboutScreen_ctaUrl:"https://ethereum.org/ja/wallets/",connectorsScreen_heading:"ウォレットの接続",connectorsScreen_newcomer:"ウォレットを持っていません",connectorsScreen_h1:"ウォレットとは何ですか？",connectorsScreen_p:"ウォレットは、デジタル資産の送信、受信、および保存に使用されます。 ウォレットを接続すると、アプリとやり取りできます。",mobileConnectorsScreen_heading:"ウォレットを選択",scanScreen_heading:"電話でスキャンする",scanScreen_heading_withConnector:"{{ CONNECTORNAME }}でスキャンする",scanScreen_tooltip_walletConnect:"[WALLETCONNECTLOGO] WalletConnect 対応の ウォレットを開いてスキャンします",scanScreen_tooltip_default:"携帯電話で {{ CONNECTORNAME }} を 開いてスキャンします",downloadAppScreen_heading:"{{ CONNECTORNAME }} を取得",downloadAppScreen_iosAndroid:"携帯電話のカメラでスキャンして、iOS または Android にダウンロードします。",downloadAppScreen_ios:"携帯電話のカメラでスキャンして、iOS にダウンロードします。",downloadAppScreen_android:"携帯電話のカメラでスキャンして、Android にダウンロードします。",injectionScreen_unavailable_h1:"サポートされていないブラウザ",injectionScreen_unavailable_p:"{{ CONNECTORSHORTNAME }} ウォレットを接続するには、{{ SUGGESTEDEXTENSIONBROWSER }} に拡張機能をインストールします。",injectionScreen_install_h1:"{{ CONNECTORNAME }} をインストール",injectionScreen_install_p:"{{ CONNECTORSHORTNAME }} ウォレットを接続するには、ブラウザ拡張機能をインストールします。",injectionScreen_connecting_h1:"接続を要求",injectionScreen_connecting_p:"{{ CONNECTORSHORTNAME }} ブラウザ拡張機能を 開いて、ウォレットを接続します。",injectionScreen_connecting_injected_h1:"接続を要求",injectionScreen_connecting_injected_p:"このアプリに接続するには、ウォレットを介して要求を受け入れます。",injectionScreen_connected_h1:"すでに接続済み",injectionScreen_connected_p:"このポップアップを閉じてもかまいません",injectionScreen_rejected_h1:"要求がキャンセルされました",injectionScreen_rejected_p:"要求をキャンセルしました。上をクリックしてもう一度お試しください。",injectionScreen_failed_h1:"接続に失敗しました",injectionScreen_failed_p:"申し訳ありませんが、問題が発生しました。もう一度接続してみてください。",injectionScreen_notconnected_h1:"{{ CONNECTORNAME }} にログイン",injectionScreen_notconnected_p:"続行するには、 {{ CONNECTORNAME }} 拡張機能にログインしてください。",profileScreen_heading:"接続されました",switchNetworkScreen_heading:"ネットワークの切り替え",signInWithEthereumScreen_tooltip:`このアプリにサインインしていません。
続行するには、**イーサリアムでサインイン**してください。`,signInWithEthereumScreen_signedOut_heading:"イーサリアムでサインイン",signInWithEthereumScreen_signedOut_h1:"このアプリは、あなたがこのウォレットの 所有者であることを確認しようとしています。",signInWithEthereumScreen_signedOut_p:"続行するには、ウォレットで メッセージ リクエストに署名してください。",signInWithEthereumScreen_signedOut_button:"サインイン",signInWithEthereumScreen_signedIn_heading:"イーサリアムでサインインしました",signInWithEthereumScreen_signedIn_h1:"このウォレットの所有者であることが 正常に確認されました。",signInWithEthereumScreen_signedIn_p:"サインアウトすると、今後 再度認証する必要があります。",signInWithEthereumScreen_signedIn_button:"サインアウト"},Q3={...lt,connectWallet:"Conectar carteira",disconnect:"Desconectar",connected:"Conectado",wrongNetwork:"Rede incorreta",switchNetworks:"Alternar rede",chainNetwork:"Rede {{ CHAIN }}",copyToClipboard:"Copiar para a área de transferência",copyCode:"Copiar código",moreInformation:"Mais informações",back:"Voltar",close:"Fechar",or:"ou",more:"Mais",tryAgain:"Tentar novamente",tryAgainQuestion:"Tentar novamente?",dontHaveTheApp:"Não tem o aplicativo?",scanTheQRCode:"Escaneie o código QR",useWalletConnectModal:"Use o modal do WalletConnect",useModal:"Usar modal",installTheExtension:"Instale a extensão",getWalletName:"Obter {{ CONNECTORNAME }}",otherWallets:"Outras carteiras",learnMore:"Saiba mais",getWallet:"Obtenha uma carteira",approveInWallet:"Aprovar na carteira",confirmInWallet:"Confirmar na carteira",awaitingConfirmation:"Aguardando confirmação",signIn:"Entrar",signOut:"Sair",signedIn:"Conectado",signedOut:"Desconectado",walletNotConnected:"Carteira não conectada",warnings_walletSwitchingUnsupported:"A sua carteira não permite a troca de rede a partir deste aplicativo.",warnings_walletSwitchingUnsupportedResolve:"Tente trocar de rede de dentro da sua carteira.",warnings_chainUnsupported:"Este aplicativo não é compatível com a rede conectada.",warnings_chainUnsupportedResolve:"Altere a rede ou desconecte para continuar.",onboardingScreen_heading:"Obtenha uma carteira",onboardingScreen_h1:"Comece a explorar a Web3",onboardingScreen_p:"Sua carteira é a porta de entrada para todas as coisas Ethereum, a tecnologia mágica que torna possível explorar a web3.",onboardingScreen_ctaText:"Escolha sua primeira carteira",onboardingScreen_ctaUrl:"https://ethereum.org/pt-br/wallets/find-wallet/",aboutScreen_heading:"Sobre as carteiras",aboutScreen_a_h1:"Para seus ativos digitais",aboutScreen_a_p:"As carteiras permitem que você envie, receba, armazene e interaja com ativos digitais como NFTs e outros tokens Ethereum.",aboutScreen_b_h1:"Uma maneira melhor de fazer login",aboutScreen_b_p:"Com aplicativos modernos, sua carteira pode ser usada como uma maneira fácil de fazer login, em vez de ter que lembrar uma senha.",aboutScreen_c_h1:"Explore o mundo da Web3",aboutScreen_c_p:"Sua carteira é uma utilidade essencial que permite explorar e participar do mundo em rápida evolução da Web3.",aboutScreen_ctaText:"Saiba mais",aboutScreen_ctaUrl:"https://ethereum.org/pt-br/wallets/",connectorsScreen_heading:"Conectar carteira",connectorsScreen_newcomer:"Eu não tenho uma carteira",connectorsScreen_h1:"O que é uma carteira?",connectorsScreen_p:"As carteiras são usadas para enviar, receber e armazenar ativos digitais. A conexão de uma carteira permite que você interaja com aplicativos.",mobileConnectorsScreen_heading:"Escolha uma carteira",scanScreen_heading:"Escanear com o celular",scanScreen_heading_withConnector:"Escanear com o {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:`Abra uma carteira compatível 
com o WalletConnect [WALLETCONNECTLOGO] para escanear`,scanScreen_tooltip_default:`Abra o {{ CONNECTORNAME }} no 
seu celular para escanear`,downloadAppScreen_heading:"Obter {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Escaneie com a câmera do seu celular para baixar no iOS ou Android.",downloadAppScreen_ios:"Escaneie com a câmera do seu celular para baixar no iOS.",downloadAppScreen_android:"Escaneie com a câmera do seu celular para baixar no Android.",injectionScreen_unavailable_h1:"Navegador não compatível",injectionScreen_unavailable_p:`Para conectar sua carteira {{ CONNECTORSHORTNAME }},
instale a extensão no {{ SUGGESTEDEXTENSIONBROWSER }}.`,injectionScreen_install_h1:"Instalar {{ CONNECTORNAME }}",injectionScreen_install_p:`Para conectar sua carteira {{ CONNECTORSHORTNAME }},
instale a extensão do navegador`,injectionScreen_connecting_h1:"Solicitando conexão",injectionScreen_connecting_p:`Abra a extensão do navegador do {{ CONNECTORSHORTNAME }} 
para conectar a sua carteira.`,injectionScreen_connecting_injected_h1:"Solicitando conexão",injectionScreen_connecting_injected_p:"Aceite a solicitação por meio de sua carteira para se conectar a este aplicativo.",injectionScreen_connected_h1:"Já conectado",injectionScreen_connected_p:"Agora você já pode fechar esta janela",injectionScreen_rejected_h1:"Solicitação cancelada",injectionScreen_rejected_p:`Você cancelou a solicitação.
Clique acima para tentar novamente.`,injectionScreen_failed_h1:"A conexão falhou",injectionScreen_failed_p:`Desculpe, ocorreu um erro.
Por favor, tente conectar novamente.`,injectionScreen_notconnected_h1:"Faça login no {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Para continuar, faça login na sua extensão do {{ CONNECTORNAME }}.",profileScreen_heading:"Conectado",switchNetworkScreen_heading:"Alternar rede",signInWithEthereumScreen_tooltip:`Você não está conectado a este aplicativo.
**Entre com Ethereum** para continuar.`,signInWithEthereumScreen_signedOut_heading:"Entrar com Ethereum",signInWithEthereumScreen_signedOut_h1:`Este aplicativo gostaria de verificar você 
 como o proprietário desta carteira.`,signInWithEthereumScreen_signedOut_p:`Por favor, assine o pedido de mensagem 
 em sua carteira para continuar.`,signInWithEthereumScreen_signedOut_button:"Entrar",signInWithEthereumScreen_signedIn_heading:"Conectado com Ethereum",signInWithEthereumScreen_signedIn_h1:`Você se verificou com sucesso 
 como o proprietário desta carteira`,signInWithEthereumScreen_signedIn_p:`Se sair, será necessário que você 
 autentique novamente no futuro.`,signInWithEthereumScreen_signedIn_button:"Sair"},J3={...lt,connectWallet:"Подключить кошелек",disconnect:"Отключить",connected:"Подключена",wrongNetwork:"Неверная сеть",switchNetworks:"Переключение сети",chainNetwork:"Сеть {{ CHAIN }}",copyToClipboard:"Скопировать в буфер обмена",copyCode:"Скопировать код",moreInformation:"Больше информации",back:"Назад",close:"Закрыть",or:"или",more:"Еще",tryAgain:"Попробовать снова",tryAgainQuestion:"Попробовать снова?",dontHaveTheApp:"У вас нет приложения?",scanTheQRCode:"Отсканируйте QR-код",useWalletConnectModal:"Использовать окно WalletConnect",useModal:"Использовать модальное окно",installTheExtension:"Установить расширение",getWalletName:"Скачать {{ CONNECTORNAME }}",otherWallets:"Другие кошельки",learnMore:"Узнать больше",getWallet:"Завести кошелек",approveInWallet:"Подтвердите",confirmInWallet:"Подтвердите",awaitingConfirmation:"Ожидаем подтверждение",signIn:"Войти",signOut:"Выйти",signedIn:"Вошли",signedOut:"Вышли",walletNotConnected:"Кошелек не подключен",warnings_walletSwitchingUnsupported:"Ваш кошелек не поддерживает переключение сетей из этого приложения.",warnings_walletSwitchingUnsupportedResolve:"Попробуйте переключиться на другую сеть прямо в вашем кошельке.",warnings_chainUnsupported:"Это приложение не поддерживает текущую подключенную сеть.",warnings_chainUnsupportedResolve:"Для продолжения переключите сеть или отключите кошелек.",onboardingScreen_heading:"Завести кошелек",onboardingScreen_h1:"Начните исследовать веб3",onboardingScreen_p:"Ваш кошелек — это врата в мир Ethereum, волшебной технологии, которая позволяет исследовать веб3.",onboardingScreen_ctaText:"Выбрать свой первый кошелек",onboardingScreen_ctaUrl:"https://ethereum.org/en/wallets/find-wallet/",aboutScreen_heading:"О кошельках",aboutScreen_a_h1:"Для ваших цифровых активов",aboutScreen_a_p:"Кошельки позволяют вам отправлять, получать, хранить и взаимодействовать с цифровыми активами, такими как NFT и другие токены Ethereum.",aboutScreen_b_h1:"Лучший способ входа",aboutScreen_b_p:"В современных приложениях ваш кошелек можно использовать как удобный способ входа без необходимости помнить пароль.",aboutScreen_c_h1:"Исследуйте мир веб3",aboutScreen_c_p:"Ваш кошелек - это неотъемлемый инструмент, который позволяет вам исследовать и участвовать в быстро развивающемся мире веб3.",aboutScreen_ctaText:"Узнать больше",aboutScreen_ctaUrl:"https://ethereum.org/en/wallets/",connectorsScreen_heading:"Подключение кошелька",connectorsScreen_newcomer:"У меня нет кошелька",connectorsScreen_h1:"Что такое кошелек?",connectorsScreen_p:"Кошельки используются для отправки, получения и хранения цифровых активов. Подключение кошелька позволяет вам взаимодействовать с приложениями.",mobileConnectorsScreen_heading:"Выберите кошелек",scanScreen_heading:"Сканирование с телефона",scanScreen_heading_withConnector:"Сканирование с помощью {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"Откройте [WALLETCONNECTLOGO] поддерживаемый WalletConnect кошелек для сканирования",scanScreen_tooltip_default:"Откройте {{ CONNECTORNAME }} на вашем мобильном телефоне для сканирования",downloadAppScreen_heading:"Скачивание {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Отсканируйте камерой телефона для загрузки приложения на iOS или Android.",downloadAppScreen_ios:"Отсканируйте камерой телефона для загрузки приложения на iOS.",downloadAppScreen_android:"Сканируйте камерой телефона для загрузки приложения на Android.",injectionScreen_unavailable_h1:"Неподдерживаемый браузер",injectionScreen_unavailable_p:"Для подключения вашего кошелька {{ CONNECTORSHORTNAME }}, установите расширение для браузера {{ SUGGESTEDEXTENSIONBROWSER }}.",injectionScreen_install_h1:"Установите {{ CONNECTORNAME }}",injectionScreen_install_p:"Для подключения вашего кошелька {{ CONNECTORSHORTNAME }}, установите расширение для браузера.",injectionScreen_connecting_h1:"Запрос на подключение",injectionScreen_connecting_p:"Откройте расширение для браузера {{ CONNECTORSHORTNAME }} для подключения вашего кошелька.",injectionScreen_connecting_injected_h1:"Запрос на подключение",injectionScreen_connecting_injected_p:"Примите запрос в вашем кошельке, чтобы подключиться к приложению.",injectionScreen_connected_h1:"Уже подключен",injectionScreen_connected_p:"Можно закрыть это окно",injectionScreen_rejected_h1:"Запрос отменен",injectionScreen_rejected_p:`Вы отменили запрос.
Нажмите выше, чтобы попробовать снова.`,injectionScreen_failed_h1:"Сбой подключения",injectionScreen_failed_p:`Извините, что-то пошло не так.
Пожалуйста, попробуйте подключиться снова.`,injectionScreen_notconnected_h1:"Войдите в {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Для продолжения войдите в расширение {{ CONNECTORNAME }}.",profileScreen_heading:"Кошелек подключен",switchNetworkScreen_heading:"Переключение сетей",signInWithEthereumScreen_tooltip:`Вы не вошли в это приложение.
**Войдите с помощью Ethereum**, чтобы продолжить.`,signInWithEthereumScreen_signedOut_heading:"Войти с помощью Ethereum",signInWithEthereumScreen_signedOut_h1:`Это приложение хочет подтвердить вас 
 в качестве владельца этого кошелька.`,signInWithEthereumScreen_signedOut_p:`Пожалуйста, подпишите запрос на сообщение 
 в своем кошельке, чтобы продолжить.`,signInWithEthereumScreen_signedOut_button:"Войти",signInWithEthereumScreen_signedIn_heading:"Вошли с помощью Ethereum",signInWithEthereumScreen_signedIn_h1:`Вы успешно подтвердили себя 
 в качестве владельца этого кошелька.`,signInWithEthereumScreen_signedIn_p:`Выйти потребуется 
 повторная аутентификация в будущем.`,signInWithEthereumScreen_signedIn_button:"Выйти"},eg={...lt,connectWallet:"Cüzdan Bağla",disconnect:"Bağlantıyı Kes",connected:"Bağlandı",wrongNetwork:"Yanlış Ağ",switchNetworks:"Ağ Değiştir",chainNetwork:"{{ CHAIN }} Ağı",copyToClipboard:"Panoya Kopyala",copyCode:"Kodu Kopyala",moreInformation:"Daha Fazla Bilgi",back:"Geri",close:"Kapat",or:"veya",more:"Daha Fazla",tryAgain:"Tekrar Dene",tryAgainQuestion:"Tekrar Dene?",dontHaveTheApp:"Uygulaman yok mu?",scanTheQRCode:"Karekodu tarat",useWalletConnectModal:"WalletConnect Modalini Kullan ",useModal:"Modal Kullan",installTheExtension:"Eklentiyi İndir",getWalletName:"{{ CONNECTORNAME }} Alın",otherWallets:"Diğer Cüzdanlar",learnMore:"Daha Fazlasını Öğren",getWallet:"Cüzdan Al",approveInWallet:"Cüzdanda Yetki Ver",confirmInWallet:"Cüzdanda Onayla",awaitingConfirmation:"Doğrulama Bekleniyor",signIn:"Giriş Yap",signOut:"Çıkış Yap",signedIn:"Giriş Yapıldı",signedOut:"Çıkış Yapıldı",walletNotConnected:"Cüzdan Bağlı Değil",warnings_walletSwitchingUnsupported:"Bu uygulamada ağ değiştirmeyi cüzdanın desteklemiyor.",warnings_walletSwitchingUnsupportedResolve:"Bunun yerine cüzdanınızdan ağları değiştirmeyi deneyin.",warnings_chainUnsupported:"Bu uygulama kullanmış olduğunuz ağı desteklemiyor.",warnings_chainUnsupportedResolve:"Devam etmek için ağ değiştir veya bağlantıyı kes.",onboardingScreen_heading:"Cüzdan Al",onboardingScreen_h1:"Web3'ü keşfetmeye başla",onboardingScreen_p:"Cüzdanınız, Web3'ü keşfetmeyi mümkün kılan sihirli teknoloji olan Ethereum'a açılan kapıdır.",onboardingScreen_ctaText:"İlk Cüzdanını Seç",onboardingScreen_ctaUrl:"https://ethereum.org/tr/wallets/find-wallet/",aboutScreen_heading:"Cüzdanlar Hakkında",aboutScreen_a_h1:"Dijital varlıkların için",aboutScreen_a_p:"Cüzdanlar, NFT'ler ve diğer Ethereum varlıkları gibi dijital varlıklar göndermenize, almanıza, saklamanıza ve bunlarla etkileşim kurmanıza olanak tanır.",aboutScreen_b_h1:"Giriş yapmanın daha iyi bir yolu",aboutScreen_b_p:"Modern uygulamalar ile parola hatırlamak yerine cüzdanınız ile kolayca giriş yapabilirsiniz.",aboutScreen_c_h1:"Web3 dünyasını keşfet",aboutScreen_c_p:"Cüzdanınız, hızla gelişen Web3 dünyasını keşfetmenizi ve bu dünyaya katılmanızı sağlayan temel bir yardımcı programdır.",aboutScreen_ctaText:"Daha Fazlasını Öğren",aboutScreen_ctaUrl:"https://ethereum.org/tr/wallets/",connectorsScreen_heading:"Cüzdan Bağla",connectorsScreen_newcomer:"Cüzdanım Yok",connectorsScreen_h1:"Cüzdan nedir?",connectorsScreen_p:"Cüzdanlar, dijital varlıkları göndermek, almak ve depolamak için kullanılır. Bir cüzdanı bağlamak, uygulamalarla etkileşime geçmenizi sağlar.",mobileConnectorsScreen_heading:"Cüzdan Seç",scanScreen_heading:"Telefon ile Tarat",scanScreen_heading_withConnector:"{{ CONNECTORNAME }} ile tarat",scanScreen_tooltip_walletConnect:`Desteklenen bir cüzdan taramak için
 [WALLETCONNECTLOGO] WalletConnect uygulamasını aç`,scanScreen_tooltip_default:`Taramak için telefonunda
 {{ CONNECTORNAME }} uygulamasını aç`,downloadAppScreen_heading:"{{ CONNECTORNAME }} İndir",downloadAppScreen_iosAndroid:"iOS ve Android'e indirmek için telefon kameran ile tarat.",downloadAppScreen_ios:"iOS'a indirmek için telefon kameran ile tarat.",downloadAppScreen_android:"Android'e indirmek için telefon kameran ile tarat.",injectionScreen_unavailable_h1:"Desteklenmeyen Tarayıcı",injectionScreen_unavailable_p:`{{ CONNECTORSHORTNAME }} cüzdanına bağlanmak için
{{ SUGGESTEDEXTENSIONBROWSER }} üzerinde indirmen gerekiyor.`,injectionScreen_install_h1:"{{ CONNECTORNAME }} İndir",injectionScreen_install_p:`{{ CONNECTORSHORTNAME }} cüzdanına bağlanmak için,
tarayıcı eklentisini indir.`,injectionScreen_connecting_h1:"Bağlantı İsteniyor.",injectionScreen_connecting_p:`Cüzdanını bağlamak için
 tarayıcıdan {{ CONNECTORSHORTNAME }} uzantısını açın.`,injectionScreen_connecting_injected_h1:"Bağlantı İsteniyor.",injectionScreen_connecting_injected_p:"Bu uygulamaya bağlanmak için cüzdanına gelen isteği kabul et.",injectionScreen_connected_h1:"Zaten Bağlanmış",injectionScreen_connected_p:"Bu açılır pencereyi artık kapatabilirsin",injectionScreen_rejected_h1:"İstek iptal edildi.",injectionScreen_rejected_p:`İsteği iptal ettin.
Tekrar denemek için yukarıyı tıklayın.`,injectionScreen_failed_h1:"Bağlantı Başarısız",injectionScreen_failed_p:`Üzgünüz, bir şeyler ters gitti.
Lütfen daha sonra tekrar deneyin.`,injectionScreen_notconnected_h1:"{{ CONNECTORNAME }} ile giriş yap",injectionScreen_notconnected_p:"Devam etmek için, {{ CONNECTORNAME }} eklentisine giriş yapın.",profileScreen_heading:"Bağlandı",switchNetworkScreen_heading:"Ağ Değiştir",signInWithEthereumScreen_tooltip:`Bu uygulamada oturum açmadınız.
 Devam etmek için **Ethereum İle Giriş Yap**.`,signInWithEthereumScreen_signedOut_heading:"Ethereum İle Giriş Yap",signInWithEthereumScreen_signedOut_h1:`Bu uygulama seni 
 bu cüzdanın sahibi olarak doğrulamak istiyor.`,signInWithEthereumScreen_signedOut_p:`Devam etmek için 
 cüzdanınızdaki isteği onaylayın.`,signInWithEthereumScreen_signedOut_button:"Giriş Yap",signInWithEthereumScreen_signedIn_heading:"Ethereum İle Giriş Yapıldı",signInWithEthereumScreen_signedIn_h1:`Bu cüzdanın sahibi olduğunu 
 başarıyla onayladın.`,signInWithEthereumScreen_signedIn_p:`Çıkış yaparsan ileride 
 tekrar giriş yapman gerekecek. `,signInWithEthereumScreen_signedIn_button:"Çıkış Yap"},tg={...lt,connectWallet:"Kết nối ví",disconnect:"Ngắt kết nối",connected:"Đã kết nối",wrongNetwork:"Mạng không hỗ trợ",switchNetworks:"Đổi mạng",chainNetwork:"Mạng {{ CHAIN }}",copyToClipboard:"Sao chép",copyCode:"Sao chép mã",moreInformation:"Thêm thông tin",back:"Quay lại",close:"Đóng",or:"hoặc",more:"Thêm",tryAgain:"Thử lại",tryAgainQuestion:"Thử lại?",dontHaveTheApp:"Không có app?",scanTheQRCode:"Quét mã QR",useWalletConnectModal:"Dùng WalletConnect Modal",useModal:"Dùng Modal",installTheExtension:"Cài tiện ích",getWalletName:"Lấy {{ CONNECTORNAME }}",otherWallets:"Các ví khác",learnMore:"Xem thêm",getWallet:"Tạo một ví",approveInWallet:"Cấp quyền trong ví",confirmInWallet:"Xác nhận trong ví",awaitingConfirmation:"Đang chờ xác nhận",signIn:"Đăng nhập",signOut:"Đăng xuất",signedIn:"Đã đăng nhập",signedOut:"Đã đăng xuất",walletNotConnected:"Chưa kết nối ví",warnings_walletSwitchingUnsupported:"Ví của bạn không hỗ trợ đổi mạng từ ứng dụng.",warnings_walletSwitchingUnsupportedResolve:"Hãy thử đổi mạng từ phía ví của bạn.",warnings_chainUnsupported:"Ứng dụng này không hỗ trợ mạng hiện tại.",warnings_chainUnsupportedResolve:"Đổi hoặc ngắt kết nối để tiếp tục.",onboardingScreen_heading:"Tạo một ví",onboardingScreen_h1:"Bắt đầu khám khá Web3",onboardingScreen_p:"Ví của bạn là cổng giao tiếp mọi thứ trên Ethereum, công nghệ tuyệt vời giúp khám phá Web3.",onboardingScreen_ctaText:"Chọn ví đầu tiên của bạn",onboardingScreen_ctaUrl:"https://ethereum.org/en/wallets/find-wallet/",aboutScreen_heading:"Giới thiệu các ví",aboutScreen_a_h1:"Cho tài sản số của bạn",aboutScreen_a_p:"Các ví để bạn gửi, nhận, lưu trữ, và tương tác với các tài sản điện tử như NFTs và các loại tiền Ethereum khác.",aboutScreen_b_h1:"Một cách tốt hơn để đăng nhập",aboutScreen_b_p:"Với các ứng dụng hiện đại, ví của bạn có thể dùng để đăng nhập dễ dàng thay vì phải nhớ tài khoản và mật khẩu.",aboutScreen_c_h1:"Khám phá thế giới Web3",aboutScreen_c_p:"Ví của bạn là một tiện ích thiết yếu cho phép bạn khám phá và tham gia vào thế giới web3 đang phát triển nhanh chóng.",aboutScreen_ctaText:"Tìm hiểu thêm",aboutScreen_ctaUrl:"https://ethereum.org/en/wallets/",connectorsScreen_heading:"Kết nối Ví",connectorsScreen_newcomer:"Tôi chưa có ví",connectorsScreen_h1:"Ví là gì?",connectorsScreen_p:"Ví dùng để gửi, nhận, và lưu trữ các tài sản điện tử. Kết nối với một ví giúp bạn tương tác với các ứng dụng.",mobileConnectorsScreen_heading:"Chọn ví",scanScreen_heading:"Scan bằng điện thoại",scanScreen_heading_withConnector:"Quét với {{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:`Mở một [WALLETCONNECTLOGO] mà WalletConnect 
 hỗ trợ để quét`,scanScreen_tooltip_default:`Mở {{ CONNECTORNAME }} trong 
điện thoại của bạn để quét`,downloadAppScreen_heading:"Lấy {{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"Quét bằng camera trên điện thoại của bạn để tải về cho iOS hoặc Android.",downloadAppScreen_ios:"Quét bằng camera trên điện thoại ủa bạn để tải về cho iOS.",downloadAppScreen_android:"Quét bằng camera trên điện thoại ủa bạn để tải về cho Android.",injectionScreen_unavailable_h1:"Trình duyệt không được hỗ trợ",injectionScreen_unavailable_p:`Để kết nối ví {{ CONNECTORSHORTNAME }} của bạn,
cài đặt tiện ích trên {{ SUGGESTEDEXTENSIONBROWSER }}.`,injectionScreen_install_h1:"Cài {{ CONNECTORNAME }}",injectionScreen_install_p:`Để kết nối ví {{ CONNECTORSHORTNAME }},
cài đặt tiện ích trên trình duyệt.`,injectionScreen_connecting_h1:"Đang yêu cầu kết nối",injectionScreen_connecting_p:`Mở tiện ích {{ CONNECTORSHORTNAME }} 
 trên trình duyệt để kết nối.`,injectionScreen_connecting_injected_h1:"Đang yêu cầu kết nối",injectionScreen_connecting_injected_p:"Đồng ý yêu cầu từ phía ví của bạn để kết nối ứng dụng này.",injectionScreen_connected_h1:"Đã kết nối",injectionScreen_connected_p:"Đã có thể đóng popup",injectionScreen_rejected_h1:"Đã hủy yêu cầu",injectionScreen_rejected_p:`Bạn vừa hủy yêu cầu.
Nhấn phía trên để thử lại.`,injectionScreen_failed_h1:"Kết nối không thành công",injectionScreen_failed_p:`Xin lỗi, có gì đó không đúng.
Vui lòng thử lại.`,injectionScreen_notconnected_h1:"Đăng nhập vào {{ CONNECTORNAME }}",injectionScreen_notconnected_p:"Để tiếp tục, vui lòng đăng nhập bằng tiện ích {{ CONNECTORNAME }}.",profileScreen_heading:"Đã kết nối",switchNetworkScreen_heading:"Đổi mạng",signInWithEthereumScreen_tooltip:`Bạn chưa đăng nhập vào ứng dụng.
**Đăng nhập qua Ethereum** để tiếp tục.`,signInWithEthereumScreen_signedOut_heading:"Đăng nhập qua Ethereum",signInWithEthereumScreen_signedOut_h1:`Ứng dụng này muốn xác nhận bạn 
 là chủ sở hữu của ví.`,signInWithEthereumScreen_signedOut_p:`Vui lòng ký tin nhắn yêu cầu 
 trên ví của bạn để tiếp tục.`,signInWithEthereumScreen_signedOut_button:"Đăng nhập",signInWithEthereumScreen_signedIn_heading:"Đăng nhập qua Ethereum",signInWithEthereumScreen_signedIn_h1:"Bạn đã xác nhận thành công.",signInWithEthereumScreen_signedIn_p:`Sau khi Đăng xuất bạn sẽ cần 
 xác nhận lại trong làn tiếp theo.`,signInWithEthereumScreen_signedIn_button:"Đăng xuất"},ng={...lt,connectWallet:"绑定钱包",disconnect:"解除绑定",connected:"已绑定",wrongNetwork:"错误网络",switchNetworks:"切换网络",chainNetwork:"{{ CHAIN }}网络",copyToClipboard:"复制到剪贴板",copyCode:"复制代码",moreInformation:"更多信息",back:"返回",close:"关闭",or:"或",more:"更多",tryAgain:"重试",tryAgainQuestion:"重试？",dontHaveTheApp:"没有该应用？",scanTheQRCode:"扫描二维码",useWalletConnectModal:"使用 WalletConnect 模态窗",useModal:"使用模态窗",installTheExtension:"安装扩展程序",getWalletName:"获取{{ CONNECTORNAME }}",otherWallets:"其他钱包",learnMore:"了解更多",getWallet:"获取钱包",approveInWallet:"在钱包中批准",confirmInWallet:"在钱包中确认",awaitingConfirmation:"等待确认",signIn:"登录",signOut:"登出",signedIn:"已登录",signedOut:"已登出",walletNotConnected:"钱包未绑定",warnings_walletSwitchingUnsupported:"您的钱包不支持从此应用切换网络。",warnings_walletSwitchingUnsupportedResolve:"请尝试从钱包中切换网络。",warnings_chainUnsupported:"此应用不支持当前连接的网络。",warnings_chainUnsupportedResolve:"请切换网络或断开连接以继续。",onboardingScreen_heading:"获取钱包",onboardingScreen_h1:"开始探索 Web3",onboardingScreen_p:"您的钱包是通往以太坊的一扇大门，而以太坊是探索 Web3 的一项神奇技术。",onboardingScreen_ctaText:"选择您的第一钱包",onboardingScreen_ctaUrl:"https://ethereum.org/zh/wallets/find-wallet/",aboutScreen_heading:"关于钱包",aboutScreen_a_h1:"对于您的数字资产",aboutScreen_a_p:"有了钱包，您可以发送、接收、存储数字资产及使用数字资产进行交互，例如 NFT 和其他以太坊通证等。",aboutScreen_b_h1:"更好的登录方式",aboutScreen_b_p:"使用现代应用，您的钱包可以用作简便的登录方法，而不必记住密码。",aboutScreen_c_h1:"探索 Web3 世界",aboutScreen_c_p:"您的钱包是一个重要的工具，可以让您探索并参与到快速发展的 Web3 世界。",aboutScreen_ctaText:"了解更多",aboutScreen_ctaUrl:"https://ethereum.org/zh/wallets/",connectorsScreen_heading:"绑定钱包",connectorsScreen_newcomer:"我没有钱包",connectorsScreen_h1:"什么是钱包？",connectorsScreen_p:"钱包可用于发送、接收和存储数字资产。通过绑定钱包，您可以与应用进行交互。",mobileConnectorsScreen_heading:"选择钱包",scanScreen_heading:"手机扫描",scanScreen_heading_withConnector:"手机扫描{{ CONNECTORNAME }}",scanScreen_tooltip_walletConnect:"打开 [WALLETCONNECTLOGO] WalletConnect 支持的钱包进行扫描",scanScreen_tooltip_default:"打开您手机上的{{ CONNECTORNAME }} 进行扫描",downloadAppScreen_heading:"获取{{ CONNECTORNAME }}",downloadAppScreen_iosAndroid:"使用手机相机扫描以下载 iOS 或 Android 应用。",downloadAppScreen_ios:"使用手机相机扫描以下载 iOS 应用。",downloadAppScreen_android:"使用手机相机扫描以下载 Android 应用。",injectionScreen_unavailable_h1:"不支持的浏览器",injectionScreen_unavailable_p:"要绑定您的{{ CONNECTORSHORTNAME }}钱包，请在{{ SUGGESTEDEXTENSIONBROWSER }}上安装此扩展程序。",injectionScreen_install_h1:"安装{{ CONNECTORNAME }}",injectionScreen_install_p:"要绑定您的{{ CONNECTORSHORTNAME }}钱包，请安装此浏览器扩展程序。",injectionScreen_connecting_h1:"请求绑定",injectionScreen_connecting_p:"打开{{ CONNECTORSHORTNAME }}浏览器 扩展程序以绑定您的钱包。",injectionScreen_connecting_injected_h1:"请求绑定",injectionScreen_connecting_injected_p:"通过您的钱包接受请求，以绑定到此应用。",injectionScreen_connected_h1:"已绑定",injectionScreen_connected_p:"现在可以关闭此弹窗",injectionScreen_rejected_h1:"请求已取消",injectionScreen_rejected_p:"您已取消请求。点击上面可重试。",injectionScreen_failed_h1:"绑定失败",injectionScreen_failed_p:"抱歉，发生错误。请尝试重新绑定。",injectionScreen_notconnected_h1:"登录{{ CONNECTORNAME }}",injectionScreen_notconnected_p:"要继续，请登录到您的{{ CONNECTORNAME }}扩展程序。",profileScreen_heading:"已绑定",switchNetworkScreen_heading:"切换网络",signInWithEthereumScreen_tooltip:`您尚未登录到此应用。
请选择**使用以太坊登录**以继续。`,signInWithEthereumScreen_signedOut_heading:"使用以太坊登录",signInWithEthereumScreen_signedOut_h1:"此应用希望验证您是 此钱包的所有者。",signInWithEthereumScreen_signedOut_p:"请签署钱包中的消息请求 以继续。",signInWithEthereumScreen_signedOut_button:"登录",signInWithEthereumScreen_signedIn_heading:"已使用以太坊登录",signInWithEthereumScreen_signedIn_h1:"您已成功验证自己 是此钱包的所有者。",signInWithEthereumScreen_signedIn_p:"登出后，将来您还需要 再次进行身份验证。",signInWithEthereumScreen_signedIn_button:"登出"},rg=e=>{switch(e){case"ee-EE":return q3;case"ar-AE":return H3;case"es-ES":return Z3;case"fa-IR":return K3;case"fr-FR":return Y3;case"ja-JP":return X3;case"pt-BR":return Q3;case"ru-RU":return J3;case"zh-CN":return ng;case"ca-AD":return G3;case"tr-TR":return eg;case"vi-VN":return tg;default:return lt}};function bt(e){var t;const o=(t=U().uiConfig.language)!==null&&t!==void 0?t:"en-US",i=v.useMemo(()=>rg(o),[o]);if(!i)throw Z.error(`Missing translations for: ${o}`),new Error(`Missing translations for: ${o}`);const a={};return Object.keys(i).forEach(c=>{const s=i[c];a[c]=og(s,e)}),a}const og=(e,t)=>{let r=e;return t&&Object.keys(t).forEach(o=>{r=r.replace(new RegExp(`({{ ${o} }})`,"g"),t[o])}),ig(r)},ig=e=>{const t=e.split(`
`);return t.map((r,o)=>n.jsxs(fe.Fragment,{children:[ag(r),o<t.length-1&&n.jsx("br",{})]},`line-${o}-${r.substring(0,20)}`))},ag=e=>e.split(/(\*\*[^*]*\*\*)/g).map((o,i)=>/(\*\*.*\*\*)/g.test(o)?n.jsx("strong",{children:o.replace(/\*\*/g,"")},`bold-${i}-${o.substring(0,10)}`):`${o}`).map(o=>typeof o=="string"?o.split(/(\[WALLETCONNECTLOGO\])/g).map(i=>i==="[WALLETCONNECTLOGO]"?n.jsx("span",{className:"ck-tt-logo",children:n.jsx(Ye.WalletConnect,{})},i):i):o);function hn({queryFn:e,queryKey:t,enabled:r=!0,refetchInterval:o,staleTime:i=0}){const[a,c]=v.useState(void 0),[s,l]=v.useState(null),[d,u]=v.useState(!1),p=v.useRef(0),h=v.useRef(null),f=v.useRef(e);f.current=e;const g=JSON.stringify(t),m=v.useCallback(async()=>{if(r){u(!0),l(null);try{const b=await f.current();return c(b),p.current=Date.now(),b}catch(b){const y=b instanceof Error?b:new Error(String(b));throw l(y),y}finally{u(!1)}}},[r]);return v.useEffect(()=>{r&&m().catch(()=>{})},[r,g]),v.useEffect(()=>{if(!(!r||!o||o<=0))return h.current=setInterval(()=>{const b=Date.now()-p.current;i>0&&b<i||m().catch(()=>{})},o),()=>{h.current&&(clearInterval(h.current),h.current=null)}},[r,o,i,m]),{data:a,error:s,isLoading:d,isPending:d,refetch:m}}async function sg(e,t){const r=xr({chain:Wi,transport:vr(t)}),o=await r.getEnsName({address:e}),i=o?await r.getEnsAvatar({name:f1(o)}):null;return{name:o,avatar:i}}function Vn(e){var t,r,o,i,a;const{address:c,chainType:s=ne.EVM,ensChainId:l=0,enabled:d=!0}=e,{walletConfig:u}=U(),p=l===1?(o=(r=(t=u?.ethereum)===null||t===void 0?void 0:t.rpcUrls)===null||r===void 0?void 0:r[l])!==null&&o!==void 0?o:gr(l):void 0,h=d&&!!c&&c.length>0&&l===1&&!!p,{data:f,error:g,isLoading:m}=hn({queryKey:["identity",s,c,l],queryFn:()=>sg(c,p),enabled:h,staleTime:300*1e3});return h?m?{status:"loading"}:g?{status:"error",error:g}:{status:"success",name:(i=f?.name)!==null&&i!==void 0?i:null,avatar:(a=f?.avatar)!==null&&a!==void 0?a:null}:{status:"idle"}}const cl=BigInt(1e9);function qu(e,t=4){const r=e/cl,i=(e%cl).toString().padStart(9,"0");return`${r}.${i}`.replace(new RegExp(`(\\d*\\.\\d{${t}})\\d*`),"$1")}const To="openfort:balance-invalidate";async function cg(e,t,r){const i=await xr({transport:vr(t)}).getBalance({address:e}),{symbol:a,decimals:c}=m1(r);return{value:i,formatted:x1(i),symbol:a,decimals:c}}async function Zu(e,t,r){const{address:o,createSolanaRpc:i}=await Na(async()=>{const{address:s,createSolanaRpc:l}=await import("./index.browser-PNUJC51R.js");return{address:s,createSolanaRpc:l}},[]),a=i(t),{value:c}=await a.getBalance(o(e),{commitment:r}).send();return{value:BigInt(c),formatted:qu(BigInt(c),9),symbol:"SOL",decimals:9}}function lg(e){var t,r,o,i,a,c,s,l,d,u;const{address:p,chainType:h,chainId:f=g1,cluster:g="devnet",commitment:m="confirmed",enabled:b=!0,refetchInterval:y=3e4}=e,{walletConfig:w}=U(),C=h===ne.EVM?(o=(r=(t=w?.ethereum)===null||t===void 0?void 0:t.rpcUrls)===null||r===void 0?void 0:r[f])!==null&&o!==void 0?o:gr(f):(c=(a=(i=w?.solana)===null||i===void 0?void 0:i.rpcUrls)===null||a===void 0?void 0:a[g])!==null&&c!==void 0?c:v1(g),k=b&&!!p&&p.length>0,{data:x,error:S,isLoading:O,refetch:j}=hn({queryKey:["balance",h,p,f,g],queryFn:()=>h===ne.EVM?cg(p,C,f):Zu(p,C,m),enabled:k,refetchInterval:y,staleTime:3e4});return v.useEffect(()=>{if(!k)return;const A=()=>j().catch(()=>{});return window.addEventListener(To,A),()=>window.removeEventListener(To,A)},[k,j]),k?O?{status:"loading",refetch:j}:S?{status:"error",error:S,refetch:j}:{status:"success",value:(s=x?.value)!==null&&s!==void 0?s:BigInt(0),formatted:(l=x?.formatted)!==null&&l!==void 0?l:"0",symbol:(d=x?.symbol)!==null&&d!==void 0?d:"",decimals:(u=x?.decimals)!==null&&u!==void 0?u:18,refetch:j}:{status:"idle",refetch:j}}function ll(e,t){let r;return(...o)=>{window.clearTimeout(r),r=window.setTimeout(()=>e(...o),t)}}function dg({debounce:e,scroll:t,polyfill:r,offsetSize:o}={debounce:0,scroll:!1,offsetSize:!1}){const i=r||(typeof window>"u"?class{}:window.ResizeObserver);if(!i)throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");const[a,c]=v.useState({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),s=v.useRef({element:null,scrollContainers:null,resizeObserver:null,lastBounds:a,orientationHandler:null}),l=e?typeof e=="number"?e:e.scroll:null,d=e?typeof e=="number"?e:e.resize:null,u=v.useRef(!1);v.useEffect(()=>(u.current=!0,()=>{u.current=!1}));const[p,h,f]=v.useMemo(()=>{const y=()=>{if(!s.current.element)return;const{left:w,top:C,width:k,height:x,bottom:S,right:O,x:j,y:A}=s.current.element.getBoundingClientRect(),_={left:w,top:C,width:k,height:x,bottom:S,right:O,x:j,y:A};s.current.element instanceof HTMLElement&&o&&(_.height=s.current.element.offsetHeight,_.width=s.current.element.offsetWidth),Object.freeze(_),u.current&&!fg(s.current.lastBounds,_)&&c(s.current.lastBounds=_)};return[y,d?ll(y,d):y,l?ll(y,l):y]},[c,o,l,d]);function g(){s.current.scrollContainers&&(s.current.scrollContainers.forEach(y=>y.removeEventListener("scroll",f,!0)),s.current.scrollContainers=null),s.current.resizeObserver&&(s.current.resizeObserver.disconnect(),s.current.resizeObserver=null),s.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",s.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",s.current.orientationHandler))}function m(){s.current.element&&(s.current.resizeObserver=new i(f),s.current.resizeObserver.observe(s.current.element),t&&s.current.scrollContainers&&s.current.scrollContainers.forEach(y=>y.addEventListener("scroll",f,{capture:!0,passive:!0})),s.current.orientationHandler=()=>{f()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",s.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",s.current.orientationHandler))}const b=y=>{!y||y===s.current.element||(g(),s.current.element=y,s.current.scrollContainers=Ku(y),m())};return pg(f,!!t),ug(h),v.useEffect(()=>{g(),m()},[t,f,h]),v.useEffect(()=>g,[]),[b,a,p]}function ug(e){v.useEffect(()=>{const t=e;return window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[e])}function pg(e,t){v.useEffect(()=>{if(t){const r=e;return window.addEventListener("scroll",r,{capture:!0,passive:!0}),()=>{window.removeEventListener("scroll",r,!0)}}},[e,t])}function Ku(e){const t=[];if(!e||e===document.body)return t;const{overflow:r,overflowX:o,overflowY:i}=window.getComputedStyle(e);return[r,o,i].some(a=>a==="auto"||a==="scroll")&&t.push(e),[...t,...Ku(e.parentElement)]}const hg=["x","y","top","bottom","left","right","width","height"],fg=(e,t)=>hg.every(r=>e[r]===t[r]),ur=E(F.div)`
  top: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;E(F.div)`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  svg {
    display: block;
  }
`;E(F.div)`
  pointer-events: none;
  user-select: none;
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;E(F.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  background: var(--ck-body-color-danger, red);
  color: #fff;
  svg {
    display: block;
    position: relative;
    top: -1px;
  }
`;const gg="1.0.15",vg=(e={})=>{const{client:t,updateUser:r}=ve(),[o,i]=v.useState({status:"idle"}),a=v.useCallback(()=>{i({status:"idle"})},[]),{tryUseWallet:c}=Fa(),s=v.useCallback(async d=>{var u,p;try{if(i({status:"loading"}),!d.email||!d.otp){const m=new Ee("Email and OTP are required",Ne.VALIDATION_ERROR);return i({status:"error",error:m}),st({hookOptions:e,options:d,error:m})}if(!Vi(d.email)){const m=new Ee("Invalid email",Ne.VALIDATION_ERROR);return i({status:"error",error:m}),st({hookOptions:e,options:d,error:m})}const h=await t.auth.logInWithEmailOtp({email:d.email,otp:d.otp}),{wallet:f}=await c({logoutOnError:(u=d.logoutOnError)!==null&&u!==void 0?u:e.logoutOnError,recoverWalletAutomatically:(p=d.recoverWalletAutomatically)!==null&&p!==void 0?p:e.recoverWalletAutomatically});i({status:"success"});const g=h.user;return await r(),Tn({data:{user:g,wallet:f},hookOptions:e,options:d})}catch(h){const f=new Ee("Failed to login with email OTP",Ne.AUTHENTICATION_ERROR,{error:h});return i({status:"error",error:f}),st({hookOptions:e,options:d,error:f})}},[t,i,r,e]),l=v.useCallback(async d=>{try{if(i({status:"requesting"}),!d.email){const u=new Ee("Email is required",Ne.VALIDATION_ERROR);return i({status:"error",error:u}),st({hookOptions:e,options:d,error:u})}if(!Vi(d.email)){const u=new Ee("Invalid email",Ne.VALIDATION_ERROR);return i({status:"error",error:u}),st({hookOptions:e,options:d,error:u})}return await t.auth.requestEmailOtp({email:d.email}),i({status:"success"}),Tn({data:{},hookOptions:e,options:d})}catch(u){const p=new Ee("Failed to request email OTP",Ne.AUTHENTICATION_ERROR,{error:u});return i({status:"error",error:p}),st({hookOptions:e,options:d,error:p})}},[t,i,r,e]);return{signInEmailOtp:s,requestEmailOtp:l,reset:a,isRequesting:o.status==="requesting",...Ma(o),isAwaitingInput:o.status==="awaiting-input"}},mg=(e={})=>{const{client:t,updateUser:r,updateEmbeddedAccounts:o}=ve(),[i,a]=v.useState({status:"idle"}),{tryUseWallet:c}=Fa();return{signUpGuest:v.useCallback(async(l={})=>{var d,u,p,h;try{a({status:"loading"});let f;try{Z.log("Guest signup: calling auth.signUpGuest()"),f=(await t.auth.signUpGuest()).user,Z.log("Guest signup: auth OK, user id:",f?.id)}catch(m){if(((d=m?.message)===null||d===void 0?void 0:d.includes("Already logged in"))||m?.name==="SessionError"){if(Z.log("Guest signup: already logged in, using existing session"),f=(u=await t.user.get())!==null&&u!==void 0?u:void 0,!f)throw m}else throw m}await r(f),Z.log("Guest signup: calling tryUseWallet()");const{wallet:g}=await c({logoutOnError:(p=l.logoutOnError)!==null&&p!==void 0?p:e.logoutOnError,recoverWalletAutomatically:(h=l.recoverWalletAutomatically)!==null&&h!==void 0?h:e.recoverWalletAutomatically});return g&&typeof o=="function"&&await o(),a({status:"success"}),Z.log("Guest signup: success",g?"(wallet created)":"(no wallet)"),Tn({hookOptions:e,options:l,data:{user:f,wallet:g}})}catch(f){Z.error("Guest signup failed:",f);const g=new Ee("Failed to signup guest",Ne.AUTHENTICATION_ERROR,{error:f});return a({status:"error",error:g}),st({hookOptions:e,options:l,error:g})}},[t,a,r,o,c,e]),...Ma(i)}},xg=(e={})=>{const{client:t,updateUser:r}=ve(),[o,i]=v.useState({status:"idle"}),a=v.useCallback(()=>{i({status:"idle"})},[]),{tryUseWallet:c}=Fa(),s=v.useCallback(async u=>{var p,h;try{if(i({status:"loading"}),!u.phoneNumber||!u.otp){const b=new Ee("Phone and OTP are required",Ne.VALIDATION_ERROR);return i({status:"error",error:b}),st({hookOptions:e,options:u,error:b})}const f=await t.auth.logInWithPhoneOtp({phoneNumber:u.phoneNumber,otp:u.otp}),{wallet:g}=await c({logoutOnError:(p=u.logoutOnError)!==null&&p!==void 0?p:e.logoutOnError,recoverWalletAutomatically:(h=u.recoverWalletAutomatically)!==null&&h!==void 0?h:e.recoverWalletAutomatically});i({status:"success"});const m=f.user;return await r(),Tn({data:{user:m,wallet:g},hookOptions:e,options:u})}catch(f){const g=new Ee("Failed to login with phone OTP",Ne.AUTHENTICATION_ERROR,{error:f});return i({status:"error",error:g}),st({hookOptions:e,options:u,error:g})}},[t,i,r,e]),l=v.useCallback(async u=>{try{if(i({status:"requesting"}),!u.phoneNumber){const p=new Ee("Phone number is required",Ne.VALIDATION_ERROR);return i({status:"error",error:p}),st({hookOptions:e,options:u,error:p})}return await t.auth.requestPhoneOtp({phoneNumber:u.phoneNumber}),i({status:"idle"}),Tn({data:{},hookOptions:e,options:u})}catch(p){const h=new Ee("Failed to request phone OTP",Ne.AUTHENTICATION_ERROR,{error:p});return i({status:"error",error:h}),st({hookOptions:e,options:u,error:h})}},[t,i,r,e]),d=v.useCallback(async u=>{try{if(i({status:"loading"}),!u.phoneNumber||!u.otp){const f=new Ee("Phone and OTP are required",Ne.VALIDATION_ERROR);return i({status:"error",error:f}),st({hookOptions:e,options:u,error:f})}const p=await t.auth.linkPhoneOtp({phoneNumber:u.phoneNumber,otp:u.otp});i({status:"success"});const h=p.user;return await r(),Tn({data:{user:h},hookOptions:e,options:u})}catch(p){const h=new Ee("Failed to link phone OTP",Ne.AUTHENTICATION_ERROR,{error:p});return i({status:"error",error:h}),st({hookOptions:e,options:u,error:h})}},[t,i,r,e]);return{logInWithPhoneOtp:s,requestPhoneOtp:l,linkPhoneOtp:d,reset:a,isRequesting:o.status==="requesting",...Ma(o),isAwaitingInput:o.status==="awaiting-input"}};async function bg(e,...[t]){const{account:r=e.account,aggregate:o=!0}=t??{},i=await e.request({method:"wallet_getAssets",params:[yg({...t,account:r})]}),a=Cg(i),c=(()=>{if(!o)return;const s={};for(const[l,d]of Object.entries(a)){if(l==="0")continue;const u=new Set;for(const p of d){const h=typeof o=="function"?o(p):p.address??b1,f=s[h]??{};u.has(h)||(u.add(h),s[h]={...p,balance:p.balance+(f?.balance??0n),chainIds:[...f?.chainIds??[],Number(l)]})}}return Object.values(s)})();return c?{0:c,...a}:a}function yg(e={}){const{account:t,assets:r,assetTypes:o,chainIds:i}=e;if(typeof t>"u")throw new y1({docsPath:"/experimental/erc7811/getAssets"});return{account:C1(t).address,assetFilter:r,assetTypeFilter:o,chainFilter:i?.map(c=>Ui(c))}}function Cg(e){return Object.fromEntries(Object.entries(e).map(([t,r])=>[Number(t),r.map(o=>{const i=Rs(o.balance),a=o.metadata,c=o.type==="native"?"native":o.type==="erc20"?"erc20":o.type==="erc721"?"erc721":{custom:o.type},s=c==="native"?void 0:o.address;return{balance:i,type:c,...s?{address:s}:{},...a?{metadata:{...a,..."tokenId"in a?{tokenId:Rs(a.tokenId)}:{}}}:{}}})]))}function wg(){return e=>({getAssets:(...[t])=>bg(e,t)})}const co={all:["openfort"],user:()=>[...co.all,"user"],embeddedAccounts:()=>[...co.all,"embeddedAccounts"],walletAssets:(e,t,r)=>[...co.all,"walletAssets",e,t,r]};class qt extends Ql{constructor(t){const{docsPath:r,field:o,metaMessages:i}=t;super(`Invalid Sign-In with Ethereum message field "${o}".`,{docsPath:r,metaMessages:i,name:"SiweInvalidMessageFieldError"})}}function dl(e){if(/[^a-z0-9:/?#[\]@!$&'()*+,;=.\-_~%]/i.test(e)||/%[^0-9a-f]/i.test(e)||/%[0-9a-f](:?[^0-9a-f]|$)/i.test(e))return!1;const t=kg(e),r=t[1],o=t[2],i=t[3],a=t[4],c=t[5];if(!(r?.length&&i.length>=0))return!1;if(o?.length){if(!(i.length===0||/^\//.test(i)))return!1}else if(/^\/\//.test(i))return!1;if(!/^[a-z][a-z0-9+\-.]*$/.test(r.toLowerCase()))return!1;let s="";return s+=`${r}:`,o?.length&&(s+=`//${o}`),s+=i,a?.length&&(s+=`?${a}`),c?.length&&(s+=`#${c}`),s}function kg(e){return e.match(/(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/)}function Eg(e){const{chainId:t,domain:r,expirationTime:o,issuedAt:i=new Date,nonce:a,notBefore:c,requestId:s,resources:l,scheme:d,uri:u,version:p}=e;{if(t!==Math.floor(t))throw new qt({field:"chainId",metaMessages:["- Chain ID must be a EIP-155 chain ID.","- See https://eips.ethereum.org/EIPS/eip-155","",`Provided value: ${t}`]});if(!(Sg.test(r)||jg.test(r)||_g.test(r)))throw new qt({field:"domain",metaMessages:["- Domain must be an RFC 3986 authority.","- See https://www.rfc-editor.org/rfc/rfc3986","",`Provided value: ${r}`]});if(!Ag.test(a))throw new qt({field:"nonce",metaMessages:["- Nonce must be at least 8 characters.","- Nonce must be alphanumeric.","",`Provided value: ${a}`]});if(!dl(u))throw new qt({field:"uri",metaMessages:["- URI must be a RFC 3986 URI referring to the resource that is the subject of the signing.","- See https://www.rfc-editor.org/rfc/rfc3986","",`Provided value: ${u}`]});if(p!=="1")throw new qt({field:"version",metaMessages:["- Version must be '1'.","",`Provided value: ${p}`]});if(d&&!Tg.test(d))throw new qt({field:"scheme",metaMessages:["- Scheme must be an RFC 3986 URI scheme.","- See https://www.rfc-editor.org/rfc/rfc3986#section-3.1","",`Provided value: ${d}`]});const y=e.statement;if(y?.includes(`
`))throw new qt({field:"statement",metaMessages:["- Statement must not include '\\n'.","",`Provided value: ${y}`]})}const h=w1(e.address),f=d?`${d}://${r}`:r,g=e.statement?`${e.statement}
`:"",m=`${f} wants you to sign in with your Ethereum account:
${h}

${g}`;let b=`URI: ${u}
Version: ${p}
Chain ID: ${t}
Nonce: ${a}
Issued At: ${i.toISOString()}`;if(o&&(b+=`
Expiration Time: ${o.toISOString()}`),c&&(b+=`
Not Before: ${c.toISOString()}`),s&&(b+=`
Request ID: ${s}`),l){let y=`
Resources:`;for(const w of l){if(!dl(w))throw new qt({field:"resources",metaMessages:["- Every resource must be a RFC 3986 URI.","- See https://www.rfc-editor.org/rfc/rfc3986","",`Provided value: ${w}`]});y+=`
- ${w}`}b+=y}return`${m}
${b}`}const Sg=/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?$/,jg=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?$/,_g=/^localhost(:[0-9]{1,5})?$/,Ag=/^[a-zA-Z0-9]{8,}$/,Tg=/^([a-zA-Z][a-zA-Z0-9+-.]*)$/,Og=(e,t,r)=>{if(!(typeof window>"u"))return Eg({domain:window.location.host,address:e,statement:"By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.",uri:window.location.origin,version:"1",chainId:r,nonce:t})};function ps(){const{client:e,user:t,updateUser:r}=ve(),o=ot(),i=v.useRef(o);i.current=o;const a=v.useRef(t);return a.current=t,{connectWithSiwe:v.useCallback(async({onError:s,onConnect:l,address:d,connectorType:u,walletClientType:p,link:h}={})=>{var f,g,m,b,y,w,C,k,x,S,O,j,A;const _=i.current,P=a.current,D=h??!!P,$=d??((f=_?.account)===null||f===void 0?void 0:f.address),q=u??((m=(g=_?.account)===null||g===void 0?void 0:g.connector)===null||m===void 0?void 0:m.type),B=p??((y=(b=_?.account)===null||b===void 0?void 0:b.connector)===null||y===void 0?void 0:y.id),W=(w=_?.chainId)!==null&&w!==void 0?w:0,H=(x=(k=(C=_?.account)===null||C===void 0?void 0:C.chain)===null||k===void 0?void 0:k.id)!==null&&x!==void 0?x:_?.chainId,K=(O=(S=_?.account)===null||S===void 0?void 0:S.chain)===null||O===void 0?void 0:O.name,Y=(j=_?.switchChain)===null||j===void 0?void 0:j.switchChainAsync,ue=_?.signMessage;if(!$||!q||!B){Z.warn("[useConnectWithSiwe] Missing params",{address:$,connectorType:q,walletClientType:B}),s?.("No address found");return}if(!ue){Z.warn("[useConnectWithSiwe] No signMessage on bridge"),s?.("EVM bridge not available (signMessage)");return}try{H!==W&&Y&&await Y({chainId:W});let G;D?G=(await e.auth.initLinkSiwe({address:$})).nonce:G=(await e.auth.initSiwe({address:$})).nonce;const I=Og($,G,W);if(!I)throw new Error("SIWE message creation failed (window not available)");const N=await ue({message:I});D?await e.auth.linkWithSiwe({signature:N,message:I,connectorType:q,walletClientType:B,address:$,chainId:W}):await e.auth.loginWithSiwe({signature:N,message:I,connectorType:q,walletClientType:B,address:$}),await r(),await Promise.resolve(l?.())}catch(G){if(Z.error("[useConnectWithSiwe] SIWE failed",{message:G instanceof Error?G.message:String(G),status:(A=G?.response)===null||A===void 0?void 0:A.status}),!s)return;let I=G instanceof Error?G.message:String(G);I.includes("User rejected the request.")?I="User rejected the request.":I.includes("Invalid signature")?I="Invalid signature. Please try again.":I.includes("An error occurred when attempting to switch chain")?I=`Failed to switch chain. Please switch your wallet to ${K??"the correct network"} and try again.`:I.includes("already linked")?I="This wallet is already linked to another account. Log out and connect with this wallet instead.":I="Failed to connect with SIWE.",s(I,G instanceof k1?G:void 0)}},[e,r])}}function ul(e){var t,r,o;const i=(t=e.metadata)===null||t===void 0?void 0:t.fiat;if(!i?.value||e.balance===void 0)return 0;const a=(o=(r=e.metadata)===null||r===void 0?void 0:r.decimals)!==null&&o!==void 0?o:18,c=Number.parseFloat(vn(e.balance,a));return Number.isFinite(c)?c*i.value:0}const Gt=({assets:e,multiChain:t=!1,staleTime:r=3e4}={})=>{var o,i;const a=He(),c=a.status==="connected",s=c?a.address:void 0,l=c?a.chainId:void 0,{walletConfig:d,publishableKey:u,overrides:p,thirdPartyAuth:h,chains:f}=U(),{getAccessToken:g}=Rr(),m=f.find(_=>_.id===l),b=p?.backendUrl||"https://api.openfort.io",y=v.useCallback(async()=>{if(h){const P=await h.getAccessToken();if(!P)throw new Ee("Failed to get access token from third party auth provider",Ne.AUTHENTICATION_ERROR);return{"Content-Type":"application/json","x-auth-provider":h.provider,"x-player-token":P,"x-token-type":"idToken",Authorization:`Bearer ${u}`}}return{"Content-Type":"application/json","x-project-key":u,Authorization:`Bearer ${await g()}`}},[u,g,h]),w=v.useMemo(()=>{var _;if(!t)return;const P=(_=d?.ethereum)===null||_===void 0?void 0:_.assets;if(!P)return;const D={};for(const[$,q]of Object.entries(P)){const B=Ui(Number($));D[B]=q.map(W=>({address:W,type:"erc20"}))}return Object.keys(D).length>0?D:void 0},[t,(o=d?.ethereum)===null||o===void 0?void 0:o.assets]),C=v.useMemo(()=>()=>E1({async request({method:_,params:P}){const $=await(await fetch(`${b}/rpc`,{method:"POST",headers:await y(),body:JSON.stringify({method:_,params:P[0],id:1,jsonrpc:"2.0"})})).json();if($.error)throw new Error($.error.message);return $.result}}),[y,b]),k=v.useMemo(()=>{var _;if(!l)return[];const P=!((_=d?.ethereum)===null||_===void 0)&&_.assets?d.ethereum.assets[l]||[]:[],D=e?e[l]||[]:[];return[...P,...D]},[(i=d?.ethereum)===null||i===void 0?void 0:i.assets,e,l]),{data:x,error:S,isLoading:O,refetch:j}=hn({queryKey:t?["wallet-assets","multi",s,w]:[...co.walletAssets(l,k,s)],queryFn:async()=>{var _,P,D,$,q,B,W,H,K,Y,ue,G,I,N,R;if(t){if(!s)throw new Ee("No wallet address available",Ne.UNEXPECTED_ERROR);const ye=await y(),xe=fetch(`${b}/rpc`,{method:"POST",headers:ye,body:JSON.stringify({method:"wallet_getAssets",params:{account:s},id:1,jsonrpc:"2.0"})}),qe=w?fetch(`${b}/rpc`,{method:"POST",headers:ye,body:JSON.stringify({method:"wallet_getAssets",params:{account:s,assetFilter:w},id:2,jsonrpc:"2.0"})}):null,ke=await Promise.all([xe,qe].filter(Boolean)),[Le,ee]=await Promise.all(ke.map(Ge=>Ge.json())),Se={...(_=Le.result)!==null&&_!==void 0?_:{}};if(ee?.result&&typeof ee.result=="object"){for(const[Ge,We]of Object.entries(ee.result))if(Array.isArray(We))if(!Se[Ge])Se[Ge]=We;else{const dt=new Map(Se[Ge].map(Be=>{var ut;return[(ut=Be.address)!==null&&ut!==void 0?ut:"",Be]}));for(const Be of We)dt.set((P=Be.address)!==null&&P!==void 0?P:"",Be);Se[Ge]=Array.from(dt.values())}}const tt=[];for(const[Ge,We]of Object.entries(Se)){const dt=Number(Ge);if(Array.isArray(We)){for(const Be of We)if(Be.type==="erc20"){const ut={type:"erc20",address:(D=Be.address)!==null&&D!==void 0?D:"0x0",balance:BigInt(($=Be.balance)!==null&&$!==void 0?$:0),metadata:{name:((q=Be.metadata)===null||q===void 0?void 0:q.name)||"Unknown Token",symbol:((B=Be.metadata)===null||B===void 0?void 0:B.symbol)||"UNKNOWN",decimals:(W=Be.metadata)===null||W===void 0?void 0:W.decimals,fiat:(H=Be.metadata)===null||H===void 0?void 0:H.fiat},raw:Be};tt.push({...ut,chainId:dt})}else if(Be.type==="native"){const ut=(K=Be.metadata)!==null&&K!==void 0?K:{},Zn={type:"native",address:"native",balance:BigInt((Y=Be.balance)!==null&&Y!==void 0?Y:0),metadata:{symbol:ut.symbol||"ETH",decimals:ut.decimals,fiat:(ue=ut.fiat)!==null&&ue!==void 0?ue:{value:0,currency:"USD"}},raw:Be};tt.push({...Zn,chainId:dt})}}}return tt.sort((Ge,We)=>ul(We)-ul(Ge)),tt}if(!s||!l||!m)throw new Ee("Wallet not connected",Ne.UNEXPECTED_ERROR,{error:new Error("Address, chainId, or chain not available")});const T=B1({account:s,chain:m,transport:C()}).extend(wg()),oe=T.getAssets({chainIds:[l]}),V=Ui(l),de=k.length>0?T.getAssets({chainIds:[l],assets:{[V]:k.map(ye=>({address:ye,type:"erc20"}))}}):Promise.resolve({[V]:[]}),[ce,se]=await Promise.all([oe,de]),J=ce,me=se,ae=(I=(G=J[V])!==null&&G!==void 0?G:J[String(l)])!==null&&I!==void 0?I:[],ie=(R=(N=me[V])!==null&&N!==void 0?N:me[String(l)])!==null&&R!==void 0?R:[],he=[...ae.map(ye=>{var xe;let qe;if(ye.type==="erc20"){const ke=ye.metadata;qe={type:"erc20",address:ye.address,balance:ye.balance,metadata:{name:ke?.name||"Unknown Token",symbol:ke?.symbol||"UNKNOWN",decimals:ke?.decimals,fiat:ke?.fiat},raw:ye}}else if(ye.type==="native"){const ke=ye.metadata;qe={type:"native",address:"native",balance:ye.balance,metadata:ke?.fiat?{symbol:(xe=ke.symbol)!==null&&xe!==void 0?xe:"",decimals:ke.decimals,fiat:ke.fiat}:void 0,raw:ye}}else throw new Ee("Unsupported asset type",Ne.UNEXPECTED_ERROR,{error:ye});return qe})];return ie.flatMap(ye=>{var xe,qe;return ye.type!=="erc20"?[]:!((xe=d?.ethereum)===null||xe===void 0)&&xe.assets?((qe=d.ethereum.assets[l])===null||qe===void 0?void 0:qe.find(Le=>Le.toLowerCase()===ye.address.toLowerCase()))?[{type:"erc20",address:ye.address,balance:ye.balance,metadata:ye.metadata,raw:ye}]:[{...ye,raw:ye}]:[{...ye,raw:ye}]}).forEach(ye=>{he.find(xe=>xe.address===ye.address)||he.push(ye)}),he},enabled:t?c&&!!s:c&&!!l&&!!m&&!!s,staleTime:r}),A=v.useMemo(()=>{if(S)return S instanceof Ee?S:new Ee("Failed to fetch wallet assets",Ne.UNEXPECTED_ERROR,{error:S})},[S]);return{data:x??null,multiChain:t,isLoading:O,isError:!!S,isSuccess:!!x&&!S,isIdle:t?!s:!c||!l||!m,error:A,refetch:j}};var wi=0,ki=1,Xr=2,Ei=3,Si=4,Rg=5,Lg=6,Yu=["preEnter","entering","entered","preExit","exiting","exited","unmounted"],ji=function(t){return t?Lg:Rg},pl=function(t,r,o,i,a){clearTimeout(i.current),r(t),o.current=t,a&&a({state:Yu[t]})},Xu=function(t){var r=t===void 0?{}:t,o=r.enter,i=o===void 0?!0:o,a=r.exit,c=a===void 0?!0:a,s=r.preEnter,l=r.preExit,d=r.timeout,u=r.initialEntered,p=r.mountOnEnter,h=r.unmountOnExit,f=r.onChange,g=v.useState(u?Xr:ji(p)),m=g[0],b=g[1],y=v.useRef(m),w=v.useRef(),C,k;typeof d=="object"?(C=d.enter,k=d.exit):C=k=d;var x=v.useCallback(function(){var O;switch(y.current){case ki:case wi:O=Xr;break;case Si:case Ei:O=ji(h);break}O!==void 0&&pl(O,b,y,w,f)},[f,h]),S=v.useCallback(function(O){var j=function _(P){switch(pl(P,b,y,w,f),P){case ki:C>=0&&(w.current=setTimeout(x,C));break;case Si:k>=0&&(w.current=setTimeout(x,k));break;case wi:case Ei:w.current=setTimeout(function(){return _(P+1)},0);break}},A=y.current<=Xr;typeof O!="boolean"&&(O=!A),O?A||j(i?s?wi:ki:Xr):A&&j(c?l?Ei:Si:ji(h))},[x,f,i,c,s,l,C,k,h]);return v.useEffect(function(){return function(){return clearTimeout(w.current)}},[]),[Yu[m],S,x]};const Ig=9;function Ng(){const e=v.useRef(null);function t(r){if(e.current){var o=e.current.querySelectorAll(`
        a[href]:not(:disabled),
        button:not(:disabled),
        textarea:not(:disabled),
        input[type="text"]:not(:disabled),
        input[type="radio"]:not(:disabled),
        input[type="checkbox"]:not(:disabled),
        select:not(:disabled)
      `),i=o[0],a=o[o.length-1],c=r.key==="Tab"||r.keyCode===Ig;c&&(r.shiftKey?document.activeElement===i&&(a?.focus(),r.preventDefault()):document.activeElement===a&&(i?.focus(),r.preventDefault()))}}return v.useEffect(()=>(e.current&&(e.current.addEventListener("keydown",t),e.current.focus({preventScroll:!0})),()=>{e.current&&e.current.removeEventListener("keydown",t)}),[]),e}function Fg(e){const t=Ng();return v.useEffect(()=>{t.current&&t.current.focus({preventScroll:!0})},[]),n.jsx("div",{ref:t,children:e.children})}const Mg=typeof window<"u"?v.useLayoutEffect:v.useEffect;function Pg(e){const[t,r]=v.useState(e),o=U();return Mg(()=>{if(!t)return;const i={overflow:document.body.style.overflow,position:document.body.style.position,touchAction:document.body.style.touchAction,paddingRight:document.body.style.paddingRight},a=getComputedStyle(document.body),c=parseInt(a.marginRight,10)+parseInt(a.paddingRight,10)+parseInt(a.borderRight,10)+parseInt(a.marginLeft,10)+parseInt(a.paddingLeft,10)+parseInt(a.borderLeft,10),s=window.innerWidth-document.body.offsetWidth-c;return document.documentElement.style.setProperty("--ck-scrollbar-width",`${s}px`),document.body.style.overflow="hidden",document.body.style.position="relative",document.body.style.touchAction="none",o.uiConfig.avoidLayoutShift&&(document.body.style.paddingRight=`${s}px`),()=>{document.documentElement.style.removeProperty("--ck-scrollbar-width"),document.body.style.overflow=i.overflow,document.body.style.position=i.position,document.body.style.touchAction=i.touchAction,o.uiConfig.avoidLayoutShift&&(document.body.style.paddingRight=i.paddingRight)}},[t]),v.useEffect(()=>{t!==e&&r(e)},[e]),[t,r]}function hl(e,t){const r=v.useRef({target:e,previous:t});return r.current.target!==e&&(r.current.previous=r.current.target,r.current.target=e),r.current.previous}const Qu=v.createContext(null),Dg=({children:e,theme:t="auto",mode:r="auto",customTheme:o})=>{const i={theme:t,mode:r,customTheme:o};return v.createElement(Qu.Provider,{value:i},e)},Un=()=>{const e=fe.useContext(Qu);if(!e)throw Error("ConnectKitThemeProvider must be inside a Provider.");return e};var Ju=(function(){if(typeof Map<"u")return Map;function e(t,r){var o=-1;return t.some(function(i,a){return i[0]===r?(o=a,!0):!1}),o}return(function(){function t(){this.__entries__=[]}return Object.defineProperty(t.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),t.prototype.get=function(r){var o=e(this.__entries__,r),i=this.__entries__[o];return i&&i[1]},t.prototype.set=function(r,o){var i=e(this.__entries__,r);~i?this.__entries__[i][1]=o:this.__entries__.push([r,o])},t.prototype.delete=function(r){var o=this.__entries__,i=e(o,r);~i&&o.splice(i,1)},t.prototype.has=function(r){return!!~e(this.__entries__,r)},t.prototype.clear=function(){this.__entries__.splice(0)},t.prototype.forEach=function(r,o){o===void 0&&(o=null);for(var i=0,a=this.__entries__;i<a.length;i++){var c=a[i];r.call(o,c[1],c[0])}},t})()})(),ha=typeof window<"u"&&typeof document<"u"&&window.document===document,Oo=(function(){return typeof global<"u"&&global.Math===Math?global:typeof self<"u"&&self.Math===Math?self:typeof window<"u"&&window.Math===Math?window:Function("return this")()})(),$g=(function(){return typeof requestAnimationFrame=="function"?requestAnimationFrame.bind(Oo):function(e){return setTimeout(function(){return e(Date.now())},1e3/60)}})(),Bg=2;function Wg(e,t){var r=!1,o=!1,i=0;function a(){r&&(r=!1,e()),o&&s()}function c(){$g(a)}function s(){var l=Date.now();if(r){if(l-i<Bg)return;o=!0}else r=!0,o=!1,setTimeout(c,t);i=l}return s}var Vg=20,Ug=["top","right","bottom","left","width","height","size","weight"],zg=typeof MutationObserver<"u",Hg=(function(){function e(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=Wg(this.refresh.bind(this),Vg)}return e.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},e.prototype.removeObserver=function(t){var r=this.observers_,o=r.indexOf(t);~o&&r.splice(o,1),!r.length&&this.connected_&&this.disconnect_()},e.prototype.refresh=function(){var t=this.updateObservers_();t&&this.refresh()},e.prototype.updateObservers_=function(){var t=this.observers_.filter(function(r){return r.gatherActive(),r.hasActive()});return t.forEach(function(r){return r.broadcastActive()}),t.length>0},e.prototype.connect_=function(){!ha||this.connected_||(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),zg?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},e.prototype.disconnect_=function(){!ha||!this.connected_||(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},e.prototype.onTransitionEnd_=function(t){var r=t.propertyName,o=r===void 0?"":r,i=Ug.some(function(a){return!!~o.indexOf(a)});i&&this.refresh()},e.getInstance=function(){return this.instance_||(this.instance_=new e),this.instance_},e.instance_=null,e})(),e0=(function(e,t){for(var r=0,o=Object.keys(t);r<o.length;r++){var i=o[r];Object.defineProperty(e,i,{value:t[i],enumerable:!1,writable:!1,configurable:!0})}return e}),Pn=(function(e){var t=e&&e.ownerDocument&&e.ownerDocument.defaultView;return t||Oo}),t0=Ko(0,0,0,0);function Ro(e){return parseFloat(e)||0}function fl(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return t.reduce(function(o,i){var a=e["border-"+i+"-width"];return o+Ro(a)},0)}function Gg(e){for(var t=["top","right","bottom","left"],r={},o=0,i=t;o<i.length;o++){var a=i[o],c=e["padding-"+a];r[a]=Ro(c)}return r}function qg(e){var t=e.getBBox();return Ko(0,0,t.width,t.height)}function Zg(e){var t=e.clientWidth,r=e.clientHeight;if(!t&&!r)return t0;var o=Pn(e).getComputedStyle(e),i=Gg(o),a=i.left+i.right,c=i.top+i.bottom,s=Ro(o.width),l=Ro(o.height);if(o.boxSizing==="border-box"&&(Math.round(s+a)!==t&&(s-=fl(o,"left","right")+a),Math.round(l+c)!==r&&(l-=fl(o,"top","bottom")+c)),!Yg(e)){var d=Math.round(s+a)-t,u=Math.round(l+c)-r;Math.abs(d)!==1&&(s-=d),Math.abs(u)!==1&&(l-=u)}return Ko(i.left,i.top,s,l)}var Kg=(function(){return typeof SVGGraphicsElement<"u"?function(e){return e instanceof Pn(e).SVGGraphicsElement}:function(e){return e instanceof Pn(e).SVGElement&&typeof e.getBBox=="function"}})();function Yg(e){return e===Pn(e).document.documentElement}function Xg(e){return ha?Kg(e)?qg(e):Zg(e):t0}function Qg(e){var t=e.x,r=e.y,o=e.width,i=e.height,a=typeof DOMRectReadOnly<"u"?DOMRectReadOnly:Object,c=Object.create(a.prototype);return e0(c,{x:t,y:r,width:o,height:i,top:r,right:t+o,bottom:i+r,left:t}),c}function Ko(e,t,r,o){return{x:e,y:t,width:r,height:o}}var Jg=(function(){function e(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=Ko(0,0,0,0),this.target=t}return e.prototype.isActive=function(){var t=Xg(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},e.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},e})(),e4=(function(){function e(t,r){var o=Qg(r);e0(this,{target:t,contentRect:o})}return e})(),t4=(function(){function e(t,r,o){if(this.activeObservations_=[],this.observations_=new Ju,typeof t!="function")throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=r,this.callbackCtx_=o}return e.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(t instanceof Pn(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var r=this.observations_;r.has(t)||(r.set(t,new Jg(t)),this.controller_.addObserver(this),this.controller_.refresh())}},e.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(t instanceof Pn(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var r=this.observations_;r.has(t)&&(r.delete(t),r.size||this.controller_.removeObserver(this))}},e.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},e.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach(function(r){r.isActive()&&t.activeObservations_.push(r)})},e.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,r=this.activeObservations_.map(function(o){return new e4(o.target,o.broadcastRect())});this.callback_.call(t,r,t),this.clearActive()}},e.prototype.clearActive=function(){this.activeObservations_.splice(0)},e.prototype.hasActive=function(){return this.activeObservations_.length>0},e})(),n0=typeof WeakMap<"u"?new WeakMap:new Ju,r0=(function(){function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var r=Hg.getInstance(),o=new t4(t,r,this);n0.set(this,o)}return e})();["observe","unobserve","disconnect"].forEach(function(e){r0.prototype[e]=function(){var t;return(t=n0.get(this))[e].apply(t,arguments)}});var n4=(function(){return typeof Oo.ResizeObserver<"u"?Oo.ResizeObserver:r0})();const r4=typeof window<"u"&&window.document&&window.document.createElement!==void 0?v.useLayoutEffect:v.useEffect,o4=({logLevel:e="info",maxFontSize:t=100,minFontSize:r=20,onFinish:o,onStart:i,resolution:a=5}={})=>{var c;const s=v.useCallback(()=>({calcKey:0,fontSize:t,fontSizePrev:r,fontSizeMax:t,fontSizeMin:r}),[t,r]),l=v.useRef(null),d=v.useRef(),u=v.useRef(!1),[p,h]=v.useState(s),{calcKey:f,fontSize:g,fontSizeMax:m,fontSizeMin:b,fontSizePrev:y}=p;let w=null;const[C]=v.useState(()=>new n4(()=>{w=window.requestAnimationFrame(()=>{u.current||(i?.(),u.current=!0,h({...s(),calcKey:f+1}))})}));v.useEffect(()=>(l.current&&C.observe(l.current),()=>{w&&window.cancelAnimationFrame(w),C.disconnect()}),[w,C]);const k=(c=l.current)===null||c===void 0?void 0:c.innerHTML;return v.useEffect(()=>{f===0||u.current||(k!==d.current&&(i?.(),h({...s(),calcKey:f+1})),d.current=k)},[f,s,k,i]),r4(()=>{if(f===0)return;const x=Math.abs(g-y)<=a,S=!!l.current&&(l.current.scrollHeight>l.current.offsetHeight||l.current.scrollWidth>l.current.offsetWidth),O=S&&g===y,j=g>y;if(x){O?u.current=!1:S?h({fontSize:j?y:b,fontSizeMax:m,fontSizeMin:b,fontSizePrev:y,calcKey:f}):(u.current=!1,o?.(g));return}let A,_=m,P=b;S?(A=j?y-g:b-g,_=Math.min(m,g)):(A=j?m-g:y-g,P=Math.max(b,g)),h({calcKey:f,fontSize:g+A/2,fontSizeMax:_,fontSizeMin:P,fontSizePrev:g})},[f,g,m,b,y,o,l,a]),{fontSize:g,ref:l}},Pe=({children:e,maxFontSize:t=100,minFontSize:r=70,justifyContent:o="center"})=>{const[i,a]=fe.useState(!1),c=v.useCallback(()=>a(!0),[]),{fontSize:s,ref:l}=o4({logLevel:"none",maxFontSize:t,minFontSize:r,onStart:c,onFinish:c});return n.jsx("div",{ref:l,style:{visibility:i?"visible":"hidden",fontSize:`${s}%`,maxHeight:"100%",maxWidth:"100%",display:"flex",justifyContent:o,alignItems:"center"},children:e})};Pe.displayName="FitText";const o0=e=>{e={selector:"__OPENFORT__",...e};const{selector:t,children:r}=e,o=v.useRef(null),[i,a]=v.useState(!1);return v.useEffect(()=>{const c=`#${t.replace(/^#/,"")}`;if(o.current=document.querySelector(c),!o.current){const s=document.createElement("div");s.setAttribute("id",t),s.setAttribute("data-openfort-react",`${gg}`),document.body.appendChild(s),o.current=s}a(!0)},[t]),o.current&&i?S1.createPortal(r,o.current):null};var Ue={mobileWidth:560};const i0=E(F.div)`
  max-width: 100%;
  width: 295px;
  padding-top: 48px;
`;E(F.div)`
  z-index: -1;
  pointer-events: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: var(--width);
  top: 64px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  background: var(--ck-body-color-danger);
  border-radius: 20px;
  padding: 24px 46px 82px 24px;
  transition: width var(--duration) var(--ease);
  a {
    font-weight: 700;
    text-decoration: underline;
  }
  code {
    font-size: 0.9em;
    display: inline-block;
    font-family: monospace;
    margin: 1px;
    padding: 0 4px;
    border-radius: 8px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.1);
  }
`;const fa=je`
from { opacity: 0; }
  to { opacity: 1; }
`,i4=je`
from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`,a4=je`
from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
`,ga=je`
from { opacity: 1; }
  to { opacity: 0; }
`,s4=je`
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(1.1); }
`,c4=je`
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.85); }
`,l4=E(F.div)`
  user-select: none;
  position: relative;
  display: block;
  text-align: center;
  color: var(--ck-body-color-muted);
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  span {
    z-index: 2;
    position: relative;
    display: inline-block;
    user-select: none;
    pointer-events: none;
    padding: 0 14px;
    background: var(--ck-body-background);
    transition: background-color 200ms ease;
  }
  ${e=>!e.$disableHr&&`
  &:before {
    z-index: 2;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-1px);
    background: var(--ck-body-divider);
    box-shadow: var(--ck-body-divider-box-shadow);
  }
    `}
`,we=E(F.div)`
  z-index: 3;
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: 25px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  transform: translateX(-50%);
  width: var(--width);
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  font-weight: var(--ck-modal-heading-font-weight, 600);
  color: var(--ck-body-color);
  span {
    display: inline-block;
  }
`,d4=E(F.div)`
  position: relative;
  padding: 0;
`,Te=E(F.div)`
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    display: block;
  }
`,Me=E(F.h1)`
  margin: 0;
  padding: 0;
  line-height: ${e=>e.$small?20:22}px;
  font-size: ${e=>e.$small?17:19}px;
  font-weight: var(--ck-modal-h1-font-weight, 600);
  color: ${e=>e.$error?"var(--ck-body-color-danger)":e.$valid?"var(--ck-body-color-valid)":"var(--ck-body-color)"};
  > svg {
    position: relative;
    top: -2px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    margin-bottom: 6px;
    font-size: 17px;
  }
`,X=E.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: ${e=>e.$error?"var(--ck-body-color-danger)":e.$valid?"var(--ck-body-color-valid)":"var(--ck-body-color-muted)"};
  strong {
    font-weight: 500;
    color: ${e=>e.$error?"var(--ck-body-color-danger)":"var(--ck-body-color)"};
  }
`;E.div`
  padding: 0 12px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: var(--ck-body-color-muted);
  strong {
    font-weight: 500;
    color: var(--ck-body-color);
  }
`;const u4=E(F.div)`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ck-overlay-background, rgba(71, 88, 107, 0.24));
  backdrop-filter: ${e=>e.$blur?`blur(${e.$blur}px)`:"var(--ck-overlay-backdrop-filter, none)"};
  opacity: 0;
  animation: ${e=>e.$active?fa:ga} 150ms ease-out
    both;
`,p4=je`
  from{ opacity: 0; transform: scale(0.97); }
  to{ opacity: 1; transform: scale(1); }
`,h4=je`
  from{ opacity: 1; transform: scale(1); }
  to{ opacity: 0; transform: scale(0.97); }
`,f4=je`
  from { transform: translate3d(0, 100%, 0); }
  to { transform: translate3d(0, 0%, 0); }
`,g4=je`
  from { opacity: 1; }
  to { opacity: 0; }
`,a0=E(F.div)`
  z-index: 2;
  position: relative;
  color: var(--ck-body-color);

  animation: 150ms ease both;
  animation-name: ${h4};
  &.active {
    animation-name: ${p4};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: var(--width);
    height: var(--height);
    transform: translateX(-50%);
    backface-visibility: hidden;
    transition: all 200ms ease;
    border-radius: var(--ck-border-radius, 20px);
    background: var(--ck-body-background);
    box-shadow: var(--ck-modal-box-shadow);
  }

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    animation-name: ${g4};
    animation-duration: 130ms;
    animation-timing-function: ease;

    &.active {
      animation-name: ${f4};
      animation-duration: 300ms;
      animation-delay: 32ms;
      animation-timing-function: cubic-bezier(0.15, 1.15, 0.6, 1);
    }

    &:before {
      width: 100%;
      transition: 0ms height cubic-bezier(0.15, 1.15, 0.6, 1);
      will-change: height;
    }
  }
`,s0=E(F.div)`
  z-index: 3;
  position: absolute;
  top: 0;
  left: 50%;
  height: 64px;
  transform: translateX(-50%);
  backface-visibility: hidden;
  width: var(--width);
  transition: 0.2s ease width;
  pointer-events: auto;
  //border-bottom: 1px solid var(--ck-body-divider);
`,v4=E(F.div)`
  position: relative;
  overflow: hidden;
  height: var(--height);
  transition: 0.2s ease height;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    transition: 0ms height cubic-bezier(0.15, 1.15, 0.6, 1);
    /* animation-delay: 34ms; */
  }
`,c0=E(F.div)`
  z-index: 2;
  position: relative;
  top: 0;
  left: 50%;
  margin-left: calc(var(--width) / -2);
  width: var(--width);
  /* left: 0; */
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
  animation: 200ms ease both;

  &.active {
    animation-name: ${a4};
  }
  &.active-scale-up {
    animation-name: ${i4};
  }
  &.exit-scale-down {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    animation-name: ${c4};
  }
  &.exit {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    /* left: 50%; */
    /* transform: translateX(-50%); */
    animation-name: ${s4};
    animation-delay: 16.6667ms;
  }
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    /* animation: 0ms ease both; */
    /* animation-delay: 35ms; */
    animation: 0ms cubic-bezier(0.15, 1.15, 0.6, 1) both;

    &.active {
      animation-name: ${fa};
    }
    &.active-scale-up {
      animation-name: ${fa};
    }
    &.exit-scale-down {
      z-index: 3;
      animation-name: ${ga};
    }
    &.exit {
      z-index: 3;
      animation-name: ${ga};
      animation-delay: 0ms;
    }
  }
`,l0=E(F.div)`
  margin: 0 auto;
  width: fit-content;
  padding: 29px 24px 24px;
  backface-visibility: hidden;
`,m4=E.div`
  z-index: 2147483646; // z-index set one below max (2147483647) for if we wish to layer things on top of the modal in a separate Portal
  position: fixed;
  inset: 0;
`,va=E(F.button)`
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 22px;
  right: 17px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
  }

  &:hover {
    background: var(--ck-body-background-secondary);
  }
  &:active {
    transform: scale(0.9);
  }
`;E(F.button)`
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;const ma=E(F.button)`
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
    left: -1px;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`,xa=E(F.button)`
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  transform: translateX(-1px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
  }
  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`,x4=E(F.div)`
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --duration: 200ms;
  --transition: height var(--duration) var(--ease),
    width var(--duration) var(--ease);
  z-index: 3;
  display: block;
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate3d(-50%, -50%, 0);
  backface-visibility: hidden;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    pointer-events: auto;
    left: 0;
    top: auto;
    bottom: -5px;
    transform: none;
    ${a0} {
      max-width: 448px;
      margin: 0 auto;
      &:before {
        width: 100%;
        border-radius: var(--ck-border-radius, 30px)
          var(--ck-border-radius, 30px) 0 0;
      }
    }
    ${c0} {
      left: 0;
      right: 0;
      margin: 0 auto;
      width: auto;
    }
    ${i0} {
      margin: 0 auto;
      width: 100% !important;
    }
    ${we} {
      top: 29px;
    }
    ${Te} {
      gap: 12px;
    }
    ${X} {
    }
    ${l0} {
      width: 100%;
      padding: 31px 24px;
    }
    ${s0} {
      width: 100%;
      top: 4px;
      border-bottom: 0;
    }
    ${va} {
      right: 22px;
    }
    ${ma} {
      top: -1px;
      left: -3px;
    }
    ${xa} {
      top: -1px;
      left: -3px;
      svg {
        width: 65%;
        height: auto;
      }
    }
    ${va},
    ${ma},
    ${xa} {
      // Quick hack for bigger tappable area on mobile
      transform: scale(1.4) !important;
      background: transparent !important;
      svg {
        transform: scale(0.8) !important;
      }
    }
  }
`,b4=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px -24px -24px -24px;
  padding: 15px 40px 18px;
  font-size: var(--ck-body-disclaimer-font-size, 13px);
  font-weight: var(--ck-body-disclaimer-font-weight, 400);
  text-align: center;
  line-height: 19px;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & a {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    margin: 24px -24px -26px -24px;
    padding: 20px 42px 22px 42px;
  }
`;E(F.div)`
  pointer-events: all;
  z-index: 9;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: var(--width);
  backface-visibility: hidden;
  transform: translateX(-50%);
  transform-origin: bottom center;

  border-radius: var(--ck-border-radius, 30px);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  transition: width 200ms ease;

  background: var(
    --ck-body-disclaimer-background,
    var(--ck-body-background-secondary)
  );
  box-shadow: var(--ck-body-disclaimer-box-shadow);

  ${b4} {
    margin: 0 !important;
    /* visibility: hidden; */
  }

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    border-radius: 0;
  }
`;E(F.div)`
  z-index: 2;
  position: absolute;
  top: 100%;
  white-space: nowrap;
  padding: 8px 16px;
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
  background: #1a88f8;
  border-radius: calc(var(--ck-border-radius) * 0.75);
  transform: translateY(8px) translateX(-48px);
  box-shadow: var(--ck-modal-box-shadow);
  &:before {
    content: '';
    position: absolute;
    box-shadow: var(--shadow);
    width: 18px;
    height: 18px;
    transform: translate(215%, -75%) rotate(45deg);
    background: inherit;
    border-radius: 3px 0 0 0;
  }

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    transform: translateY(8px) translateX(-16px);
    &:before {
      transform: translate(40%, -75%) rotate(45deg);
    }
  }
`;const y4=({...e})=>n.jsx("svg",{"aria-hidden":"true",width:"22",height:"22",viewBox:"0 0 22 22",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z",fill:"currentColor"})}),C4=({...e})=>n.jsxs(F.svg,{width:14,height:14,viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("title",{children:"Close"}),n.jsx("path",{d:"M1 13L13 1M1 1L13 13",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),w4=({...e})=>n.jsxs(F.svg,{width:9,height:16,viewBox:"0 0 9 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("title",{children:"Back"}),n.jsx("path",{d:"M8 1L1 8L8 15",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]}),_i=.22,gl={initial:{zIndex:2,opacity:0},animate:{opacity:1,scale:1,transition:{duration:_i*.75,delay:_i*.25,ease:[.26,.08,.25,1]}},exit:{zIndex:1,opacity:0,pointerEvents:"none",position:"absolute",left:["50%","50%"],x:["-50%","-50%"],transition:{duration:_i,ease:[.26,.08,.25,1]}}},k4=({open:e,pages:t,pageId:r,positionInside:o,inline:i,demo:a,onClose:c,onInfo:s})=>{var l,d,u,p,h,f,g,m,b,y,w,C,k;const x=U(),S=Un(),O=zi(),j=an((l=x.connector)===null||l===void 0?void 0:l.id),A={name:j?.name,shortName:(d=j?.shortName)!==null&&d!==void 0?d:j?.name,icon:(u=j?.iconConnector)!==null&&u!==void 0?u:j?.icon,iconShape:(p=j?.iconShape)!==null&&p!==void 0?p:"circle",iconShouldShrink:j?.iconShouldShrink},_=bt({CONNECTORNAME:(h=A?.name)!==null&&h!==void 0?h:"UNKNOWN CONNECTOR"}),[P,D]=Xu({timeout:160,preEnter:!0,mountOnEnter:!0,unmountOnExit:!0}),$=!(P==="exited"||P==="unmounted"),q=P==="preEnter"||P!=="exiting",B=x.route.route,W=B===L.PROVIDERS?0:B===L.DOWNLOAD?2:1,H=hl(W,W);Pg(o?!1:$),hl(r,r),v.useEffect(()=>{D(e),e&&G(void 0)},[e]);const[K,Y]=v.useState({width:void 0,height:void 0}),[ue,G]=v.useState(void 0),I=ae=>{const ie={width:ae?.offsetWidth,height:ae?.offsetHeight};Y({width:`${ie?.width}px`,height:`${ie?.height}px`})};let N;const R=v.useCallback(ae=>{ae&&(de.current=ae,G(ue!==void 0),clearTimeout(N),N=setTimeout(()=>G(!1),360),I(ae))},[e,ue]),M=Wo(),T=ot(),oe=(b=(f=M?.getChainId())!==null&&f!==void 0?f:(m=(g=T?.account)===null||g===void 0?void 0:g.chain)===null||m===void 0?void 0:m.id)!==null&&b!==void 0?b:T?.chainId,V=(y=T?.switchChain)===null||y===void 0?void 0:y.switchChain,de=v.useRef(null);v.useEffect(()=>{de.current&&I(de.current)},[oe,V,O,x.uiConfig,x.resize]),v.useEffect(()=>{if(!$){Y({width:void 0,height:void 0});return}const ae=ie=>{ie.key==="Escape"&&c&&c()};return document.addEventListener("keydown",ae),()=>{document.removeEventListener("keydown",ae)}},[$,c]);const ce={"--height":K.height,"--width":K.width};function se(){return j?!(!j.getWalletConnectDeeplink||j.isInstalled):!1}function J(){var ae;switch(B){case L.ABOUT:return _.aboutScreen_heading;case L.EMAIL_LOGIN:return"Continue with email";case L.FORGOT_PASSWORD:return"Reset your password";case L.EMAIL_VERIFICATION:return"Email Verification";case L.CONNECT:return se()?Pa((ae=j?.connector)===null||ae===void 0?void 0:ae.id)?_.scanScreen_heading:_.scanScreen_heading_withConnector:A?.name;case L.CONNECTORS:return _.connectorsScreen_heading;case L.MOBILECONNECTORS:return _.mobileConnectorsScreen_heading;case L.DOWNLOAD:return _.downloadAppScreen_heading;case L.ONBOARDING:return _.onboardingScreen_heading;case L.SWITCHNETWORKS:case L.ETH_SWITCH_NETWORK:return _.switchNetworkScreen_heading;default:return""}}const me=n.jsx(_o,{$useTheme:(w=a?.theme)!==null&&w!==void 0?w:S.theme,$useMode:(C=a?.mode)!==null&&C!==void 0?C:S.mode,$customTheme:(k=a?.customTheme)!==null&&k!==void 0?k:S.customTheme,children:n.jsxs(m4,{role:"dialog",style:{pointerEvents:q?"auto":"none",position:o?"absolute":void 0},children:[!i&&n.jsx(u4,{$active:q,onClick:c,$blur:x.uiConfig.overlayBlur}),n.jsxs(x4,{style:ce,initial:!1,children:[n.jsx("div",{style:{pointerEvents:ue?"all":"none",position:"absolute",top:0,bottom:0,left:"50%",transform:"translateX(-50%)",width:"var(--width)",zIndex:9,transition:"width 200ms ease"}}),n.jsxs(a0,{className:`${q&&"active"}`,children:[n.jsxs(s0,{children:[c&&n.jsx(va,{"aria-label":er(_.close).toString(),onClick:c,children:n.jsx(C4,{})}),n.jsx("div",{style:{position:"absolute",top:23,left:20,minWidth:32,minHeight:32,display:"flex",alignItems:"center"},children:n.jsx(Ve,{children:x.onBack?n.jsx(ma,{disabled:ue,"aria-label":er(_.back).toString(),onClick:x.onBack,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:O?0:.1,delay:O?.01:0},children:n.jsx(w4,{})},"backButton"):x.headerLeftSlot?n.jsx(F.div,{initial:{opacity:0,y:-4},animate:{opacity:1,y:0},exit:{opacity:0,y:-4},transition:{duration:.12},style:{display:"inline-flex"},children:x.headerLeftSlot},"headerLeftSlot"):s&&!x.uiConfig.hideQuestionMarkCTA&&n.jsx(xa,{disabled:ue,"aria-label":er(_.moreInformation).toString(),onClick:s,initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:O?0:.1,delay:O?.01:0},children:n.jsx(y4,{})},"infoButton")})})]}),n.jsx(we,{children:n.jsx(Ve,{children:n.jsx(F.div,{style:{position:"absolute",top:0,bottom:0,left:52,right:52,display:"flex",justifyContent:"center"},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:O?0:.17,delay:O?.01:0},children:n.jsx(Pe,{children:J()})},`${B}-signedIn`)})}),n.jsx(v4,{children:Object.keys(t).map(ae=>{var ie,Fe;const he=(Fe=(ie=x.uiConfig.customPageComponents)===null||ie===void 0?void 0:ie[ae])!==null&&Fe!==void 0?Fe:t[ae];return n.jsx(E4,{open:ae===r,initial:!o&&P!=="entered",enterAnim:ae===r?W>H?"active-scale-up":"active":"",exitAnim:ae!==r?W<H?"exit-scale-down":"exit":"",children:n.jsx(l0,{ref:R,style:{pointerEvents:ae===r&&q?"auto":"none"},children:he},`inner-${ae}`)},ae)})})]})]})]})});return n.jsx(n.Fragment,{children:$&&(o?me:n.jsx(o0,{children:n.jsx(Fg,{children:me})}))})},E4=({children:e,open:t,initial:r,enterAnim:o,exitAnim:i})=>{const[a,c]=Xu({timeout:400,preEnter:!0,initialEntered:t,mountOnEnter:!0,unmountOnExit:!0}),s=!(a==="exited"||a==="unmounted"),l=a==="preEnter"||a!=="exiting";return v.useEffect(()=>{c(t)},[t]),s?n.jsx(c0,{className:`${l?o:i}`,style:{animationDuration:r?"0ms":void 0,animationDelay:r?"0ms":void 0},children:e}):null},S4=({children:e,hideHr:t})=>{const r=bt();return n.jsx(l4,{$disableHr:t,children:n.jsx("span",{children:e??r.or})})},vl=je`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`,j4=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${vl} 1s linear infinite;
  svg {
    display: block;
    position: relative;
    animation: ${vl} 1s ease-in-out infinite;
  }
`,ml={duration:.4,ease:[.175,.885,.32,.98]},d0=()=>n.jsx(j4,{initial:{opacity:0,rotate:180},animate:{opacity:1,rotate:0},exit:{position:"absolute",opacity:0,rotate:-180,transition:{...ml}},transition:{...ml,delay:.2},children:n.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Loading"}),n.jsx("circle",{cx:"9",cy:"9",r:"7",stroke:"currentColor",strokeOpacity:"0.1",strokeWidth:"2.5"}),n.jsx("path",{d:"M16 9C16 5.13401 12.866 2 9 2",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round"})]})}),_4=E(F.div)`
  position: absolute;
  right: 16px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`,Vt=E.svg`
  --x: -3px;
  --stroke-width: 2;
  position: relative;
  top: 1px;
  left: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(var(--x, -3px));
  color: currentColor;
  opacity: 0.4;
`,rn=E.path``,pr=E.line`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`,ba=E.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-right: 6px;
  color: currentColor;
`,A4=E.div`
  transform: rotate(90deg);
  ${Vt} {
    margin: 0 auto;
  }
`,Yo=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  height: 100%;
`,on=E.button`

  ${({disabled:e})=>e&&pe`
      cursor: not-allowed;
      pointer-events: none;
      ${zn} {
        opacity: 0.4;
      }
    `}

  ${({$variant:e})=>{if(e==="primary")return pe`
        --color: var(--ck-primary-button-color, var(--ck-body-color));
        --background: var(
          --ck-primary-button-background,
          var(--ck-body-background-primary)
        );
        --box-shadow: var(--ck-primary-button-box-shadow);
        --border-radius: var(--ck-primary-button-border-radius);
        --font-weight: var(--ck-primary-button-font-weight, 500);

        --hover-color: var(--ck-button-primary-hover-color, var(--color));
        --hover-background: var(
          --ck-primary-button-hover-background,
          var(--background)
        );
        --hover-box-shadow: var(
          --ck-primary-button-hover-box-shadow,
          var(--box-shadow)
        );
        --hover-border-radius: var(
          --ck-primary-button-hover-border-radius,
          var(--border-radius)
        );
        --hover-font-weight: var(
          --ck-primary-button-font-weight,
          var(--font-weight)
        );
      `;if(e==="secondary")return pe`
        --color: var(--ck-secondary-button-color, var(--ck-body-color));
        --background: var(
          --ck-secondary-button-background,
          var(--ck-body-background-secondary)
        );
        --box-shadow: var(--ck-secondary-button-box-shadow);
        --border-radius: var(--ck-secondary-button-border-radius);
        --font-weight: var(--ck-secondary-button-font-weight, 500);

        --hover-color: var(--ck-secondary-button-hover-color, var(--color));
        --hover-background: var(
          --ck-secondary-button-hover-background,
          var(--background)
        );
        --hover-box-shadow: var(
          --ck-secondary-button-hover-box-shadow,
          var(--box-shadow)
        );
        --hover-border-radius: var(
          --ck-secondary-button-hover-border-radius,
          var(--border-radius)
        );
        --hover-font-weight: var(
          --ck-secondary-button-font-weight,
          var(--font-weight)
        );
      `;if(e==="tertiary")return pe`
        --color: var(
          --ck-tertiary-button-color,
          var(--ck-secondary-button-color)
        );
        --background: var(
          --ck-tertiary-button-background,
          var(--ck-secondary-button-background)
        );
        --box-shadow: var(
          --ck-tertiary-button-box-shadow,
          var(--ck-secondary-button-box-shadow)
        );
        --border-radius: var(
          --ck-tertiary-button-border-radius,
          var(--ck-secondary-button-border-radius)
        );
        --font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );

        --hover-color: var(
          var(--ck-tertiary-button-color)
        );
        --hover-background: var(
          --ck-tertiary-button-hover-background,
          var(--ck-tertiary-button-background)
        );
        --hover-box-shadow: var(
          --ck-tertiary-button-hover-box-shadow,
          var(--ck-tertiary-button-box-shadow)
        );
        --hover-border-radius: var(
          --ck-tertiary-button-hover-border-radius,
          var(--ck-tertiary-button-border-radius, var(--border-radius))
        );
        --hover-font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );
      `}}

  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display:block;
  text-align: center;
  height: 48px;
  margin: 12px 0 0;
  line-height: 48px;
  padding: 0 4px;
  font-size: 16px;
  font-weight: var(--font-weight,500);
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;
  color: var(--color);
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  will-change: transform, box-shadow, background-color, color;

  ${ba} {
    ${Vt} {
      transform: translateX(0);
      ${pr} {
        transform: none;
      }
      ${rn} {
      }
    }
  }

  @media only screen and (min-width: ${Ue.mobileWidth+1}px) {
    &:hover,
    &:focus-visible {
      color: var(--ck-accent-text-color, var(--hover-color));
      background: var(--ck-accent-color, var(--hover-background));
      border-radius: var(--hover-border-radius);
      box-shadow: var(--hover-box-shadow);

      ${Vt} {
        transform: translateX(0);
        ${pr} {
          transform: none;
        }
        ${rn} {
        }
      }
      ${ba} {
        ${Vt} {
          transform: translateX(var(--x));
          ${pr} {
            transform: scaleX(0.1);
          }
          ${rn} {
          }
        }
      }
    }
    &:active {
      box-shadow: var(--ck-secondary-button-active-box-shadow, var(--hover-box-shadow));
    }
  }
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    transition: transform 100ms ease;
    transform: scale(1);
    font-size: 17px;
    &:active {
    }
  }
`,zn=E.div`
  transform: translateZ(0); // Shifting fix
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: calc(100% - 42px);
  transition: opacity 300ms ease;
  /*
  overflow: hidden;
  text-overflow: ellipsis;
  */
`,xl=E(F.div)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 20px;
  max-height: 20px;
  margin: 0 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  ${e=>e.$rounded&&pe`
        overflow: hidden;
        border-radius: 5px;
      `}
  svg {
    display: block;
    position: relative;
    max-width: 100%;
    height: auto;
  }
`,Xo=E.button`
  background: none;
  border: none;

  cursor: pointer;
  font-size: inherit;
  color: var(--ck-body-color-muted, inherit);
  text-decoration: none;
  transition: color 200ms ease;
  &:hover {
    color: var(--ck-body-color-muted-hover, inherit);
  }
`,bl={duration:.4,ease:[.175,.885,.32,.98]},te=({className:e,children:t,variant:r="secondary",disabled:o,type:i,icon:a,iconPosition:c="left",roundedIcon:s,waiting:l,arrow:d,download:u,href:p,style:h,onClick:f,textAlign:g,title:m,fitText:b=!0})=>{const y=typeof t=="string"?t:er(t).join(""),w=p&&(typeof p=="string"?p:er(p).join(""));return n.jsx(on,{className:e,as:p?"a":i?"button":void 0,type:i,onClick:C=>{!o&&f&&f(C)},href:p&&w,target:p&&"_blank",rel:p&&"noopener noreferrer",disabled:o,$variant:r,style:h,title:m,children:n.jsxs(Ve,{initial:!1,children:[n.jsxs(Yo,{initial:{opacity:0,y:-10},animate:{opacity:1,y:-1},exit:{position:"absolute",opacity:0,y:10,transition:{...bl}},transition:{...bl,delay:.2},children:[a&&c==="left"&&n.jsx(xl,{$rounded:s,children:a}),u&&n.jsx(ba,{children:n.jsx(A4,{children:n.jsxs(Vt,{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx(pr,{stroke:"currentColor",x1:"1",y1:"6",x2:"12",y2:"6",strokeWidth:"var(--stroke-width)",strokeLinecap:"round"}),n.jsx(rn,{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"var(--stroke-width)",strokeLinecap:"round"})]})})}),n.jsx(zn,{style:{paddingLeft:d?6:0},children:b?n.jsx(Pe,{justifyContent:g,children:t}):t}),a&&c==="right"&&n.jsx(xl,{$rounded:s,children:a}),d&&n.jsxs(Vt,{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx(pr,{stroke:"currentColor",x1:"1",y1:"6",x2:"12",y2:"6",strokeWidth:"2",strokeLinecap:"round"}),n.jsx(rn,{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"2",strokeLinecap:"round"})]})]},y),l&&n.jsx(_4,{children:n.jsx(d0,{})})]})})},Q=({children:e,width:t,onBack:r="back",logoutOnBack:o,header:i})=>{const{setOnBack:a,setRoute:c,setPreviousRoute:s,setRouteHistory:l}=U(),{signOut:d}=j1();return v.useEffect(()=>{if(typeof r=="string"||r instanceof Object&&typeof r!="function")switch(r){case"back":a(()=>()=>s());break;case"inherit":break;default:a(()=>()=>{o&&d(),c(r)})}else r?a(o?()=>()=>{d(),r()}:()=>r):r===null?(a(null),l(u=>u.length>0?[u[u.length-1]]:u)):a(null)},[!!r,!!o]),n.jsxs(i0,{style:{width:t},children:[i&&n.jsx(we,{children:i}),e]})},yl={scale:[.9,1.25,1.6],opacity:[0,.11,0]},Cl={ease:"linear",duration:2,repeat:1/0},u0=E.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
`,T4=je`
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
`,O4=E(F.div)`
  z-index: -1;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 100%;
  animation: ${T4} 16s linear infinite;
`,hs=E(F.div)`
  overflow: hidden;
  border-radius: inherit;
  z-index: 0;
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
`,fs=E(F.div)`
  z-index: 2;
  position: relative;
  border-radius: 50%;
  background: var(--ck-body-background);
`,gs=E(F.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`,R4=()=>{const e=v.useId();return n.jsxs("svg",{width:"34",height:"34",viewBox:"0 0 34 34",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Compass graphic"}),n.jsx("path",{d:"M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z",fill:"var(--ck-graphic-compass-color, var(--ck-body-color))"}),n.jsx("path",{d:"M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z",fill:`url(#ck-compass-gradient-${e})`}),n.jsx("defs",{children:n.jsxs("linearGradient",{id:`ck-compass-gradient-${e}`,x1:"17",y1:"0",x2:"17",y2:"34",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"rgba(0,0,0,0)"}),n.jsx("stop",{offset:"1",stopColor:"rgba(0,0,0,0.05)"})]})})]})},p0=({inverted:e=!1})=>{const t=v.useId();return n.jsxs("svg",{width:"58",height:"50",viewBox:"0 0 58 50",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Wallet graphic"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M57.9332 20.3335V42.1113C57.9332 46.4069 54.451 49.8891 50.1555 49.8891H8.15546C3.85991 49.8891 0.377686 46.4069 0.377686 42.1113V25.0002V7.8891C0.377686 3.59355 3.85991 0.111328 8.15546 0.111328H47.0444C48.7626 0.111328 50.1555 1.50422 50.1555 3.22244C50.1555 4.94066 48.7626 6.33355 47.0443 6.33355H9.71102C7.9928 6.33355 6.59991 7.72644 6.59991 9.44466C6.59991 11.1629 7.9928 12.5558 9.71102 12.5558H50.1555C54.451 12.5558 57.9332 16.038 57.9332 20.3335ZM46.2667 34.3337C48.4145 34.3337 50.1556 32.5926 50.1556 30.4448C50.1556 28.297 48.4145 26.5559 46.2667 26.5559C44.1189 26.5559 42.3778 28.297 42.3778 30.4448C42.3778 32.5926 44.1189 34.3337 46.2667 34.3337Z",fill:e?"var(--ck-graphic-primary-color, var(--ck-body-background))":"var(--ck-graphic-primary-color, var(--ck-body-color))"}),n.jsx("defs",{children:n.jsxs("linearGradient",{id:`paint0_linear_${t}`,x1:"29.1555",y1:"0.111328",x2:"29.1555",y2:"49.8891",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:e?"var(--ck-body-color-muted)":"var(--ck-body-background-transparent, transparent)"}),n.jsx("stop",{offset:"1",stopColor:e?"var(--ck-body-color)":"var(--ck-body-background)"})]})})]})},L4=n.jsxs("svg",{width:"41",height:"41",viewBox:"0 0 41 41",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Send icon"}),n.jsx("path",{d:"M35.4446 0.839914L2.14484 10.7065C0.0395033 11.3303 -0.632966 13.9786 0.919705 15.5313L7.9624 22.574C9.47585 24.0874 11.8661 24.273 13.5951 23.0114L25.2866 14.4797C25.5558 14.2832 25.9281 14.3121 26.1638 14.5478C26.3998 14.7838 26.4285 15.1567 26.2313 15.426L17.6874 27.0937C16.4213 28.8228 16.6052 31.2168 18.1206 32.7322L25.1811 39.7926C26.7337 41.3453 29.382 40.6728 30.0058 38.5675L39.8724 5.2677C40.6753 2.55794 38.1544 0.037024 35.4446 0.839914Z",fill:"var(--ck-graphic-secondary-color, white)"})]}),I4=n.jsxs("svg",{width:"38",height:"44",viewBox:"0 0 38 44",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Receive icon"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M19 0.875C21.4853 0.875 23.5 2.88972 23.5 5.375V27.761L30.068 21.193C31.8254 19.4357 34.6746 19.4357 36.432 21.193C38.1893 22.9504 38.1893 25.7996 36.432 27.557L22.182 41.807C20.4246 43.5643 17.5754 43.5643 15.818 41.807L1.56802 27.557C-0.18934 25.7996 -0.18934 22.9504 1.56802 21.193C3.32538 19.4357 6.17462 19.4357 7.93198 21.193L14.5 27.761V5.375C14.5 2.88972 16.5147 0.875 19 0.875Z",fill:"var(--ck-graphic-secondary-color, white)"})]}),N4=({...e})=>{var t;const r=(t=e?.id)!==null&&t!==void 0?t:"";return n.jsxs("svg",{...e,width:"81",height:"81",viewBox:"0 0 81 81",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Key graphic"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z",fill:`url(#${r}paint0_linear_2509_6177)`}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z",fill:`url(#${r}paint1_radial_2509_6177)`,fillOpacity:"0.2"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M44.5658 51.2522C45.1527 50.6653 46.0151 50.4492 46.8095 50.6899C49.0823 51.3788 51.4958 51.75 54 51.75C67.6691 51.75 78.75 40.669 78.75 27C78.75 13.331 67.6691 2.25 54 2.25C40.331 2.25 29.25 13.331 29.25 27C29.25 29.5042 29.6212 31.9177 30.3101 34.1905C30.5508 34.9849 30.3347 35.8473 29.7478 36.4342L2.90901 63.273C2.48705 63.6949 2.25 64.2672 2.25 64.864V76.5C2.25 77.7426 3.25736 78.75 4.5 78.75H15.75V72C15.75 70.7574 16.7574 69.75 18 69.75H24.75V63C24.75 61.7574 25.7574 60.75 27 60.75H35.068L44.5658 51.2522ZM36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63ZM68.625 20.25C68.625 24.5992 65.0992 28.125 60.75 28.125C56.4008 28.125 52.875 24.5992 52.875 20.25C52.875 15.9008 56.4008 12.375 60.75 12.375C65.0992 12.375 68.625 15.9008 68.625 20.25ZM66.375 20.25C66.375 23.3566 63.8566 25.875 60.75 25.875C57.6434 25.875 55.125 23.3566 55.125 20.25C55.125 17.1434 57.6434 14.625 60.75 14.625C63.8566 14.625 66.375 17.1434 66.375 20.25Z",fill:"black",fillOpacity:"0.1"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M33.4205 47.5795C33.8598 48.0188 33.8598 48.7312 33.4205 49.1705L3.0455 79.5455C2.60616 79.9848 1.89384 79.9848 1.4545 79.5455C1.01517 79.1062 1.01517 78.3938 1.4545 77.9545L31.8295 47.5795C32.2688 47.1402 32.9812 47.1402 33.4205 47.5795Z",fill:"#A5A9AD"}),n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:`${r}paint0_linear_2509_6177`,x1:"72",y1:"5.625",x2:"2.25",y2:"78.75",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#D4DFE6"}),n.jsx("stop",{offset:"0.0967282",stopColor:"#C6CACD"}),n.jsx("stop",{offset:"0.526645",stopColor:"#BDBAC4"}),n.jsx("stop",{offset:"1",stopColor:"#939CA1"})]}),n.jsxs("radialGradient",{id:`${r}paint1_radial_2509_6177`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(52.875 12.375) rotate(93.2705) scale(39.4392)",children:[n.jsx("stop",{stopColor:"white"}),n.jsx("stop",{offset:"1",stopColor:"white"})]})]})]})},F4=n.jsxs("svg",{width:"131",height:"14",viewBox:"0 0 131 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Vitalik address graphic"}),n.jsx("path",{d:"M5.74805 13.2549C8.86816 13.2549 10.7227 10.6973 10.7227 6.63672C10.7227 2.57617 8.85059 0.0625 5.74805 0.0625C2.63672 0.0625 0.755859 2.59375 0.755859 6.64551C0.755859 10.7148 2.61914 13.2549 5.74805 13.2549ZM5.74805 11.4004C4.02539 11.4004 3.04102 9.64258 3.04102 6.63672C3.04102 3.68359 4.04297 1.91699 5.74805 1.91699C7.44434 1.91699 8.4375 3.6748 8.4375 6.64551C8.4375 9.65137 7.46191 11.4004 5.74805 11.4004Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M13.0869 13.1758C13.4561 13.1758 13.6934 13.0439 13.9658 12.6221L15.9697 9.66016H16.0137L18.0264 12.6572C18.2549 13.0088 18.4922 13.1758 18.8965 13.1758C19.4854 13.1758 19.9424 12.7891 19.9424 12.209C19.9424 11.9805 19.8633 11.7695 19.7051 11.541L17.376 8.28906L19.6963 5.16016C19.8896 4.90527 19.9688 4.68555 19.9688 4.43066C19.9688 3.88574 19.5381 3.49902 18.9229 3.49902C18.5361 3.49902 18.2988 3.6748 18.0176 4.10547L16.1191 6.95312H16.0752L14.1328 4.08789C13.8516 3.64844 13.6318 3.49902 13.2012 3.49902C12.6035 3.49902 12.1465 3.91211 12.1465 4.44824C12.1465 4.70312 12.2256 4.92285 12.3838 5.13379L14.7129 8.35059L12.3486 11.5498C12.1641 11.8135 12.0762 12.0156 12.0762 12.2705C12.0762 12.7979 12.498 13.1758 13.0869 13.1758Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M26.2441 13.2549C29.1445 13.2549 31.1924 11.7432 31.1924 9.57227C31.1924 7.9375 30.0146 6.68066 28.3184 6.3291V6.27637C29.7773 5.87207 30.7178 4.7998 30.7178 3.45508C30.7178 1.48633 28.8633 0.0625 26.2441 0.0625C23.625 0.0625 21.7617 1.49512 21.7617 3.44629C21.7617 4.80859 22.7109 5.88965 24.1699 6.27637V6.3291C22.4736 6.67188 21.3047 7.92871 21.3047 9.57227C21.3047 11.7344 23.335 13.2549 26.2441 13.2549ZM26.2441 5.55566C24.9258 5.55566 24.0029 4.78223 24.0029 3.6748C24.0029 2.55859 24.9258 1.77637 26.2441 1.77637C27.5537 1.77637 28.4854 2.5498 28.4854 3.6748C28.4854 4.78223 27.5537 5.55566 26.2441 5.55566ZM26.2441 11.5234C24.7236 11.5234 23.6514 10.6357 23.6514 9.40527C23.6514 8.1748 24.7236 7.28711 26.2441 7.28711C27.7646 7.28711 28.8369 8.16602 28.8369 9.40527C28.8369 10.6357 27.7646 11.5234 26.2441 11.5234Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M36.3164 13.1494C37.7578 13.1494 38.7598 12.4199 39.208 11.3477H39.252V12.0771C39.252 12.7891 39.7266 13.1758 40.3594 13.1758C40.9922 13.1758 41.4404 12.7803 41.4404 12.0771V1.29297C41.4404 0.554688 40.9834 0.141602 40.3418 0.141602C39.7002 0.141602 39.252 0.554688 39.252 1.29297V5.24805H39.1992C38.707 4.21973 37.6523 3.52539 36.3164 3.52539C33.9697 3.52539 32.4492 5.38867 32.4492 8.33301C32.4492 11.2949 33.9697 13.1494 36.3164 13.1494ZM36.9756 11.3564C35.5605 11.3564 34.6904 10.1963 34.6904 8.3418C34.6904 6.49609 35.5693 5.32715 36.9756 5.32715C38.3555 5.32715 39.2607 6.51367 39.2607 8.3418C39.2607 10.1875 38.3555 11.3564 36.9756 11.3564Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M44.0508 13.1494C44.6396 13.1494 44.9736 12.8594 45.1846 12.1738L46.0195 9.76562H50.7568L51.5918 12.1914C51.7939 12.8682 52.1367 13.1494 52.752 13.1494C53.4111 13.1494 53.8857 12.7188 53.8857 12.1035C53.8857 11.9014 53.8418 11.6992 53.7363 11.4092L50.0449 1.38965C49.7285 0.537109 49.2188 0.167969 48.3838 0.167969C47.5576 0.167969 47.0479 0.554688 46.7402 1.39844L43.0576 11.4092C42.9521 11.6816 42.9082 11.9277 42.9082 12.1035C42.9082 12.7451 43.3564 13.1494 44.0508 13.1494ZM46.5557 7.97266L48.3398 2.55859H48.4014L50.2031 7.97266H46.5557Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M60.1172 13.2549C62.8594 13.2549 64.8545 11.4004 64.8545 8.8252C64.8545 6.42578 63.1406 4.66797 60.6973 4.66797C58.9746 4.66797 57.709 5.54688 57.208 6.71582H57.1641V6.58398C57.208 3.66602 58.2275 1.89941 60.1436 1.89941C61.084 1.89941 61.7607 2.26855 62.3496 3.07715C62.7012 3.52539 62.9824 3.73633 63.4307 3.73633C64.0283 3.73633 64.3975 3.34082 64.3975 2.82227C64.3975 2.57617 64.3359 2.35645 64.1953 2.10156C63.5625 0.897461 62.0859 0.0537109 60.1523 0.0537109C56.9268 0.0537109 54.9932 2.57617 54.9932 6.80371C54.9932 8.24512 55.2305 9.45801 55.6963 10.4336C56.5752 12.2881 58.1396 13.2549 60.1172 13.2549ZM60.082 11.4092C58.667 11.4092 57.5508 10.293 57.5508 8.86914C57.5508 7.4541 58.6494 6.41699 60.1084 6.41699C61.5674 6.41699 62.6309 7.4541 62.6221 8.91309C62.6221 10.3018 61.4971 11.4092 60.082 11.4092Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M68.1328 8.83398C68.8447 8.83398 69.416 8.27148 69.416 7.55078C69.416 6.83008 68.8447 6.25879 68.1328 6.25879C67.4121 6.25879 66.8408 6.83008 66.8408 7.55078C66.8408 8.27148 67.4121 8.83398 68.1328 8.83398Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M73.3359 8.83398C74.0479 8.83398 74.6191 8.27148 74.6191 7.55078C74.6191 6.83008 74.0479 6.25879 73.3359 6.25879C72.6152 6.25879 72.0439 6.83008 72.0439 7.55078C72.0439 8.27148 72.6152 8.83398 73.3359 8.83398Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M78.5391 8.83398C79.251 8.83398 79.8223 8.27148 79.8223 7.55078C79.8223 6.83008 79.251 6.25879 78.5391 6.25879C77.8184 6.25879 77.2471 6.83008 77.2471 7.55078C77.2471 8.27148 77.8184 8.83398 78.5391 8.83398Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M83.7422 8.83398C84.4541 8.83398 85.0254 8.27148 85.0254 7.55078C85.0254 6.83008 84.4541 6.25879 83.7422 6.25879C83.0215 6.25879 82.4502 6.83008 82.4502 7.55078C82.4502 8.27148 83.0215 8.83398 83.7422 8.83398Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M92.2148 13.2549C94.957 13.2549 96.9521 11.4004 96.9521 8.8252C96.9521 6.42578 95.2383 4.66797 92.7949 4.66797C91.0723 4.66797 89.8066 5.54688 89.3057 6.71582H89.2617V6.58398C89.3057 3.66602 90.3252 1.89941 92.2412 1.89941C93.1816 1.89941 93.8584 2.26855 94.4473 3.07715C94.7988 3.52539 95.0801 3.73633 95.5283 3.73633C96.126 3.73633 96.4951 3.34082 96.4951 2.82227C96.4951 2.57617 96.4336 2.35645 96.293 2.10156C95.6602 0.897461 94.1836 0.0537109 92.25 0.0537109C89.0244 0.0537109 87.0908 2.57617 87.0908 6.80371C87.0908 8.24512 87.3281 9.45801 87.7939 10.4336C88.6729 12.2881 90.2373 13.2549 92.2148 13.2549ZM92.1797 11.4092C90.7646 11.4092 89.6484 10.293 89.6484 8.86914C89.6484 7.4541 90.7471 6.41699 92.2061 6.41699C93.665 6.41699 94.7285 7.4541 94.7197 8.91309C94.7197 10.3018 93.5947 11.4092 92.1797 11.4092Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M103.377 13.2549C106.497 13.2549 108.352 10.6973 108.352 6.63672C108.352 2.57617 106.479 0.0625 103.377 0.0625C100.266 0.0625 98.3848 2.59375 98.3848 6.64551C98.3848 10.7148 100.248 13.2549 103.377 13.2549ZM103.377 11.4004C101.654 11.4004 100.67 9.64258 100.67 6.63672C100.67 3.68359 101.672 1.91699 103.377 1.91699C105.073 1.91699 106.066 3.6748 106.066 6.64551C106.066 9.65137 105.091 11.4004 103.377 11.4004Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M117.167 13.1758C117.8 13.1758 118.248 12.7715 118.248 12.0596V10.5654H119.127C119.733 10.5654 120.094 10.1875 120.094 9.63379C120.094 9.08887 119.733 8.70215 119.136 8.70215H118.248V1.81152C118.248 0.756836 117.554 0.141602 116.385 0.141602C115.453 0.141602 114.899 0.52832 114.073 1.75879C112.553 3.99121 111.111 6.16211 110.224 7.75293C109.872 8.38574 109.731 8.79883 109.731 9.29102C109.731 10.0469 110.268 10.5654 111.085 10.5654H116.086V12.0596C116.086 12.7715 116.543 13.1758 117.167 13.1758ZM116.121 8.75488H111.788V8.69336C112.816 6.82129 114.073 4.92285 116.086 2.04004H116.121V8.75488Z",fill:"var(--ck-body-color)"}),n.jsx("path",{d:"M126.105 13.2549C128.918 13.2549 130.869 11.4355 130.869 8.78125C130.869 6.35547 129.138 4.6416 126.712 4.6416C125.438 4.6416 124.392 5.13379 123.855 5.9248H123.812L124.146 2.17188H129.27C129.85 2.17188 130.228 1.80273 130.228 1.24023C130.228 0.686523 129.85 0.317383 129.27 0.317383H123.803C122.81 0.317383 122.3 0.72168 122.221 1.72363L121.816 6.51367C121.808 6.56641 121.808 6.60156 121.808 6.6543C121.79 7.26953 122.15 7.78809 122.88 7.78809C123.398 7.78809 123.618 7.67383 124.146 7.14648C124.629 6.67188 125.323 6.34668 126.123 6.34668C127.617 6.34668 128.681 7.38379 128.681 8.84277C128.681 10.3457 127.617 11.4092 126.114 11.4092C124.893 11.4092 124.049 10.8027 123.618 9.77441C123.381 9.30859 123.091 9.12402 122.616 9.12402C122.019 9.12402 121.641 9.49316 121.641 10.082C121.641 10.4072 121.72 10.6709 121.843 10.9434C122.467 12.3232 124.154 13.2549 126.105 13.2549Z",fill:"var(--ck-body-color)"})]}),wl=({layoutId:e})=>n.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[n.jsx(F.div,{initial:{rotate:90,scale:.2,x:"100%"},animate:{rotate:0,scale:1,x:0},exit:{rotate:40,scale:.1,x:"70%"},style:{zIndex:4,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:76,height:76,background:"var(--ck-graphic-secondary-background, #6366F1)",borderRadius:"50%",boxShadow:"var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(99, 102, 241, 0.3))"},children:I4}),n.jsx(fs,{layoutId:e,style:{position:"relative",zIndex:10,margin:"0 -8px",width:112,height:112},children:n.jsxs(gs,{style:{background:"var(--ck-graphic-primary-background, var(--ck-body-background))",boxShadow:"var(--ck-graphic-primary-box-shadow, 0px 3px 15px rgba(0, 0, 0, 0.1))"},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:[n.jsx(hs,{}),n.jsx(F.div,{style:{zIndex:2,position:"relative"},children:n.jsx(p0,{})})]},"SlideOneInner")},e),n.jsx(F.div,{initial:{rotate:-90,scale:.2,x:"-100%"},animate:{rotate:0,scale:1,x:0},exit:{rotate:-40,scale:.1,x:"-70%"},style:{zIndex:4,position:"relative",width:76,height:76,background:"var(--ck-graphic-secondary-background, #3897FB)",borderRadius:"50%",boxShadow:"var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(56, 151, 251, 0.3))"},children:n.jsx(u0,{children:n.jsx("div",{style:{position:"relative",left:-2,top:3},children:L4})})})]}),kl=({layoutId:e})=>n.jsxs("div",{style:{position:"relative",left:-14},children:[n.jsx(fs,{layoutId:e,style:{zIndex:10,position:"absolute",left:15,top:12,width:32,height:32},children:n.jsx(gs,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},style:{background:"var(--ck-graphic-primary-background, var(--ck-body-background))",boxShadow:"var(--ck-graphic-primary-box-shadow, 0px 2px 5px rgba(37, 41, 46, 0.16))"},children:n.jsx(u0,{children:n.jsx(p0,{})})},"SlideTwoInner")},e),n.jsxs(F.div,{initial:{scale:.2},animate:{scale:1},exit:{scale:.2},style:{zIndex:7,position:"relative",display:"flex",alignItems:"center",padding:"21px 56px",paddingRight:52,background:"var(--ck-graphic-primary-background, var(--ck-body-background))",boxShadow:"var(--ck-graphic-primary-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.07))",borderRadius:"var(--ck-border-radius, 16px)"},children:[n.jsx(hs,{}),n.jsx("div",{style:{position:"relative",zIndex:2,top:1,left:1},children:F4})]}),n.jsx(F.div,{style:{zIndex:8,position:"absolute",top:-16,right:-28},initial:{rotate:90,x:-70,scale:.4},animate:{rotate:0,x:0,scale:1},exit:{rotate:0,x:-70,scale:.4},children:n.jsx(N4,{id:e})})]}),El=({layoutId:e})=>{const t=Math.random();return n.jsxs(F.div,{style:{position:"relative"},children:[n.jsxs(fs,{layoutId:e,initial:{rotate:80},style:{zIndex:10,position:"relative",width:128,height:128},children:[n.jsx(gs,{initial:{opacity:0,rotate:100},animate:{opacity:1},exit:{opacity:0},style:{overflow:"hidden",background:`var(--ck-graphic-globe-background, radial-gradient(
              82.42% 82.42% at 50% 86.72%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(0, 0, 0, 0) 100%
            ),
            linear-gradient(180deg, #3897FB 0%, #5004F1 100%))`,boxShadow:"var(--ck-graphic-globe-box-shadow, 0px -6px 20px rgba(56, 151, 251, 0.23))"},children:n.jsx(O4,{style:e?void 0:{animationPlayState:"paused"},children:n.jsxs("svg",{width:"128",height:"128",viewBox:"0 0 128 128",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Network rings graphic"}),n.jsxs("g",{children:[n.jsx("circle",{cx:"30",cy:"141",r:"64",stroke:`url(#networkRadialA-${t})`,strokeWidth:"3"}),n.jsx("circle",{cx:"78.8515",cy:"131.123",r:"54.1005",transform:"rotate(-37.4016 78.8515 131.123)",stroke:`url(#networkRadialB-${t})`,strokeWidth:"3"}),n.jsx("circle",{cx:"63.6053",cy:"2.12794",r:"50.8338",transform:"rotate(134.702 63.6053 2.12794)",stroke:`url(#networkRadialC-${t})`,strokeWidth:"3"}),n.jsx("circle",{cx:"126.658",cy:"56.6577",r:"50.3433",transform:"rotate(-105 126.658 56.6577)",stroke:`url(#networkRadialD-${t})`,strokeWidth:"3"}),n.jsx("circle",{cx:"13.6619",cy:"18.9603",r:"46.0247",transform:"rotate(107.362 13.6619 18.9603)",stroke:`url(#networkRadialE-${t})`,strokeWidth:"3"})]}),n.jsxs("defs",{children:[n.jsxs("radialGradient",{id:`networkRadialA-${t}`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(60.5 84) rotate(104.668) scale(77.0097)",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-globe-lines, white)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-graphic-globe-lines, white)",stopOpacity:"0"})]}),n.jsxs("radialGradient",{id:`networkRadialB-${t}`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(96.1805 81.6717) rotate(97.125) scale(64.7443)",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-globe-lines, white)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-graphic-globe-lines, white)",stopOpacity:"0"})]}),n.jsxs("radialGradient",{id:`networkRadialC-${t}`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(96.3816 -36.4455) rotate(114.614) scale(57.7177)",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-globe-lines, white)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-graphic-globe-lines, white)",stopOpacity:"0"})]}),n.jsxs("radialGradient",{id:`networkRadialD-${t}`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(137.86 7.73234) rotate(92.3288) scale(62.743)",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-globe-lines, white)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-graphic-globe-lines, white)",stopOpacity:"0"})]}),n.jsxs("radialGradient",{id:`networkRadialE-${t}`,cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(35.3203 -21.566) rotate(104.513) scale(54.8617)",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-globe-lines, white)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-graphic-globe-lines, white)",stopOpacity:"0"})]})]})]})})},"SlideThreeInner"),n.jsxs(F.div,{exit:{opacity:0},children:[n.jsx(F.div,{initial:e?void 0:{scale:1.1},animate:e?yl:void 0,transition:{...Cl},style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:"0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))"}},"pulseA"),n.jsx(F.div,{initial:e?void 0:{scale:1.2,opacity:.25},animate:e?yl:void 0,transition:{...Cl,delay:.5},style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:"0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))"}},"pulseB")]})]},e),n.jsxs(F.div,{initial:{rotate:-20,scale:.1,y:-10,x:-10},animate:{rotate:0,scale:1,y:0,x:0},exit:{zIndex:3,scale:.2,y:-25,x:15},style:{zIndex:12,borderRadius:"50%",position:"absolute",bottom:-4,right:-4,width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",padding:13,background:"var(--ck-graphic-compass-background, var(--ck-body-background))",boxShadow:"var(--ck-graphic-compass-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.15))"},children:[n.jsx(hs,{}),n.jsx(F.div,{style:{zIndex:2,position:"absolute"},initial:{rotate:-170},animate:{rotate:0},exit:{rotate:-180,transition:{duration:0}},transition:{type:"spring",stiffness:6,damping:.9,mass:.2},children:n.jsx(R4,{})})]})]},"SlideThree")},Lo=208,M4=E.div`
  pointer-events: none;
  user-select: none;
  height: ${Lo}px;
  padding: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    display: none;
  }
`,Qr=E(F.div)``,P4=E.div`
  pointer-events: none;
  user-select: none;
  height: ${Lo}px;
  padding: 0 0 12px;
  display: none;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    display: flex;
  }
`,h0=E.div`
  position: relative;
`,f0=E(F.div)`
  scroll-snap-type: x mandatory;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 4px 8px;
  /* will-change: transform, opacity; */
  transition: 400ms 50ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-property: transform, opacity;
  ${e=>!e.$active&&pe`
      pointer-events: none;
      position: absolute;
      opacity: 0;
      transform: scale(0.95);
      transition-duration: 300ms;
      transition-delay: 0ms;
    `}
`,D4=E.div`
  --background: var(--ck-body-background-secondary);
  --background-transparent: var(--ck-body-background-transparent, transparent);
  position: relative;
  padding: 0 0 4px;
  border-radius: 16px;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    margin: 0 -24px;
    ${h0} {
      position: relative;
      z-index: 3;
      display: flex;
      overflow: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      margin-top: -${Lo}px;
      padding-top: ${Lo}px;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }
    }
    ${f0} {
      position: relative;
      opacity: 1;
      transform: none;
      flex-shrink: 0;
      scroll-snap-align: start;
    }
  }
`,$4=E.div`
  position: relative;
  top: -1px;
  display: flex;
  justify-content: center;
  pointer-events: auto;
`,B4=E.button`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 2px;
  background: none;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    padding: 4px;
    &:before {
      transform: none !important;
    }
  }
  &:before {
    content: '';
    display: block;
    width: 16px;
    height: 3px;
    opacity: 0.12;
    border-radius: 4px;
    background: var(--ck-accent-color, var(--ck-body-color));
    transition: transform 200ms ease, opacity 180ms ease;
  }
  ${e=>e.$active?pe`
          cursor: default;
          &:before {
            opacity: 1;
          }
        `:!e.disabled&&pe`
          cursor: pointer;
          &:hover:before {
            transform: scaleY(3.5);
          }
          &:active:before {
          }
        `}
`,W4=()=>{var e;const t=bt({}),r=U(),o=(e=r.uiConfig.ethereumOnboardingUrl)!==null&&e!==void 0?e:t.aboutScreen_ctaUrl,[i,a]=v.useState(!0),[c,s]=v.useState(0),l=v.useRef(!1),d=v.useRef(0),u=[.16,1,.3,1],p=600;let h;v.useEffect(()=>()=>clearInterval(h),[]);const f=()=>{if(k.current){const{overflow:A}=getComputedStyle(k.current);return A!=="visible"}return!1},g=A=>{a(!1),f()?m(A):s(A)},m=A=>{if(k.current){const{offsetWidth:_}=k.current;k.current.scrollLeft=_*A,setTimeout(()=>s(A),100)}},b=()=>{if(!k.current)return;const{offsetWidth:A,scrollLeft:_}=k.current,P=d.current;d.current=_;const D=4;if(P-_>-D&&P-_<D){const $=Math.round(_/A);s($)}},y=()=>{C()},w=()=>{const{offsetWidth:A,scrollLeft:_}=k.current,P=Math.round(_/A);s(P)},C=()=>{l.current=!0,clearTimeout(h)},k=v.useRef(null);v.useEffect(()=>{if(k.current)return k.current.addEventListener("scroll",b),k.current.addEventListener("touchmove",y),k.current.addEventListener("touchend",w),()=>{k.current&&(k.current.removeEventListener("scroll",b),k.current.removeEventListener("touchmove",y),k.current.removeEventListener("touchend",w))}},[k]);const x=[n.jsx(wl,{layoutId:"graphicCircle",duration:p,ease:u},"slide-one"),n.jsx(kl,{layoutId:"graphicCircle",duration:p,ease:u},"slide-two"),n.jsx(El,{layoutId:"graphicCircle",duration:p,ease:u},"slide-three")],S=[n.jsx(wl,{duration:p,ease:u},"mobile-slide-one"),n.jsx(kl,{duration:p,ease:u},"mobile-slide-two"),n.jsx(El,{duration:p,ease:u},"mobile-slide-three")],O=(()=>{switch(r.uiConfig.language){case"en-US":case"zh-CN":return 64;default:return 84}})(),j=[{key:"slide-a",content:n.jsxs(n.Fragment,{children:[n.jsx(Me,{style:{height:24},$small:!0,children:n.jsx(Pe,{children:t.aboutScreen_a_h1})}),n.jsx(X,{style:{height:O},children:n.jsx(Pe,{children:t.aboutScreen_a_p})})]})},{key:"slide-b",content:n.jsxs(n.Fragment,{children:[n.jsx(Me,{style:{height:24},$small:!0,children:n.jsx(Pe,{children:t.aboutScreen_b_h1})}),n.jsx(X,{style:{height:O},children:n.jsx(Pe,{children:t.aboutScreen_b_p})})]})},{key:"slide-c",content:n.jsxs(n.Fragment,{children:[n.jsx(Me,{style:{height:24},$small:!0,children:n.jsx(Pe,{children:t.aboutScreen_c_h1})}),n.jsx(X,{style:{height:O},children:n.jsx(Pe,{children:t.aboutScreen_c_p})})]})}];return n.jsxs(Q,{children:[n.jsxs(D4,{children:[n.jsx(M4,{children:n.jsx(Hc,{transition:{duration:p/1e3,ease:u},children:n.jsxs(Ve,{initial:!1,onExitComplete:()=>a(!0),children:[c===0&&n.jsx(Qr,{style:{position:"absolute"},children:x[0]},"graphic-0"),c===1&&n.jsx(Qr,{style:{position:"absolute"},children:x[1]},"graphic-1"),c===2&&n.jsx(Qr,{style:{position:"absolute"},children:x[2]},"graphic-2")]})})}),n.jsx(h0,{ref:k,children:n.jsx(Ve,{children:j.map((A,_)=>n.jsxs(f0,{$active:c===_,children:[n.jsx(P4,{children:n.jsx(Hc,{transition:{duration:0},children:n.jsx(Qr,{children:S[_]})})}),n.jsx(Te,{style:{gap:8,paddingBottom:0},children:A.content})]},A.key))})})]}),n.jsx(S4,{children:n.jsx($4,{children:j.map((A,_)=>n.jsx(B4,{$active:c===_,onClick:()=>{C(),g(_)}},A.key))})}),n.jsx(te,{href:o,arrow:!0,children:t.aboutScreen_ctaText})]})},Ce="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains",g0={ETH:`${Ce}/ethereum/info/logo.png`,BNB:`${Ce}/smartchain/info/logo.png`,TBNB:`${Ce}/smartchain/info/logo.png`,MATIC:`${Ce}/polygon/info/logo.png`,POL:`${Ce}/polygon/info/logo.png`,AVAX:`${Ce}/avalanchec/info/logo.png`,FTM:`${Ce}/fantom/info/logo.png`,CELO:`${Ce}/celo/info/logo.png`,FIL:`${Ce}/filecoin/info/logo.png`,METIS:`${Ce}/metis/info/logo.png`,IOTX:`${Ce}/iotex/info/logo.png`,EVMOS:`${Ce}/evmos/info/logo.png`,XDAI:`${Ce}/xdai/info/logo.png`,FLR:`${Ce}/flare/info/logo.png`,TLOS:`${Ce}/telos/info/logo.png`,USDC:`${Ce}/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png`,USDT:`${Ce}/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png`,DAI:`${Ce}/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png`,WETH:`${Ce}/ethereum/assets/0xC02aaA39b223FE8D0A0e5c4F27eAD9083C756Cc2/logo.png`,WBTC:`${Ce}/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png`,LINK:`${Ce}/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png`,UNI:`${Ce}/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png`,AAVE:`${Ce}/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png`,MKR:`${Ce}/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png`,CRV:`${Ce}/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png`,LDO:`${Ce}/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png`,SHIB:`${Ce}/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png`,ARB:`${Ce}/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png`,OP:`${Ce}/optimism/assets/0x4200000000000000000000000000000000000042/logo.png`,STETH:`${Ce}/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png`,CBETH:`${Ce}/ethereum/assets/0xBe9895146f7AF43049ca1c1AE358B0541Ea49704/logo.png`,RETH:`${Ce}/ethereum/assets/0xae78736Cd615f374D3085123A210448E74Fc6393/logo.png`,GRT:`${Ce}/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png`,SNX:`${Ce}/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png`,COMP:`${Ce}/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png`,PEPE:`${Ce}/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png`,SUSHI:`${Ce}/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png`,DYDX:`${Ce}/ethereum/assets/0x92D6C1e31e14520e676a687F0a93788B716BEff5/logo.png`,BEAM:`${Ce}/ethereum/assets/0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE/logo.png`,EUL:`${Ce}/ethereum/assets/0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b/logo.png`};function v0(e){let t=0;for(let o=0;o<e.length;o++)t=e.charCodeAt(o)+((t<<5)-t);return`hsl(${(t%360+360)%360}, 55%, 50%)`}const lo=E(Q)`
  min-height: 320px;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
`,m0=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
  flex: 1;
`,V4=E.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }
`,U4=E.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
`,Io=E.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  text-align: right;
`,x0=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`,No=E.span`
  font-size: 13px;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,b0=E.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`,z4=E.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`,H4=E.div`
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`,G4=E.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${e=>e.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  user-select: none;
`,q4=E.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`,Z4=E.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ck-body-background);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 0.7px var(--ck-body-background);
`,Fo=E.div`
  margin-top: 28px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: center;
`,K4=E.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  color: var(--ck-body-color-muted, rgba(255, 255, 255, 0.4));
  padding: 0 0 8px;
  cursor: pointer;
  transition: color 0.15s ease;
  svg { opacity: 0.6; }
  &:hover {
    color: var(--ck-body-color, #fff);
    svg { opacity: 1; }
  }
`,Sl=E.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`,Y4=E.div`
  &:not(:first-child) {
    margin-top: 16px;
  }
`,X4=E.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color, #fff);
  margin-bottom: 8px;
`,Q4=E.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--ck-body-background-secondary, rgba(255, 255, 255, 0.06));
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted, rgba(255, 255, 255, 0.6));
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`,J4=E.span`
  color: var(--ck-body-color, #fff);
  font-weight: 600;
`;function hr(e){const r=e.replace(/,/g,".").trim();if(r===""||r===".")return r;const o=r.match(/^([0-9]*)(\.?)([0-9]*)$/);return o?o[1]+o[2]+o[3]:""}const Dn=e=>{const t=e.trim();if(!t||t===".")return null;let r=t;return r.startsWith(".")&&(r=`0${r}`),r.endsWith(".")&&(r=r.slice(0,-1)),r||null},vs=(e,t)=>{if(e===void 0)return"--";const r=vn(e,t),[o,i]=r.split(".");if(!i)return o;const a=i.replace(/0+$/,"");return a?`${o}.${a.slice(0,6)}`:o},ev=(e,t,r)=>{const o=vs(e,t);return o==="--"?"--":`${o} ${r}`},Dr=(e,t)=>e.type!==t.type?!1:e.type==="native"?!0:e.type==="erc20"&&t.type==="erc20"?e.address.toLowerCase()===t.address.toLowerCase():!1,Ke=e=>{var t;return((t=e.metadata)===null||t===void 0?void 0:t.symbol)||(e.type==="native"?"ETH":"UNKNOWN")},_r=e=>{var t,r;return(r=(t=e.metadata)===null||t===void 0?void 0:t.decimals)!==null&&r!==void 0?r:18},ya=BigInt(0),jl=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}),tv=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:4});function nv(e){var t;const r=Ke(e).toUpperCase();return(t=g0[r])!==null&&t!==void 0?t:null}function rv({token:e}){const[t,r]=v.useState(!1),o=Ke(e),i=nv(e);return n.jsxs(H4,{children:[i&&!t?n.jsx(q4,{src:i,alt:o,onError:()=>r(!0)}):n.jsx(G4,{$bg:v0(o),children:o.charAt(0).toUpperCase()}),n.jsx(Z4,{children:n.jsx(Ao,{id:e.chainId,unsupported:!1,size:14})})]})}function ov(e){var t,r,o,i;const a=e.type==="erc20"?`${e.chainId}-${e.address}`:`${e.chainId}-native`,c=Ke(e),s=((t=e.metadata)===null||t===void 0?void 0:t.name)||c||"Unknown Token",l=_r(e),d=(o=(r=e.metadata)===null||r===void 0?void 0:r.fiat)===null||o===void 0?void 0:o.value;let u=null,p="",h=null;const f=e.balance!==void 0;if(f&&((i=e.balance)!==null&&i!==void 0?i:ya)<=ya)return null;if(f&&e.balance!==void 0){const m=parseFloat(vn(e.balance,l));if(Number.isFinite(m)&&(p=`${m.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:4})} ${c}`,d!==void 0)){const b=m*d;b>=.01?u=jl.format(b):b>0?u="<$0.01":u=jl.format(0),h=`@${tv.format(d)}`}}return n.jsxs(U4,{children:[n.jsxs(z4,{children:[n.jsx(rv,{token:e}),n.jsxs(Io,{style:{textAlign:"left"},children:[n.jsx(x0,{children:s}),n.jsx(No,{children:p||"Loading..."})]})]}),n.jsxs(Io,{children:[u?n.jsx(b0,{children:u}):null,h?n.jsx(No,{style:{textAlign:"end"},children:h}):null]})]},a)}const Jr=16;function iv({symbol:e}){var t;const[r,o]=v.useState(!1),i=(t=g0[e.toUpperCase()])!==null&&t!==void 0?t:null;return!i||r?n.jsx("span",{style:{width:Jr,height:Jr,borderRadius:"50%",background:v0(e),display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",flexShrink:0},children:e.charAt(0).toUpperCase()}):n.jsx("img",{src:i,alt:e,onError:()=>o(!0),style:{width:Jr,height:Jr,borderRadius:"50%",objectFit:"cover",flexShrink:0}})}const av=()=>{var e;const{data:t,multiChain:r,isLoading:o}=Gt({multiChain:!0}),{triggerResize:i,chains:a}=U(),[c,s]=v.useState(!1);v.useEffect(()=>{o||i()},[o]),v.useEffect(()=>{i()},[c]);const l=(e=r?t:null)!==null&&e!==void 0?e:[],d=l.some(h=>h.balance>ya),u=v.useMemo(()=>{const h=new Map;for(const f of a)h.set(f.id,f.name);return h},[a]),p=v.useMemo(()=>{var h;const f=new Map;for(const g of l)f.has(g.chainId)||f.set(g.chainId,[]),f.get(g.chainId).push({symbol:Ke(g),name:((h=g.metadata)===null||h===void 0?void 0:h.name)||Ke(g)});return f},[l]);return o?n.jsxs(lo,{children:[n.jsx(we,{children:"Your assets"}),n.jsx(Fo,{children:"Loading balances..."})]}):c?n.jsxs(lo,{onBack:()=>{s(!1)},children:[n.jsx(we,{children:"Configured assets"}),n.jsx(F.div,{initial:{opacity:0,scale:1.1},animate:{opacity:1,scale:1},transition:{duration:.2,ease:[.26,.08,.25,1]},style:{display:"flex",flexDirection:"column",flex:1,minHeight:0},children:n.jsx(Sl,{style:{overflowY:"auto",maxHeight:400},children:Array.from(p.entries()).map(([h,f])=>n.jsxs(Y4,{children:[n.jsxs(X4,{children:[n.jsx(Ao,{id:h,unsupported:!1,size:18}),u.get(h)||`Chain ${h}`]}),f.map(g=>n.jsxs(Q4,{children:[n.jsx(iv,{symbol:g.symbol}),n.jsx(J4,{children:g.symbol}),g.name!==g.symbol&&g.name]},`${h}-${g.symbol}`))]},h))})})]},"details"):n.jsxs(lo,{children:[n.jsx(we,{children:"Your assets"}),n.jsxs(Sl,{children:[n.jsxs(K4,{type:"button",onClick:()=>s(!0),children:[n.jsxs("svg",{role:"img","aria-label":"Info",width:"12",height:"12",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("circle",{cx:"7",cy:"7",r:"6",stroke:"currentColor",strokeWidth:"1.25"}),n.jsx("path",{d:"M7 6.25V10",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round"}),n.jsx("circle",{cx:"7",cy:"4.25",r:"0.75",fill:"currentColor"})]}),"Only configured chains and tokens are shown"]}),n.jsx(m0,{children:d?l.map(ov):n.jsx(Fo,{children:"No assets found"})})]})]},"assets")},Ca=E.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 12px;
`,_l=E.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ck-body-color-muted);
`,sv=E.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
`,cv=E.span`
  font-size: 28px;
  font-weight: 600;
  color: var(--ck-body-color-muted);
  line-height: 1;
`,lv=E.input`
  flex: 1;
  border: none;
  background: transparent;
  color: var(--ck-body-color);
  font-size: 44px;
  font-weight: 600;
  line-height: 1;
  padding: 0;
  outline: none;
  width: 100%;

  &::placeholder {
    color: var(--ck-body-color-muted);
  }
`,dv=E.div`
  display: flex;
  gap: 10px;
  width: 100%;
`,uv=E.button`
  flex: 1;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  background: ${({$active:e})=>e?"var(--ck-accent-color)":"var(--ck-secondary-button-background)"};
  color: ${({$active:e})=>e?"var(--ck-accent-text-color)":"var(--ck-body-color)"};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({$active:e})=>e?"var(--ck-accent-color)":"var(--ck-secondary-button-hover-background)"};
  }
`,pv=E.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  text-align: left;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }
`,hv=E.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`,fv=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,gv=E.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,vv=E.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ck-body-color-muted);
`,Ar=E.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;

  > button {
    flex: 1;
  }

  ${on} {
    margin: 0;
  }
`,Al=E.div`
  display: flex;
  gap: 12px;

  > button {
    flex: 1;
  }
`,mv=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`,xv=E.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid ${({$active:e})=>e?"var(--ck-focus-color)":"var(--ck-body-divider)"};
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease, opacity 150ms ease;
  text-align: left;

  &:hover:not(:disabled) {
    background: var(--ck-secondary-button-hover-background);
    border-color: ${({$active:e})=>e?"var(--ck-focus-color)":"var(--ck-body-color-muted)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,bv=E.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`,yv=E.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Cv=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`,wv=E.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--ck-secondary-button-hover-background);
  color: var(--ck-body-color-muted);
`,kv=E.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Ev=E.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  white-space: nowrap;
`,Sv=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`,jv=E.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
`,Tl=E.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 32px;
  height: 120px;
`,_v=[10,20,50],y0=()=>{var e;const{buyForm:t,setBuyForm:r,setRoute:o,triggerResize:i}=U(),a=bt(),{data:c}=Gt(),[s,l]=v.useState(null),d=v.useMemo(()=>{const A=Dn(hr(t.amount));if(!A)return null;const _=Number(A);return Number.isFinite(_)?_:null},[t.amount]);v.useEffect(()=>{i()},[i]);const u=v.useMemo(()=>c?.find(A=>Dr(A,t.asset)),[c,t.asset]),p=u??c?.[0],h=p??t.asset,f=Ke(h),g=((e=h.metadata)===null||e===void 0?void 0:e.name)||f,m=v.useMemo(()=>Da(t.currency),[t.currency]),b=v.useMemo(()=>_1(t.currency),[t.currency]),y=A=>{const _=hr(A.target.value);(_===""||/^[0-9]*\.?[0-9]*$/.test(_))&&(l(null),r(P=>({...P,amount:_})))},w=()=>{const A=Dn(hr(t.amount));if(A){const _=Number(A);Number.isFinite(_)&&_>0&&r(P=>({...P,amount:_.toFixed(2)}))}},C=A=>{l(A),r(_=>({..._,amount:A.toFixed(2)}))},k=()=>{o(L.BUY_TOKEN_SELECT)},x=()=>{d===null||d<=0||o(L.BUY_SELECT_PROVIDER)},S=()=>{o(L.CONNECTED)},O=A=>s===A,j=d===null||d<=0;return n.jsxs(Q,{onBack:S,children:[n.jsx(we,{children:a.buyScreen_heading}),n.jsx(X,{children:a.buyScreen_subheading}),n.jsxs(Ca,{children:[n.jsx(_l,{children:"Amount"}),n.jsxs(sv,{children:[n.jsx(cv,{children:b}),n.jsx(lv,{value:t.amount,onChange:y,onBlur:w,placeholder:"0.00",inputMode:"decimal",autoComplete:"off"})]}),n.jsx(dv,{children:_v.map(A=>n.jsx(uv,{type:"button",onClick:()=>C(A),$active:O(A),children:m.format(A)},A))})]}),n.jsxs(Ca,{children:[n.jsx(_l,{children:"Asset"}),n.jsxs(pv,{type:"button",onClick:k,children:[n.jsxs(hv,{children:[n.jsx(fv,{children:f}),n.jsx(gv,{children:g})]}),n.jsx(vv,{children:n.jsx(Vt,{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx(rn,{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"2",strokeLinecap:"round"})})})]})]}),n.jsx(Ar,{children:n.jsx(te,{variant:"primary",onClick:x,disabled:j,children:"Continue"})})]})},Av=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M9 5H19V15",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),ms=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{d:"M19 5L5 19",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M15 19H5V9",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),Jn=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("rect",{x:"3",y:"6",width:"18",height:"12",rx:"2",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M3 10H21",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M7 14H9",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),Ol=e=>n.jsxs("svg",{width:"800px",height:"800px",viewBox:"0 0 24 24",role:"img",xmlns:"http://www.w3.org/2000/svg","aria-labelledby":"dolarIconTitle",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",fill:"none",color:"currentColor",...e,children:[n.jsx("title",{id:"dolarIconTitle",children:"Dolar"}),n.jsx("path",{d:"M12 4L12 6M12 18L12 20M15.5 8C15.1666667 6.66666667 14 6 12 6 9 6 8.5 7.95652174 8.5 9 8.5 13.140327 15.5 10.9649412 15.5 15 15.5 16.0434783 15 18 12 18 10 18 8.83333333 17.3333333 8.5 16"})]}),Tv=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("rect",{x:"3",y:"6",width:"18",height:"14",rx:"2.5",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M21 10H17C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14H21V10Z",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("circle",{cx:"17",cy:"12",r:"1",fill:"currentColor"})]}),Ov=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{left:0,top:0},...e,children:[n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M4 4C2.89543 4 2 4.89543 2 6V12C2 13.1046 2.89543 14 4 14H10C11.1046 14 12 13.1046 12 12V9.66667C12 9.11438 12.4477 8.66667 13 8.66667C13.5523 8.66667 14 9.11438 14 9.66667V12C14 14.2091 12.2091 16 10 16H4C1.79086 16 0 14.2091 0 12V6C0 3.79086 1.79086 2 4 2H6.33333C6.88562 2 7.33333 2.44772 7.33333 3C7.33333 3.55228 6.88562 4 6.33333 4H4Z",fill:"currentColor",fillOpacity:.3}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M9.5 1C9.5 0.447715 9.94772 0 10.5 0H15C15.5523 0 16 0.447715 16 1V5.5C16 6.05228 15.5523 6.5 15 6.5C14.4477 6.5 14 6.05228 14 5.5V3.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L12.5858 2H10.5C9.94772 2 9.5 1.55228 9.5 1Z",fill:"currentColor",fillOpacity:.3})]}),Rv=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"19",height:"18",viewBox:"0 0 19 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.81753 1.60122C7.39283 0.530035 8.46953 0 9.50409 0C10.5507 0 11.6022 0.539558 12.1805 1.59767L18.6047 13.3334C18.882 13.8283 19 14.3568 19 14.8622C19 16.5296 17.7949 18 15.9149 18H3.08514C1.20508 18 0 16.5296 0 14.8622C0 14.3454 0.131445 13.8172 0.405555 13.3379L6.81753 1.60122ZM9.50409 2C9.13355 2 8.77256 2.18675 8.57866 2.54907L8.57458 2.5567L2.14992 14.3166L2.144 14.3268C2.04638 14.4959 2 14.6817 2 14.8622C2 15.5497 2.43032 16 3.08514 16H15.9149C16.5697 16 17 15.5497 17 14.8622C17 14.6681 16.9554 14.4805 16.8588 14.309L16.8529 14.2986L10.4259 2.55741C10.2191 2.1792 9.86395 2 9.50409 2Z",fill:"currentColor"}),n.jsx("path",{d:"M9.5 11.2297C9.01639 11.2297 8.7459 10.9419 8.72951 10.4186L8.60656 6.4157C8.59016 5.88372 8.95902 5.5 9.4918 5.5C10.0164 5.5 10.4016 5.89244 10.3852 6.42442L10.2623 10.4099C10.2377 10.9419 9.96721 11.2297 9.5 11.2297ZM9.5 14.5C8.95082 14.5 8.5 14.0901 8.5 13.5058C8.5 12.9215 8.95082 12.5116 9.5 12.5116C10.0492 12.5116 10.5 12.9128 10.5 13.5058C10.5 14.0988 10.041 14.5 9.5 14.5Z",fill:"currentColor"})]}),Lv=({...e})=>n.jsx("svg",{"aria-hidden":"true",width:"15",height:"14",viewBox:"0 0 15 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{left:0,top:0},...e,children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H6C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H6C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0H4ZM11.7071 3.29289C11.3166 2.90237 10.6834 2.90237 10.2929 3.29289C9.90237 3.68342 9.90237 4.31658 10.2929 4.70711L11.5858 6H9.5H6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8H9.5H11.5858L10.2929 9.29289C9.90237 9.68342 9.90237 10.3166 10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071L14.7071 7.70711C15.0976 7.31658 15.0976 6.68342 14.7071 6.29289L11.7071 3.29289Z",fill:"currentColor",fillOpacity:"0.4"})}),$n=({...e})=>n.jsx("svg",{"aria-hidden":"true",width:"18",height:"18",viewBox:"0 0 18 18",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM13.274 7.13324C13.6237 6.70579 13.5607 6.07577 13.1332 5.72604C12.7058 5.37632 12.0758 5.43932 11.726 5.86676L7.92576 10.5115L6.20711 8.79289C5.81658 8.40237 5.18342 8.40237 4.79289 8.79289C4.40237 9.18342 4.40237 9.81658 4.79289 10.2071L7.29289 12.7071C7.49267 12.9069 7.76764 13.0128 8.04981 12.9988C8.33199 12.9847 8.59505 12.8519 8.77396 12.6332L13.274 7.13324Z",fill:"currentColor"})}),C0=({...e})=>n.jsx("svg",{"aria-hidden":"true",width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM24.5001 8.74263C25.0834 8.74263 25.5563 9.21551 25.5563 9.79883V14.5997C25.5563 15.183 25.0834 15.6559 24.5001 15.6559H19.6992C19.1159 15.6559 18.643 15.183 18.643 14.5997C18.643 14.0164 19.1159 13.5435 19.6992 13.5435H21.8378L20.071 11.8798C20.0632 11.8724 20.0555 11.865 20.048 11.8574C19.1061 10.915 17.8835 10.3042 16.5643 10.1171C15.2452 9.92999 13.9009 10.1767 12.7341 10.82C11.5674 11.4634 10.6413 12.4685 10.0955 13.684C9.54968 14.8994 9.41368 16.2593 9.70801 17.5588C10.0023 18.8583 10.711 20.0269 11.7273 20.8885C12.7436 21.7502 14.0124 22.2582 15.3425 22.336C16.6726 22.4138 17.9919 22.0572 19.1017 21.3199C19.5088 21.0495 19.8795 20.7333 20.2078 20.3793C20.6043 19.9515 21.2726 19.9262 21.7004 20.3228C22.1282 20.7194 22.1534 21.3876 21.7569 21.8154C21.3158 22.2912 20.8176 22.7161 20.2706 23.0795C18.7793 24.0702 17.0064 24.5493 15.2191 24.4448C13.4318 24.3402 11.7268 23.6576 10.3612 22.4998C8.9956 21.3419 8.0433 19.7716 7.6478 18.0254C7.2523 16.2793 7.43504 14.4519 8.16848 12.8186C8.90192 11.1854 10.1463 9.83471 11.7142 8.97021C13.282 8.10572 15.0884 7.77421 16.861 8.02565C18.6282 8.27631 20.2664 9.09278 21.5304 10.3525L23.4439 12.1544V9.79883C23.4439 9.21551 23.9168 8.74263 24.5001 8.74263Z",fill:"currentColor"})}),Iv=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{d:"M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5",stroke:"var(--ck-body-color-muted)",strokeWidth:"2"}),n.jsx("rect",{x:"10",y:"10",width:"9",height:"9",rx:"2",stroke:"var(--ck-body-color-muted)",strokeWidth:"2"}),n.jsx("path",{d:"M1 3L3 5L7 1",stroke:"var(--ck-body-color)",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),kt=({...e})=>n.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 256 256",width:"256",height:"256",children:[n.jsx("rect",{width:"256",height:"256",fill:"none"}),n.jsx("path",{d:"M32,96V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V96L128,32Z",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"16"}),n.jsx("polyline",{points:"224 96 145.46 152 110.55 152 32 96",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"16"})]}),Hn=({...e})=>n.jsx("svg",{id:"Layer_1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",viewBox:"0 0 32 32",enableBackground:"new 0 0 32 32",xmlSpace:"preserve",...e,children:n.jsx("path",{fill:"none",stroke:"currentColor",strokeWidth:2,strokeMiterlimit:10,d:"M13.6,8.5L9.5,4.3C9,3.9,8.3,3.9,7.8,4.3L4.7,7.5 C4,8.1,3.8,9.1,4.1,9.9c0.8,2.3,2.9,6.9,7,11s8.7,6.1,11,7c0.9,0.3,1.8,0.1,2.5-0.5l3.1-3.1c0.5-0.5,0.5-1.2,0-1.7l-4.1-4.1 c-0.5-0.5-1.2-0.5-1.7,0l-2.5,2.5c0,0-2.8-1.2-5-3.3s-3.3-5-3.3-5l2.5-2.5C14.1,9.7,14.1,8.9,13.6,8.5z"})}),w0=({...e})=>n.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 256 256",width:"256",height:"256",children:[n.jsx("rect",{width:"256",height:"256",fill:"none"}),n.jsx("circle",{cx:"128",cy:"96",r:"64",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"16"}),n.jsx("path",{d:"M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"16"})]}),Nv=({...e})=>n.jsxs("svg",{width:"800",height:"800",fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{d:"m15.001 12c0 1.6569-1.3431 3-3 3-1.6568 0-3-1.3431-3-3s1.3432-3 3-3c1.6569 0 3 1.3431 3 3z",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2}),n.jsx("path",{d:"m12.001 5c-4.4777 0-8.2679 2.9429-9.5422 7 1.2743 4.0571 5.0646 7 9.5422 7 4.4776 0 8.2679-2.9429 9.5422-7-1.2743-4.0571-5.0646-7-9.5422-7z",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2})]}),Fv=({...e})=>n.jsx("svg",{width:"800",height:"800",fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{d:"m2.999 3 18 18m-11.156-11.086c-0.52264 0.53996-0.84428 1.2756-0.84428 2.0864 0 1.6569 1.3432 3 3 3 0.8225 0 1.5677-0.331 2.1096-0.867m-7.6096-7.4858c-1.8993 1.2532-3.346 3.1368-4.042 5.3528 1.2742 4.0571 5.0646 7 9.5422 7 1.9889 0 3.8422-0.5806 5.3996-1.5816m-6.3998-12.369c0.329-0.03266 0.6627-0.04939 1.0002-0.04939 4.4777 0 8.268 2.9429 9.5422 7-0.2807 0.894-0.6837 1.7338-1.1892 2.5",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2})}),mt=({...e})=>n.jsx("svg",{transform:"matrix(1 0 0 1 0 0)",width:"24",height:"24",fill:"none",stroke:"#000000",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{d:"M15 15a6 6 0 1 0-5.743-4.257L9 11l-5.707 5.707a1 1 0 0 0-.293.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1 1 1 0 0 1 1-1 1 1 0 0 0 1-1 1 1 0 0 1 1-1h.586a1 1 0 0 0 .707-.293L13 15l.257-.257A5.999 5.999 0 0 0 15 15zm2-6a2 2 0 0 0-2-2",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.152})}),fn=({...e})=>n.jsxs("svg",{fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("path",{d:"m9 16c0 0.5523-0.44772 1-1 1s-1-0.4477-1-1 0.44772-1 1-1 1 0.4477 1 1z",fill:"currentColor"}),n.jsx("path",{d:"m13 16c0 0.5523-0.4477 1-1 1s-1-0.4477-1-1 0.4477-1 1-1 1 0.4477 1 1z",fill:"currentColor"}),n.jsx("path",{d:"m17 16c0 0.5523-0.4477 1-1 1s-1-0.4477-1-1 0.4477-1 1-1 1 0.4477 1 1z",fill:"currentColor"}),n.jsx("path",{d:"m6 10v-2c0-0.34071 0.0284-0.67479 0.08296-1m11.917 3v-2c0-3.3137-2.6863-6-6-6-1.792 0-3.4006 0.78563-4.5 2.0313",stroke:"currentColor",strokeLinecap:"round",strokeWidth:1.152}),n.jsx("path",{d:"m11 22h-3c-2.8284 0-4.2426 0-5.1213-0.8787s-0.87868-2.2929-0.87868-5.1213 0-4.2426 0.87868-5.1213 2.2929-0.8787 5.1213-0.8787h8c2.8284 0 4.2426 0 5.1213 0.8787s0.8787 2.2929 0.8787 5.1213 0 4.2426-0.8787 5.1213-2.2929 0.8787-5.1213 0.8787h-1",stroke:"currentColor",strokeLinecap:"round",strokeWidth:1.152})]}),k0=({...e})=>n.jsx("svg",{fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...e,children:n.jsx("path",{d:"m9 12 2 2 4-4m5 2c0 4.4611-5.46 7.6937-7.3586 8.683-0.2053 0.107-0.308 0.1605-0.4504 0.1882-0.111 0.0216-0.271 0.0216-0.382 0-0.1424-0.0277-0.2451-0.0812-0.4504-0.1882-1.8986-0.9893-7.3586-4.2219-7.3586-8.683v-3.7824c0-0.79951 0-1.1993 0.13076-1.5429 0.11551-0.30357 0.30322-0.57443 0.5469-0.78918 0.27584-0.24309 0.65014-0.38345 1.3987-0.66418l5.3618-2.0107c0.2079-0.07796 0.3118-0.11694 0.4188-0.1324 0.0948-0.0137 0.1912-0.0137 0.286 0 0.107 0.01546 0.2109 0.05444 0.4188 0.1324l5.3618 2.0107c0.7486 0.28073 1.1229 0.42109 1.3987 0.66418 0.2437 0.21475 0.4314 0.48561 0.5469 0.78918 0.1308 0.34363 0.1308 0.74338 0.1308 1.5429v3.7824z",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.2})}),Gn=({...e})=>n.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 256 256",...e,children:[n.jsx("rect",{width:256,height:256,fill:"none"}),n.jsx("path",{d:"M50.69,184.92A127.52,127.52,0,0,0,64,128a63.85,63.85,0,0,1,24-50",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M128,128a191.11,191.11,0,0,1-24,93",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M96,128a32,32,0,0,1,64,0,223.12,223.12,0,0,1-21.28,95.41",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M218.56,184A289.45,289.45,0,0,0,224,128a96,96,0,0,0-192,0,95.8,95.8,0,0,1-5.47,32",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M92.81,160a158.92,158.92,0,0,1-18.12,47.84",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M120,64.5a66,66,0,0,1,8-.49,64,64,0,0,1,64,64,259.86,259.86,0,0,1-2,32",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10}),n.jsx("path",{d:"M183.94,192q-2.28,8.88-5.18,17.5",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:10})]}),Mv=({...e})=>n.jsx("svg",{fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"m4 12h16m-8-8v16",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2"})}),E0=({...e})=>n.jsxs("svg",{"aria-hidden":"true",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[n.jsx("circle",{cx:"12",cy:"8",r:"4",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("path",{d:"M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),Rl="https://explorer.solana.com",Pv={[Wi.id]:Wi,[$s.id]:$s,[Ds.id]:Ds,[Vs.id]:Vs,[Ps.id]:Ps,[Ws.id]:Ws,[ho.id]:ho,[Ms.id]:Ms,[Fs.id]:Fs,[Ns.id]:Ns,[Is.id]:Is,[Ls.id]:Ls};function Ai(e,t,r){let o=e;return t.address?o=`${e}/address/${t.address}`:t.txHash&&(o=`${e}/tx/${t.txHash}`),r?`${o}?${r}`:o}const Dv={[ne.EVM]:e=>{var t;if(!e.chainId)return Z.warn("No chain ID provided. Configure explorerUrls in OpenfortProvider for better reliability and rate limits."),ho.blockExplorers.default.url;const r=Pv[e.chainId],o=(t=r?.blockExplorers)===null||t===void 0?void 0:t.default.url;return o?Ai(o,e):(Z.warn(`No explorer URL found for chain ${e.chainId}. Configure explorerUrls in OpenfortProvider for better reliability and rate limits.`),ho.blockExplorers.default.url)},[ne.SVM]:e=>{if(!e.cluster)return Z.warn("No cluster provided. Configure explorerUrls in OpenfortProvider for better reliability and rate limits."),Ai(Rl,e);const t=e.cluster==="mainnet-beta"?void 0:`cluster=${encodeURIComponent(e.cluster)}`;return Ai(Rl,e,t)}};function S0(e,t){return Dv[e](t)}const $v=()=>{const{setRoute:e,triggerResize:t}=U(),{chainType:r}=ve(),o=He(),i=Xe(),a=r===ne.EVM?o:i,c=a.status==="connected",s=c?a.address:void 0,l=c&&r===ne.EVM?a.chainId:void 0;v.useEffect(()=>{t()},[t]),v.useEffect(()=>{typeof sessionStorage<"u"&&sessionStorage.removeItem("buyPopupOpen")},[]);const d=()=>{e(L.CONNECTED)},u=()=>{e(L.CONNECTED)},p=s&&l?S0(ne.EVM,{chainId:l,address:s}):"";return n.jsx(Q,{onBack:u,children:n.jsxs(Te,{style:{paddingBottom:18,textAlign:"center"},children:[n.jsx(Me,{children:"Provider Finished"}),n.jsx(X,{style:{marginTop:24},children:"The provider flow has been completed. You can view your wallet on the block explorer to check your transactions."}),n.jsxs(Ca,{style:{marginTop:24},children:[p&&n.jsx(Ar,{style:{marginTop:0},children:n.jsx(te,{variant:"secondary",onClick:()=>window.open(p,"_blank","noopener,noreferrer"),children:n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{children:"View Wallet Transactions"}),n.jsx(Ov,{})]})})}),n.jsx(Ar,{style:{marginTop:p?4:0},children:n.jsx(te,{variant:"primary",onClick:d,children:"Done"})})]})]})})},Bv=E(F.div)`
  z-index: 4;
  position: relative;
  overflow: hidden;
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`,Wv=E(F.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 24px;
  background: var(--ck-body-background);
  svg,
  img {
    pointer-events: none;
    display: block;
    width: 100%;
    height: 100%;
  }
`,Vv=E(F.div)`
  position: absolute;
  inset: 1px;
  overflow: hidden;
`,Uv=E(F.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
      from -90deg,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      var(--ck-spinner-color)
    );
    animation: rotateSpinner 1200ms linear infinite;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,Mo=({logo:e,connecting:t=!0})=>n.jsxs(Bv,{transition:{duration:.5,ease:[.175,.885,.32,.98]},children:[n.jsx(Wv,{children:e}),n.jsx(Vv,{children:n.jsx(Ve,{children:t&&n.jsx(Uv,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,transition:{duration:0}}},"Spinner")})}),n.jsxs("svg",{"aria-hidden":"true",width:"102",height:"102",viewBox:"0 0 102 102",fill:"none",children:[n.jsx("rect",{x:"7.57895",y:"7.57895",width:"86.8421",height:"86.8421",rx:"19.2211",stroke:"black",strokeOpacity:"0.02",strokeWidth:"1.15789"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0 0H102V102H0V0ZM7 38.284C7 27.5684 7 22.2106 9.01905 18.0892C10.9522 14.1431 14.1431 10.9522 18.0892 9.01905C22.2106 7 27.5684 7 38.284 7H63.716C74.4316 7 79.7894 7 83.9108 9.01905C87.8569 10.9522 91.0478 14.1431 92.9809 18.0892C95 22.2106 95 27.5684 95 38.284V63.716C95 74.4316 95 79.7894 92.9809 83.9108C91.0478 87.8569 87.8569 91.0478 83.9108 92.9809C79.7894 95 74.4316 95 63.716 95H38.284C27.5684 95 22.2106 95 18.0892 92.9809C14.1431 91.0478 10.9522 87.8569 9.01905 83.9108C7 79.7894 7 74.4316 7 63.716V38.284ZM41.5 0.5H41.4325C34.7246 0.499996 29.6023 0.499994 25.5104 0.823325C21.388 1.14906 18.1839 1.80986 15.3416 3.20227C10.0602 5.78959 5.78959 10.0602 3.20227 15.3416C1.80986 18.1839 1.14906 21.388 0.823325 25.5104C0.499994 29.6023 0.499996 34.7246 0.5 41.4325V41.5V55.5938C0.5 55.6808 0.507407 55.766 0.521624 55.849C0.507407 55.9319 0.5 56.0172 0.5 56.1042V60.5V60.5675C0.499996 67.2754 0.499994 72.3977 0.823325 76.4896C1.14906 80.612 1.80986 83.8161 3.20227 86.6584C5.78959 91.9398 10.0602 96.2104 15.3416 98.7977C18.1839 100.19 21.388 100.851 25.5104 101.177C29.6022 101.5 34.7244 101.5 41.432 101.5H41.4324H41.5H43.4227H60.5H60.5675H60.568C67.2756 101.5 72.3977 101.5 76.4896 101.177C80.612 100.851 83.8161 100.19 86.6584 98.7977C91.9398 96.2104 96.2104 91.9398 98.7977 86.6584C100.19 83.8161 100.851 80.612 101.177 76.4896C101.5 72.3978 101.5 67.2756 101.5 60.568V60.5676V60.5V41.5V41.4324V41.432C101.5 34.7244 101.5 29.6022 101.177 25.5104C100.851 21.388 100.19 18.1839 98.7977 15.3416C96.2104 10.0602 91.9398 5.78959 86.6584 3.20227C83.8161 1.80986 80.612 1.14906 76.4896 0.823325C72.3977 0.499994 67.2754 0.499996 60.5675 0.5H60.5H41.5ZM3.5 56.1042C3.5 56.0172 3.49259 55.9319 3.47838 55.849C3.49259 55.766 3.5 55.6808 3.5 55.5938V41.5C3.5 34.7112 3.50109 29.7068 3.814 25.7467C4.1256 21.8032 4.73946 19.0229 5.89635 16.6614C8.19077 11.9779 11.9779 8.19077 16.6614 5.89635C19.0229 4.73946 21.8032 4.1256 25.7467 3.814C29.7068 3.50109 34.7112 3.5 41.5 3.5H60.5C67.2888 3.5 72.2932 3.50109 76.2533 3.814C80.1968 4.1256 82.977 4.73946 85.3386 5.89635C90.022 8.19077 93.8092 11.9779 96.1036 16.6614C97.2605 19.0229 97.8744 21.8032 98.186 25.7467C98.4989 29.7068 98.5 34.7112 98.5 41.5V60.5C98.5 67.2888 98.4989 72.2932 98.186 76.2533C97.8744 80.1968 97.2605 82.9771 96.1036 85.3386C93.8092 90.022 90.022 93.8092 85.3386 96.1036C82.977 97.2605 80.1968 97.8744 76.2533 98.186C72.2932 98.4989 67.2888 98.5 60.5 98.5H43.4227H41.5C34.7112 98.5 29.7068 98.4989 25.7467 98.186C21.8032 97.8744 19.0229 97.2605 16.6614 96.1036C11.9779 93.8092 8.19077 90.022 5.89635 85.3386C4.73946 82.9771 4.1256 80.1968 3.814 76.2533C3.50109 72.2932 3.5 67.2888 3.5 60.5V56.1042Z",fill:"var(--ck-body-background)"})]})]}),zv=()=>{const e=$a.getInstance();return e?.backendUrl||"https://api.openfort.io"},Hv=e=>({1:"ethereum",8453:"base",137:"polygon",42161:"arbitrum",10:"optimism"})[e]||"base",wa=["btc","eth","usdc","usdt","matic","pol","sol","avax","atom","dot","link","uni","aave","comp","snx","mkr","dai","wld","xlm"],Ll=e=>{const t=Ke(e);return wa.includes(t.toLowerCase())},Gv=e=>{const t=Ke(e),r=t.toLowerCase();if(!wa.includes(r))throw new Error(`Unsupported currency for Coinbase: ${t}. Supported currencies are: ${wa.join(", ")}`);return t},qv=async e=>{const{token:t,chainId:r,publishableKey:o,...i}=e;if(!o)throw new Error("Publishable key is required for authentication");const a={provider:"coinbase",destinationCurrency:Gv(t),destinationNetwork:Hv(r),destinationAddress:i.destinationAddress};i.sourceAmount&&(a.sourceAmount=i.sourceAmount),i.sourceCurrency&&(a.sourceCurrency=i.sourceCurrency),i.paymentMethod&&(a.paymentMethod=i.paymentMethod),i.country&&(a.country=i.country),i.subdivision&&(a.subdivision=i.subdivision),i.redirectUrl&&(a.redirectUrl=i.redirectUrl),i.clientIp&&(a.clientIp=i.clientIp);const c=await fetch(`${zv()}/v1/onramp/sessions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(a)});if(!c.ok){const s=await c.json().catch(()=>({}));throw new Error(s.error||s.errorMessage||"Failed to create Coinbase session")}return c.json()},Zv=()=>{const e=$a.getInstance();return e?.backendUrl||"https://api.openfort.io"},Kv=e=>({1:"ethereum",8453:"base",137:"polygon",42161:"arbitrum",10:"optimism"})[e]||"base",ka=["btc","eth","xlm","matic","pol","sol","usdc","avax","wld"],Il=e=>{const t=Ke(e);return ka.includes(t.toLowerCase())},Yv=e=>{const t=Ke(e),r=t.toLowerCase();if(!ka.includes(r))throw new Error(`Unsupported currency for Stripe: ${t}. Supported currencies are: ${ka.join(", ")}`);return r},Xv=async e=>{const{token:t,chainId:r,publishableKey:o,destinationAddress:i,sourceAmount:a,sourceCurrency:c,redirectUrl:s}=e;if(!o)throw new Error("Publishable key is required for authentication");const l=Yv(t),d=Kv(r),u={provider:"stripe",destinationCurrency:l,destinationNetwork:d,destinationAddress:i,sourceAmount:a,sourceCurrency:c?.toLowerCase(),redirectUrl:s},p=await fetch(`${Zv()}/v1/onramp/sessions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(u)});if(!p.ok){const f=await p.json().catch(()=>({}));throw new Error(f.error||f.errorMessage||"Failed to create Stripe session")}return await p.json()},Qv=()=>{const{buyForm:e,setRoute:t,triggerResize:r,publishableKey:o}=U(),{chainType:i}=ve(),a=He(),c=Xe(),s=i===ne.EVM?a:c,l=s.status==="connected",d=l?s.address:void 0,u=l&&i===ne.EVM?s.chainId:void 0,[p,h]=v.useState(null),[f,g]=v.useState(!1),[m,b]=v.useState(!0),[y,w]=v.useState(!1),{data:C}=Gt(),k=v.useMemo(()=>C?.find(B=>Dr(B,e.asset)),[C,e.asset]),x=k??C?.[0],S=x??e.asset,O=v.useMemo(()=>{const B=e.amount;if(!B)return null;const W=Number(B);return Number.isFinite(W)?W:null},[e.amount]),j=v.useRef(!1);v.useEffect(()=>{if(!d||!u||j.current)return;j.current=!0,(async()=>{if(!O||O<=0){t(L.BUY_SELECT_PROVIDER);return}b(!0),w(!1);try{let W=null;if(e.providerId==="coinbase"?W=(await qv({token:S,chainId:u,publishableKey:o,destinationAddress:d,sourceAmount:O.toFixed(2),sourceCurrency:e.currency,redirectUrl:`${window.location.origin}?coinbase_onramp=success`})).onrampUrl:e.providerId==="stripe"&&(W=(await Xv({token:S,chainId:u,publishableKey:o,destinationAddress:d,sourceAmount:O.toFixed(2),sourceCurrency:e.currency,redirectUrl:`${window.location.origin}?stripe_onramp=success`})).onrampUrl),!W){w(!0);return}const H=new URL(W);H.searchParams.delete("fiatCurrency");const K=H.toString();if(typeof window<"u"){const G=window.screenLeft!==void 0?window.screenLeft:window.screenX,I=window.screenTop!==void 0?window.screenTop:window.screenY,N=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,R=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,M=N/2-500/2+G,T=R/2-700/2+I,oe=window.open(K,"BuyPopup",`scrollbars=yes,width=500,height=700,top=${T},left=${M}`);oe?h(oe):w(!0)}}catch{w(!0)}finally{b(!1)}})()},[d,u]),v.useEffect(()=>{r()},[r,m,f,y]),v.useEffect(()=>{if(m)return;g(!1);const B=setTimeout(()=>{g(!0)},2e3);return()=>clearTimeout(B)},[m]),v.useEffect(()=>{if(!p||m)return;const B=setInterval(()=>{try{if(p.closed){clearInterval(B),h(null),e.providerId==="coinbase"&&t(L.BUY_COMPLETE);return}try{const W=p.location.href;(W.includes("coinbase_onramp=success")||W.includes("stripe_onramp=success"))&&(p.close(),h(null),t(L.BUY_COMPLETE),clearInterval(B))}catch{}}catch{clearInterval(B)}},500);return()=>{clearInterval(B)}},[p,e.providerId,t,m]);const A=()=>{p&&!p.closed&&p.close(),h(null),t(L.BUY)},_=()=>{p&&!p.closed&&p.close(),h(null),t(L.BUY_COMPLETE)},P=()=>{p&&!p.closed&&p.close(),h(null),t(L.BUY_SELECT_PROVIDER)};if(y)return n.jsx(Q,{onBack:P,children:n.jsxs(Te,{style:{paddingBottom:18,textAlign:"center"},children:[n.jsx(we,{children:"Error"}),n.jsxs(X,{children:["Failed to create payment session.",n.jsx("br",{}),"Please try again."]}),n.jsx(Ar,{style:{marginTop:24},children:n.jsx(te,{variant:"primary",onClick:P,children:"Go Back"})})]})});const D=e.providerId==="stripe",$=e.providerId==="coinbase",q=D||$;return m?n.jsx(Q,{onBack:P,children:n.jsxs(Te,{style:{paddingBottom:18,textAlign:"center"},children:[n.jsx(we,{children:"Creating Session"}),n.jsx(X,{children:"Please wait..."}),n.jsx(Tl,{children:n.jsx(Mo,{logo:q?n.jsxs("div",{style:{padding:"12px",position:"relative",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:[D&&n.jsx(Ye.Stripe,{}),$&&n.jsx(Ye.CoinbasePay,{})]}):void 0,connecting:!0})})]})}):n.jsx(Q,{onBack:A,children:n.jsxs(Te,{style:{paddingBottom:18,textAlign:"center"},children:[n.jsx(we,{children:"Processing Purchase"}),n.jsx(X,{children:"Complete the purchase in the popup window..."}),n.jsx(Tl,{children:n.jsx(Mo,{logo:n.jsxs("div",{style:{padding:"12px",position:"relative",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:[D&&n.jsx(Ye.Stripe,{}),$&&n.jsx(Ye.CoinbasePay,{}),!D&&!$&&n.jsx(Ye.Openfort,{})]}),connecting:!0})}),f&&n.jsx(X,{children:"Click Continue when you are done."}),f&&n.jsxs(n.Fragment,{children:[n.jsx(Al,{children:n.jsx(te,{variant:"primary",onClick:_,children:"Continue"})}),n.jsx(Al,{children:n.jsx(te,{variant:"secondary",onClick:A,children:"Cancel"})})]})]})})},j0=[{id:"coinbase",name:"Coinbase",feeBps:250,highlight:"best"},{id:"stripe",name:"Stripe",feeBps:405,highlight:"fast"}],_0=()=>j0,Jv=e=>j0.map(t=>{if(e===null||Number.isNaN(e)||e<=0)return{provider:t,netAmount:null,feeAmount:null};const r=+(e*(t.feeBps/1e4)).toFixed(2),o=Math.max(e-r,0);return{provider:t,netAmount:o,feeAmount:r}}),em=E(Q)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  padding-bottom: 16px;
`,tm=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`,nm=E.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid ${({$active:e})=>e?"var(--ck-accent-color)":"var(--ck-body-divider)"};
  background: ${({$active:e})=>e?"var(--ck-secondary-button-hover-background)":"var(--ck-secondary-button-background)"};
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  text-align: left;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: ${({$active:e})=>e?"var(--ck-accent-color)":"var(--ck-body-color-muted)"};
  }
`,rm=E.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`,om=E.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,im=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`,am=E.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--ck-secondary-button-hover-background);
  color: var(--ck-body-color-muted);
`,sm=E.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,cm=E.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  white-space: nowrap;
`,lm=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`,dm=E.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
`,um=E.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color-muted);
  font-size: 14px;
`,pm=()=>{const{buyForm:e,setBuyForm:t,setRoute:r,triggerResize:o}=U(),i=_0(),a=Dn(hr(e.amount)),c=v.useMemo(()=>{if(!a)return null;const h=Number(a);return Number.isFinite(h)?h:null},[a]),s=v.useMemo(()=>Jv(c),[c]);v.useEffect(()=>{o()},[s.length]);const l=v.useMemo(()=>Da(e.currency),[e.currency]),d=Ke(e.asset),u=h=>{t(f=>({...f,providerId:h})),r(L.BUY)},p=()=>i.length?n.jsx(tm,{children:i.map(h=>{const f=s.find(k=>k.provider.id===h.id),g=f&&f.netAmount!==null?`${f.netAmount.toFixed(2)} ${d}`:"--",m=c!==null?l.format(c):"--",b=(h.feeBps/100).toFixed(2),y=h.highlight==="best"?"Best price":h.highlight==="fast"?"Fastest":null,w=`Fee ${b}%`,C=e.providerId===h.id;return n.jsxs(nm,{type:"button",onClick:()=>u(h.id),$active:C,children:[n.jsxs(rm,{children:[n.jsxs(om,{children:[n.jsx(im,{children:h.name}),y?n.jsx(am,{children:y}):null]}),n.jsx(sm,{children:w})]}),n.jsxs(cm,{children:[n.jsx(lm,{children:g}),n.jsx(dm,{children:m})]})]},h.id)})}):n.jsx(um,{children:"No providers available right now."});return n.jsxs(em,{children:[n.jsx(we,{children:"Choose provider"}),n.jsx(X,{children:"Compare quotes and pick the provider that works best for you."}),p()]})},hm=()=>{const e=$a.getInstance();return e?.backendUrl||"https://api.openfort.io"},fm=e=>({1:"ethereum",8453:"base",137:"polygon",42161:"arbitrum",10:"optimism"})[e]||"base",gm=e=>Ke(e).toLowerCase(),vm=async e=>{const{token:t,chainId:r,publishableKey:o,sourceCurrency:i,sourceAmount:a}=e;if(!o)throw new Error("Publishable key is required for authentication");const c={destinationCurrency:gm(t),destinationNetwork:fm(r),sourceCurrency:i.toLowerCase(),sourceAmount:a},s=await fetch(`${hm()}/v1/onramp/quotes`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(c)});if(!s.ok){const d=await s.json().catch(()=>({}));throw new Error(d.error||d.errorMessage||"Failed to fetch quotes")}const l=await s.json();return Array.isArray(l)?l:[l]},mm=()=>{const{buyForm:e,setBuyForm:t,setRoute:r,triggerResize:o,publishableKey:i}=U(),{chainType:a}=ve(),c=He(),s=Xe(),l=a===ne.EVM?c:s,d=l.status==="connected",u=d?l.address:void 0,p=d&&a===ne.EVM?l.chainId:void 0,[h,f]=v.useState({}),[g,m]=v.useState(!1),[b,y]=v.useState(!1),[w,C]=v.useState(!1),[k,x]=v.useState(60),[S,O]=v.useState(0),j=v.useMemo(()=>{const I=e.amount;if(!I)return null;const N=Number(I);return Number.isFinite(N)?N:null},[e.amount]),{data:A}=Gt(),_=v.useMemo(()=>A?.find(I=>Dr(I,e.asset)),[A,e.asset]),P=_??A?.[0],D=P??e.asset,$=Ke(D),q=v.useMemo(()=>Da(e.currency),[e.currency]);v.useEffect(()=>{o()},[o]),v.useEffect(()=>{if(!j||j<=0)return;const I=setInterval(()=>{x(N=>N<=1?(O(R=>R+1),60):N-1)},1e3);return()=>clearInterval(I)},[j]),v.useEffect(()=>{j&&j>0&&x(60)},[j]),v.useEffect(()=>{const N=setTimeout(async()=>{if(!u||!p||!j||j<=0){f({}),y(!1),C(!1);return}m(!0),y(!1),C(!1);try{const R=await vm({token:D,chainId:p,publishableKey:i,sourceAmount:j.toFixed(2),sourceCurrency:e.currency}),M={};for(const T of R)M[T.provider]=T;f(M),y(!M.coinbase&&Ll(D)),C(!M.stripe&&Il(D))}catch{f({}),y(!0),C(!0)}finally{m(!1)}},500);return()=>clearTimeout(N)},[j,D.metadata,D.type,e.currency,p,u,i,S]);const B=I=>{t(N=>({...N,providerId:I}))},W=()=>{r(L.BUY_PROCESSING)},H=()=>{r(L.BUY)},K=j!==null?q.format(j):null,Y=!u||g,ue=_0(),G=v.useMemo(()=>{const I=Object.values(h).map(N=>Number.parseFloat(N.destinationAmount)).filter(N=>Number.isFinite(N));return I.length>0?Math.max(...I):null},[h]);return n.jsxs(Q,{onBack:H,children:[n.jsx(we,{children:"Select Provider"}),n.jsx(X,{children:K&&`Buying ${K} of ${$}`}),n.jsx(X,{style:{marginTop:4,fontSize:"12px",opacity:.7},children:g?"Loading quotes...":`Quotes refresh in ${k}s`}),n.jsx(mv,{children:ue.map(I=>{var N,R,M,T,oe,V;const de=h[I.id];let ce=null,se=null,J=j,me=!1,ae="",ie=!1;if(I.id==="coinbase"){if(!Ll(D))me=!0,ae="Token not supported";else if(b)me=!0,ae="Provider not supported";else if(de){const ke=Number.parseFloat(de.destinationAmount);if(G!==null&&Math.abs(ke-G)>1e-6){ie=!0,ce=G;const Le=(R=(N=de.fees)===null||N===void 0?void 0:N.reduce((Ge,We)=>Ge+Number.parseFloat(We.amount),0))!==null&&R!==void 0?R:0,ee=j??0,Se=G/ke,tt=Le*Se;J=ee+tt,se=ee>0?(tt/ee*100).toFixed(2):null}else{ce=ke;const Le=(T=(M=de.fees)===null||M===void 0?void 0:M.reduce((Se,tt)=>Se+Number.parseFloat(tt.amount),0))!==null&&T!==void 0?T:0;se=j?(Le/j*100).toFixed(2):null,J=Number.parseFloat(de.sourceAmount)+Le}}}else if(I.id==="stripe"){if(!Il(D))me=!0,ae="Token not supported";else if(w)me=!0,ae="Provider not supported";else if(de){ce=Number.parseFloat(de.destinationAmount),J=Number.parseFloat(de.sourceAmount);const ke=(V=(oe=de.fees)===null||oe===void 0?void 0:oe.reduce((Le,ee)=>Le+Number.parseFloat(ee.amount),0))!==null&&V!==void 0?V:0;se=j?(ke/j*100).toFixed(2):null}}const Fe=me?ae:g||!de?"...":ce!==null?A1(ce,$):"--",he=me?"":g||!de?"...":J!==null?`${ie?"~":""}${q.format(J)}`:"--",Oe=se??(I.feeBps/100).toFixed(2),ye=I.highlight==="best"?"Best price":I.highlight==="fast"?"Fastest":null,xe=me?"":`Fee ${ie?"~":""}${Oe}%`,qe=e.providerId===I.id;return n.jsxs(xv,{type:"button",onClick:()=>!me&&B(I.id),$active:qe,disabled:me,children:[n.jsxs(bv,{children:[n.jsxs(yv,{children:[n.jsx(Cv,{children:I.name}),ye&&!me?n.jsx(wv,{children:ye}):null]}),n.jsx(kv,{children:xe})]}),n.jsxs(Ev,{children:[n.jsx(Sv,{children:he}),n.jsx(jv,{children:Fe})]})]},I.id)})}),n.jsxs(Ar,{children:[n.jsx(te,{variant:"secondary",onClick:H,children:"Back"}),n.jsx(te,{variant:"primary",onClick:W,disabled:Y,children:"Continue"})]})]})};function xs(e=1e3){const[t,r]=v.useState(!1),o=v.useRef(),i=v.useCallback(a=>{if(!a)return;const c=a.trim();navigator.clipboard&&navigator.clipboard.writeText(c),r(!0),clearTimeout(o.current),o.current=setTimeout(()=>r(!1),e)},[e]);return v.useEffect(()=>()=>{o.current&&clearTimeout(o.current)},[]),{copied:t,copy:i}}const xm=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: all 220ms ease;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg path:first-child {
    transition: all 220ms ease;
    fill: var(--bg, var(--ck-body-background));
    stroke: var(--color, var(--ck-copytoclipboard-stroke));
    transform-origin: 50% 50%;
  }

  svg rect {
    transition: all 220ms ease;
    fill: var(--bg, var(--ck-body-background));
    stroke: var(--color, var(--ck-copytoclipboard-stroke));
    transform-origin: 53% 63%;
  }

  svg path:last-child {
    transition: all 220ms ease;
    opacity: ${e=>e.$copied?1:0};
    stroke: var(--ck-body-background);
    transform: translate(11.75px, 10px) rotate(90deg) scale(0.6);
  }

  ${e=>e.$copied?pe`
          --color: var(--ck-focus-color) !important;
          --bg: var(--ck-body-background);
          svg {
            transition-delay: 0ms;
            path:first-child {
              opacity: 0;
              transform: rotate(-90deg) scale(0.2);
            }
            rect {
              rx: 10px;
              fill: var(--color);
              transform: rotate(-90deg) scale(1.45);
            }
            path:last-child {
              transition-delay: 100ms;
              opacity: 1;
              transform: translate(7.75px, 9.5px);
            }
          }
        `:pe`
          &:hover {
          }
          &:hover:active {
          }
        `}
`,bs=({copied:e,size:t="1rem",className:r})=>n.jsx(xm,{$copied:e,className:r,style:{width:t,height:t},children:n.jsx(Iv,{})}),bm=E.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.4:1};
  transition: all 220ms ease;

  --color: var(--ck-copytoclipboard-stroke);

  &:hover:not([disabled]) {
    --color: var(--ck-body-color-muted);
  }
`,Ft=({value:e,children:t,size:r="1.5rem"})=>{const{copied:o,copy:i}=xs();return n.jsxs(bm,{onClick:()=>i(e),$disabled:!e,children:[t,n.jsx(bs,{copied:o,size:r})]})},$r=({showDisclaimer:e})=>{var t,r;const{uiConfig:o}=U();return n.jsxs(wm,{children:[e&&n.jsx(ym,{children:o?.disclaimer?o.disclaimer:n.jsxs("div",{children:["By logging in, you agree to our"," ",n.jsx("a",{href:(t=o?.termsOfServiceUrl)!==null&&t!==void 0?t:"https://www.openfort.io/terms",target:"_blank",rel:"noopener noreferrer",children:"Terms of Service"})," ","&"," ",n.jsx("a",{href:(r=o?.privacyPolicyUrl)!==null&&r!==void 0?r:"https://www.openfort.io/privacy",target:"_blank",rel:"noopener noreferrer",children:"Privacy Policy"}),"."]})}),n.jsxs(km,{onClick:()=>{window.open("https://www.openfort.io/","_blank")},children:[n.jsx("span",{children:"Powered by"}),n.jsx(Cm,{children:n.jsx(Ye.Openfort,{})}),n.jsx("span",{children:"Openfort"})]})]})},ym=E(F.div)`
  padding: 8px 50px 0px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ck-body-disclaimer-font-size, 10px);
  font-weight: var(--ck-body-disclaimer-font-weight, 400);
  text-align: center;
  line-height: 1rem;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & a {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }
`,Cm=E.div`
  width: 20px;
  height: 20px;
  margin-left: 5px;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &[data-shape='squircle'] {
    border-radius: 22.5%;
  }
  &[data-shape='circle'] {
    border-radius: 100%;
  }
  &[data-shape='square'] {
    border-radius: 0;
  }
`,wm=E(F.div)`
  text-align: center;
  margin-top: 4px;
  margin-bottom: -16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`,km=E(F.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--ck-body-color-muted);
  text-decoration-color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;

  transition:
    color 200ms ease,
    transform 100ms ease;
  &:hover {
    color: var(--ck-body-color-muted-hover);
    text-decoration-color: var(--ck-body-color-muted-hover);
  }
  &:active {
    transform: scale(0.96);
  }

  span {
    opacity: 1;
    transition: opacity 300ms ease;
  }
`,Em=E(F.div)`
  padding: 18px 0 20px;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    padding: 16px 0 20px;
  }
`,Sm=E(F.div)`
  position: relative;
  display: inline-block;
`,jm=E(F.div)`
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: -16px;
`,_m=E(F.div)`
  position: relative;
  height: 24px;
  margin-top: 4px;
`,A0=E(F.div)`
  position: relative;
  font-size: 20px;
`,Am=je`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`,Nl=E(F.div)`
  width: 25%;
  height: 24px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--ck-body-background-secondary);
  inset: 0;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      90deg,
      var(--ck-body-background-transparent) 50%,
      var(--ck-body-background),
      var(--ck-body-background-transparent)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${Am} 1000ms linear infinite both;
  }
`,Tm=E(F.div)`
  z-index: 2;
  width: 100%;
  height: 100%;
  min-width: 13px;
  min-height: 13px;
  color: var(--ck-body-color-danger, red);
`,Om=E.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`,uo=E(te)`
  flex: 1;
  margin: 0;
  height: 48px;
  font-size: 16px;

  ${zn} {
    gap: 8px;
    white-space: nowrap;
  }
`,Rm=E(te)`
  margin-top: 4px;
`,T0=E.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  margin: 0;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`,O0=({address:e,displayName:t,avatar:r,balance:o,actions:i,beforeAvatar:a,hideBalance:c,isBalanceLoading:s,isAddressLoading:l,noWalletFallback:d,afterActions:u})=>n.jsxs(Te,{style:{paddingBottom:6,gap:6},children:[e?n.jsxs(n.Fragment,{children:[n.jsx(Em,{children:n.jsxs(Sm,{children:[a,r]})}),n.jsx(Me,{children:t}),c?null:n.jsxs(X,{children:[n.jsx(_m,{children:s?n.jsx(Nl,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:" "}):o}),n.jsx(Om,{children:i}),u]})]}):l?n.jsx(Nl,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:"Loading..."}):d,n.jsx($r,{})]}),Lm=v.lazy(()=>Na(()=>import("./index-DMmefASG.js"),__vite__mapDeps([0,1,2,3,4,5,6])));function Fl(e){return e?.find(t=>t.balance&&t.balance>BigInt(0))}const Im=()=>{var e,t,r,o;const i=U(),{setHeaderLeftSlot:a,setRoute:c,chains:s}=i,l=Un(),d=ot(),u=He(),{embeddedAccounts:p}=ve(),h=((e=p?.filter(Y=>Y.chainType===ne.EVM))!==null&&e!==void 0?e:[]).length>0,f=u.status==="connected",g=!!(d?.account.isConnected&&d?.account.address),m=f||g,b=f?u.address:g?d.account.address:void 0,y=f?u.chainId:g?d.chainId:void 0,{chainType:w}=ve();v.useEffect(()=>{},[w]);const C=s.find(Y=>Y.id===y),k=Vn({address:b??"",chainType:w,ensChainId:y??0,enabled:m&&!!b}),x=k.status==="success"?k.name:void 0,{data:S,isLoading:O,refetch:j}=Gt(),A=v.useMemo(()=>S?S.reduce((Y,ue)=>{var G,I,N,R;if(!ue.metadata||!ue.balance)return Y;const M=(N=(I=(G=ue.metadata)===null||G===void 0?void 0:G.fiat)===null||I===void 0?void 0:I.value)!==null&&N!==void 0?N:0;if(!M)return Y;const T=Number(vn((R=ue.balance)!==null&&R!==void 0?R:BigInt(0),_r(ue)));return Y+M*T},0):0,[S]);v.useEffect(()=>{m&&j()},[m,j]);const _=(t=C?.testnet)!==null&&t!==void 0?t:!1,[P,D]=v.useState(!1);v.useEffect(()=>{if(i.triggerResize(),P){const Y=setTimeout(()=>{D(!1)},2e3);return()=>clearTimeout(Y)}},[P,i.triggerResize]);const $=Y=>{!C||_?(Y.preventDefault(),D(!0)):i.setRoute(L.BUY)};v.useEffect(()=>{if(!b){a(null);return}return a(n.jsx(T0,{type:"button",onClick:()=>c(L.PROFILE),"aria-label":"Profile",title:"Profile",children:n.jsx(E0,{})})),()=>{a(null)}},[b,a,c]);const{setSendForm:q}=i,B=["web95","rounded","minimal"].includes((o=(r=l.theme)!==null&&r!==void 0?r:i.uiConfig.theme)!==null&&o!==void 0?o:"")?"....":void 0,W=bt(),H=S&&!O?n.jsx(Xo,{type:"button",onClick:()=>{if(!Fl(S)){c(L.NO_ASSETS_AVAILABLE);return}c(L.ASSET_INVENTORY)},children:n.jsxs(A0,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:["$",td(A)]},`chain-${C?.id}`)}):null,K=h?n.jsx(te,{onClick:()=>i.setRoute(L.SELECT_WALLET_TO_RECOVER),children:"Manage wallets"}):n.jsx(te,{onClick:()=>i.setRoute({route:L.CONNECTORS,connectType:"link"}),icon:n.jsx(Tm,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsxs("svg",{width:"130",height:"120",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Unsupported wallet icon"}),n.jsx("path",{d:"M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z",fill:"currentColor",stroke:"var(--ck-body-background, #fff)",strokeWidth:"1.5"}),n.jsx("path",{d:"M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z",fill:"white"})]})}),children:"Connect wallet"});return n.jsx(Q,{onBack:null,header:W.profileScreen_heading,children:n.jsx(O0,{address:b??"",displayName:n.jsx(Ft,{value:b??"",children:x??_t(b??"",B)}),avatar:b?n.jsx(Gu,{address:b}):n.jsx("span",{}),beforeAvatar:n.jsx(jm,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.2},children:d?n.jsx(v.Suspense,{fallback:n.jsx(Ao,{id:y}),children:n.jsx(Lm,{})}):n.jsx(Ao,{id:y})},y??"loading"),balance:H,actions:n.jsxs(n.Fragment,{children:[n.jsx(uo,{icon:n.jsx(Av,{}),onClick:()=>{const Y=Fl(S);if(!Y){c(L.NO_ASSETS_AVAILABLE);return}q({...T1,asset:Y}),i.setRoute(L.SEND)},children:"Send"}),n.jsx(uo,{icon:n.jsx(ms,{}),onClick:()=>i.setRoute(L.RECEIVE),children:"Get"}),n.jsx(uo,{icon:n.jsx(Jn,{}),onClick:$,style:_?{cursor:"not-allowed",opacity:.4,pointerEvents:"auto"}:void 0,children:"Buy"})]}),hideBalance:i?.uiConfig.hideBalance,isBalanceLoading:O,noWalletFallback:K,afterActions:n.jsx(Ve,{onExitComplete:()=>i.triggerResize(),children:P&&n.jsx(X,{as:F.div,initial:{opacity:0,y:-10},animate:{opacity:.7,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},style:{marginTop:12,fontSize:14,textAlign:"center"},children:"Buy is only available on mainnet chains"})})})})},Nm=()=>{var e,t,r,o,i;const a=U(),{setHeaderLeftSlot:c,setRoute:s}=a,l=bt(),d=Xe(),{embeddedAccounts:u}=ve(),{rpcUrl:p}=O1(),h=((e=u?.filter(_=>_.chainType===ne.SVM))!==null&&e!==void 0?e:[]).length>0,f=d.status==="connected"&&!d.address,g=d.status==="connected"&&d.address?d.address:void 0,{triggerResize:m}=a;v.useEffect(()=>{g&&m()},[g,m]);const b=hn({queryKey:["solana-balance",g,p],queryFn:async()=>{if(!g||!p)return null;try{return(await Zu(g,p,"confirmed")).value}catch(_){return Z.error("Failed to fetch Solana balance:",_),null}},enabled:!!(g&&p)});v.useEffect(()=>{if(!g||!p)return;const _=()=>b.refetch().catch(()=>{});return window.addEventListener(To,_),()=>window.removeEventListener(To,_)},[g,p,b.refetch]);const y=b.data,w=b.isLoading,C=y!=null?qu(BigInt(y),9):null;v.useEffect(()=>{w||m()},[w,m]),v.useEffect(()=>{if(!g){c(null);return}return c(n.jsx(T0,{type:"button",onClick:()=>s(L.PROFILE),"aria-label":"Profile",title:"Profile",children:n.jsx(E0,{})})),()=>{c(null)}},[g,c,s]);const k=Un(),x=(r=(t=a.walletConfig)===null||t===void 0?void 0:t.solana)===null||r===void 0?void 0:r.ui,S=x?.customAvatar,O=["web95","rounded","minimal"].includes((i=(o=k.theme)!==null&&o!==void 0?o:a.uiConfig.theme)!==null&&i!==void 0?i:"")?"....":void 0,j=g?S?n.jsx(S,{address:g}):n.jsx(Gu,{address:g}):n.jsx("span",{}),A=C!=null&&!w?n.jsxs(A0,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:[td(Number(C))," SOL"]},"solana-balance"):null;return n.jsx(Q,{onBack:null,header:l.profileScreen_heading,children:n.jsx(O0,{address:g??"",displayName:n.jsx(Ft,{value:g??"",children:R1(g??"",O)}),avatar:j,balance:A,actions:n.jsx(uo,{icon:n.jsx(ms,{}),onClick:()=>a.setRoute(L.SOL_RECEIVE),children:"Get"}),hideBalance:a?.uiConfig.hideBalance,isBalanceLoading:w,isAddressLoading:f,noWalletFallback:h?n.jsx(te,{onClick:()=>s(L.SELECT_WALLET_TO_RECOVER),children:"Manage wallets"}):n.jsx(te,{onClick:()=>s(L.SOL_CREATE_WALLET),children:"Create Solana Wallet"})})})},Fm={[ne.EVM]:Im,[ne.SVM]:Nm},Po=()=>{const{chainType:e}=ve(),t=Fm[e];return t?n.jsx(t,{}):null},Zt=E(F.div)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  left: 0;
  right: 0;
  ${Te} {
    padding: 0 8px 32px;
    gap: 12px;
  }
`,Ti=2,Mm=je`
  0%{ transform:none; }
  25%{ transform:translateX(${Ti}px); }
  50%{ transform:translateX(-${Ti}px); }
  75%{ transform:translateX(${Ti}px); }
  100%{ transform:none; }
`,Pm=je`
  0%{ opacity:1; }
  100%{ opacity:0; }
`,Oi=E(F.div)`
  /*
  background: var(
    --ck-body-background
  ); // To stop the overlay issue during transition for the squircle spinner
  */
`,Dm=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto 16px;
  height: 120px;
  //transform: scale(1.001); // fixes shifting issue between states
`,$m=E(F.div)`
  user-select: none;
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: var(--ck-body-color-danger);
    ${e=>e.$circle&&pe`
        inset: -5px;
        border-radius: 50%;
        background: none;
        box-shadow: inset 0 0 0 3.5px var(--ck-body-color-danger);
      `}
  }
  ${e=>e.$shake&&pe`
      animation: ${Mm} 220ms ease-out both;
      &:before {
        animation: ${Pm} 220ms ease-out 750ms both;
      }
    `}
`,R0=E(F.button)`
  z-index: 5;
  appearance: none;
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  background: none;

  color: var(--ck-body-background-secondary);
  transition: color 200ms ease;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

  &:before {
    z-index: 3;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 200ms ease;
    background: var(--ck-body-color);
  }

  &:hover:before {
    opacity: 0.1;
  }
`,L0=E(F.div)`
  position: absolute;
  inset: 0;

  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 16px;
    background: conic-gradient(
      from 90deg,
      currentColor 10%,
      var(--ck-body-color) 80%
    );
  }

  svg {
    z-index: 2;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
`,Bm=E(F.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`,Wm=E(F.div)`
  --shadow: var(--ck-tooltip-shadow);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: var(
    --ck-tooltip-border-radius,
    ${e=>e.$size==="small"?11:14}px
  );
  border-radius: ;
  padding: 10px 16px 10px 12px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  letter-spacing: -0.1px;
  color: var(--ck-tooltip-color);
  background: var(--ck-tooltip-background);
  box-shadow: var(--shadow);
  > span {
    z-index: 3;
    position: relative;
  }
  > div {
    margin: -4px 0; // offset for icon
  }
  strong {
    color: var(--ck-spinner-color);
  }

  .ck-tt-logo {
    display: inline-block;
    vertical-align: text-bottom;
    height: 1em;
    width: 1.25em;
    svg {
      display: block;
      height: 100%;
      transform: translate(0.5px, -1px) scale(1.75);
    }
  }
`,Vm=E(F.div)`
  z-index: 2;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${e=>e.$size==="small"?14:18}px;
  right: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    box-shadow: var(--shadow);
    width: ${e=>e.$size==="small"?14:18}px;
    height: ${e=>e.$size==="small"?14:18}px;
    transform: translate(75%, 0) rotate(45deg);
    background: var(--ck-tooltip-background);
    border-radius: ${e=>e.$size==="small"?2:3}px 0 0 0;
  }
`,Tr=({children:e,message:t,open:r,xOffset:o=0,yOffset:i=0,delay:a})=>{const c=U(),s=Un(),[l,d]=v.useState(!1),[u,p]=v.useState(!1),[h,f]=v.useState("small"),[g,m]=v.useState(!1),[b]=v.useState(c.route),y=v.useRef(null),[w,C]=dg({debounce:g?0:220,offsetSize:!0,scroll:!0}),k=()=>{let O=!1;const j=o+C.left+C.width,A=i+C.top+C.height*.5;return(j>window.innerWidth||j<0||A>window.innerHeight||A<0)&&(O=!0),O};return(typeof window<"u"?v.useLayoutEffect:v.useEffect)(()=>{if(!y.current||C.top+C.bottom+C.left+C.right+C.height+C.width===0)return;const O=o+C.left+C.width,j=i+C.top+C.height*.5;!g&&O!==0&&j!==0&&m(!0),y.current.style.left=`${O}px`,y.current.style.top=`${j}px`,f(y.current.offsetHeight<=40?"small":"large"),p(k())},[C,r,l]),v.useEffect(()=>{c.open||d(!1)},[c.open]),v.useEffect(()=>{d(!!r)},[r]),c.uiConfig.hideTooltips?n.jsx(n.Fragment,{children:e}):n.jsxs(n.Fragment,{children:[n.jsx(F.div,{ref:w,style:r===void 0?{cursor:"help"}:{},onHoverStart:()=>d(!0),onHoverEnd:()=>d(!1),onClick:()=>d(!1),children:e}),n.jsx(o0,{children:n.jsx(Ve,{children:b===c.route&&!u&&l&&n.jsx(_o,{$useTheme:s.theme,$useMode:s.mode,$customTheme:s.customTheme,children:n.jsx(Bm,{children:n.jsxs(Wm,{role:"tooltip",$size:h,ref:y,initial:"collapsed",animate:g?"open":{},exit:"collapsed",variants:{collapsed:{transformOrigin:"20px 50%",opacity:0,scale:.9,z:.01,y:"-50%",x:20,transition:{duration:.1}},open:{willChange:"opacity,transform",opacity:1,scale:1,z:.01,y:"-50%",x:20,transition:{ease:[.76,0,.24,1],duration:.15,delay:a||.5}}},children:[t,n.jsx(Vm,{$size:h})]})})})})})]})},Um=E.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px 16px;
  text-align: center;
`,zm=E(F.div)`
display: flex;
align-items: center;
justify-content: center;
margin: 10px auto 16px;
height: 120px;
`,Ri=2,Hm=je`
  0%{ transform:none; }
  25%{ transform:translateX(${Ri}px); }
  50%{ transform:translateX(-${Ri}px); }
  75%{ transform:translateX(${Ri}px); }
  100%{ transform:none; }
`,Gm=je`
  0%{ opacity:0; }
  100%{ opacity:1; }
`,qm=E(F.div)`
  position: relative;
  user-select: none;
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: ${e=>e.$color};
  }
  ${e=>!!e.$color&&pe`
    &:before {
      opacity: 1;
    }
  `}
  ${e=>e.$shake&&pe`
      animation: ${Hm} 220ms ease-out both;
      &:before {
        animation: ${Gm} 220ms ease-out both;
      }
    `}
`,ze=({header:e,description:t,icon:r,isError:o=!1,isSuccess:i=!1,isLoading:a=!o&&!i,onRetry:c})=>{const{uiConfig:s}=U(),{triggerResize:l}=U(),d=bt();v.useEffect(()=>()=>l(),[]);const u=()=>r||(s?.logo?typeof s.logo=="string"?n.jsx("img",{src:s.logo,alt:"Logo",style:{width:"100%"}}):s.logo:n.jsx(Ye.Openfort,{}));return n.jsxs(n.Fragment,{children:[n.jsx(zm,{children:n.jsxs(qm,{$color:i?"var(--ck-body-color-valid)":o?"var(--ck-body-color-danger)":void 0,$shake:o,children:[n.jsx(Ve,{children:o&&c&&n.jsx(R0,{"aria-label":"Retry",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},whileTap:{scale:.9},transition:{duration:.1},onClick:c,children:n.jsx(L0,{children:n.jsx(Tr,{open:o,message:d.tryAgainQuestion,xOffset:-6,children:n.jsx(C0,{})})})})}),n.jsx(Mo,{logo:n.jsx("div",{style:{padding:"12px",position:"relative",width:"100%"},children:u()}),connecting:a})]})}),n.jsxs(Um,{children:[a&&n.jsxs(n.Fragment,{children:[n.jsx(Me,{children:"Loading, please wait"}),n.jsx(X,{children:t??e})]}),i&&n.jsxs(n.Fragment,{children:[n.jsxs(Me,{$valid:!0,children:[n.jsx($n,{})," ",e]}),n.jsx(X,{children:t})]}),o&&n.jsxs(n.Fragment,{children:[n.jsx(Me,{$error:!0,children:e}),n.jsx(X,{children:t})]})]})]})},Zm=()=>{const{setOpen:e}=U();return v.useEffect(()=>{setTimeout(()=>{e(!1)},1e3)},[]),n.jsx(Q,{children:n.jsx(ze,{isLoading:!1,isSuccess:!0,header:"Connected"})})};function Km(){var e;const t=ot();return(e=t?.connectors)!==null&&e!==void 0?e:[]}function I0(e,t){const r=Km();return e==="injected"?r.find(o=>{var i;return o.id===e&&((i=o.name)===null||i===void 0?void 0:i.includes("Injected"))}):r.find(o=>o.id===e)}function Ym(){return I0("familyAccountsProvider")}function Xm(){return I0("co.family.wallet")}function N0(){const[e,t]=v.useState(zi());return v.useEffect(()=>{const r=()=>{t(zi())};return window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]),e}const Qm=()=>{var e;const t=ot(),r=(e=t?.config)===null||e===void 0?void 0:e.storage,[o,i]=v.useState(null);return v.useEffect(()=>{let c=!1;return(async()=>{try{const l=r?await r.getItem("recentConnectorId"):null;c||i(l??"")}catch{}})(),()=>{c=!0}},[r]),{lastConnectorId:o,updateLastConnectorId:c=>{r?.setItem("recentConnectorId",c)}}},Jm=E(F.div)`
  display: flex;
  gap: 8px;
  position: relative;
  border-radius: 9px;
  margin: 0 auto;
  padding: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  max-width: 260px;
  min-width: 100%;

  border-radius: var(--ck-alert-border-radius, 12px);
  color: var(--ck-alert-color, var(--ck-body-color-muted));
  background: var(--ck-alert-background, var(--ck-body-background-secondary));
  box-shadow: var(--ck-alert-box-shadow, var(--ck-body-box-shadow));

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    padding: 16px;
    font-size: 16px;
    line-height: 21px;
    border-radius: 24px;
    text-align: center;
  }

  ${e=>{if(e)return pe`
        color: #fff;
        background: var(--ck-body-color-danger, red);
      `}}
`,e9=E(F.div)`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`,Or=({children:e,error:t,icon:r})=>n.jsxs(Jm,{$error:t,children:[r&&n.jsx(e9,{children:r}),n.jsx("div",{children:e})]});Or.displayName="Alert";const t9=E.div`
  position: relative;
`,n9=je`
0%{ opacity:0; }
100%{ opacity:1; }
`,r9=E.div`
  z-index: 9;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.75rem;
  display: flex;
  justify-content: center;

  transition: opacity 300ms ease;

  span {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.3075rem 0.9375rem 0.375rem;
    border-radius: 6rem;
    background: var(--ck-tooltip-background);
    color: var(--ck-tooltip-color);
    font-weight: 500;
    font-size: 0.8125rem;
    letter-spacing: -0.01rem;
    box-shadow: var(--ck-tooltip-shadow);
    animation: ${n9} 300ms ease 1000ms both;

    transition: transform 100ms ease;

    &:hover {
      transform: scale(1.02);
    }
    &:active {
      transform: scale(0.98);
    }
    svg {
      display: block;
      transform: translateX(-0.1875rem);
    }
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
`,o9=E.div`
  --bg: ${({$backgroundColor:e})=>e||"var(--ck-body-background)"};
  --fade-height: 1px;
  position: relative;
  z-index: 1;

  ${({$mobile:e,$height:t,$mobileDirection:r})=>e&&r==="horizontal"?pe`
          overflow-x: scroll;
          margin: 0 -24px;
          padding: 0 24px;

          &:before,
          &:after {
            pointer-events: none;
            z-index: 10;
            content: '';
            display: block;
            position: sticky;
            top: 0;
            bottom: 0;
            width: var(--fade-height);
            background: var(
              --ck-body-divider-secondary,
              var(--ck-body-divider)
            );
            box-shadow: var(--ck-body-divider-box-shadow);
            transition: opacity 300ms ease;
          }
          &:before {
            left: 0;
          }
          &:after {
            right: 0;
          }

          &.scroll-start {
            &:before {
              opacity: 0;
            }
          }

          &.scroll-end {
            &:after {
              opacity: 0;
            }
          }
        `:pe`
          max-height: ${t?`${t}px`:"310px"};
          overflow-y: scroll;
          padding: 0 10px;
          margin: calc(var(--fade-height) * -1) -16px 0 -10px;

          &:before,
          &:after {
            pointer-events: none;
            z-index: 10;
            content: '';
            display: block;
            position: sticky;
            left: 0;
            right: 0;
            height: var(--fade-height);
            background: var(
              --ck-body-divider-secondary,
              var(--ck-body-divider)
            );
            box-shadow: var(--ck-body-divider-box-shadow);
            transition: opacity 300ms ease;
          }
          &:before {
            top: 0;
          }
          &:after {
            bottom: 0;
          }

          &.scroll-start {
            &:before {
              opacity: 0;
            }
          }

          &.scroll-end {
            &:after {
              opacity: 0;
            }
          }
        `}

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: var(--ck-body-color-muted);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ck-body-color-muted-hover);
  }
`,i9=()=>n.jsxs("svg",{width:"11",height:"12",viewBox:"0 0 11 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Scroll down arrow"}),n.jsx("path",{d:"M5.49438 1L5.49438 11M5.49438 11L9.5 7M5.49438 11L1.5 7",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]}),ys=({children:e,height:t,backgroundColor:r,mobileDirection:o})=>{const i=v.useRef(null),a=v.useRef(null),c=N0();return v.useEffect(()=>{const s=i.current;if(!s)return;s.scrollHeight>s.clientHeight&&a.current&&a.current.classList.remove("hide");const l=d=>{const{scrollTop:u,scrollHeight:p,clientHeight:h,scrollLeft:f,scrollWidth:g,clientWidth:m}=d.target;a.current&&u>0&&a.current.classList.add("hide"),u===0&&f===0?s.classList.add("scroll-start"):s.classList.remove("scroll-start"),p-u===h&&g-f===m?s.classList.add("scroll-end"):s.classList.remove("scroll-end")};return s.addEventListener("scroll",l),l({target:s}),()=>{s.removeEventListener("scroll",l)}},[i.current]),n.jsxs(t9,{children:[n.jsx(o9,{ref:i,$mobile:c,$height:t,$backgroundColor:r,$mobileDirection:o,children:e}),n.jsx(r9,{ref:a,className:"hide",onClick:()=>{i.current&&i.current.scrollTo({top:i.current.scrollHeight,behavior:"smooth"})},children:n.jsxs("span",{children:[n.jsx(i9,{})," More Available"]})})]})},a9=je`
  0%{ transform: translate(-100%) rotate(-45deg); }
  100%{ transform: translate(100%) rotate(-80deg); }
`,Ea=E(F.button)`
  display: block;
  text-decoration: none;
`;E(F.a)`
  display: block;
  text-decoration: none;
`;const Sa=E(F.span)``,ja=E(F.div)``,xn={desktop:{ConnectorButton:pe`
      cursor: pointer;
      user-select: none;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 20px;
      width: 100%;
      height: 64px;
      font-size: 17px;
      font-weight: var(--ck-primary-button-font-weight, 500);
      line-height: 20px;
      text-align: var(--ck-body-button-text-align, left);
      transition: 180ms ease;
      transition-property: background, color, box-shadow, transform, opacity;
      will-change: transform, box-shadow, background-color, color, opacity;

      --fallback-color: var(--ck-primary-button-color);
      --fallback-background: var(--ck-primary-button-background);
      --fallback-box-shadow: var(--ck-primary-button-box-shadow);
      --fallback-border-radius: var(--ck-primary-button-border-radius);

      --color: var(--ck-primary-button-color, var(--fallback-color));
      --background: var(
        --ck-primary-button-background,
        var(--fallback-background)
      );
      --box-shadow: var(
        --ck-primary-button-box-shadow,
        var(--fallback-box-shadow)
      );
      --border-radius: var(
        --ck-primary-button-border-radius,
        var(--fallback-border-radius)
      );

      --hover-color: var(--ck-primary-button-hover-color, var(--color));
      --hover-background: var(
        --ck-primary-button-hover-background,
        var(--background)
      );
      --hover-box-shadow: var(
        --ck-primary-button-hover-box-shadow,
        var(--box-shadow)
      );
      --hover-border-radius: var(
        --ck-primary-button-hover-border-radius,
        var(--border-radius)
      );

      --active-color: var(--ck-primary-button-active-color, var(--hover-color));
      --active-background: var(
        --ck-primary-button-active-background,
        var(--hover-background)
      );
      --active-box-shadow: var(
        --ck-primary-button-active-box-shadow,
        var(--hover-box-shadow)
      );
      --active-border-radius: var(
        --ck-primary-button-active-border-radius,
        var(--hover-border-radius)
      );

      color: var(--color);
      background: var(--background);
      box-shadow: var(--box-shadow);
      border-radius: var(--border-radius);

      &:disabled {
        transition: 180ms ease;
        opacity: 0.4;
      }

      --bg: var(--background);
      &:not(:disabled) {
        &:hover {
          color: var(--hover-color);
          background: var(--hover-background);
          box-shadow: var(--hover-box-shadow);
          border-radius: var(--hover-border-radius);
          --bg: var(--hover-background, var(--background));
        }
        &:focus-visible {
          transition-duration: 100ms;
          color: var(--hover-color);
          background: var(--hover-background);
          box-shadow: var(--hover-box-shadow);
          border-radius: var(--hover-border-radius);
          --bg: var(--hover-background, var(--background));
        }
        &:active {
          color: var(--active-color);
          background: var(--active-background);
          box-shadow: var(--active-box-shadow);
          border-radius: var(--active-border-radius);
          --bg: var(--active-background, var(--background));
        }
      }
    `,ConnectorLabel:pe`
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 2px 0;
      padding-right: 38px;
    `,ConnectorIcon:pe`
      position: absolute;
      right: 20px;
      width: 32px;
      height: 32px;
      overflow: hidden;
      svg,
      img {
        display: block;
        position: relative;
        pointer-events: none;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }

      &[data-shape='squircle'] {
        border-radius: 22.5%;
      }
      &[data-shape='circle'] {
        border-radius: 100%;
      }
      &[data-shape='square'] {
        border-radius: 0;
      }
    `},mobile:{ConnectorButton:pe`
      text-align: center;
      background: none;
      max-width: 100%;
      overflow: hidden;
    `,ConnectorLabel:pe`
      display: block;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
      padding: 10px 0 0;
      color: var(--ck-body-color);
      font-size: 13px;
      line-height: 15px;
      font-weight: 500;
      opacity: 0.75;
    `,ConnectorIcon:pe`
      position: relative;
      margin: 0 auto;
      width: 60px;
      height: 60px;
      overflow: hidden;
      svg,
      img {
        display: block;
        position: relative;
        width: 100%;
        height: auto;
      }
      &[data-small='true'] {
        svg,
        img {
          transform: scale(0.8);
        }
      }

      &[data-shape='squircle'] {
        border-radius: 22.5%;
        &:before {
          content: '';
          z-index: -1;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px var(--ck-body-background-tertiary);
        }
      }
      &[data-shape='circle'] {
        border-radius: 100%;
      }
      &[data-shape='square'] {
        border-radius: 0;
      }

      &[data-background='true'] {
        border-radius: 22.5%;
        background: var(--ck-body-background-tertiary);
        padding: 8%;
      }
    `}},F0=E(F.span)`
  position: relative;
  top: var(--ck-recent-badge-top-offset, 0.5px);
  display: inline-block;
  padding: 10px 7px;
  line-height: 0;
  font-size: 13px;
  font-weight: 400;
  border-radius: var(--ck-recent-badge-border-radius, var(--border-radius));
  color: var(
    --ck-recent-badge-color,
    var(--ck-accent-color, var(--ck-body-color-muted, currentColor))
  );
  background: var(--ck-recent-badge-background, transparent);
  overflow: hidden;
  span {
    display: inline-block;
    position: relative;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.4;
    box-shadow: var(--ck-recent-badge-box-shadow, inset 0 0 0 1px currentColor);
    border-radius: inherit;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: -10%;
    top: -110%;
    aspect-ratio: 1/1;
    opacity: 0.7;
    background: linear-gradient(
      170deg,
      transparent 10%,
      var(--ck-recent-badge-background, var(--bg)) 50%,
      transparent 90%
    );
    animation: ${a9} 2s linear infinite;
  }
`,s9=E.div`
  transition: opacity 300ms ease;
  min-width: fit-content;

  ${e=>e.$disabled&&pe`
      pointer-events: none;
      opacity: 0.4;
    `}

  ${e=>e.$mobile?pe`
          display: flex;
          align-items: flex-start;
          justify-content: space-around;
          gap: 22px 6px;
          //margin: 0px -10px -20px;
          padding: 14px 0px 28px;

          ${Ea} {
            flex-shrink: 0;
            width: 80px;
            ${xn.mobile.ConnectorButton}
            ${Sa} {
              ${xn.mobile.ConnectorLabel}
              ${F0} {
                display: none;
                width: fit-content;
                margin: 0 auto;
              }
            }
            ${ja} {
              ${xn.mobile.ConnectorIcon}
            }
          }
        `:pe`
          display: flex;
          flex-direction: column;
          gap: 12px;

          ${Ea} {
            ${xn.desktop.ConnectorButton}
            ${Sa} {
              ${xn.desktop.ConnectorLabel}
            }
            ${ja} {
              ${xn.desktop.ConnectorIcon}
            }
          }
        `}
`,c9=()=>{const e=U(),t=Ba(),{lastConnectorId:r}=Qm(),o=Xm(),i=Ym();let a=t.filter(s=>s.id!==i?.id&&s.id!==tr);o&&L1()&&(a=a.filter(s=>s.id!==o?.id));const c=e.uiConfig.hideRecentBadge||r==="walletConnect"?t:[...t.filter(s=>r===s.connector.id&&s.id!==tr),...t.filter(s=>r!==s.connector.id&&s.id!==tr)];return n.jsxs(ys,{mobileDirection:"horizontal",children:[a.length===0&&n.jsx(Or,{error:!0,children:"No connectors found in Openfort config."}),a.length>0&&n.jsx(s9,{$mobile:!1,$totalResults:c.length,children:a.map(s=>n.jsx(l9,{wallet:s,isRecent:s.id===r},s.id))})]})},l9=({wallet:e,isRecent:t})=>{var r;const o=N0(),i=U(),a=ot(),c=(r=a?.account)===null||r===void 0?void 0:r.connector,s=()=>{var l,d;return n.jsxs(n.Fragment,{children:[n.jsx(ja,{"data-small":e.iconShouldShrink,"data-shape":e.iconShape,children:(l=e.iconConnector)!==null&&l!==void 0?l:e.icon}),n.jsxs(Sa,{children:[o&&(d=e.shortName)!==null&&d!==void 0?d:e.name,!i.uiConfig.hideRecentBadge&&t&&n.jsx(F0,{children:n.jsx("span",{children:"Recent"})})]})]})};return n.jsx(Ea,{type:"button",onClick:async()=>{var l;!((l=a?.account)===null||l===void 0)&&l.isConnected&&(e.id==="walletConnect"||e.id===c?.id)&&await a.disconnect(),i.setRoute({route:L.CONNECT,connectType:"linkIfUserConnectIfNoUser"}),i.setConnector({id:e.id})},children:s()})},Cs=({logoutOnBack:e})=>n.jsx(Q,{logoutOnBack:e,width:312,children:n.jsx(c9,{})}),d9=()=>{const{setRoute:e}=U(),{signUpGuest:t,error:r}=mg({recoverWalletAutomatically:!1,onSuccess:()=>e(L.LOAD_WALLETS)}),o=v.useRef(!1);return v.useEffect(()=>{o.current||(o.current=!0,Z.log("Signing up guest user..."),t())},[]),n.jsx(Q,{onBack:null,children:n.jsx(ze,{header:r?"Error creating guest user.":"Creating guest user...",isError:!!r,onRetry:()=>t()})})};function Br(){const{client:e,user:t}=ve(),{walletConfig:r}=U(),o=v.useMemo(()=>!!r&&(!!r.requestWalletRecoverOTP||!!r.requestWalletRecoverOTPEndpoint),[r]),i=v.useCallback(async()=>{try{if(Z.log("Requesting wallet recover OTP for user",{userId:t?.id}),!r)throw new Error("No walletConfig found");const a=await e.getAccessToken();if(!a)throw new Ee("Openfort access token not found",Ne.AUTHENTICATION_ERROR);if(!t?.id)throw new Ee("User not found",Ne.AUTHENTICATION_ERROR);const c=t.id,s=t.email,l=t.email?void 0:t.phoneNumber;if(!s&&!l)throw new Ee("No email or phone number found for user",Ne.AUTHENTICATION_ERROR);if(Z.log("Requesting wallet recover OTP for user",{userId:c,email:s,phone:l}),r.requestWalletRecoverOTP)return await r.requestWalletRecoverOTP({userId:c,accessToken:a,email:s,phone:l}),{sentTo:s?"email":"phone",email:s,phone:l};if(!r.requestWalletRecoverOTPEndpoint)throw new Error("No requestWalletRecoverOTPEndpoint set in walletConfig");if(!(await fetch(r.requestWalletRecoverOTPEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:c,email:s,phone:l})})).ok)throw new Error("Failed to request wallet recover OTP");return{sentTo:s?"email":"phone",email:s,phone:l}}catch(a){throw Z.log("Error requesting wallet recover OTP:",a),a instanceof Ee?a:new Ee("Failed to request wallet recover OTP",Ne.WALLET_ERROR)}},[r,e,t]);return{isEnabled:o,requestOTP:i}}function ws(e,t){const r=e instanceof Error?e.message:String(e);return r!=="OTP_REQUIRED"?{error:e instanceof Ee?e:new Ee(r,Ne.UNEXPECTED_ERROR),isOTPRequired:!1}:{error:t?new Ee("OTP code is required to recover the wallet.",Ne.WALLET_ERROR):new Ee(`OTP code is required to recover the wallet.
Please set requestWalletRecoveryOTP or requestWalletRecoveryOTPEndpoint in OpenfortProvider.`,Ne.WALLET_ERROR),isOTPRequired:!0}}const M0=E.div`
  position: relative;
  width: 100%;
  height: 48px;
  margin: 12px 0 0;
`,P0=E.input`
  padding: 10px 15px;
  border-radius: var(--ck-secondary-button-border-radius);
  box-shadow: var(--ck-secondary-button-box-shadow);
  background: var(--ck-input-background);
  font-size: 1rem;
  color: var(--ck-body-color);
  transition: all 0.2s;
  width: 100%;
  height: 100%;

  ::placeholder {
    color: var(--ck-body-color-muted);
  }

  &:focus {
    background: var(--ck-input-hover-background);
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }
`,u9=E.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 14px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ck-body-color-muted);
  transition: all 0.2s;

  > svg {
    height: 24px;
    width: 24px;
  }

  &:hover {
    color: var(--ck-body-color);
  }
`,p9=({...e})=>{const[t,r]=fe.useState(!1);return n.jsxs(M0,{children:[n.jsx(P0,{...e,style:{paddingRight:"48px",...e.style},type:t?"text":"password"}),n.jsx(u9,{type:"button",onClick:()=>r(!t),children:t?n.jsx(Nv,{}):n.jsx(Fv,{})})]})},Mt=({...e})=>e.type==="password"?n.jsx(p9,{...e}):n.jsx(M0,{children:n.jsx(P0,{...e})}),h9=je`
  0%, 70%, 100% { opacity: 1; }
  20%, 50% { opacity: 0; }
`,f9=E.div`
  display: flex;
  align-items: center;
  justify-content: center;
  scale: ${({scale:e})=>e||"1"};

  --border: ${({showBorder:e})=>e?"var(--ck-body-color-muted)":"transparent"};
`,g9=je`
  0% {
    opacity: 100%;
  }
  50% {
    opacity: 40%;
  }
  100% {
    opacity: 100%;
  }
`,Li=2,v9=je`
  0%{ transform:none; }
  25%{ transform:translateX(${Li}px); }
  50%{ transform:translateX(-${Li}px); }
  75%{ transform:translateX(${Li}px); }
  100%{ transform:none; }
`,m9=je`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`,x9=E.div`
  display: flex;

  outline-width: 3px;
  outline-style: solid;
  border-radius: 0.375rem;
  transition: outline-color 0.3s, border-radius .5s;

  outline-color: ${({isError:e,isSuccess:t})=>e?"var(--ck-body-color-danger)":t?"var(--ck-body-color-valid)":"transparent"};

  ${({isLoading:e})=>e&&pe`
      animation: ${g9} 1s ease-in-out infinite;
    `}

  ${({isError:e})=>e&&pe`
      animation: ${v9} 220ms ease-out both;
    `}

  ${({isSuccess:e})=>e&&pe`
      border-radius: 3rem;
      min-width: 3.5rem;
      ${D0} {
        width: 0;
        border: 0;
        transition: width .5s, border .5s;
      }
      animation: ${m9} 220ms ease-out both;
      animation-delay: 250ms;
    `}
`,D0=E.div`
  position: relative;
  width: 2.5rem;
  height: 3.5rem;     
  font-size: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s;

  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-right: 0.5px solid var(--border);
  border-left: 0.5px solid var(--border);

  &:first-child {
    border-left: 1px solid var(--border);
    border-radius: 0.375rem 0 0 0.375rem;
  }

  &:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }

  outline: ${({isActive:e})=>e?"2px solid var(--ck-connectbutton-color)":"0"};
  z-index: ${({isActive:e})=>e?1:0};
  outline-offset: 0;

  cursor: text;
  color: var(--ck-body-color);
`,b9=E.div`
  opacity: ${({$hide:e})=>e?0:1};
  transition: opacity 0.3s;
`,y9=E.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: text;
  caret-color: transparent; /* Hide native caret */
`,C9=E.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${h9} 1.2s ease-out infinite;
`,w9=E.div`
  width: 1px;
  height: 2rem;
  background: var(--ck-body-color);
`,k9=je`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`,E9=E.div`
  position: absolute;
  inset: 5px;
  display: flex;
  animation: ${k9} 200ms ease-out both;
  animation-delay: 200ms;
  color: var(--ck-body-color-valid);
`;function S9(){return n.jsx(C9,{children:n.jsx(w9,{})})}function Wr({length:e=6,onChange:t,onComplete:r,isLoading:o,isError:i,isSuccess:a,scale:c}){const[s,l]=v.useState(Array(e).fill("")),[d,u]=v.useState(0),p=!o&&!i&&!a,h=v.useRef([]),f=(y,w)=>{var C;if(!w.match(/^[0-9]$/)||!p)return;const k=[...s];k[y]=w,l(k),t?.(k.join("")),y<e-1&&(u(y+1),(C=h.current[y+1])===null||C===void 0||C.focus())};v.useEffect(()=>{s.every(y=>y!=="")&&r?.(s.join(""))},[s]);const g=y=>{var w;const C=[...s];C[y]===""?(y>0&&(u(y-1),(w=h.current[y-1])===null||w===void 0||w.focus()),C[y-1]=""):C[y]="",l(C),t?.(C.join(""))},m=y=>{var w;const C=y.clipboardData.getData("text").replace(/\D/g,"");if(!C)return;const k=C.substring(0,e).split(""),x=[...s];k.forEach((O,j)=>{x[j]=O}),l(x),t?.(x.join(""));const S=Math.min(k.length-1,e-1);u(S),(w=h.current[S])===null||w===void 0||w.focus()},b=y=>{var w,C;if(d!==-1){u(y);return}const k=s.indexOf("");k!==-1?(u(k),(w=h.current[k])===null||w===void 0||w.focus()):(u(e-1),(C=h.current[e-1])===null||C===void 0||C.focus())};return v.useEffect(()=>{var y;i||(l(Array(e).fill("")),u(0),(y=h.current[0])===null||y===void 0||y.focus())},[i]),n.jsx(f9,{showBorder:!a,scale:c,children:n.jsxs(x9,{isError:i,isSuccess:a,isLoading:o,children:[s.slice(0,e).map((y,w)=>{const C=w;return n.jsxs(D0,{isActive:p&&d===C,children:[n.jsx(y9,{ref:k=>{h.current[C]=k},value:"",inputMode:"numeric",onBlur:()=>u(-1),autoComplete:"one-time-code",autoFocus:C===0,onFocus:()=>b(C),onPaste:m,onKeyDown:k=>{p&&k.key==="Backspace"&&(k.preventDefault(),g(C))},onChange:k=>f(C,k.target.value)}),y&&n.jsx(b9,{$hide:a,children:y}),!y&&d===C&&n.jsx(S9,{})]},C)}),a&&n.jsx(E9,{children:n.jsx($n,{width:"100%",height:"100%"})})]})})}const j9=E.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
`,_9=E.li`
  display: flex;
  align-items: center;
  text-align: left;
  gap: 8px;
  font-size: 16px;
  line-height: 24px;
`,A9=E.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`,ks=({items:e})=>n.jsx(j9,{children:e.map(t=>n.jsxs(_9,{children:[n.jsx(A9,{children:n.jsx($n,{})}),n.jsx("span",{children:t})]},t))});ks.displayName="TickList";var $0=n.jsxs("svg",{"aria-hidden":"true",width:"298",height:"188",viewBox:"0 0 298 188",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M1 55.2757L21.6438 46.0285C55.5896 30.8228 94.4104 30.8228 128.356 46.0286L169.644 64.5229C203.59 79.7287 242.41 79.7286 276.356 64.5229L297 55.2757M1 44.2118L21.6438 34.9646C55.5896 19.7589 94.4104 19.7589 128.356 34.9646L169.644 53.459C203.59 68.6647 242.41 68.6647 276.356 53.459L297 44.2118M1 33.1477L21.6438 23.9005C55.5896 8.69479 94.4104 8.69479 128.356 23.9005L169.644 42.3949C203.59 57.6006 242.41 57.6006 276.356 42.3949L297 33.1477M1 22.1477L21.6438 12.9005C55.5896 -2.30521 94.4104 -2.30521 128.356 12.9005L169.644 31.3949C203.59 46.6006 242.41 46.6006 276.356 31.3949L297 22.1477M1 66.3398L21.6438 57.0926C55.5896 41.8869 94.4104 41.8869 128.356 57.0926L169.644 75.587C203.59 90.7927 242.41 90.7927 276.356 75.587L297 66.3398M1 77.404L21.6438 68.1568C55.5896 52.9511 94.4104 52.9511 128.356 68.1569L169.644 86.6512C203.59 101.857 242.41 101.857 276.356 86.6512L297 77.404M1 88.4681L21.6438 79.2209C55.5896 64.0152 94.4104 64.0152 128.356 79.2209L169.644 97.7153C203.59 112.921 242.41 112.921 276.356 97.7153L297 88.4681M1 121.66L21.6438 112.413C55.5896 97.2075 94.4104 97.2075 128.356 112.413L169.644 130.908C203.59 146.113 242.41 146.113 276.356 130.908L297 121.66M1 110.596L21.6438 101.349C55.5896 86.1433 94.4104 86.1433 128.356 101.349L169.644 119.843C203.59 135.049 242.41 135.049 276.356 119.843L297 110.596M1 99.5321L21.6438 90.2849C55.5896 75.0792 94.4104 75.0792 128.356 90.2849L169.644 108.779C203.59 123.985 242.41 123.985 276.356 108.779L297 99.5321M1 132.724L21.6438 123.477C55.5896 108.271 94.4104 108.271 128.356 123.477L169.644 141.971C203.59 157.177 242.41 157.177 276.356 141.971L297 132.724M1 143.788L21.6438 134.541C55.5896 119.336 94.4104 119.336 128.356 134.541L169.644 153.036C203.59 168.241 242.41 168.241 276.356 153.036L297 143.788M1 154.853L21.6438 145.605C55.5896 130.4 94.4104 130.4 128.356 145.605L169.644 164.1C203.59 179.305 242.41 179.305 276.356 164.1L297 154.853M1 165.853L21.6438 156.605C55.5896 141.4 94.4104 141.4 128.356 156.605L169.644 175.1C203.59 190.305 242.41 190.305 276.356 175.1L297 165.853",stroke:"url(#paint0_linear_1094_2077)",strokeOpacity:"0.9",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("defs",{children:n.jsxs("linearGradient",{id:"paint0_linear_1094_2077",x1:"1",y1:"112.587",x2:"297.034",y2:"79.6111",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"var(--ck-graphic-wave-stop-01)"}),n.jsx("stop",{stopColor:"var(--ck-graphic-wave-stop-02)",offset:"0.239583"}),n.jsx("stop",{stopColor:"var(--ck-graphic-wave-stop-03)",offset:"0.515625"}),n.jsx("stop",{stopColor:"var(--ck-graphic-wave-stop-04)",offset:"0.739583"}),n.jsx("stop",{stopColor:"var(--ck-graphic-wave-stop-05)",offset:"1"})]})})]});const B0=E(F.div)`
  position: relative;
  margin-top: ${({$marginTop:e})=>e??"16px"};
  margin-bottom: ${({$marginBottom:e})=>e??"20px"};
  margin-left: auto;
  margin-right: auto;
  height: ${({$height:e})=>e??"190px"};
  max-width: 295px;
  pointer-events: none;
  user-select: none;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    height: 200px;
    max-width: 100%;
    margin-bottom: 32px;
  }
`,W0=E(F.div)`
  position: absolute;
  inset: 0;
  z-index: 2;
`,T9=je`
  0%{
    opacity:0;
    transform:scale(0.9);
  }
  100%{
    opacity:1;
    transform:none;
  }
`,V0=E(F.div)`
  z-index: 1;
  position: absolute;
  inset: 0;
  top: -2px;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--ck-body-background);
    background: radial-gradient(
      closest-side,
      var(--ck-body-background-transparent, transparent) 18.75%,
      var(--ck-body-background) 100%
    );
    background-size: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  animation: ${T9} 1000ms 100ms ease both;
  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    animation: none;
  }
`,O9=je`
  0%{
    opacity:0;
    transform:scale(0) translateY(40%);
  }
  100%{
    opacity:1;
    transform:none;
  }
`,Et=E(F.div)`
  position: absolute;
  inset: 0;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-delay: inherit;
`,dn=E(F.div)`
  position: absolute;
`,un=E(F.div)`
  position: relative;
  overflow: hidden;
  height: 58px;
  width: 58px;
  border-radius: 13.84px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 20px 0 rgba(0, 0, 0, 0.03);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`,R9=je`
  0%,100%{ transform:none; }
  50%{ transform: translateY(-10%) }
`,gt=E(F.div)`
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${R9};
  animation-duration: 3600ms;
`,L9=je`
  0%,100%{ transform:rotate(-3deg); }
  50%{ transform:rotate(3deg); }
`,vt=E(F.div)`
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${L9};
  animation-duration: 3200ms;
`,kn=E(F.div)`
  position: absolute;
  inset: 0;

  animation: ${O9} 750ms cubic-bezier(0.19, 1, 0.22, 1) both;
  &:nth-child(1){ z-index:2; animation-delay:0ms;  }
  &:nth-child(2){ z-index:1; animation-delay:60ms; }
  &:nth-child(3){ z-index:1; animation-delay:30ms; }
  &:nth-child(4){ z-index:1; animation-delay:90ms; }
  &:nth-child(5){ z-index:1; animation-delay:120ms;}

  &:nth-child(1){ ${vt}{ animation-delay:0ms; } }
  &:nth-child(2){ ${vt}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${vt}{ animation-delay:-1200ms; } }
  &:nth-child(4){ ${vt}{ animation-delay:-1800ms; } }
  &:nth-child(5){ ${vt}{ animation-delay:-2400ms; } }

  &:nth-child(1){ ${gt}{ animation-delay:-200ms; } }
  &:nth-child(2){ ${gt}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${gt}{ animation-delay:-800ms; } }
  &:nth-child(4){ ${gt}{ animation-delay:-300ms; } }
  &:nth-child(5){ ${gt}{ animation-delay:-3200ms; } }

  @media only screen and (max-width: ${Ue.mobileWidth}px) {
    animation: none !important;
    ${vt},${gt} {
      animation: none !important;
    }
  }

  ${dn} {
    transform: translate(-50%, -50%);
  }

  &:nth-child(1) ${Et} {
    transform: translate(50%, 50%);
    ${un} {
      border-radius: 17.2px;
      width: 72px;
      height: 72px;
    }
  }
  &:nth-child(2) ${Et} {
    transform: translate(21%, 21.5%);
  }
  &:nth-child(3) ${Et} {
    transform: translate(78%, 14%);
  }
  &:nth-child(4) ${Et} {
    transform: translate(22.5%, 76%);
  }
  &:nth-child(5) ${Et} {
    transform: translate(76%, 80%);
  }
`,Xn=({size:e="100%",logo:t})=>n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{style:{transform:`scale(${e})`},children:t})})})})})}),At=({height:e="130px",marginBottom:t,marginTop:r,logoCenter:o,logoTopRight:i,logoTopLeft:a,logoBottomRight:c,logoBottomLeft:s})=>n.jsxs(B0,{$height:e,$marginBottom:t,$marginTop:r,children:[n.jsxs(W0,{children:[n.jsx(Xn,{...o}),a?n.jsx(Xn,{...a}):n.jsx("div",{}),i?n.jsx(Xn,{...i}):n.jsx("div",{}),s?n.jsx(Xn,{...s}):n.jsx("div",{}),c?n.jsx(Xn,{...c}):n.jsx("div",{})]}),n.jsx(V0,{children:$0})]});var Ii,Ml;function I9(){if(Ml)return Ii;Ml=1;var e=function(c,s){return Math.round(s*Math.log(c)/Math.LN2)},t=[{name:"lowercase",re:/[a-z]/,length:26},{name:"uppercase",re:/[A-Z]/,length:26},{name:"numbers",re:/[0-9]/,length:10},{name:"symbols",re:/[^a-zA-Z0-9]/,length:33}],r=function(c){return function(s){return c.reduce(function(l,d){return l+(d.re.test(s)?d.length:0)},0)}},o=r(t),i=function(c){return c?e(o(c),c.length):0};return Ii=i,Ii}var N9=I9();const F9=ed(N9),M9=/[a-z]/,P9=/[A-Z]/,D9=/[0-9]/,$9="!@#$%^&()\\-*+.";function B9(e){return e.replace(/[-\\^]/g,"\\$&")}const W9=new RegExp(`[${B9($9)}]`),V9=95,U9=8,z9=.3,H9=.7,Es=.5,G9=.75,q9=.9;function Z9(e){return e>q9?"Very Strong":e>G9?"Strong":e>Es?"Medium":"Weak"}function K9(e){if(e.length<U9)return 0;let t=0;return M9.test(e)&&(t+=1),P9.test(e)&&(t+=1),D9.test(e)&&(t+=1),W9.test(e)&&(t+=1),Math.max(0,Math.min(1,t/4))}function Ss(e=""){const t=K9(e),r=F9(e)/V9;return Math.min(t*z9+r*H9,1)}const Y9=E.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
`,X9=E.div`
  width: 100%;
  height: 4px;
  background: var(--ck-secondary-button-background);
  border-radius: 4px;
  overflow: hidden;
`,Q9=E(F.div)`
  height: 100%;
  background: ${({color:e})=>e};
  border-radius: 4px;
`,J9=E.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ck-body-color-muted);
`,e8=E.span`
  color: ${({color:e})=>e};
`,U0=({password:e,showPasswordIsTooWeakError:t})=>{const r=Ss(e),o=Z9(r),i=v.useMemo(()=>{switch(o){case"Weak":return"#ef4444";case"Medium":return"#f59e0b";case"Strong":return"#10b981";case"Very Strong":return"#3b82f6";default:return"#d1d5db"}},[o]);return n.jsxs(Y9,{children:[n.jsx(X9,{children:n.jsx(Q9,{color:i,initial:{width:0},animate:{width:`${r*100}%`},transition:{ease:"easeOut",duration:.5}})}),n.jsxs("div",{style:{position:"relative"},children:[n.jsx(F.div,{initial:{opacity:1},animate:{opacity:t?0:1,y:t?5:0},transition:{duration:.3},children:n.jsxs(J9,{children:["Password strength: ",n.jsx(e8,{color:i,children:o})]})}),n.jsx(F.div,{initial:{opacity:0},animate:{opacity:t?1:0,y:t?0:-5},transition:{duration:.3},style:{color:"#ef4444",fontSize:"0.875rem",fontWeight:500,position:"absolute",top:"0"},children:"Password is too weak"})]})]})},Qo=E.p`
  color: var(--ck-body-color);
  text-align: center;
  margin-bottom: 16px;
`,Jo=E.div`
  margin-top: 16px;
  height: 24px;
  text-align: center;
`,Vr=E.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--ck-body-color-muted);
  transition: color 0.3s;

  &:disabled {
    color: var(--ck-body-color-muted) !important;
    cursor: not-allowed;
  }
`,ei=E.p`
  color: var(--ck-body-color-muted);
  text-align: center;
  margin-top: 16px;
  &:hover {
    ${Vr} {
      color: var(--ck-body-color);
    }
  }
`,gn=E.div`
  // Styles from react-international-phone (imported here to avoid importing the whole CSS file for nextjs compatibility)
  .react-international-phone-country-selector{position:relative}.react-international-phone-country-selector-button{display:flex;height:var(--react-international-phone-height, 36px);box-sizing:border-box;align-items:center;justify-content:center;padding:0;border:1px solid var(--react-international-phone-country-selector-border-color, var(--react-international-phone-border-color, gainsboro));margin:0;appearance:button;-webkit-appearance:button;background-color:var(--react-international-phone-country-selector-background-color, var(--react-international-phone-background-color, white));cursor:pointer;text-transform:none;user-select:none}.react-international-phone-country-selector-button:hover{background-color:var(--react-international-phone-country-selector-background-color-hover, whitesmoke)}.react-international-phone-country-selector-button--hide-dropdown{cursor:auto}.react-international-phone-country-selector-button--hide-dropdown:hover{background-color:transparent}.react-international-phone-country-selector-button__button-content{display:flex;align-items:center;justify-content:center}.react-international-phone-country-selector-button__flag-emoji{margin:0 4px}.react-international-phone-country-selector-button__flag-emoji--disabled{opacity:.75}.react-international-phone-country-selector-button__dropdown-arrow{border-top:var(--react-international-phone-country-selector-arrow-size, 4px) solid var(--react-international-phone-country-selector-arrow-color, #777);border-right:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;border-left:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;margin-right:4px;transition:all .1s ease-out}.react-international-phone-country-selector-button__dropdown-arrow--active{transform:rotateX(180deg)}.react-international-phone-country-selector-button__dropdown-arrow--disabled{border-top-color:var(--react-international-phone-disabled-country-selector-arrow-color, #999)}.react-international-phone-country-selector-button--disabled,.react-international-phone-country-selector-button--disabled:hover{background-color:var(--react-international-phone-disabled-country-selector-background-color, var(--react-international-phone-disabled-background-color, whitesmoke))}.react-international-phone-country-selector-button--disabled{cursor:auto}.react-international-phone-flag-emoji{width:var(--react-international-phone-flag-width, 24px);height:var(--react-international-phone-flag-height, 24px);box-sizing:border-box}.react-international-phone-country-selector-dropdown{position:absolute;z-index:1;top:var(--react-international-phone-dropdown-top, 44px);left:var(--react-international-phone-dropdown-left, 0);display:flex;width:300px;max-height:200px;flex-direction:column;padding:4px 0;margin:0;background-color:var(--react-international-phone-dropdown-item-background-color, var(--react-international-phone-background-color, white));box-shadow:var(--react-international-phone-dropdown-shadow, 2px 2px 16px rgba(0, 0, 0, .25));color:var(--react-international-phone-dropdown-item-text-color, var(--react-international-phone-text-color, #222));list-style:none;overflow-y:scroll}.react-international-phone-country-selector-dropdown__preferred-list-divider{height:1px;border:none;margin:var(--react-international-phone-dropdown-preferred-list-divider-margin, 0);background:var(--react-international-phone-dropdown-preferred-list-divider-color, var(--react-international-phone-border-color, gainsboro))}.react-international-phone-country-selector-dropdown__list-item{display:flex;min-height:var(--react-international-phone-dropdown-item-height, 28px);box-sizing:border-box;align-items:center;padding:2px 8px}.react-international-phone-country-selector-dropdown__list-item-flag-emoji{margin-right:8px}.react-international-phone-country-selector-dropdown__list-item-country-name{overflow:hidden;margin-right:8px;font-size:var(--react-international-phone-dropdown-item-font-size, 14px);text-overflow:ellipsis;white-space:nowrap}.react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-dropdown-item-dial-code-color, gray);font-size:var(--react-international-phone-dropdown-item-font-size, 14px)}.react-international-phone-country-selector-dropdown__list-item:hover{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke));cursor:pointer}.react-international-phone-country-selector-dropdown__list-item--selected,.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke);color:var(--react-international-phone-selected-dropdown-item-text-color, var(--react-international-phone-text-color, #222))}.react-international-phone-country-selector-dropdown__list-item--selected .react-international-phone-country-selector-dropdown__list-item-dial-code,.react-international-phone-country-selector-dropdown__list-item--focused .react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-selected-dropdown-item-dial-code-color, var(--react-international-phone-dropdown-item-dial-code-color, gray))}.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke))}.react-international-phone-dial-code-preview{display:flex;align-items:center;justify-content:center;padding:0 8px;border:1px solid var(--react-international-phone-dial-code-preview-border-color, var(--react-international-phone-border-color, gainsboro));margin-right:-1px;background-color:var(--react-international-phone-dial-code-preview-background-color, var(--react-international-phone-background-color, white));color:var(--react-international-phone-dial-code-preview-text-color, var(--react-international-phone-text-color, #222));font-size:var(--react-international-phone-dial-code-preview-font-size, var(--react-international-phone-font-size, 13px))}.react-international-phone-dial-code-preview--disabled{background-color:var(--react-international-phone-dial-code-preview-disabled-background-color, var(--react-international-phone-disabled-background-color, whitesmoke));color:var(--react-international-phone-dial-code-preview-disabled-text-color, var(--react-international-phone-disabled-text-color, #666))}.react-international-phone-input-container{display:flex}.react-international-phone-input-container .react-international-phone-country-selector-button{border-radius:var(--react-international-phone-border-radius, 4px);margin-right:-1px;border-bottom-right-radius:0;border-top-right-radius:0}.react-international-phone-input-container .react-international-phone-input{overflow:visible;height:var(--react-international-phone-height, 36px);box-sizing:border-box;padding:0 8px;border:1px solid var(--react-international-phone-border-color, gainsboro);border-radius:var(--react-international-phone-border-radius, 4px);margin:0;background-color:var(--react-international-phone-background-color, white);border-bottom-left-radius:0;border-top-left-radius:0;color:var(--react-international-phone-text-color, #222);font-family:inherit;font-size:var(--react-international-phone-font-size, 13px)}.react-international-phone-input-container .react-international-phone-input:focus{outline:none}.react-international-phone-input-container .react-international-phone-input--disabled{background-color:var(--react-international-phone-disabled-background-color, whitesmoke);color:var(--react-international-phone-disabled-text-color, #666)}

  border-radius: var(--ck-secondary-button-border-radius);
  font-size: 1rem;
  color: var(--ck-body-color);
  transition: all 0.2s;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;

  box-shadow: var(--ck-secondary-button-box-shadow);
  background: var(--ck-secondary-button-background);

  padding-right: 20px;

  &:focus-within {
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }

  input {
    padding-left: 20px;
    padding-right: 10px;

    border: none !important;
    outline: none !important;
    background: transparent !important;
    box-shadow: none !important;

    ::placeholder {
      color: var(--ck-body-color-muted);
    }
    
    width: 100%;
    height: 100%;
  }

  .react-international-phone-country-selector-button {
    padding-left: 20px;
    padding-right: 10px;
    --react-international-phone-border-color: none;
    --react-international-phone-border-radius: var(--ck-secondary-button-border-radius);
    --react-international-phone-background-color: var(--ck-secondary-button-background);
    --react-international-phone-text-color: var(--ck-body-color);
    border-radius: var(--ck-secondary-button-border-radius) 0px 0px var(--ck-secondary-button-border-radius);
    transition: all .2s ease-out;
  }

  .react-international-phone-country-selector-dropdown {
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }
    
  .react-international-phone-country-selector-button__dropdown-arrow {
    border-top: var(--react-international-phone-country-selector-arrow-size, 4px) solid var(--react-international-phone-country-selector-arrow-color, #777) !important;
    border-right: var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent !important;
    border-left: var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent !important;
    margin-right: 4px;
    transition: all .1s ease-out;
  }
`,z0=E(F.button)`
  color: var(--ck-body-action-color);
  transition: background-color 200ms ease, transform 100ms ease, color 200ms ease, transition 200ms ease, opacity 200ms ease;
  border-radius: 16px;
  
  svg {
    display: block;
    position: relative;
    padding: 4px;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
      color: var(--ck-body-action-hover-color);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`,xt=E.div`
  ${on} {
    height: 64px;
    font-size: 17px;
    font-weight: var(--ck-primary-button-font-weight, 500);
    line-height: 20px;
  }

  ${gn} {
    height: 64px;
  }

  &:first-of-type {
    ${on}, ${gn} {
      margin-top: 0;
    }
  }

  ${Yo} {
    padding: 0 20px;
    justify-content: space-between;
  }

  ${zn} {
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
  }
`,Nt=E.span`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0;
`,it=E.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &[data-shape='squircle'] {
    border-radius: 22.5%;
  }
  &[data-shape='circle'] {
    border-radius: 100%;
  }
  &[data-shape='square'] {
    border-radius: 0;
  }
`,Do=E.button`
  width: 100%;
  color: var(--ck-body-color-muted);
  background: none;
  font-size: 14px;
  margin-top: 10px;
  transition: color 0.2s;

  &:hover {
    color: var(--ck-body-color);
  }
`,H0=({currentMethod:e,onChangeMethod:t})=>{const{uiConfig:r}=U(),o=v.useMemo(()=>r.walletRecovery.allowedMethods.filter(i=>i!==e),[r,e]);if(o.length===0)return null;if(o.length===1){const i=o[0];let a;switch(i){case ge.PASSWORD:a="Use password recovery instead";break;case ge.AUTOMATIC:a="Skip for now";break;case ge.PASSKEY:a="Use passkey recovery instead";break;default:a=i}return n.jsx(Do,{onClick:()=>t(i),children:a})}return n.jsx(Do,{onClick:()=>t("other"),children:"Choose another recovery method"})},t8=({onBack:e,logoutOnBack:t})=>{var r;const{setRoute:o,triggerResize:i}=U(),a=Xe(),{isEnabled:c,requestOTP:s}=Br(),[l,d]=v.useState(null),[u,p]=v.useState(!1),[h,f]=v.useState(!1),[g,m]=v.useState(null),[b,y]=v.useState("idle"),[w,C]=v.useState(!1),k=async _=>{y("loading");try{await a.create({recoveryMethod:ge.AUTOMATIC,otpCode:_}),y("success"),o(L.SOL_CONNECTED)}catch(P){y("error"),C(P instanceof Ee?P.message:"There was an error verifying the OTP. Please try again."),setTimeout(()=>{y("idle"),C(!1)},1e3)}};v.useEffect(()=>{u&&(async()=>{Z.log("Creating Solana wallet with automatic recovery");try{await a.create({recoveryMethod:ge.AUTOMATIC}),o(L.SOL_CONNECTED)}catch(_){const{error:P,isOTPRequired:D}=ws(_,c);if(D&&c)try{const $=await s();f(!0),m($)}catch($){Z.log("Error requesting OTP for wallet creation",$),d(new Error("Failed to send recovery code"))}else Z.log("Error creating Solana wallet",_),d(P)}i()})()},[u]);const[x,S]=v.useState(!0);v.useEffect(()=>{p(!0)},[]);const O=v.useCallback(()=>{y("send-otp"),S(!1)},[]),j=!x||b==="sending-otp"||b==="send-otp",A=v.useMemo(()=>x?b==="sending-otp"?"Sending...":"Resend Code":"Code Sent!",[x,b]);return h&&c?!g?.email&&!g?.phone||!((r=g.email)===null||r===void 0)&&r.includes("@openfort.anonymous")?n.jsxs(Q,{onBack:e,logoutOnBack:t,children:[n.jsx(ze,{isError:!0,description:"You cannot create a wallet without authentication, please link email or phone to continue.",header:"Cannot create wallet."}),n.jsx(te,{onClick:()=>o(L.PROVIDERS),children:"Add an authentication method"})]}):n.jsxs(Q,{onBack:e,logoutOnBack:t,children:[n.jsx(we,{children:"Enter your code"}),n.jsx(At,{height:"100px",marginTop:"8px",marginBottom:"10px",logoCenter:{logo:g?.sentTo==="phone"?n.jsx(Hn,{}):n.jsx(kt,{})}}),n.jsxs(X,{children:[n.jsxs(Qo,{children:["Please check ",n.jsx("b",{children:g?.sentTo==="phone"?g?.phone:g?.email})," and enter your code below."]}),n.jsx(Wr,{length:9,scale:"80%",onComplete:k,isLoading:b==="loading",isError:b==="error",isSuccess:b==="success"}),n.jsxs(Jo,{children:[b==="success"&&n.jsx(X,{$valid:!0,children:"Code verified successfully!"}),b==="error"&&n.jsx(X,{$error:!0,children:w||"Invalid code. Please try again."})]}),n.jsxs(ei,{children:["Didn't receive the code?"," ",n.jsx(Vr,{type:"button",onClick:O,disabled:j,children:A})]})]})]}):n.jsx(Q,{onBack:e,logoutOnBack:t,children:n.jsx(ze,{isError:!!l,header:l?"Error creating wallet.":"Creating wallet...",description:l?l.message:void 0})})},n8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>{const{triggerResize:o,setRoute:i}=U(),a=Xe(),[c,s]=v.useState(!1),[l,d]=v.useState(null);return v.useEffect(()=>{c&&(async()=>{Z.log("Creating Solana wallet with passkey recovery");try{await a.create({recoveryMethod:ge.PASSKEY}),i(L.SOL_CONNECTED)}catch(u){Z.log("Error creating Solana wallet with passkey",u),d(new Error("Failed to create wallet")),s(!1)}})()},[c]),v.useEffect(()=>{s(!0)},[]),v.useEffect(()=>{l&&o()},[l]),n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(ze,{icon:n.jsx(Gn,{}),isError:!!l,header:l?"Invalid passkey.":"Creating wallet with passkey...",description:l?"There was an error creating your passkey. Please try again.":void 0,onRetry:()=>s(!0)}),n.jsx(H0,{currentMethod:ge.PASSKEY,onChangeMethod:e})]})},r8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>{const[o,i]=v.useState(""),[a,c]=v.useState(!1),{triggerResize:s,setRoute:l}=U(),[d,u]=v.useState(!1),[p,h]=v.useState(!1),f=Xe(),g=async()=>{if(Ss(o)<Es){u(!0);return}h(!0);try{await f.create({recoveryMethod:ge.PASSWORD,password:o}),l(L.SOL_CONNECTED)}catch(m){c(m instanceof Ee?m.message:"Failed to create wallet. Please try again.")}h(!1)};return v.useEffect(()=>{a&&s()},[a]),n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(At,{height:"80px",logoCenter:{logo:n.jsx(mt,{}),size:"1.2"},logoTopLeft:{logo:n.jsx(fn,{}),size:"0.75"},logoBottomRight:{logo:n.jsx(fn,{}),size:"0.5"}}),n.jsx(we,{children:"Secure your wallet"}),n.jsxs(X,{style:{textAlign:"center"},children:[n.jsx(Pe,{children:"Set a password for your wallet."}),n.jsxs("form",{onSubmit:m=>{m.preventDefault(),g()},children:[n.jsx(Mt,{value:o,onChange:m=>{d&&u(!1),i(m.target.value)},type:"password",placeholder:"Enter your password",autoComplete:"off"}),n.jsx(U0,{password:o,showPasswordIsTooWeakError:d}),n.jsx(ks,{items:["You will use this password to access your wallet","Make sure it's strong and memorable"]}),a&&n.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsx(X,{style:{height:24,marginTop:12},$error:!0,children:n.jsx(Pe,{children:a})})},a),n.jsx(te,{onClick:g,waiting:p,disabled:p,children:"Create wallet"})]}),n.jsx(H0,{currentMethod:ge.PASSWORD,onChangeMethod:e})]})]})},o8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(we,{children:"Choose a recovery method"}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.PASSKEY),children:[n.jsx(Nt,{children:"Passkey"}),n.jsx(it,{children:n.jsx(Gn,{})})]})}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.PASSWORD),children:[n.jsx(Nt,{children:"Password"}),n.jsx(it,{children:n.jsx(mt,{})})]})}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.AUTOMATIC),children:[n.jsx(Nt,{children:"Automatic"}),n.jsx(it,{children:n.jsx(fn,{})})]})})]}),i8={[ge.AUTOMATIC]:({onBack:e,logoutOnBack:t})=>n.jsx(t8,{onBack:e,logoutOnBack:t}),[ge.PASSKEY]:n8,[ge.PASSWORD]:r8,other:o8},a8=({onBack:e,logoutOnBack:t})=>{const{uiConfig:r,triggerResize:o}=U(),[i,a]=v.useState(null);v.useEffect(()=>{o()},[i]);const c=i??r.walletRecovery.defaultMethod,s=i8[c];return s?n.jsx(s,{onChangeMethod:a,onBack:e,logoutOnBack:t}):(Z.error(`Unsupported recovery method: ${c}`),null)},G0=({currentMethod:e,onChangeMethod:t})=>{const{uiConfig:r}=U(),o=v.useMemo(()=>r.walletRecovery.allowedMethods.filter(c=>c!==e),[r,e]);if(o.length===0)return null;if(o.length===1){const i=o[0];let a;switch(i){case ge.PASSWORD:a="Use password recovery instead";break;case ge.AUTOMATIC:a="Skip for now";break;case ge.PASSKEY:a="Use passkey recovery instead";break;default:a=i}return n.jsx(Do,{onClick:()=>{t(i)},children:a})}return n.jsx(Do,{onClick:()=>t("other"),children:"Choose another recovery method"})},s8=({onBack:e,logoutOnBack:t})=>{var r;const{embeddedState:o,isLoadingAccounts:i}=ve(),{setRoute:a,triggerResize:c,walletConfig:s}=U(),[l,d]=v.useState(null),{create:u}=He(),{isEnabled:p,requestOTP:h}=Br(),[f,g]=v.useState(!1),m=v.useRef(!1),b=v.useRef(!1),[y,w]=v.useState(!1),[C,k]=v.useState(null),[x,S]=v.useState("idle"),[O,j]=v.useState(!1),[A,_]=v.useState(!0),P=async B=>{S("loading");try{await u({recoveryMethod:ge.AUTOMATIC,otpCode:B}),S("success"),a(L.CONNECTED_SUCCESS)}catch(W){S("error"),j(W instanceof Ee?W.message:"There was an error verifying the OTP"),Z.log("Error verifying OTP for wallet recovery",W),setTimeout(()=>{S("idle"),j(!1)},1e3)}};v.useEffect(()=>{f&&(m.current||i||(m.current=!0,(async()=>{Z.log("Creating wallet Automatic recover");try{await u({recoveryMethod:ge.AUTOMATIC}),g(!1),a(L.CONNECTED_SUCCESS)}catch(B){g(!1);const{error:W,isOTPRequired:H}=ws(B,p);if(H&&p)try{const K=await h();w(!0),k(K)}catch(K){Z.log("Error requesting OTP for wallet recovery",K),d(new Error("Failed to send recovery code"))}else Z.log("Error creating wallet",B),d(W)}finally{m.current=!1}c()})()))},[f,u,p,h,c,i]),v.useEffect(()=>{o===mr.EMBEDDED_SIGNER_NOT_CONFIGURED&&s?.connectOnLogin!==!1&&(b.current||(b.current=!0,g(!0)))},[o,s?.connectOnLogin]);const D=v.useCallback(()=>{S("send-otp"),_(!1)},[]),$=!A||x==="sending-otp"||x==="send-otp",q=v.useMemo(()=>A?x==="sending-otp"?"Sending...":"Resend Code":"Code Sent!",[A,x]);return y&&p?!C?.email&&!C?.phone||!((r=C.email)===null||r===void 0)&&r.includes("@openfort.anonymous")?n.jsxs(Q,{onBack:e,logoutOnBack:t,children:[n.jsx(ze,{isError:!0,description:"You cannot create a wallet without authentication, please link email or phone to continue.",header:"Cannot create wallet."}),n.jsx(te,{onClick:()=>a(L.PROVIDERS),children:"Add an authentication method"})]}):n.jsxs(Q,{onBack:e,logoutOnBack:t,children:[n.jsx(we,{children:"Enter your code"}),n.jsx(At,{height:"100px",marginTop:"8px",marginBottom:"10px",logoCenter:{logo:C?.sentTo==="phone"?n.jsx(Hn,{}):n.jsx(kt,{})}}),n.jsxs(X,{children:[n.jsxs(Qo,{children:["Please check ",n.jsx("b",{children:C?.sentTo==="phone"?C?.phone:C?.email})," and enter your code below."]}),n.jsx(Wr,{length:9,scale:"80%",onComplete:P,isLoading:x==="loading",isError:x==="error",isSuccess:x==="success"}),n.jsxs(Jo,{children:[x==="success"&&n.jsx(X,{$valid:!0,children:"Code verified successfully!"}),x==="error"&&n.jsx(X,{$error:!0,children:O||"Invalid code. Please try again."})]}),n.jsxs(ei,{children:["Didn't receive the code?"," ",n.jsx(Vr,{type:"button",onClick:D,disabled:$,children:q})]})]})]}):!f&&!m.current&&!l?n.jsxs(Q,{onBack:e,logoutOnBack:t,children:[n.jsx(we,{children:"Create wallet"}),n.jsx(X,{style:{textAlign:"center"},children:"Create an embedded wallet to get started."}),n.jsx(te,{onClick:()=>{b.current=!1,g(!0)},children:"Create wallet"})]}):n.jsx(Q,{onBack:e,logoutOnBack:t,children:n.jsx(ze,{isError:!!l,header:l?"Error creating wallet.":"Creating wallet...",description:l?l.message:void 0,onRetry:l?()=>{b.current=!1,d(null),g(!0)}:void 0})})},c8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>{const{triggerResize:o,setRoute:i,walletConfig:a}=U(),{create:c}=He(),[s,l]=v.useState(!1),d=v.useRef(!1),u=v.useRef(!1),[p,h]=v.useState(null),{embeddedState:f}=ve();return v.useEffect(()=>{s&&(d.current||(d.current=!0,(async()=>{Z.log("Creating wallet passkey recovery");try{await c({recoveryMethod:ge.PASSKEY}),l(!1),i(L.CONNECTED_SUCCESS)}catch(g){Z.log("Error creating wallet",g),h(new Error("Failed to create wallet")),l(!1)}finally{d.current=!1}})()))},[s,c]),v.useEffect(()=>{f===mr.EMBEDDED_SIGNER_NOT_CONFIGURED&&a?.connectOnLogin!==!1&&(u.current||(u.current=!0,l(!0)))},[f,a?.connectOnLogin]),v.useEffect(()=>{p&&o()},[p]),n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(ze,{icon:n.jsx(Gn,{}),isError:!!p,header:p?"Invalid passkey.":"Creating wallet with passkey...",description:p?"There was an error creating your passkey. Please try again.":void 0,onRetry:()=>l(!0)}),n.jsx(G0,{currentMethod:ge.PASSKEY,onChangeMethod:e})]})},l8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>{const[o,i]=v.useState(""),[a,c]=v.useState(!1),{triggerResize:s,setRoute:l}=U(),[d,u]=v.useState(!1),[p,h]=v.useState(!1),{create:f}=He(),g=async()=>{if(Ss(o)<Es){u(!0);return}h(!0);try{await f({recoveryMethod:ge.PASSWORD,password:o}),Z.log("Recovery success"),l(L.CONNECTED_SUCCESS)}catch(m){c(m instanceof Ee?m.message:"There was an error recovering your account")}h(!1)};return v.useEffect(()=>{a&&s()},[a]),n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(At,{height:"80px",logoCenter:{logo:n.jsx(mt,{}),size:"1.2"},logoTopLeft:{logo:n.jsx(k0,{}),size:"0.75"},logoBottomRight:{logo:n.jsx(fn,{}),size:"0.5"}}),n.jsx(we,{children:"Secure your wallet"}),n.jsxs(X,{style:{textAlign:"center"},children:[n.jsx(Pe,{children:"Set a password for your wallet."}),n.jsxs("form",{onSubmit:m=>{m.preventDefault(),g()},children:[n.jsx(Mt,{value:o,onChange:m=>{d&&u(!1),i(m.target.value)},type:"password",placeholder:"Enter your password",autoComplete:"off"}),n.jsx(U0,{password:o,showPasswordIsTooWeakError:d}),n.jsx(ks,{items:["You will use this password to access your wallet","Make sure it's strong and memorable"]}),a&&n.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsx(X,{style:{height:24,marginTop:12},$error:!0,children:n.jsx(Pe,{children:a})})},a),n.jsx(te,{onClick:g,waiting:p,disabled:p,children:"Create wallet"})]}),n.jsx(G0,{currentMethod:ge.PASSWORD,onChangeMethod:e})]})]})},d8=({onChangeMethod:e,onBack:t,logoutOnBack:r})=>n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(we,{children:"Choose a recovery method"}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.PASSKEY),children:[n.jsx(Nt,{children:"Passkey"}),n.jsx(it,{children:n.jsx(Gn,{})})]})}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.PASSWORD),children:[n.jsx(Nt,{children:"Password"}),n.jsx(it,{children:n.jsx(mt,{})})]})}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>e(ge.AUTOMATIC),children:[n.jsx(Nt,{children:"Automatic"}),n.jsx(it,{children:n.jsx(fn,{})})]})})]}),q0=({onBack:e,logoutOnBack:t})=>{const{uiConfig:r,triggerResize:o}=U(),[i,a]=v.useState(null);switch(v.useEffect(()=>{o()},[i]),i??r.walletRecovery.defaultMethod){case ge.PASSWORD:return n.jsx(l8,{onChangeMethod:a,onBack:e,logoutOnBack:t});case ge.AUTOMATIC:return n.jsx(s8,{onBack:e,logoutOnBack:t});case ge.PASSKEY:return n.jsx(c8,{onChangeMethod:a,onBack:e,logoutOnBack:t});case"other":return n.jsx(d8,{onChangeMethod:a,onBack:()=>{a(null)},logoutOnBack:t});default:return Z.error(`Unsupported recovery method: ${i}${r.walletRecovery.defaultMethod}`),null}},u8=()=>{const[e,t]=v.useState(!1),{setRoute:r}=U();return e?n.jsx(q0,{onBack:()=>t(!1),logoutOnBack:!1}):n.jsxs(Q,{onBack:L.PROVIDERS,logoutOnBack:!0,children:[n.jsx(we,{children:"Choose an option"}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>t(!0),children:[n.jsx(Nt,{children:"Create Wallet"}),n.jsx(it,{children:n.jsx(Mv,{})})]})}),n.jsx(xt,{children:n.jsxs(te,{onClick:()=>{r({route:L.CONNECTORS,connectType:"link"})},children:[n.jsx(Nt,{children:"Connect Wallet"}),n.jsx(it,{children:n.jsx(Ye.OtherWallets,{})})]})})]})},p8=()=>{const{uiConfig:e,walletConfig:t,setRoute:r}=U(),{user:o,chainType:i}=ve(),a=He(),c=Xe(),l=(i===ne.EVM?a:c).status==="connected";return v.useEffect(()=>{l&&o&&r(L.CONNECTED_SUCCESS)},[l,o,r]),e.linkWalletOnSignUp===oi.OPTIONAL?n.jsx(u8,{}):e.linkWalletOnSignUp===oi.REQUIRED||!t&&e.linkWalletOnSignUp!==oi.DISABLED?n.jsx(Cs,{logoutOnBack:!0}):n.jsx(q0,{onBack:L.PROVIDERS,logoutOnBack:!0})},Pl={[ne.EVM]:n.jsx(p8,{}),[ne.SVM]:n.jsx(a8,{onBack:L.PROVIDERS,logoutOnBack:!0})},_a=()=>{var e;const{chainType:t}=ve();return(e=Pl[t])!==null&&e!==void 0?e:Pl[ne.EVM]};function h8(){const[e,t]=v.useState({width:0,height:0});return v.useEffect(()=>{function r(){t({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",r),r(),()=>window.removeEventListener("resize",r)},[]),e}const f8=(e,t)=>{const r=Array.prototype.slice.call(D1.create(e,{errorCorrectionLevel:t}).modules.data,0),o=Math.sqrt(r.length);return r.reduce((i,a,c)=>(c%o===0?i.push([a]):i[i.length-1].push(a))&&i,[])};function g8({ecl:e="M",size:t=200,uri:r,clearArea:o=!1,image:i,imageBackground:a="transparent"}){const c=o?76:0,s=t-20,l=v.useMemo(()=>{const d=[],u=f8(r,e),p=s/u.length;if([{x:0,y:0},{x:1,y:0},{x:0,y:1}].forEach(({x:b,y})=>{const w=(u.length-7)*p*b,C=(u.length-7)*p*y;for(let k=0;k<3;k++)d.push(n.jsx("rect",{fill:k%2!==0?"var(--ck-qr-background, var(--ck-body-background))":"var(--ck-qr-dot-color)",rx:(k-2)*-5+(k===0?2:3),ry:(k-2)*-5+(k===0?2:3),width:p*(7-k*2),height:p*(7-k*2),x:w+p*k,y:C+p*k},`${k}-${b}-${y}`))}),i){const b=(u.length-7)*p*1,y=(u.length-7)*p*1;d.push(n.jsxs(n.Fragment,{children:[n.jsx("rect",{fill:a,rx:12,ry:12,width:p*7,height:p*7,x:b+p*0,y:y+p*0}),n.jsx("foreignObject",{width:p*7,height:p*7,x:b+p*0,y:y+p*0,children:n.jsx("div",{style:{borderRadius:12,overflow:"hidden"},children:i})})]}))}const f=Math.floor((c+25)/p),g=u.length/2-f/2,m=u.length/2+f/2-1;return u.forEach((b,y)=>{b.forEach((w,C)=>{u[y][C]&&(y<7&&C<7||y>u.length-8&&C<7||y<7&&C>u.length-8||(i||!(y>g&&y<m&&C>g&&C<m))&&d.push(n.jsx("circle",{cx:y*p+p/2,cy:C*p+p/2,fill:"var(--ck-qr-dot-color)",r:p/3},`qr-dot-${y}-${C}`)))})}),d},[e,s,r]);return n.jsxs("svg",{height:s,width:s,viewBox:`0 0 ${s} ${s}`,style:{width:s,height:s},children:[n.jsx("title",{children:"QR Code"}),n.jsx("rect",{fill:"transparent",height:s,width:s}),l]})}const v8=E(F.div)`
  z-index: 3;
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px 0 2px;
  border-radius: var(--ck-qr-border-radius, 24px);
  background: var(--ck-qr-background, transparent);
  box-shadow: 0 0 0 1px var(--ck-qr-border-color);
  backface-visibility: hidden;
  svg {
    display: block;
    max-width: 100%;
    width: 100%;
    height: auto;
  }
`,m8=E(F.div)`
  position: absolute;
  inset: 13px;
  svg {
    width: 100% !important;
    height: auto !important;
  }
`,x8=je`
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`,b8=E(F.div)`
  --color: var(--ck-qr-dot-color);
  --bg: var(--ck-qr-background, var(--ck-body-background));

  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    z-index: 4;
    position: relative;
    width: 28%;
    height: 28%;
    border-radius: 20px;
    background: var(--bg);
    box-shadow: 0 0 0 7px var(--bg);
  }
  > span {
    z-index: 4;
    position: absolute;
    background: var(--color);
    border-radius: 12px;
    width: 13.25%;
    height: 13.25%;
    box-shadow: 0 0 0 4px var(--bg);
    &:before {
      content: '';
      position: absolute;
      inset: 9px;
      border-radius: 3px;
      box-shadow: 0 0 0 4px var(--bg);
    }
    &:nth-child(1) {
      top: 0;
      left: 0;
    }
    &:nth-child(2) {
      top: 0;
      right: 0;
    }
    &:nth-child(3) {
      bottom: 0;
      left: 0;
    }
  }
  &:before {
    z-index: 3;
    content: '';
    position: absolute;
    inset: 0;
    background: repeat;
    background-size: 1.888% 1.888%;
    background-image: radial-gradient(var(--color) 41%, transparent 41%);
  }
  &:after {
    z-index: 5;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
    background-size: 200% 100%;
    animation: ${x8} 1000ms linear infinite both;
  }
`,y8=E(F.div)`
  z-index: 6;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(50%) scale(0.9999); // Shifting fix
`,C8=E(F.div)`
  z-index: 6;
  position: absolute;
  left: 50%;
  overflow: hidden;

  transform: translate(-50%, -50%) scale(0.9999); // Shifting fix

  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }

  ${e=>e.$wcLogo?pe`
          width: 29%;
          height: 20.5%;
        `:pe`
          width: 28%;
          height: 28%;
          border-radius: 17px;
          &:before {
            pointer-events: none;
            z-index: 2;
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
          }
        `}
`;function js({value:e,image:t,imageBackground:r,imagePosition:o="center",tooltipMessage:i}){const c=h8().width>920&&i?n.jsx(Tr,{xOffset:139,yOffset:5,delay:.1,message:i,children:t}):t;return n.jsx(v8,{children:n.jsxs(m8,{children:[t&&n.jsx(y8,{children:n.jsx(C8,{$wcLogo:o!=="center",style:{background:o==="center"?r:void 0},children:c})}),n.jsx(Ve,{initial:!1,children:e?n.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,position:"absolute",inset:[0,0]},transition:{duration:.2},children:n.jsx(g8,{uri:e,size:288,ecl:"M",clearArea:!!(o==="center"&&t)})},e):n.jsxs(b8,{initial:{opacity:.1},animate:{opacity:.1},exit:{opacity:0,position:"absolute",inset:[0,0]},transition:{duration:.2},children:[n.jsx("span",{}),n.jsx("span",{}),n.jsx("span",{}),n.jsx("div",{})]})})]})})}js.displayName="CustomQRCode";const w8=()=>{var e,t,r,o;const i=U(),a=an(i.connector.id),c=bt({CONNECTORNAME:(e=a?.name)!==null&&e!==void 0?e:"UNKNOWN CONNECTOR"});if(!a)return n.jsx(n.Fragment,{children:"Wallet not found"});const s={ios:(t=a.downloadUrls)===null||t===void 0?void 0:t.ios,android:(r=a.downloadUrls)===null||r===void 0?void 0:r.android,redirect:(o=a.downloadUrls)===null||o===void 0?void 0:o.download},l=s.ios&&s.android?c.downloadAppScreen_iosAndroid:s.ios?c.downloadAppScreen_ios:c.downloadAppScreen_android;return n.jsx(Q,{children:n.jsxs(Te,{style:{paddingBottom:4,gap:14},children:[s.redirect&&n.jsx(js,{value:s.redirect}),!s.redirect&&n.jsx(n.Fragment,{children:"No download link available"}),n.jsx(X,{style:{fontSize:15,lineHeight:"20px",padding:"0 12px"},children:l})]})})},k8=E.span`
  padding: 12px 4px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1rem;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & button {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }
`,eo={initial:{opacity:0},animate:{opacity:1,transition:{duration:.3,ease:[.25,1,.5,1]}},exit:{position:"absolute",opacity:0,transition:{duration:0}}},E8=()=>{const[e,t]=fe.useState(""),{setRoute:r,triggerResize:o,setEmailInput:i,emailInput:a,previousRoute:c}=U(),[s,l]=fe.useState(!1),{signUpEmail:d,signInEmail:u,error:p,isLoading:h}=nd({recoverWalletAutomatically:!1}),f=async()=>{if(s)return g();l(!1),setTimeout(()=>{o()});const{error:w,requiresEmailVerification:C}=await u({email:a,password:e});Z.log("SIGN IN RESPONSE",{error:w,requiresEmailVerification:C}),w?setTimeout(()=>{o()},100):r(C?L.EMAIL_VERIFICATION:L.LOAD_WALLETS)},g=async()=>{l(!0),setTimeout(()=>{o()});const{error:w,requiresEmailVerification:C}=await d({email:a,password:e});Z.log("SIGN UP RESPONSE",{error:w,requiresEmailVerification:C}),w?setTimeout(()=>{o()},100):C?r(L.EMAIL_VERIFICATION):(i(""),r(L.LOAD_WALLETS))},m=()=>{l(w=>!w)},b=p?p.message==="Unauthorized"?"Invalid email or password":p.message:null,y=v.useMemo(()=>c?.route===L.EMAIL_VERIFICATION?L.PROVIDERS:"back",[c]);return n.jsxs(Q,{onBack:y,children:[n.jsxs("form",{onSubmit:w=>{w.preventDefault(),f()},noValidate:!0,children:[n.jsx(Mt,{style:{marginTop:0},value:a,onChange:w=>i(w.target.value),type:"email",placeholder:"Enter your email",disabled:h}),n.jsx(Mt,{value:e,onChange:w=>t(w.target.value),type:"password",placeholder:"Enter your password",disabled:h,autoFocus:!0}),n.jsx(X,{style:{marginTop:12},$error:!!p,children:n.jsx(Ve,{initial:!1,children:n.jsxs(F.div,{initial:"initial",animate:"animate",exit:"exit",variants:eo,children:[n.jsx(Pe,{maxFontSize:80,children:n.jsx("span",{style:{textAlign:"center",color:"var(--color-error)",marginRight:"4px"},children:b})},p?"text-error":"text-no-error"),n.jsx(Pe,{maxFontSize:80,children:n.jsx(Xo,{type:"button",onClick:()=>{r(L.FORGOT_PASSWORD)},children:"Forgot password?"})})]},p?"error":"no-error")})}),n.jsx(te,{onClick:f,disabled:h,waiting:h,children:n.jsx(Ve,{initial:!1,children:h?n.jsx(ur,{initial:"initial",animate:"animate",exit:"exit",variants:eo,children:s?"Signing up...":"Logging in..."},"connectedText"):s?n.jsx(ur,{initial:"initial",animate:"animate",exit:"exit",variants:eo,children:"Sign up"},"connectedText"):n.jsx(ur,{initial:"initial",animate:"animate",exit:"exit",variants:eo,children:"Sign in"},"connectedText")})})]}),n.jsxs(k8,{children:["or",n.jsx("button",{type:"button",onClick:m,disabled:h,children:s?"Sign in":"Sign up"})]})]})},S8=1e4,j8=2e3,_8=2e3,A8=()=>{const{emailInput:e,previousRoute:t,setRoute:r,setEmailInput:o}=U(),{isLoading:i,requestEmailOtp:a,signInEmailOtp:c}=vg({recoverWalletAutomatically:!1}),s=v.useMemo(()=>t?.route===L.EMAIL_VERIFICATION?L.PROVIDERS:"back",[t]),[l,d]=v.useState(!0),[u,p]=v.useState("idle"),h=v.useRef(!1),f=v.useCallback(async()=>{const{error:w}=await a({email:e});w?(Z.error("Error requesting email OTP:",w),p("error")):p("idle")},[e,a]);v.useEffect(()=>{h.current||(h.current=!0,f())},[f]);const g=v.useCallback(async w=>{Z.log("OTP entered:",w),p("loading");const{error:C}=await c({email:e,otp:w});C?(Z.error("Error logging in with email OTP:",C),p("error")):p("success")},[e,c]);v.useEffect(()=>{let w;switch(u){case"send-otp":p("sending-otp"),f();break;case"success":w=setTimeout(()=>{o(""),r(L.LOAD_WALLETS)},j8);break;case"error":w=setTimeout(()=>{p("idle")},_8);break}return()=>{w&&clearTimeout(w)}},[u,f,o,r]),v.useEffect(()=>{if(l)return;const w=setTimeout(()=>{d(!0)},S8);return()=>clearTimeout(w)},[l]);const m=v.useMemo(()=>l?u==="sending-otp"?"Sending...":"Resend Code":"Code Sent!",[l,u]),b=v.useCallback(()=>{p("send-otp"),d(!1)},[]),y=!l||u==="sending-otp"||u==="send-otp";return n.jsxs(Q,{onBack:s,children:[n.jsx(we,{children:"Enter your code"}),n.jsx(At,{height:"100px",marginTop:"8px",marginBottom:"10px",logoCenter:{logo:n.jsx(kt,{})}}),n.jsxs(X,{children:[n.jsxs(Qo,{children:["Please check ",n.jsx("b",{children:e})," for an email from openfort.io and enter your code below."]}),n.jsx(Wr,{onComplete:g,isLoading:u==="loading"||i,isError:u==="error",isSuccess:u==="success"}),n.jsxs(Jo,{children:[u==="success"&&n.jsx(X,{$valid:!0,children:"Code verified successfully!"}),u==="error"&&n.jsx(X,{$error:!0,children:"Invalid code. Please try again."})]}),n.jsxs(ei,{children:["Didn't receive the code?"," ",n.jsx(Vr,{type:"button",onClick:b,disabled:y,children:m})]})]}),n.jsx($r,{})]})},T8=()=>{const{setRoute:e,emailInput:t,setEmailInput:r}=U(),{user:o}=ve(),i=!!o,[a,c]=v.useState(!0),[s,l]=v.useState(null),d=v.useRef(!1);return v.useEffect(()=>{if(d.current)return;d.current=!0;const u=new URL(window.location.href);if(t){c(!1);return}const p=u.searchParams.get("email"),h=()=>{["state","openfortEmailVerificationUI","email","openfortAuthProvider"].forEach(f=>{u.searchParams.delete(f)}),window.history.replaceState({},document.title,u.toString())};if(Z.log("Email verification",p),!p){e(L.EMAIL_LOGIN);return}try{r(p),l({success:!0})}catch(f){l({success:!1,error:"There was an error verifying your email. Please try again."}),Z.log("Error verifying email",f)}finally{h(),c(!1)}},[]),a?n.jsx(Q,{children:n.jsx(ze,{header:"Checking if account is verified"})}):n.jsxs(Q,{children:[n.jsx(At,{height:"190px",logoCenter:{logo:n.jsx(kt,{})},logoTopLeft:{logo:n.jsx(kt,{})},logoBottomRight:{logo:n.jsx(kt,{})},logoTopRight:{logo:n.jsx(kt,{})},logoBottomLeft:{logo:n.jsx(kt,{})}}),n.jsx(Te,{children:s?n.jsxs(n.Fragment,{children:[n.jsx(Me,{$small:!0,children:s.success?"Email verified":"Email verification failed"}),n.jsxs(X,{children:[s.error?s.error:"Your email has been verified.",n.jsx(te,{onClick:()=>{e(L.EMAIL_LOGIN)},style:{marginTop:12},children:"Continue"})]})]}):n.jsxs(n.Fragment,{children:[n.jsx(Me,{$small:!0,children:"Email sent"}),n.jsxs(X,{style:{height:40},children:["Please check your email.",n.jsx("br",{}),t]}),n.jsx(Xo,{style:{textDecoration:"underline"},onClick:()=>{e(i?L.CONNECTED:L.EMAIL_LOGIN)},children:i?"Go back":"Go back to login"})]})})]})},O8=()=>{const{exportPrivateKey:e}=He(),[t,r]=v.useState(null),[o,i]=v.useState(null),[a,c]=v.useState(!1);return v.useEffect(()=>{(async()=>{try{const l=await e();r(l)}catch{i("You cannot export the private key for this wallet."),r(null)}})()},[e]),n.jsxs(Q,{children:[n.jsx(we,{children:"Export private key"}),n.jsx(At,{height:"110px",logoCenter:{logo:n.jsx(mt,{})},logoTopLeft:{logo:n.jsx(mt,{})},logoBottomRight:{logo:n.jsx(mt,{})},logoTopRight:{logo:n.jsx(mt,{})},logoBottomLeft:{logo:n.jsx(mt,{})}}),n.jsxs(Te,{children:[n.jsxs(X,{children:[n.jsx("p",{style:{marginBottom:6},children:"With your private key, you can access your account outside this application."}),n.jsx("p",{children:"Keep it safe and never share it with anyone you don't trust."})]}),a?o?n.jsx(X,{style:{marginTop:12},$error:!0,children:o}):t?n.jsx("div",{style:{marginTop:12},children:n.jsxs(Ft,{value:t,children:[t.slice(0,10),"...",t.slice(-10)]})}):n.jsx(n.Fragment,{children:"Loading..."}):n.jsx(te,{onClick:()=>c(!0),style:{marginTop:12},children:"Export key"})]})]})},R8=()=>{const{triggerResize:e,emailInput:t,setEmailInput:r,setRoute:o}=U(),{client:i}=ve(),[a,c]=fe.useState(!1),[s,l]=fe.useState(""),[d,u]=fe.useState("");v.useEffect(()=>{e()},[!d]),v.useEffect(()=>{if(s){const h=setTimeout(()=>{l("")},5e3);return()=>clearTimeout(h)}},[s]),v.useEffect(()=>{if(d){const h=setTimeout(()=>{u("")},5e3);return()=>clearTimeout(h)}},[d]);const p=async()=>{const h=window.location.origin+window.location.pathname;c(!0),i.auth.requestResetPassword({email:t,redirectUrl:`${h}?openfortForgotPasswordUI=true&email=${t}`}).then(()=>{l("Reset email sent."),setTimeout(()=>{o(L.EMAIL_LOGIN)},1e3),c(!1)}).catch(f=>{var g;Z.log(f);const m=(g=f?.response)===null||g===void 0?void 0:g.status;u(m===400?"Email not verified.":"Error sending reset email."),c(!1)})};return n.jsx(Q,{children:n.jsxs("form",{onSubmit:h=>{h.preventDefault(),p()},children:[n.jsx(Mt,{style:{marginTop:0},value:t,onChange:h=>r(h.target.value),type:"email",placeholder:"Enter your email",disabled:a}),d&&n.jsx(X,{style:{marginTop:12},$error:!0,children:n.jsx(Pe,{children:d})}),n.jsx(te,{onClick:p,disabled:a||!!s,waiting:a,children:s||"Send reset email"})]})})},L8=()=>{const e=window.location.href.replace("?state=","&state="),t=new URL(e),[r,o]=fe.useState(""),[i,a]=fe.useState(!1),c=t.searchParams.get("email"),s=async()=>{};return n.jsx(Q,{children:n.jsxs("form",{onSubmit:l=>{l.preventDefault(),s()},children:[n.jsx(Pe,{children:c?`Reset password for ${c}`:"Reset password"}),n.jsx(Mt,{value:r,onChange:l=>o(l.target.value),type:"password",placeholder:"Enter your new password",disabled:i}),n.jsx(te,{onClick:s,disabled:i,waiting:i,children:"Reset password"})]})})},I8=()=>new URL(window.location.href).searchParams.get("openfortForgotPasswordUI")?n.jsx(L8,{}):n.jsx(R8,{}),Dl={initial:{opacity:0},animate:{opacity:1,transition:{duration:.3,ease:[.25,1,.5,1]}},exit:{position:"absolute",opacity:0,transition:{duration:.3,ease:[.25,1,.5,1]}}},N8=()=>{const{setRoute:e,triggerResize:t,emailInput:r,setEmailInput:o}=U(),{client:i}=ve(),[a,c]=fe.useState(!1),[s,l]=fe.useState(!1),{linkEmail:d}=nd(),u=async()=>{c(!0),await i.validateAndRefreshToken();try{await d({email:r}),e(L.EMAIL_VERIFICATION)}catch(p){Z.log("Link error:",p),l("Could not link email. Please try again."),c(!1),t()}};return n.jsxs(Q,{children:[n.jsx(we,{children:"Link your email"}),n.jsxs("form",{onSubmit:p=>{p.preventDefault(),u()},children:[n.jsx(Mt,{style:{marginTop:0},value:r,onChange:p=>o(p.target.value),type:"email",placeholder:"Enter your email",disabled:a}),s&&n.jsx(X,{style:{height:24,marginTop:12},$error:!0,children:s}),n.jsx(te,{onClick:u,disabled:a,waiting:a,children:n.jsx(Ve,{initial:!1,children:a?n.jsx(ur,{initial:"initial",animate:"animate",exit:"exit",variants:Dl,children:"Linking email..."},"connectedText"):n.jsx(ur,{initial:"initial",animate:"animate",exit:"exit",variants:Dl,children:"Link email"},"connectedText")})})]})]})},fr=e=>{switch(e){case"wallet":case"siwe":return"Wallet";case"email":case"credential":return"Email";default:return e.charAt(0).toUpperCase()+e.slice(1)}},Z0=E.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`,K0=E.div`
  ${on} {
    font-weight: var(--ck-primary-button-font-weight, 500);
  }

  &:first-of-type {
    ${on}, ${gn} {
      margin-top: 0;
    }
  }

  ${Yo} {
    padding: 0 20px;
  }

  ${zn} {
    width: 100%;
    max-width: 100%;
  }
`,Y0=E.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,F8=E.div`
`,Ni=E.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ck-body-color-muted);
  text-align: start;
  max-width: 210px;
`,Aa=({walletAddress:e})=>{var t,r,o;const i=Wo(),a=ot(),[c,s]=v.useState(void 0),l=U(),d=Un(),u=i?.kind==="bridge"&&!!a?.getEnsName&&((t=a.chainId)!==null&&t!==void 0?t:0)===1;v.useEffect(()=>{!u||!e||!a?.getEnsName||a.getEnsName({address:e}).then(s).catch(h=>{})},[u,a,e]);const p=["web95","rounded","minimal"].includes((o=(r=d.theme)!==null&&r!==void 0?r:l.uiConfig.theme)!==null&&o!==void 0?o:"")?"....":void 0;return c??_t(e,p)},_s=({account:e})=>{var t;const{user:r}=Rr();switch(e.provider){case"wallet":case"siwe":return n.jsx(Ni,{children:n.jsx(Aa,{walletAddress:e.accountId})});case"phone":return n.jsx(Ni,{children:e.accountId});default:return n.jsx(Ni,{style:{textTransform:r?.email?"none":"capitalize"},children:(t=r?.email)!==null&&t!==void 0?t:e.provider})}},M8=({account:e})=>{var t;const r=Ba(),o=v.useMemo(()=>r.find(i=>{var a;return((a=i.id)===null||a===void 0?void 0:a.toLowerCase())===e.walletClientType}),[e]);return e.walletClientType==="walletconnect"?n.jsx(Ye.WalletConnect,{}):o?n.jsx(n.Fragment,{children:(t=o.iconConnector)!==null&&t!==void 0?t:o.icon}):n.jsx(Tv,{})},ti=({account:e})=>{switch(e.provider){case"email":case"credential":return n.jsx(kt,{});case"wallet":case"siwe":return n.jsx(M8,{account:e});case"phone":return n.jsx(Hn,{});case"google":case"twitter":case"facebook":return ln[e.provider];default:return n.jsx(Pe,{children:e.provider.substring(0,4).toUpperCase()})}},X0=E.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`,Q0=E.div`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ck-body-background-secondary);
  border-radius: 28px;
`,J0=E.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`,P8=({account:e})=>{var t,r;const o=e.accountId,i=U(),{chainType:a}=ve(),c=Un(),s=Vn({address:o,chainType:a,enabled:!!o}),l=s.status==="success"?s.name:void 0,d=["web95","rounded","minimal"].includes((r=(t=c.theme)!==null&&t!==void 0?t:i.uiConfig.theme)!==null&&r!==void 0?r:"")?"....":void 0;return n.jsxs(n.Fragment,{children:[n.jsx(Me,{children:n.jsx(Ft,{value:o,children:l??_t(o,d)})}),n.jsxs("div",{style:{marginTop:"16px"},children:["Linked via Sign-In with Ethereum (SIWE)",n.jsx(te,{onClick:()=>i.setRoute({route:"removeLinkedProvider",account:e}),children:"Remove this wallet"})]})]})},D8=({account:e})=>{const{user:t}=Rr(),{setRoute:r}=U();return n.jsxs(n.Fragment,{children:[n.jsx(Me,{children:e.provider.charAt(0).toUpperCase()+e.provider.slice(1)}),n.jsxs("div",{style:{marginTop:"16px"},children:[t?.email,n.jsxs(te,{onClick:()=>r({route:"removeLinkedProvider",account:e}),children:["Remove ",e.provider]})]})]})},$8=()=>{const{route:e}=U(),t=v.useRef(null),r=v.useMemo(()=>e.route==="linkedProvider"?(t.current=e.account,e.account):t.current,[e]),o=i=>{switch(i.provider){case"siwe":return n.jsx(P8,{account:i});case"google":case"facebook":case"twitter":return n.jsx(D8,{account:i});default:return n.jsxs("div",{style:{marginTop:"16px",display:"flex",alignItems:"center",gap:"8px",flexDirection:"column"},children:[n.jsxs("div",{children:["Authentication method: ",n.jsx("b",{children:fr(i.provider)})]}),n.jsx(Pe,{children:n.jsx(_s,{account:i})})]})}};return r?n.jsxs(Q,{children:[n.jsx(we,{children:fr(r.provider)}),n.jsxs(Te,{style:{paddingBottom:0},children:[n.jsx(X0,{children:n.jsx(Q0,{children:n.jsx(J0,{children:n.jsx(ti,{account:r})})})}),n.jsx(X,{children:o(r)})]})]}):null};function As(){const{user:e,linkedAccounts:t}=ve(),{uiConfig:r,thirdPartyAuth:o,setOpen:i}=U(),a=r?.authProviders||[],c=a.filter(f=>f!==Je.GUEST)||[],s=e?c.filter(f=>t?.find(g=>g.provider===f)):[],l=e?c.filter(f=>f===Je.WALLET?!0:e.email&&(f===Je.EMAIL_PASSWORD||f===Je.EMAIL_OTP)||f===Je.EMAIL_PASSWORD||e.phoneNumber&&f===Je.PHONE?!1:!t?.find(g=>g.provider===f)):c;v.useEffect(()=>{o&&(i(!1),Z.error(new Ee("When using external third party auth providers, openfort Auth providers are not available. Either remove the `thirdPartyAuth` or authenticate your users using Auth hooks.",Ne.CONFIGURATION_ERROR)))},[o,i]);const d=r?.authProvidersLength||4,{mainProviders:u,hasExcessProviders:p,remainingSocialProviders:h}=v.useMemo(()=>{const f=e?l:a;if(f.length<=d)return{mainProviders:f,hasExcessProviders:!1,remainingSocialProviders:[]};const g=f.filter((w,C,k)=>w===Je.EMAIL_OTP&&k.includes(Je.EMAIL_PASSWORD)?!1:!Hi.includes(w)),m=f.filter(w=>Hi.includes(w)),b=d-g.length,y=m.slice(Math.max(0,b-1));return{mainProviders:[...g,...m.slice(0,Math.max(0,b-1))].sort((w,C)=>{const k=f.indexOf(w),x=f.indexOf(C);return k-x}),hasExcessProviders:m.length>b-1,remainingSocialProviders:y}},[e,l,a,d]);return{availableProviders:l,linkedProviders:s,allProviders:a,mainProviders:u,hasExcessProviders:p,remainingSocialProviders:h}}const Fi=({account:e})=>{const{setRoute:t}=U();return n.jsx(K0,{children:n.jsx(te,{onClick:()=>t({route:L.LINKED_PROVIDER,account:e}),fitText:!1,children:n.jsxs(Y0,{children:[n.jsx(Z0,{children:n.jsx(ti,{account:e})}),n.jsx(_s,{account:e})]})})})},Mi=()=>{const{setRoute:e}=U(),{availableProviders:t}=As();return n.jsx(te,{disabled:t.length===0,onClick:()=>e(L.PROVIDERS),children:"+"})},B8=()=>{const{linkedAccounts:e,user:t,isLoading:r}=ve(),{triggerResize:o,emailInput:i}=U();return v.useEffect(()=>{r||o()},[r]),r?n.jsx("div",{children:n.jsx(Mi,{})}):t?n.jsxs(n.Fragment,{children:[n.jsxs(F8,{children:[e.length===0&&!t.email&&!t.phoneNumber&&n.jsxs(Te,{children:["You are logged in as a guest.",n.jsx(X,{children:"Add authentication methods to avoid losing access to your account."})]}),!e.find(a=>a.provider==="credential")&&t.email&&n.jsx(Fi,{account:{provider:"credential",accountId:t.email}},`credential-${t.email}`),e.map(a=>n.jsx(Fi,{account:a},`${a.provider}-${a.accountId}`)),t.phoneNumber&&n.jsx(Fi,{account:{provider:"phone",accountId:t.phoneNumber}},`phone-${t.phoneNumber}`),i&&n.jsx(K0,{children:n.jsxs(Y0,{style:{padding:"12px 20px",opacity:.6},children:[n.jsx(Z0,{children:n.jsx(ti,{account:{provider:"credential",accountId:i}})}),n.jsx(_s,{account:{provider:"credential",accountId:i}}),n.jsx(X,{style:{fontSize:11,marginLeft:"auto",whiteSpace:"nowrap"},children:"Awaiting validation"})]})})]}),n.jsx(Mi,{})]}):n.jsx("div",{children:n.jsx(Mi,{})})},W8=()=>n.jsxs(Q,{children:[n.jsx(we,{children:"Authentication methods"}),n.jsx(B8,{})]}),V8=()=>{const{setRoute:e,walletConfig:t}=U(),{user:r,isLoadingAccounts:o,isLoading:i,needsRecovery:a,embeddedState:c}=ve(),{chainType:s}=ve(),l=ot(),d=He(),u=Xe(),p=s===ne.EVM?d:u,h=p.status==="connected",f=s===ne.EVM&&!!(l?.account.isConnected&&l?.account.address),g=h?p.address:f?l?.account.address:void 0,[m,b]=fe.useState(!0),[y,w]=fe.useState(0);return v.useEffect(()=>{m||(c===mr.NONE||c===mr.UNAUTHENTICATED)&&!f||o||i||e(r?g?a?t?L.LOAD_WALLETS:{route:L.CONNECTORS,connectType:"connect"}:L.CONNECTED:t?L.LOAD_WALLETS:{route:L.CONNECTORS,connectType:"connect"}:L.PROVIDERS)},[c,o,i,r,g,a,m,y]),v.useEffect(()=>{const C=setInterval(()=>{w(k=>k+1)},250);return()=>clearInterval(C)},[]),v.useEffect(()=>{setTimeout(()=>b(!1),400)},[]),n.jsx(Q,{children:n.jsx(ze,{header:"Redirecting"})})},U8={[ne.EVM]:e=>({route:L.RECOVER_WALLET,wallet:e}),[ne.SVM]:e=>({route:L.SOL_RECOVER_WALLET,wallet:e})};function $o(e,t){return U8[e](t)}const z8={[ne.EVM]:()=>L.CREATE_WALLET,[ne.SVM]:()=>L.SOL_CREATE_WALLET};function H8(e){return z8[e]()}function G8(e){var t,r;return(r=(t=e.find(o=>o.recoveryMethod===ge.AUTOMATIC))!==null&&t!==void 0?t:e.find(o=>o.recoveryMethod===ge.PASSKEY))!==null&&r!==void 0?r:e[0]}function q8(e,t,r){t===ne.SVM?r($o(t,rd(e))):r($o(t,e))}const Z8={[ne.SVM]:()=>({isError:!1,message:void 0}),[ne.EVM]:e=>({isError:!!e,message:e?.message||"There was an error loading wallets"})},K8=()=>{var e;const{chainType:t,user:r,isLoadingAccounts:o}=ve(),{triggerResize:i,setRoute:a,setConnector:c,walletConfig:s}=U(),l=He(),d=Xe(),u=t===ne.EVM?l:d,p=(e=s?.connectOnLogin)!==null&&e!==void 0?e:!0,[h,f]=v.useState(!0),g=u.wallets,m=u.status==="fetching-wallets"||u.status==="connecting"||u.status==="creating"||o,b=u.status==="error"?new Error(u.error):void 0;v.useEffect(()=>{let x;return m||(x=setTimeout(()=>{f(!1),i()},500)),()=>clearTimeout(x)},[m,i]),v.useEffect(()=>{if(!h&&!m){if(!g){Z.error("Could not load wallets for user:",r);return}if(Z.log("User wallets loaded:",g.length),g.length===0){a(H8(t));return}if(u.status==="connected"&&u.address){const x=u.address;if(g.some(O=>t===ne.SVM?O.address===x:O.address.toLowerCase()===x.toLowerCase())){a(t===ne.SVM?L.SOL_CONNECTED:L.ETH_CONNECTED);return}}if(p){const x=G8(g);q8(x,t,a)}else a(t===ne.SVM?L.SOL_CONNECTED:L.ETH_CONNECTED)}},[h,m,g,r,t,a,c,s,p]);const{isError:y,message:w}=Z8[t](b),C=!r||y,k=r?w:void 0;return n.jsx(Q,{onBack:r?null:"back",children:n.jsx(ze,{header:"Setting up wallet",isError:C,description:C?k:"Setting up wallets"})})};function e1(){const e=ot(),[t,r]=v.useState(!1),o=v.useRef(e);o.current=e;const i=v.useRef(!1),a=v.useCallback(async()=>{var c;if(i.current)return{};i.current=!0;const s=o.current,l=document.createElement("style");l.textContent="w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }",document.head.appendChild(l);const d=()=>{document.head.contains(l)&&document.head.removeChild(l)},p=((c=s?.connectors)!==null&&c!==void 0?c:[]).find(h=>Pa(h.id));if(p&&s?.connectAsync)try{return s.reset(),r(!0),await s.connectAsync({connector:p}),r(!1),d(),i.current=!1,{}}catch(h){return r(!1),d(),i.current=!1,(h instanceof Error?h.message:String(h)).includes("Connection request reset")?(s.reset(),{error:"Connection cancelled"}):(Z.log("WalletConnect",h),{error:"Connection failed"})}else return d(),i.current=!1,Z.log("Configuration error: Please provide a WalletConnect Project ID in your wagmi config."),{error:"Configuration error: Please provide a WalletConnect Project ID in your wagmi config."}},[]);return{isOpen:t,open:a}}const Y8=({value:e,children:t})=>{const{copied:r,copy:o}=xs();return n.jsx(te,{disabled:!e,onClick:()=>o(e),icon:n.jsx(bs,{copied:r}),children:t})},Ta=E.div`
  text-align: center;
  transition: opacity 100ms ease;
  opacity: ${e=>e.$waiting?.4:1};
`,$l=E.div`
  z-index: 9;
  position: relative;
  margin: 0 auto 10px;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.04);
  ${e=>e.$outline&&`
  &:before {
    content: '';
    z-index: 2;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px var(--ck-body-background-tertiary);
  }`}
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
  }
`,Bl=E.div`
  color: var(--ck-body-color);
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
  opacity: 0.75;
`,X8=je`
  0%,100% { opacity:1; }
  50% { opacity:0.5; }
`,Q8=E.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 8px;
  margin: 0 -10px;
  padding: 4px 0 0;
  transition: opacity 300ms ease;
  ${e=>e.$disabled&&pe`
      pointer-events: none;
      opacity: 0.4;
      ${Ta} {
        animation: ${X8} 1s infinite ease-in-out;
      }
    `}
`,J8=E.div``,e6=n.jsxs("svg",{width:"60",height:"60",viewBox:"0 0 60 60",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"More wallets icon"}),n.jsx("path",{d:"M30 42V19M19 30.5H42",stroke:"var(--ck-body-color-muted)",strokeWidth:"3",strokeLinecap:"round"})]}),t6=()=>{var e;const t=U(),r=bt(),{open:o,isOpen:i}=e1(),a=Ba(),c=(e=Object.keys(Jt).filter(l=>{const d=Jt[l];return!(a.find(u=>u.connector.id===l)||!d.getWalletConnectDeeplink)}))!==null&&e!==void 0?e:[],s=l=>{t.setRoute(L.CONNECT_WITH_MOBILE),t.setConnector({id:l})};return n.jsx(Q,{width:312,onBack:L.PROVIDERS,children:n.jsxs(J8,{children:[n.jsx(Te,{style:{paddingBottom:0},children:n.jsx(ys,{height:340,children:n.jsxs(Q8,{children:[c.sort((l,d)=>{var u,p,h,f;const g=Jt[l],m=Jt[d],b=(p=(u=g.name)!==null&&u!==void 0?u:g.shortName)!==null&&p!==void 0?p:l,y=(f=(h=m.name)!==null&&h!==void 0?h:m.shortName)!==null&&f!==void 0?f:d;return b.localeCompare(y)}).filter(l=>!(l==="coinbaseWallet"||l==="com.coinbase.wallet")).map((l,d)=>{const u=Jt[l],{name:p,shortName:h,iconConnector:f,icon:g}=u;return n.jsxs(Ta,{onClick:()=>s(l),style:{animationDelay:`${d*50}ms`},children:[n.jsx($l,{$outline:!0,children:f??g}),n.jsx(Bl,{children:h??p})]},l)}),n.jsxs(Ta,{onClick:o,$waiting:i,children:[n.jsx($l,{style:{background:"var(--ck-body-background-secondary)"},children:i?n.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},children:n.jsx("div",{style:{width:"50%"},children:n.jsx(d0,{})})}):e6}),n.jsx(Bl,{children:r.more})]})]})})}),t.uiConfig.walletConnectCTA!=="modal"&&n.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:14,paddingTop:8},children:n.jsx(Y8,{value:"",children:r.copyToClipboard})})]})})},n6=E.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`,r6=()=>{const{setRoute:e,chains:t}=U(),{chainType:r}=ve(),o=He(),i=Xe(),a=r===ne.EVM?o:i,c=a.status==="connected"&&r===ne.EVM?a.chainId:void 0,s=t.find(d=>d.id===c),l=s&&!s.testnet;return n.jsxs(Q,{children:[n.jsx(At,{height:"190px",logoCenter:{logo:n.jsx(Jn,{})},logoTopLeft:{logo:n.jsx(Jn,{})},logoBottomRight:{logo:n.jsx(Jn,{})},logoTopRight:{logo:n.jsx(Ol,{})},logoBottomLeft:{logo:n.jsx(Ol,{})}}),n.jsxs(Te,{style:{paddingBottom:0},children:[n.jsx(Me,{$small:!0,children:"No assets available"}),n.jsxs(X,{children:[n.jsx("div",{style:{paddingRight:12,paddingLeft:12},children:"You currently have no assets available in your wallet."}),n.jsxs(n6,{children:[n.jsx(te,{onClick:()=>{e(L.RECEIVE)},icon:n.jsx(ms,{}),children:"Get assets"}),l&&n.jsx(te,{onClick:()=>{e(L.BUY)},icon:n.jsx(Jn,{}),children:"Buy assets"})]})]})]})]})},o6=()=>{var e;const t=U(),r=bt({}),o=(e=t.uiConfig.walletOnboardingUrl)!==null&&e!==void 0?e:r.onboardingScreen_ctaUrl;return n.jsxs(Q,{children:[n.jsxs(B0,{children:[n.jsxs(W0,{children:[n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{children:n.jsx(Ye.Coinbase,{background:!0})})})})})})}),n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{children:n.jsx(Ye.MetaMask,{background:!0})})})})})})}),n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{children:n.jsx(Ye.Trust,{})})})})})})}),n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{children:n.jsx(Ye.Argent,{})})})})})})}),n.jsx(kn,{children:n.jsx(Et,{children:n.jsx(dn,{children:n.jsx(gt,{children:n.jsx(vt,{children:n.jsx(un,{children:n.jsx(Ye.ImToken,{})})})})})})})]}),n.jsx(V0,{children:$0})]}),n.jsxs(Te,{style:{paddingBottom:18},children:[n.jsx(Me,{$small:!0,children:r.onboardingScreen_h1}),n.jsx(X,{children:r.onboardingScreen_p})]}),n.jsx(te,{href:o,arrow:!0,children:r.onboardingScreen_ctaText})]})},i6=E.p`
  color: var(--ck-body-color);
  text-align: center;
  margin-bottom: 16px;
`,a6=E.div`
  margin-top: 16px;
  height: 24px;
  text-align: center;
`,t1=E.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--ck-body-color-muted);
  transition: color 0.3s;

  &:disabled {
    color: var(--ck-body-color-muted) !important;
    cursor: not-allowed;
  }
`,s6=E.p`
  color: var(--ck-body-color-muted);
  text-align: center;
  margin-top: 16px;
  &:hover {
    ${t1} {
      color: var(--ck-body-color);
    }
  }
`,c6=1e4,l6=2e3,d6=2e3,u6=()=>{const{phoneInput:e,setPhoneInput:t,setRoute:r}=U(),{isLoading:o,requestPhoneOtp:i,logInWithPhoneOtp:a,linkPhoneOtp:c}=xg({recoverWalletAutomatically:!1}),{user:s}=Rr(),[l,d]=v.useState(!0),[u,p]=v.useState("idle"),[h,f]=v.useState(null),g=v.useRef(!1),m=v.useCallback(async()=>{const{error:k}=await i({phoneNumber:e});k?(Z.error("Error requesting phone OTP:",k),p("error")):p("idle")},[e,i]);v.useEffect(()=>{g.current||(g.current=!0,m())},[m]);const b=v.useCallback(async k=>{Z.log("OTP entered:",k),p("loading");let x=null;if(s){const{error:S}=await c({phoneNumber:e,otp:k});x=S}else{const{error:S}=await a({phoneNumber:e,otp:k});x=S}x?(Z.error("Error verifying phone OTP:",x),p("error"),x.message==="Invalid OTP"?f("Invalid code. Please try again."):f("Verification failed. Please try again.")):p("success")},[e,a]);v.useEffect(()=>{let k;switch(u){case"send-otp":p("sending-otp"),m();break;case"success":k=setTimeout(()=>{t(""),r(L.LOAD_WALLETS)},l6);break;case"error":k=setTimeout(()=>{p("idle")},d6);break}return()=>{k&&clearTimeout(k)}},[u,m,t,r]),v.useEffect(()=>{if(l)return;const k=setTimeout(()=>{d(!0)},c6);return()=>clearTimeout(k)},[l]);const y=v.useMemo(()=>l?u==="sending-otp"?"Sending...":"Resend Code":"Code Sent!",[l,u]),w=v.useCallback(()=>{p("send-otp"),d(!1)},[]),C=!l||u==="sending-otp"||u==="send-otp";return n.jsxs(Q,{children:[n.jsx(we,{children:"Enter your code"}),n.jsx(At,{height:"100px",marginTop:"8px",marginBottom:"10px",logoCenter:{logo:n.jsx(Hn,{})}}),n.jsxs(X,{children:[n.jsxs(i6,{children:["Please check ",n.jsx("b",{children:e})," for an SMS and enter your code below."]}),n.jsx(Wr,{onComplete:b,isLoading:u==="loading"||o,isError:u==="error",isSuccess:u==="success"}),n.jsxs(a6,{children:[u==="success"&&n.jsx(X,{$valid:!0,children:"Code verified successfully!"}),u==="error"&&n.jsx(X,{$error:!0,children:h||"Invalid code. Please try again."})]}),n.jsxs(s6,{children:["Didn't receive the code?"," ",n.jsx(t1,{type:"button",onClick:w,disabled:C,children:y})]})]}),n.jsx($r,{})]})},p6=E.div`
  ${on} {
    height: 64px;
    font-size: 17px;
    font-weight: var(--ck-primary-button-font-weight, 500);
    line-height: 20px;
  }

  ${gn} {
    height: 64px;
  }

  &:first-of-type {
    ${on}, ${gn} {
      margin-top: 0;
    }
  }

  ${Yo} {
    padding: 0 20px;
    justify-content: space-between;
  }

  ${zn} {
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
  }
`,h6=E.span`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0;
`,f6=E.div`
  width: 32px;
  height: 32px;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &[data-shape='squircle'] {
    border-radius: 22.5%;
  }
  &[data-shape='circle'] {
    border-radius: 100%;
  }
  &[data-shape='square'] {
    border-radius: 0;
  }
`,Wl=({children:e,icon:t,onClick:r,disabled:o})=>n.jsx(p6,{children:n.jsxs(te,{onClick:r,disabled:o,children:[n.jsx(h6,{children:e}),n.jsx(f6,{children:t})]})}),g6=()=>{const{setOpen:e,setRoute:t}=U(),{logout:r}=ve(),o=bt(),[i,a]=v.useState(!1);return v.useEffect(()=>{if(i)return e(!1),()=>{r()}},[i,e,r]),n.jsxs(Q,{onBack:L.CONNECTED,children:[n.jsxs(Te,{children:[n.jsx(we,{children:"Profile"}),n.jsxs("div",{children:[n.jsx(Wl,{onClick:()=>{t(L.LINKED_PROVIDERS)},icon:n.jsx(w0,{}),children:"Authentication methods"}),n.jsx(Wl,{onClick:()=>{t(L.EXPORT_KEY)},icon:n.jsx(mt,{}),children:"Export key"})]})]}),n.jsx(Rm,{onClick:()=>a(!0),icon:n.jsx(Lv,{}),children:o.disconnect})]})};var qn=[["Afghanistan","af","93"],["Albania","al","355"],["Algeria","dz","213"],["Andorra","ad","376"],["Angola","ao","244"],["Antigua and Barbuda","ag","1268"],["Argentina","ar","54",{default:"(..) .... ....","/^11/":"(..) .... ....","/^15/":"(..) ... ....","/^(2|3|4|5)/":"(.) .... ....","/^9/":"(.) .... ....."},0],["Armenia","am","374",".. ......"],["Aruba","aw","297"],["Australia","au","61",{default:". .... ....","/^4/":"... ... ...","/^5(?!50)/":"... ... ...","/^1(3|8)00/":".... ... ...","/^13/":".. .. ..","/^180/":"... ...."},0,[]],["Austria","at","43"],["Azerbaijan","az","994","(..) ... .. .."],["Bahamas","bs","1242"],["Bahrain","bh","973",".... ...."],["Bangladesh","bd","880"],["Barbados","bb","1246"],["Belarus","by","375","(..) ... .. .."],["Belgium","be","32","... .. .. .."],["Belize","bz","501"],["Benin","bj","229"],["Bhutan","bt","975"],["Bolivia","bo","591"],["Bosnia and Herzegovina","ba","387"],["Botswana","bw","267"],["Brazil","br","55","(..) .....-...."],["British Indian Ocean Territory","io","246"],["Brunei","bn","673"],["Bulgaria","bg","359"],["Burkina Faso","bf","226"],["Burundi","bi","257"],["Cambodia","kh","855"],["Cameroon","cm","237"],["Canada","ca","1","(...) ...-....",1,["204","226","236","249","250","289","306","343","365","387","403","416","418","431","437","438","450","506","514","519","548","579","581","587","604","613","639","647","672","705","709","742","778","780","782","807","819","825","867","873","902","905"]],["Cape Verde","cv","238"],["Caribbean Netherlands","bq","599","",1],["Cayman Islands","ky","1","... ... ....",4,["345"]],["Central African Republic","cf","236"],["Chad","td","235"],["Chile","cl","56"],["China","cn","86","... .... ...."],["Colombia","co","57","... ... ...."],["Comoros","km","269"],["Congo","cd","243"],["Congo","cg","242"],["Costa Rica","cr","506","....-...."],["Côte d'Ivoire","ci","225",".. .. .. .. .."],["Croatia","hr","385"],["Cuba","cu","53"],["Curaçao","cw","599","",0],["Cyprus","cy","357",".. ......"],["Czech Republic","cz","420","... ... ..."],["Denmark","dk","45",".. .. .. .."],["Djibouti","dj","253",".. .. ...."],["Dominica","dm","1767"],["Dominican Republic","do","1","(...) ...-....",2,["809","829","849"]],["Ecuador","ec","593"],["Egypt","eg","20"],["El Salvador","sv","503","....-...."],["Equatorial Guinea","gq","240"],["Eritrea","er","291"],["Estonia","ee","372",".... ......"],["Ethiopia","et","251",".. ... ...."],["Faroe Islands","fo","298",".. .. .."],["Fiji","fj","679"],["Finland","fi","358",".. ... .. .."],["France","fr","33",". .. .. .. .."],["French Guiana","gf","594","... .. .. .."],["French Polynesia","pf","689",{"/^44/":".. .. ..","/^80[0-5]/":"... .. .. ..",default:".. .. .. .."}],["Gabon","ga","241"],["Gambia","gm","220"],["Georgia","ge","995"],["Germany","de","49","... ........."],["Ghana","gh","233"],["Gibraltar","gi","350"],["Greece","gr","30"],["Greenland","gl","299",".. .. .."],["Grenada","gd","1473"],["Guadeloupe","gp","590","... .. .. ..",0],["Guam","gu","1671"],["Guatemala","gt","502","....-...."],["Guinea","gn","224"],["Guinea-Bissau","gw","245"],["Guyana","gy","592"],["Haiti","ht","509","....-...."],["Honduras","hn","504"],["Hong Kong","hk","852",".... ...."],["Hungary","hu","36"],["Iceland","is","354","... ...."],["India","in","91",".....-....."],["Indonesia","id","62"],["Iran","ir","98","... ... ...."],["Iraq","iq","964"],["Ireland","ie","353",".. ......."],["Israel","il","972","... ... ...."],["Italy","it","39","... .......",0],["Jamaica","jm","1876"],["Japan","jp","81",".. .... ...."],["Jordan","jo","962"],["Kazakhstan","kz","7","... ...-..-..",0],["Kenya","ke","254"],["Kiribati","ki","686"],["Kosovo","xk","383"],["Kuwait","kw","965",".... ...."],["Kyrgyzstan","kg","996","... ... ..."],["Laos","la","856"],["Latvia","lv","371",".. ... ..."],["Lebanon","lb","961"],["Lesotho","ls","266"],["Liberia","lr","231"],["Libya","ly","218"],["Liechtenstein","li","423"],["Lithuania","lt","370"],["Luxembourg","lu","352"],["Macau","mo","853"],["Macedonia","mk","389"],["Madagascar","mg","261"],["Malawi","mw","265"],["Malaysia","my","60","..-....-...."],["Maldives","mv","960"],["Mali","ml","223"],["Malta","mt","356"],["Marshall Islands","mh","692"],["Martinique","mq","596","... .. .. .."],["Mauritania","mr","222"],["Mauritius","mu","230"],["Mayotte","yt","262","... .. .. ..",1,["269","639"]],["Mexico","mx","52","... ... ....",0],["Micronesia","fm","691"],["Moldova","md","373","(..) ..-..-.."],["Monaco","mc","377"],["Mongolia","mn","976"],["Montenegro","me","382"],["Morocco","ma","212"],["Mozambique","mz","258"],["Myanmar","mm","95"],["Namibia","na","264"],["Nauru","nr","674"],["Nepal","np","977"],["Netherlands","nl","31",{"/^06/":"(.). .........","/^6/":". .........","/^0(10|13|14|15|20|23|24|26|30|33|35|36|38|40|43|44|45|46|50|53|55|58|70|71|72|73|74|75|76|77|78|79|82|84|85|87|88|91)/":"(.).. ........","/^(10|13|14|15|20|23|24|26|30|33|35|36|38|40|43|44|45|46|50|53|55|58|70|71|72|73|74|75|76|77|78|79|82|84|85|87|88|91)/":".. ........","/^0/":"(.)... .......",default:"... ......."}],["New Caledonia","nc","687"],["New Zealand","nz","64","...-...-...."],["Nicaragua","ni","505"],["Niger","ne","227"],["Nigeria","ng","234"],["North Korea","kp","850"],["Norway","no","47","... .. ..."],["Oman","om","968",".... ...."],["Pakistan","pk","92","...-......."],["Palau","pw","680"],["Palestine","ps","970"],["Panama","pa","507"],["Papua New Guinea","pg","675"],["Paraguay","py","595"],["Peru","pe","51"],["Philippines","ph","63","... ... ...."],["Poland","pl","48","...-...-..."],["Portugal","pt","351"],["Puerto Rico","pr","1","(...) ...-....",3,["787","939"]],["Qatar","qa","974",".... ...."],["Réunion","re","262","... .. .. ..",0],["Romania","ro","40"],["Russia","ru","7","(...) ...-..-..",1],["Rwanda","rw","250"],["Saint Kitts and Nevis","kn","1869"],["Saint Lucia","lc","1758"],["Saint Pierre & Miquelon","pm","508",{"/^708/":"... ... ...","/^8/":"... .. .. ..",default:".. .. .."}],["Saint Vincent and the Grenadines","vc","1784"],["Samoa","ws","685"],["San Marino","sm","378"],["São Tomé and Príncipe","st","239"],["Saudi Arabia","sa","966",".. ... ...."],["Senegal","sn","221"],["Serbia","rs","381"],["Seychelles","sc","248"],["Sierra Leone","sl","232"],["Singapore","sg","65","....-...."],["Slovakia","sk","421"],["Slovenia","si","386"],["Solomon Islands","sb","677"],["Somalia","so","252"],["South Africa","za","27"],["South Korea","kr","82","... .... ...."],["South Sudan","ss","211"],["Spain","es","34","... ... ..."],["Sri Lanka","lk","94"],["Sudan","sd","249"],["Suriname","sr","597"],["Swaziland","sz","268"],["Sweden","se","46","... ... ..."],["Switzerland","ch","41",".. ... .. .."],["Syria","sy","963"],["Taiwan","tw","886"],["Tajikistan","tj","992"],["Tanzania","tz","255"],["Thailand","th","66"],["Timor-Leste","tl","670"],["Togo","tg","228"],["Tonga","to","676"],["Trinidad and Tobago","tt","1868"],["Tunisia","tn","216"],["Turkey","tr","90","... ... .. .."],["Turkmenistan","tm","993"],["Tuvalu","tv","688"],["Uganda","ug","256"],["Ukraine","ua","380","(..) ... .. .."],["United Arab Emirates","ae","971",{default:".. ... ....","/^5[024568]/":".. ... ....","/^[234679]/":". ... ...."}],["United Kingdom","gb","44",".... ......"],["United States","us","1","(...) ...-....",0],["Uruguay","uy","598"],["Uzbekistan","uz","998",".. ... .. .."],["Vanuatu","vu","678"],["Vatican City","va","39",".. .... ....",1],["Venezuela","ve","58"],["Vietnam","vn","84"],["Wallis & Futuna","wf","681",".. .. .."],["Yemen","ye","967"],["Zambia","zm","260"],["Zimbabwe","zw","263"]],v6="react-international-phone-",n1=(...e)=>e.filter(t=>!!t).join(" ").trim(),m6=(...e)=>n1(...e).split(" ").map(t=>`${v6}${t}`).join(" "),et=({addPrefix:e,rawClassNames:t})=>n1(m6(...e),...t),x6=({value:e,mask:t,maskSymbol:r,offset:o=0,trimNonMaskCharsLeftover:i=!1,allowMaskOverflow:a=!1})=>{if(e.length<o)return e;let c=e.slice(0,o),s=e.slice(o),l=t.split("").filter(f=>f===r).length,d=s.slice(0,l),u=a?s.slice(l):"",p=c,h=0;for(let f of t.split("")){if(h>=d.length){if(!i&&f!==r){p+=f;continue}break}f===r?(p+=d[h],h+=1):p+=f}return p+u},En=e=>e?/^\d+$/.test(e):!1,ni=e=>e.replace(/\D/g,""),b6=(e,t)=>{let r=e.style.display;r!=="block"&&(e.style.display="block");let o=e.getBoundingClientRect(),i=t.getBoundingClientRect(),a=i.top-o.top,c=o.bottom-i.bottom;a>=0&&c>=0||(Math.abs(a)<Math.abs(c)?e.scrollTop+=a:e.scrollTop-=c),e.style.display=r},y6=()=>typeof window>"u"?!1:window.navigator.userAgent.toLowerCase().includes("macintosh"),C6=(e,t)=>{let r=t.disableDialCodeAndPrefix?!1:t.forceDialCode,o=t.disableDialCodeAndPrefix?!1:t.insertDialCodeOnEmpty,i=e,a=d=>t.trimNonDigitsEnd?d.trim():d;if(!i)return o&&!i.length||r?a(`${t.prefix}${t.dialCode}${t.charAfterDialCode}`):a(i);if(i=ni(i),i===t.dialCode&&!t.disableDialCodeAndPrefix)return a(`${t.prefix}${t.dialCode}${t.charAfterDialCode}`);if(t.dialCode.startsWith(i)&&!t.disableDialCodeAndPrefix)return a(r?`${t.prefix}${t.dialCode}${t.charAfterDialCode}`:`${t.prefix}${i}`);if(!i.startsWith(t.dialCode)&&!t.disableDialCodeAndPrefix){if(r)return a(`${t.prefix}${t.dialCode}${t.charAfterDialCode}`);if(i.length<t.dialCode.length)return a(`${t.prefix}${i}`)}let c=()=>{let d=t.dialCode.length,u=i.slice(0,d),p=i.slice(d);return{phoneLeftSide:u,phoneRightSide:p}},{phoneLeftSide:s,phoneRightSide:l}=c();return s=`${t.prefix}${s}${t.charAfterDialCode}`,l=x6({value:l,mask:t.mask,maskSymbol:t.maskChar,trimNonMaskCharsLeftover:t.trimNonDigitsEnd||t.disableDialCodeAndPrefix&&l.length===0,allowMaskOverflow:t.allowMaskOverflow}),t.disableDialCodeAndPrefix&&(s=""),a(`${s}${l}`)},w6=({phoneBeforeInput:e,phoneAfterInput:t,phoneAfterFormatted:r,cursorPositionAfterInput:o,leftOffset:i=0,deletion:a})=>{if(o<i)return i;if(!e)return r.length;let c=null;for(let u=o-1;u>=0;u-=1)if(En(t[u])){c=u;break}if(c===null){for(let u=0;u<t.length;u+=1)if(En(r[u]))return u;return t.length}let s=0;for(let u=0;u<c;u+=1)En(t[u])&&(s+=1);let l=0,d=0;for(let u=0;u<r.length&&(l+=1,En(r[u])&&(d+=1),!(d>=s+1));u+=1);if(a!=="backward")for(;!En(r[l])&&l<r.length;)l+=1;return l},po=({phone:e,prefix:t})=>e?`${t}${ni(e)}`:"";function Oa({value:e,country:t,insertDialCodeOnEmpty:r,trimNonDigitsEnd:o,countries:i,prefix:a,charAfterDialCode:c,forceDialCode:s,disableDialCodeAndPrefix:l,defaultMask:d,countryGuessingEnabled:u,disableFormatting:p,allowMaskOverflow:h}){let f=e;l&&(f=f.startsWith(`${a}`)?f:`${a}${t.dialCode}${f}`);let g=u?L6({phone:f,countries:i,currentCountryIso2:t?.iso2}):void 0,m=g?.country??t,b=C6(f,{prefix:a,mask:O6({phone:f,country:m,defaultMask:d,disableFormatting:p}),maskChar:r1,dialCode:m.dialCode,trimNonDigitsEnd:o,charAfterDialCode:c,forceDialCode:s,insertDialCodeOnEmpty:r,disableDialCodeAndPrefix:l,allowMaskOverflow:h}),y=u&&!g?.fullDialCodeMatch?t:m;return{phone:po({phone:l?`${y.dialCode}${b}`:b,prefix:a}),inputValue:b,country:y}}var k6=e=>{if(e?.toLocaleLowerCase().includes("delete")??!1)return e?.toLocaleLowerCase().includes("forward")?"forward":"backward"},E6=(e,{country:t,insertDialCodeOnEmpty:r,phoneBeforeInput:o,prefix:i,charAfterDialCode:a,forceDialCode:c,disableDialCodeAndPrefix:s,countryGuessingEnabled:l,defaultMask:d,disableFormatting:u,countries:p,allowMaskOverflow:h})=>{let f=e.nativeEvent,g=f.inputType,m=k6(g),b=!!g?.startsWith("insertFrom"),y=g==="insertText",w=f?.data||void 0,C=e.target.value,k=e.target.selectionStart??0;if(g?.includes("history"))return{inputValue:o,phone:po({phone:o,prefix:i}),cursorPosition:o.length,country:t};if(y&&!En(w)&&C!==i)return{inputValue:o,phone:po({phone:s?`${t.dialCode}${o}`:o,prefix:i}),cursorPosition:k-(w?.length??0),country:t};if(c&&!C.startsWith(`${i}${t.dialCode}`)&&!b){let A=C?o:`${i}${t.dialCode}${a}`;return{inputValue:A,phone:po({phone:A,prefix:i}),cursorPosition:i.length+t.dialCode.length+a.length,country:t}}let{phone:x,inputValue:S,country:O}=Oa({value:C,country:t,trimNonDigitsEnd:m==="backward",insertDialCodeOnEmpty:r,countryGuessingEnabled:l,countries:p,prefix:i,charAfterDialCode:a,forceDialCode:c,disableDialCodeAndPrefix:s,disableFormatting:u,defaultMask:d,allowMaskOverflow:h}),j=w6({cursorPositionAfterInput:k,phoneBeforeInput:o,phoneAfterInput:C,phoneAfterFormatted:S,leftOffset:c?i.length+t.dialCode.length+a.length:0,deletion:m});return{phone:x,inputValue:S,cursorPosition:j,country:O}},S6=(e,t)=>{let r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(let i of r)if(e[i]!==t[i])return!1;return!0},j6=()=>{let e=v.useRef(),t=v.useRef(Date.now()),r=v.useCallback(()=>{let o=Date.now(),i=e.current?o-t.current:void 0;return e.current=t.current,t.current=o,i},[]);return v.useMemo(()=>({check:r}),[r])},_6={size:20,overrideLastItemDebounceMS:-1};function A6(e,t){let{size:r,overrideLastItemDebounceMS:o,onChange:i}={..._6,...t},[a,c]=v.useState(e),s=v.useRef([a]),l=v.useRef(0),d=j6(),u=v.useCallback((f,g)=>{let m=s.current[l.current];if(f===m||typeof f=="object"&&typeof m=="object"&&S6(f,m))return;let b=o>0,y=d.check(),w=b&&y!==void 0?y>o:!0;if(g?.overrideLastItem!==void 0?g.overrideLastItem:!w)s.current=[...s.current.slice(0,l.current),f];else{let C=s.current.length>=r;s.current=[...s.current.slice(C?1:0,l.current+1),f],C||(l.current+=1)}c(f),i?.(f)},[i,o,r,d]),p=v.useCallback(()=>{if(l.current<=0)return{success:!1};let f=s.current[l.current-1];return c(f),l.current-=1,i?.(f),{success:!0,value:f}},[i]),h=v.useCallback(()=>{if(l.current+1>=s.current.length)return{success:!1};let f=s.current[l.current+1];return c(f),l.current+=1,i?.(f),{success:!0,value:f}},[i]);return[a,u,p,h]}var r1=".",at={defaultCountry:"us",value:"",prefix:"+",defaultMask:"............",charAfterDialCode:" ",historySaveDebounceMS:200,disableCountryGuess:!1,disableDialCodePrefill:!1,forceDialCode:!1,disableDialCodeAndPrefix:!1,disableFormatting:!1,allowMaskOverflow:!1,countries:qn},T6=({defaultCountry:e=at.defaultCountry,value:t=at.value,countries:r=at.countries,prefix:o=at.prefix,defaultMask:i=at.defaultMask,charAfterDialCode:a=at.charAfterDialCode,historySaveDebounceMS:c=at.historySaveDebounceMS,disableCountryGuess:s=at.disableCountryGuess,disableDialCodePrefill:l=at.disableDialCodePrefill,forceDialCode:d=at.forceDialCode,disableDialCodeAndPrefix:u=at.disableDialCodeAndPrefix,disableFormatting:p=at.disableFormatting,allowMaskOverflow:h=at.allowMaskOverflow,onChange:f,inputRef:g})=>{let m={countries:r,prefix:o,charAfterDialCode:a,forceDialCode:u?!1:d,disableDialCodeAndPrefix:u,defaultMask:i,countryGuessingEnabled:!s,disableFormatting:p,allowMaskOverflow:h},b=v.useRef(null),y=g||b,w=W=>{Promise.resolve().then(()=>{typeof window>"u"||y.current!==document?.activeElement||y.current?.setSelectionRange(W,W)})},C=v.useCallback(W=>An({value:W,field:"iso2",countries:r}),[r]),k=v.useCallback(({inputValue:W,phone:H,country:K})=>{if(!f)return;let Y=C(K);f({phone:H,inputValue:W,country:Y})},[C,f]),[{phone:x,inputValue:S,country:O},j,A,_]=A6(()=>{let W=An({value:e,field:"iso2",countries:r});W||console.error(`[react-international-phone]: can not find a country with "${e}" iso2 code`);let H=W||An({value:"us",field:"iso2",countries:r}),{phone:K,inputValue:Y,country:ue}=Oa({value:t,country:H,insertDialCodeOnEmpty:!l,...m});return w(Y.length),{phone:K,inputValue:Y,country:ue.iso2}},{overrideLastItemDebounceMS:c,onChange:k}),P=v.useMemo(()=>C(O),[O,C]);v.useEffect(()=>{let W=y.current;if(!W)return;let H=K=>{if(!K.key)return;let Y=K.ctrlKey,ue=K.metaKey,G=K.shiftKey;if(K.key.toLowerCase()==="z"){if(y6()){if(!ue)return}else if(!Y)return;G?_():A()}};return W.addEventListener("keydown",H),()=>{W.removeEventListener("keydown",H)}},[y,A,_]);let D=W=>{W.preventDefault();let{phone:H,inputValue:K,country:Y,cursorPosition:ue}=E6(W,{country:P,phoneBeforeInput:S,insertDialCodeOnEmpty:!1,...m});return j({inputValue:K,phone:H,country:Y.iso2}),w(ue),t},$=v.useCallback((W,H={focusOnInput:!1})=>{let K=An({value:W,field:"iso2",countries:r});if(!K){console.error(`[react-international-phone]: can not find a country with "${W}" iso2 code`);return}let Y=u?"":`${o}${K.dialCode}${a}`;j({inputValue:Y,phone:`${o}${K.dialCode}`,country:K.iso2}),H.focusOnInput&&Promise.resolve().then(()=>{y.current?.focus()})},[r,u,o,a,j,y]),[q,B]=v.useState(!1);return v.useEffect(()=>{if(!q){B(!0),t!==x&&f?.({inputValue:S,phone:x,country:P});return}if(t===x)return;let{phone:W,inputValue:H,country:K}=Oa({value:t,country:P,insertDialCodeOnEmpty:!l,...m});j({phone:W,inputValue:H,country:K.iso2})},[t]),{phone:x,inputValue:S,country:P,setCountry:$,handlePhoneValueChange:D,inputRef:y}},O6=({phone:e,country:t,defaultMask:r="............",disableFormatting:o=!1})=>{let i=t.format,a=s=>o?s.replace(new RegExp(`[^${r1}]`,"g"),""):s;if(!i)return a(r);if(typeof i=="string")return a(i);if(!i.default)return console.error(`[react-international-phone]: default mask for ${t.iso2} is not provided`),a(r);let c=Object.keys(i).find(s=>{if(s==="default")return!1;if(!(s.charAt(0)==="/"&&s.charAt(s.length-1)==="/"))return console.error(`[react-international-phone]: format regex "${s}" for ${t.iso2} is not valid`),!1;let l=new RegExp(s.substring(1,s.length-1)),d=e.replace(t.dialCode,"");return l.test(ni(d))});return a(c?i[c]:i.default)},Lt=e=>{let[t,r,o,i,a,c]=e;return{name:t,iso2:r,dialCode:o,format:i,priority:a,areaCodes:c}},R6=e=>`Field "${e}" is not supported`,An=({field:e,value:t,countries:r=qn})=>{if(["priority"].includes(e))throw new Error(R6(e));let o=r.find(i=>{let a=Lt(i);return t===a[e]});if(o)return Lt(o)},L6=({phone:e,countries:t=qn,currentCountryIso2:r})=>{let o={country:void 0,fullDialCodeMatch:!1};if(!e)return o;let i=ni(e);if(!i)return o;let a=o,c=({country:s,fullDialCodeMatch:l})=>{let d=s.dialCode===a.country?.dialCode,u=(s.priority??0)<(a.country?.priority??0);(!d||u)&&(a={country:s,fullDialCodeMatch:l})};for(let s of t){let l=Lt(s),{dialCode:d,areaCodes:u}=l;if(i.startsWith(d)){let p=a.country?Number(d)>=Number(a.country.dialCode):!0;if(u){let h=i.substring(d.length);for(let f of u)if(h.startsWith(f))return{country:l,fullDialCodeMatch:!0}}(p||d===i||!a.fullDialCodeMatch)&&c({country:l,fullDialCodeMatch:!0})}a.fullDialCodeMatch||i.length<d.length&&d.startsWith(i)&&(!a.country||Number(d)<=Number(a.country.dialCode))&&c({country:l,fullDialCodeMatch:!1})}if(r){let s=An({value:r,field:"iso2",countries:t});if(!s)return a;let l=s?(d=>{if(!d?.areaCodes)return!1;let u=i.substring(d.dialCode.length);return d.areaCodes.some(p=>p.startsWith(u))})(s):!1;a&&a.country?.dialCode===s.dialCode&&a.country!==s&&a.fullDialCodeMatch&&(!s.areaCodes||l)&&(a={country:s,fullDialCodeMatch:!0})}return a},I6=(e,t)=>{let r=parseInt(e,16);return Number(r+t).toString(16)},N6="abcdefghijklmnopqrstuvwxyz",F6="1f1e6",Vl=N6.split("").reduce((e,t,r)=>({...e,[t]:I6(F6,r)}),{}),M6=e=>[Vl[e[0]],Vl[e[1]]].join("-"),o1=({iso2:e,size:t,src:r,protocol:o="https",disableLazyLoading:i,className:a,style:c,...s})=>{if(!e)return fe.createElement("img",{className:et({addPrefix:["flag-emoji"],rawClassNames:[a]}),width:t,height:t,...s});let l=()=>{if(r)return r;let d=M6(e);return`${o}://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${d}.svg`};return fe.createElement("img",{className:et({addPrefix:["flag-emoji"],rawClassNames:[a]}),src:l(),width:t,height:t,draggable:!1,"data-country":e,loading:i?void 0:"lazy",style:{width:t,height:t,...c},alt:"",...s})},P6=1e3,D6=({show:e,dialCodePrefix:t="+",selectedCountry:r,countries:o=qn,preferredCountries:i=[],flags:a,onSelect:c,onClose:s,...l})=>{let d=v.useRef(null),u=v.useRef(),p=v.useMemo(()=>{if(!i||!i.length)return o;let S=[],O=[...o];for(let j of i){let A=O.findIndex(_=>Lt(_).iso2===j);if(A!==-1){let _=O.splice(A,1)[0];S.push(_)}}return S.concat(O)},[o,i]),h=v.useRef({updatedAt:void 0,value:""}),f=S=>{let O=h.current.updatedAt&&new Date().getTime()-h.current.updatedAt.getTime()>P6;h.current={value:O?S:`${h.current.value}${S}`,updatedAt:new Date};let j=p.findIndex(A=>Lt(A).name.toLowerCase().startsWith(h.current.value));j!==-1&&b(j)},g=v.useCallback(S=>p.findIndex(O=>Lt(O).iso2===S),[p]),[m,b]=v.useState(g(r)),y=()=>{u.current!==r&&b(g(r))},w=v.useCallback(S=>{b(g(S.iso2)),c?.(S)},[c,g]),C=S=>{let O=p.length-1,j=A=>S==="prev"?A-1:S==="next"?A+1:S==="last"?O:0;b(A=>{let _=j(A);return _<0?0:_>O?O:_})},k=S=>{if(S.stopPropagation(),S.key==="Enter"){S.preventDefault();let O=Lt(p[m]);w(O);return}if(S.key==="Escape"){s?.();return}if(S.key==="ArrowUp"){S.preventDefault(),C("prev");return}if(S.key==="ArrowDown"){S.preventDefault(),C("next");return}if(S.key==="PageUp"){S.preventDefault(),C("first");return}if(S.key==="PageDown"){S.preventDefault(),C("last");return}S.key===" "&&S.preventDefault(),S.key.length===1&&!S.altKey&&!S.ctrlKey&&!S.metaKey&&f(S.key.toLocaleLowerCase())},x=v.useCallback(()=>{if(!d.current||m===void 0)return;let S=Lt(p[m]).iso2;if(S===u.current)return;let O=d.current.querySelector(`[data-country="${S}"]`);O&&(b6(d.current,O),u.current=S)},[m,p]);return v.useEffect(()=>{x()},[m,x]),v.useEffect(()=>{d.current&&(e?d.current.focus():y())},[e]),v.useEffect(()=>{y()},[r]),fe.createElement("ul",{ref:d,role:"listbox",className:et({addPrefix:["country-selector-dropdown"],rawClassNames:[l.className]}),style:{display:e?"block":"none",...l.style},onKeyDown:k,onBlur:s,tabIndex:-1,"aria-activedescendant":`react-international-phone__${Lt(p[m]).iso2}-option`},p.map((S,O)=>{let j=Lt(S),A=j.iso2===r,_=O===m,P=i.includes(j.iso2),D=O===i.length-1,$=a?.find(q=>q.iso2===j.iso2);return fe.createElement(fe.Fragment,{key:j.iso2},fe.createElement("li",{"data-country":j.iso2,role:"option","aria-selected":A,"aria-label":`${j.name} ${t}${j.dialCode}`,id:`react-international-phone__${j.iso2}-option`,className:et({addPrefix:["country-selector-dropdown__list-item",P&&"country-selector-dropdown__list-item--preferred",A&&"country-selector-dropdown__list-item--selected",_&&"country-selector-dropdown__list-item--focused"],rawClassNames:[l.listItemClassName,P&&l.listItemPreferredClassName,A&&l.listItemSelectedClassName,_&&l.listItemFocusedClassName]}),onClick:()=>w(j),style:l.listItemStyle,title:j.name},fe.createElement(o1,{iso2:j.iso2,src:$?.src,className:et({addPrefix:["country-selector-dropdown__list-item-flag-emoji"],rawClassNames:[l.listItemFlagClassName]}),style:l.listItemFlagStyle}),fe.createElement("span",{className:et({addPrefix:["country-selector-dropdown__list-item-country-name"],rawClassNames:[l.listItemCountryNameClassName]}),style:l.listItemCountryNameStyle},j.name),fe.createElement("span",{className:et({addPrefix:["country-selector-dropdown__list-item-dial-code"],rawClassNames:[l.listItemDialCodeClassName]}),style:l.listItemDialCodeStyle},t,j.dialCode)),D?fe.createElement("hr",{className:et({addPrefix:["country-selector-dropdown__preferred-list-divider"],rawClassNames:[l.preferredListDividerClassName]}),style:l.preferredListDividerStyle}):null)}))},$6=fe.memo(({selectedCountry:e,onSelect:t,disabled:r,hideDropdown:o,countries:i=qn,preferredCountries:a=[],flags:c,renderButtonWrapper:s,...l})=>{let[d,u]=v.useState(!1),p=v.useMemo(()=>{if(e)return An({value:e,field:"iso2",countries:i})},[i,e]),h=v.useRef(null),f=m=>{m.key&&["ArrowUp","ArrowDown"].includes(m.key)&&(m.preventDefault(),u(!0))},g=()=>{let m={title:p?.name,onClick:()=>u(y=>!y),onMouseDown:y=>y.preventDefault(),onKeyDown:f,disabled:o||r,role:"combobox","aria-label":"Country selector","aria-haspopup":"listbox","aria-expanded":d},b=fe.createElement("div",{className:et({addPrefix:["country-selector-button__button-content"],rawClassNames:[l.buttonContentWrapperClassName]}),style:l.buttonContentWrapperStyle},fe.createElement(o1,{iso2:e,src:c?.find(y=>y.iso2===e)?.src,className:et({addPrefix:["country-selector-button__flag-emoji",r&&"country-selector-button__flag-emoji--disabled"],rawClassNames:[l.flagClassName]}),style:{visibility:e?"visible":"hidden",...l.flagStyle}}),!o&&fe.createElement("div",{className:et({addPrefix:["country-selector-button__dropdown-arrow",r&&"country-selector-button__dropdown-arrow--disabled",d&&"country-selector-button__dropdown-arrow--active"],rawClassNames:[l.dropdownArrowClassName]}),style:l.dropdownArrowStyle}));return s?s({children:b,rootProps:m}):fe.createElement("button",{...m,type:"button",className:et({addPrefix:["country-selector-button",d&&"country-selector-button--active",r&&"country-selector-button--disabled",o&&"country-selector-button--hide-dropdown"],rawClassNames:[l.buttonClassName]}),"data-country":e,style:l.buttonStyle},b)};return fe.createElement("div",{className:et({addPrefix:["country-selector"],rawClassNames:[l.className]}),style:l.style,ref:h},g(),fe.createElement(D6,{show:d,countries:i,preferredCountries:a,flags:c,onSelect:m=>{u(!1),t?.(m)},selectedCountry:e,onClose:()=>{u(!1)},...l.dropdownStyleProps}))}),B6=({dialCode:e,prefix:t,disabled:r,style:o,className:i})=>fe.createElement("div",{className:et({addPrefix:["dial-code-preview",r&&"dial-code-preview--disabled"],rawClassNames:[i]}),style:o},`${t}${e}`),W6=v.forwardRef(({value:e,onChange:t,countries:r=qn,preferredCountries:o,hideDropdown:i,showDisabledDialCodeAndPrefix:a,disableFocusAfterCountrySelect:c,flags:s,style:l,className:d,inputStyle:u,inputClassName:p,countrySelectorStyleProps:h,dialCodePreviewStyleProps:f,inputProps:g,placeholder:m,disabled:b,name:y,onFocus:w,onBlur:C,required:k,autoFocus:x,...S},O)=>{let j=v.useCallback(H=>{t?.(H.phone,{country:H.country,inputValue:H.inputValue})},[t]),{phone:A,inputValue:_,inputRef:P,country:D,setCountry:$,handlePhoneValueChange:q}=T6({value:e,countries:r,...S,onChange:j}),B=S.disableDialCodeAndPrefix&&a&&D?.dialCode,W=v.useCallback(H=>{$(H.iso2,{focusOnInput:!c})},[$,c]);return v.useImperativeHandle(O,()=>P.current?Object.assign(P.current,{setCountry:$,state:{phone:A,inputValue:_,country:D}}):null,[P,$,A,_,D]),fe.createElement("div",{ref:O,className:et({addPrefix:["input-container"],rawClassNames:[d]}),style:l},fe.createElement($6,{onSelect:W,flags:s,selectedCountry:D?.iso2,countries:r,preferredCountries:o,disabled:b,hideDropdown:i,...h}),B&&fe.createElement(B6,{dialCode:D.dialCode,prefix:S.prefix??"+",disabled:b,...f}),fe.createElement("input",{onChange:q,value:_,type:"tel",ref:P,className:et({addPrefix:["input",b&&"input--disabled"],rawClassNames:[p]}),placeholder:m,disabled:b,style:u,name:y,onFocus:w,onBlur:C,autoFocus:x,required:k,...g}))});const ri=({children:e,icon:t,onClick:r,disabled:o})=>n.jsx(xt,{children:n.jsxs(te,{onClick:r,disabled:o,children:[n.jsx(Nt,{children:e}),n.jsx(it,{children:t})]})}),V6=()=>{const{setRoute:e}=U(),t=()=>{e(L.CREATE_GUEST_USER)};return n.jsx(ri,{onClick:t,icon:n.jsx(w0,{}),children:"Guest"})},U6=({disabled:e})=>{const{setRoute:t}=U(),{user:r}=ve();return n.jsx(ri,{onClick:()=>t({route:L.CONNECTORS,connectType:r?"link":"connect"}),icon:n.jsx(Ye.OtherWallets,{}),disabled:e,children:"Wallet"})},i1=({handleSubmit:e})=>{const{emailInput:t,setEmailInput:r}=U(),o=v.useMemo(()=>Vi(t),[t]);return n.jsx(xt,{children:n.jsx("form",{onSubmit:i=>{i.preventDefault(),o&&e()},noValidate:!0,children:n.jsxs(gn,{children:[n.jsx("input",{value:t,onChange:i=>r(i.target.value),type:"email",placeholder:"Enter your email",formNoValidate:!0}),n.jsx("div",{style:{position:"relative"},children:n.jsx(Ve,{initial:!1,children:o?n.jsx(F.div,{initial:{x:-5,opacity:0},animate:{x:0,opacity:1},exit:{x:-5,opacity:0,position:"absolute"},transition:{duration:.2,ease:[.25,1,.5,1]},children:n.jsx(z0,{type:"submit","aria-label":"Submit email",children:n.jsx(it,{children:n.jsxs("svg",{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Submit email"}),n.jsx("line",{stroke:"currentColor",x1:"1",y1:"6",x2:"12",y2:"6",strokeWidth:"1",strokeLinecap:"round"}),n.jsx("path",{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"1",strokeLinecap:"round"})]})})})},t?"enabled":"disabled"):n.jsx(F.div,{initial:{x:5,opacity:0},animate:{x:0,opacity:1},exit:{x:5,opacity:0,position:"absolute"},transition:{duration:.2,ease:[.25,1,.5,1]},children:n.jsx(it,{children:n.jsx(kt,{})})})})})]})})})},a1=()=>{const{setRoute:e}=U(),{user:t}=ve(),r=()=>{e(t?L.LINK_EMAIL:L.EMAIL_LOGIN)};return n.jsx(i1,{handleSubmit:r})},z6=()=>{const{setRoute:e}=U(),t=()=>{e(L.EMAIL_OTP)};return n.jsx(i1,{handleSubmit:t})},H6=()=>{const{uiConfig:e,phoneInput:t,setPhoneInput:r,setRoute:o}=U(),i=c=>{c.preventDefault(),o(L.PHONE_OTP)},a=t.length>5;return n.jsx(xt,{children:n.jsx("form",{onSubmit:i,noValidate:!0,children:n.jsxs(gn,{children:[n.jsx("div",{style:{width:"100%"},children:n.jsx(W6,{value:t,onChange:c=>r(c),hideDropdown:!1,placeholder:"Enter your phone",style:{"--react-international-phone-height":"56px","--react-international-phone-text-color":"var(--ck-body-color)","--react-international-phone-background-color":"var(--ck-secondary-button-background)","--react-international-phone-country-selector-background-color":"var(--ck-secondary-button-background)","--react-international-phone-selected-dropdown-item-background-color":"var(--ck-secondary-button-hover-background)","--react-international-phone-country-selector-background-color-hover":"var(--ck-secondary-button-hover-background)","--react-international-phone-font-size":"16px",paddingLeft:"4px"},...e.phoneConfig})}),n.jsx("div",{style:{position:"relative"},children:n.jsx(Ve,{initial:!1,children:a?n.jsx(z0,{initial:{x:-5,opacity:0},animate:{x:0,opacity:1},exit:{x:-5,opacity:0,position:"absolute"},transition:{duration:.2,ease:[.25,1,.5,1]},type:"submit","aria-label":"Submit email",children:n.jsx(it,{children:n.jsxs("svg",{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("title",{children:"Submit email"}),n.jsx("line",{stroke:"currentColor",x1:"1",y1:"6",x2:"12",y2:"6",strokeWidth:"1",strokeLinecap:"round"}),n.jsx("path",{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"1",strokeLinecap:"round"})]})})},t?"enabled":"disabled"):n.jsx(F.div,{initial:{x:5,opacity:0},animate:{x:0,opacity:1},exit:{x:5,opacity:0,position:"absolute"},transition:{duration:.2,ease:[.25,1,.5,1]},children:n.jsx(it,{children:n.jsx(Hn,{})})})})})]})})})},Qn=({provider:e,title:t=`${e} login`,icon:r})=>{const{setRoute:o,setConnector:i}=U(),a=()=>{o({route:L.CONNECT,connectType:"linkIfUserConnectIfNoUser"}),i({id:e,type:"oauth"})};return n.jsx(ri,{onClick:a,icon:r,children:t})},G6={guest:n.jsx(V6,{}),wallet:null,emailPassword:n.jsx(a1,{}),emailOtp:n.jsx(z6,{}),phone:n.jsx(H6,{}),google:n.jsx(Qn,{provider:bn.GOOGLE,title:"Google",icon:ln[Je.GOOGLE]}),twitter:n.jsx(Qn,{provider:bn.TWITTER,title:"X",icon:ln[Je.TWITTER]}),facebook:n.jsx(Qn,{provider:bn.FACEBOOK,title:"Facebook",icon:ln[Je.FACEBOOK]}),discord:n.jsx(Qn,{provider:bn.DISCORD,title:"Discord",icon:ln[Je.DISCORD]}),apple:n.jsx(Qn,{provider:bn.APPLE,title:"Apple",icon:ln[Je.APPLE]})},s1=({provider:e})=>{const{user:t,chainType:r}=ve();return t&&(e===Je.EMAIL_OTP||e===Je.EMAIL_PASSWORD)?n.jsx(a1,{}):e===Je.WALLET?n.jsx(U6,{disabled:r===ne.SVM}):G6[e]||null},q6=()=>{const{updateUser:e}=ve(),{logout:t}=ve();return v.useEffect(()=>{e().then(r=>{r||t()}).catch(()=>{Z.error("Failed to update user")})},[e,t]),n.jsx(Q,{children:n.jsx(ze,{header:"Updating user"})})},Z6=({thereAreSocialsAlready:e})=>{const{setRoute:t}=U();return n.jsx(ri,{onClick:()=>t(L.SOCIAL_PROVIDERS),icon:n.jsx(I1,{}),children:e?"Other socials":"Social providers"})},K6=()=>{const{user:e}=ve(),{previousRoute:t}=U(),{mainProviders:r,hasExcessProviders:o}=As(),{chainType:i}=ve(),a=He(),c=Xe(),s=i===ne.EVM?a:c,d=s.status==="connected"?s.address:void 0,u=v.useMemo(()=>e?"back":null,[t,e]);return d&&!e?n.jsx(q6,{}):n.jsxs(Q,{onBack:u,children:[n.jsx(we,{children:e?"Link auth":"Connect"}),r.map(p=>n.jsx(s1,{provider:p},p)),o&&n.jsx(Z6,{thereAreSocialsAlready:!!r.find(p=>Hi.includes(p))}),n.jsx($r,{showDisclaimer:!0})]})},Y6=E.button`
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: var(--ck-secondary-button-border-radius);
  background: var(--ck-accent-color, rgba(26, 136, 248, 0.1));
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  --color: var(--ck-accent-text-color, #1a88f8);
  --bg: var(--ck-accent-color, rgba(26, 136, 248, 0.1));

  &:hover:not(:disabled) {
    background: var(--ck-accent-color, rgba(26, 136, 248, 0.2));
    --bg: var(--ck-accent-color, rgba(26, 136, 248, 0.2));
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,X6=({value:e})=>{const{copied:t,copy:r}=xs();return n.jsx(Y6,{onClick:()=>r(e),disabled:!e,type:"button",children:n.jsx(bs,{copied:t,size:24})})},Q6=E.div`
  min-height: 480px;
  display: flex;
  flex-direction: column;
`,J6=E.div`
  display: block;
  margin: 24px auto 16px;
  width: 100%;
  max-width: 280px;
  
  > div {
    width: 100%;
  }
`,e7=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`,t7=E.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`,n7=E.div`
  display: flex;
  gap: 8px;
  align-items: center;
`,r7=E.div`
  flex: 1;
  padding: 12px;
  border-radius: var(--ck-secondary-button-border-radius);
  background: var(--ck-secondary-button-background);
  box-shadow: var(--ck-secondary-button-box-shadow);
  font-size: 14px;
  color: var(--ck-body-color);
  word-break: break-all;
`,o7=E.div`
  margin-top: 12px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: center;
`;function i7(e){return e==="mainnet-beta"?"Mainnet":e.charAt(0).toUpperCase()+e.slice(1)}const Ra=()=>{var e;const t=U(),{route:r,chains:o}=t,a=((e=r?.route)!==null&&e!==void 0?e:"").startsWith("sol:"),{chainType:c}=ve(),s=He(),l=Xe(),d=ot(),u=c===ne.EVM?s:l,p=u.status==="connected",h=c===ne.EVM&&!!(d?.account.isConnected&&d?.account.address),f=p||h,g=p?u.address:h?d?.account.address:void 0,m=p&&c===ne.EVM?u.chainId:h?d?.chainId:void 0,b=o.find(x=>x.id===m),y=g||"",w=f&&c===ne.SVM&&l.cluster?i7(l.cluster):b?.name?`${b.name}${m?` · Chain ID: ${m}`:""}`:m?`Chain ID: ${m}`:null,{uiConfig:C}=t,k=()=>C?.logo?typeof C.logo=="string"?n.jsx("img",{src:C.logo,alt:"Logo",style:{width:"100%"}}):C.logo:n.jsx(Ye.Openfort,{});return v.useEffect(()=>{const x=setTimeout(()=>t.triggerResize(),100);return()=>clearTimeout(x)},[g,t]),n.jsx(Q,{onBack:a?L.SOL_CONNECTED:L.CONNECTED,children:n.jsxs(Q6,{children:[n.jsx(we,{children:"Receive funds"}),n.jsx(X,{children:"Scan the QR code or copy your wallet details."}),g&&n.jsx(J6,{children:n.jsx(js,{value:y,image:n.jsx("div",{style:{padding:10},children:k()})})}),n.jsxs(e7,{children:[n.jsx(t7,{children:"Your wallet address"}),n.jsxs(n7,{children:[n.jsx(r7,{children:g??"--"}),n.jsx(X6,{value:g??""})]})]}),w&&n.jsxs(o7,{children:["Network: ",w]})]})})};async function a7(e,t){t.setError(!1),await t.setActive({address:e.address,recoveryMethod:ge.PASSWORD,password:t.password}),t.setRoute(L.CONNECTED_SUCCESS)}async function s7(e,t){t.setError(!1),await t.setActive({address:e.address,recoveryMethod:ge.PASSKEY,passkeyId:t.passkeyId}),t.setRoute(L.CONNECTED_SUCCESS)}async function c7(e,t){t.setError(!1);try{await t.setActive({address:e.address,recoveryMethod:ge.AUTOMATIC,otpCode:t.otpCode}),t.setRoute(L.CONNECTED_SUCCESS)}catch(r){const{error:o,isOTPRequired:i}=ws(r,t.otp.isEnabled);if(i&&t.otp.isEnabled)try{const a=await t.otp.request();t.setNeedsOTP(!0),t.setOtpResponse(a)}catch{t.setError("Failed to send recovery code")}else t.setError(o.message)}}const Ul={password:a7,passkey:s7,automatic:c7},Bo={[ne.EVM]:Ul,[ne.SVM]:Ul},l7=({wallet:e,onBack:t,logoutOnBack:r})=>{const[o,i]=v.useState(""),[a,c]=v.useState(!1),{triggerResize:s,setRoute:l}=U(),[d,u]=v.useState(!1),{chainType:p}=ve(),h=He(),f=Xe(),g=p===ne.EVM?h:f,{isEnabled:m,requestOTP:b}=Br(),y=v.useMemo(()=>({setActive:x=>g.setActive(x),setRoute:l,setError:c,otp:{isEnabled:m,request:b},setNeedsOTP:()=>{},setOtpResponse:()=>{}}),[g,l,m,b]),w=async()=>{u(!0);try{await Bo[p].password(e,{...y,password:o})}catch(x){c(x instanceof Ee?x.message:"Recovery failed. Please try again.")}finally{u(!1)}};v.useEffect(()=>{a&&s()},[a,s]);const C=Vn({address:e.address,chainType:p,enabled:!!e.address}),k=C.status==="success"?C.name:void 0;return n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(At,{height:"130px",logoCenter:{logo:n.jsx(mt,{}),size:"1.2"},logoTopLeft:{logo:n.jsx(k0,{}),size:"0.75"},logoBottomRight:{logo:n.jsx(fn,{}),size:"0.5"}}),n.jsx(we,{children:"Recover wallet"}),n.jsxs(X,{style:{textAlign:"center"},children:["Please enter the password to recover wallet"," ",n.jsx(Ft,{value:e.address,children:k??_t(e.address)})]}),n.jsxs("form",{onSubmit:x=>{x.preventDefault(),w()},children:[n.jsx(Mt,{value:o,onChange:x=>i(x.target.value),type:"password",placeholder:"Enter your password",autoComplete:"off"}),a&&n.jsx(F.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:n.jsx(X,{style:{height:24,marginTop:12},$error:!0,children:n.jsx(Pe,{children:a})})},a),n.jsx(te,{onClick:w,waiting:d,disabled:d,children:"Recover wallet"})]})]})},d7=({wallet:e,onBack:t,logoutOnBack:r})=>{const{triggerResize:o,setRoute:i}=U(),[a,c]=v.useState(!1),{chainType:s}=ve(),l=He(),d=Xe(),u=s===ne.EVM?l:d,{isEnabled:p,requestOTP:h}=Br(),f=v.useMemo(()=>({setActive:C=>u.setActive(C),setRoute:i,setError:c,otp:{isEnabled:p,request:h},setNeedsOTP:()=>{},setOtpResponse:()=>{}}),[u,i,p,h]),g=v.useCallback(async()=>{try{await Bo[s].passkey(e,f)}catch(C){c(C instanceof Ee?C.message:"Invalid passkey. Please try again.")}},[s,e,f]),m=v.useRef(!1);v.useEffect(()=>{m.current||(m.current=!0,g())},[g]),v.useEffect(()=>{a&&o()},[a,o]);const b=Vn({address:e.address,chainType:s,enabled:!!e.address}),y=b.status==="success"?b.name:void 0,w=y??_t(e.address);return n.jsx(Q,{onBack:t,logoutOnBack:r,children:n.jsx(ze,{icon:n.jsx(Gn,{}),isError:!!a,header:a?"Invalid passkey.":`Recovering wallet ${w} with passkey...`,description:a?"There was an error creating your passkey. Please try again.":void 0,onRetry:()=>g()})})},c1=({wallet:e,onBack:t,logoutOnBack:r})=>{const{embeddedState:o}=ve(),{setRoute:i}=U(),{chainType:a}=ve(),c=He(),s=Xe(),l=a===ne.EVM?c:s,{isEnabled:d,requestOTP:u}=Br(),[p,h]=v.useState(!1),[f,g]=v.useState(!1),[m,b]=v.useState(null),[y,w]=v.useState("idle"),C=v.useMemo(()=>({setActive:B=>l.setActive(B),setRoute:i,setError:h,otp:{isEnabled:d,request:u},setNeedsOTP:g,setOtpResponse:b}),[l,i,d,u]),k=v.useCallback(async()=>{a!==ne.SVM&&o!==mr.EMBEDDED_SIGNER_NOT_CONFIGURED||(Z.log("Automatically recovering wallet",e.address),await Bo[a].automatic(e,C))},[e,o,a,C]),x=v.useRef(!1);v.useEffect(()=>{x.current||(x.current=!0,k())},[k]);const S=Vn({address:e.address,chainType:a,enabled:!!e.address}),O=S.status==="success"?S.name:void 0,j=O??_t(e.address),[A,_]=v.useState(!0);v.useEffect(()=>{if(A)return;const B=setTimeout(()=>_(!0),1e4);return()=>clearTimeout(B)},[A]);const P=v.useCallback(async B=>{w("loading");try{await Bo[a].automatic(e,{...C,otpCode:B}),w("success"),setTimeout(()=>i(L.CONNECTED_SUCCESS),1e3)}catch(W){w("error"),h(W instanceof Ee?W.message:"There was an error verifying the OTP. Please try again."),Z.log("Error verifying OTP for wallet recovery",W),setTimeout(()=>{w("idle"),h(!1)},1e3)}},[a,e,C,i]),D=v.useCallback(()=>{w("send-otp"),_(!1)},[]),$=!A||y==="sending-otp"||y==="send-otp",q=v.useMemo(()=>A?y==="sending-otp"?"Sending...":"Resend Code":"Code Sent!",[A,y]);return f&&d?n.jsxs(Q,{onBack:t,logoutOnBack:r,children:[n.jsx(we,{children:"Enter your code"}),n.jsx(At,{height:"100px",marginTop:"8px",marginBottom:"10px",logoCenter:{logo:m?.sentTo==="phone"?n.jsx(Hn,{}):n.jsx(kt,{})}}),n.jsxs(X,{children:[n.jsxs(Qo,{as:"div",children:["Recovering wallet ",n.jsx(Ft,{value:e.address,children:j}),"Please check ",n.jsx("b",{children:m?.sentTo==="phone"?m?.phone:m?.email})," and enter your code below."]}),n.jsx(Wr,{length:9,scale:"80%",onComplete:P,isLoading:y==="loading",isError:y==="error",isSuccess:y==="success"}),n.jsxs(Jo,{children:[y==="success"&&n.jsx(X,{$valid:!0,children:"Code verified successfully!"}),y==="error"&&n.jsx(X,{$error:!0,children:p||"Invalid code. Please try again."})]}),n.jsxs(ei,{children:["Didn't receive the code?"," ",n.jsx(Vr,{type:"button",onClick:D,disabled:$,children:q})]})]})]}):p?n.jsx(Q,{onBack:t,logoutOnBack:r,children:n.jsx(X,{style:{textAlign:"center"},$error:!0,children:n.jsx(Pe,{children:p})})}):n.jsx(Q,{children:n.jsx(ze,{header:"Recovering wallet..."})})},u7={[ge.PASSWORD]:l7,[ge.AUTOMATIC]:c1,[ge.PASSKEY]:d7},p7=({wallet:e,onBack:t,logoutOnBack:r})=>{var o;const i=u7[(o=e.recoveryMethod)!==null&&o!==void 0?o:ge.AUTOMATIC];return i?n.jsx(i,{wallet:e,onBack:t,logoutOnBack:r}):(Z.error(`Unsupported recovery method: ${e.recoveryMethod}, defaulting to automatic.`),n.jsx(c1,{wallet:e,onBack:t,logoutOnBack:r}))},La=()=>{const{previousRoute:e,route:t}=U(),r=t.route===L.SOL_RECOVER_WALLET||t.route===L.RECOVER_WALLET?t.wallet:void 0,{onBack:o,logoutOnBack:i}=v.useMemo(()=>e?.route===L.SELECT_WALLET_TO_RECOVER?{onBack:"back",logoutOnBack:!1}:{onBack:L.PROVIDERS,logoutOnBack:!0},[e]);return r?n.jsx(p7,{wallet:r,onBack:o,logoutOnBack:i}):null},zl=E.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`,h7=E.div`
  color: var(--ck-body-color-danger, #ff4d4f);
  margin-top: 16px;
`,f7=()=>{const{route:e,triggerResize:t,onBack:r,setOnBack:o,setRouteHistory:i,setRoute:a}=U(),{client:c,updateUser:s}=ve(),[l,d]=v.useState(null),[u,p]=v.useState(!1),h=v.useMemo(()=>e.route==="removeLinkedProvider"?e.account:null,[e]);v.useEffect(()=>{l&&t()},[l]),v.useEffect(()=>{u&&(s(),t(),o(()=>()=>{i(g=>{const m=[...g];return m.pop(),m.pop(),m.length>0?a(m[m.length-1]):a({route:L.CONNECTED}),m})}))},[u]);const f=async()=>{var g;if(!h)return;const m="Failed to remove linked provider. Please try again.";if(h.provider==="siwe"||h.provider==="wallet")try{(await c.auth.unlinkWallet({address:h.accountId,chainId:Number((g=h.chainId)!==null&&g!==void 0?g:0)})).success?p(!0):d(m)}catch(b){Z.error("Unexpected error removing linked provider:",b),d(m)}else try{(await c.auth.unlinkOAuth({provider:h.provider})).status?p(!0):d(m)}catch(b){Z.error("Unexpected error removing linked provider:",b),d(m)}};return h?n.jsxs(Q,{children:[n.jsxs(we,{children:["Remove ",fr(h.provider)]}),n.jsxs(Te,{style:{paddingBottom:0},children:[n.jsx(X0,{style:{marginBottom:"16px"},children:n.jsx(Q0,{children:n.jsx(J0,{children:n.jsx(ti,{account:h})})})}),u?n.jsxs(n.Fragment,{children:[n.jsx(Me,{$valid:!0,children:"Success"}),n.jsxs(X,{children:["Successfully removed"," ",h.provider==="siwe"?n.jsxs("span",{children:[n.jsx("b",{children:n.jsx(Aa,{walletAddress:h.accountId})}),"."]}):n.jsxs(n.Fragment,{children:[n.jsx("b",{children:fr(h.provider)})," as an authentication method."]})]}),n.jsx(zl,{style:{marginTop:0},children:n.jsx(te,{onClick:()=>r?.(),children:"Back"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs("p",{children:["Are you sure you want to remove"," ",h.provider==="siwe"?n.jsxs(Ft,{value:h.accountId,children:[n.jsx("b",{children:n.jsx(Aa,{walletAddress:h.accountId})}),"?"]}):n.jsxs(n.Fragment,{children:[n.jsx("b",{children:fr(h.provider)}),"as an authentication method?"]})]}),l&&n.jsx(h7,{children:l}),n.jsxs(zl,{style:{marginTop:0},children:[n.jsx(te,{onClick:()=>r?.(),children:"Cancel"}),n.jsx(te,{onClick:f,children:"Remove"})]})]})]})]}):null},to=BigInt(0),Hl=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}),Gl=({isBuyFlow:e})=>{const{setSendForm:t,setBuyForm:r,setRoute:o,triggerResize:i}=U(),[a,c]=v.useState(!1);v.useEffect(()=>{i()},[a]);const{data:s,isLoading:l}=Gt(),d=s||[],u=h=>{var f;if(!(!e&&((f=h.balance)!==null&&f!==void 0?f:to)<=to)){if(e){r(g=>({...g,asset:h})),o(L.BUY);return}t(g=>({...g,asset:h,amount:""})),o(L.SEND)}};v.useEffect(()=>{i()},[d.length,e]);const p=()=>d.length?n.jsxs(m0,{children:[d.map(h=>{var f,g,m,b,y;const w=h.type==="erc20"?h.address:"native",C=Ke(h),k=((f=h.metadata)===null||f===void 0?void 0:f.name)||C||"Unknown Token",x=_r(h),S=(m=(g=h.metadata)===null||g===void 0?void 0:g.fiat)===null||m===void 0?void 0:m.value;let O=null;const j=h.balance!==void 0,A=j?ev(h.balance,x,((b=h.metadata)===null||b===void 0?void 0:b.symbol)||""):"Loading...",_=j&&((y=h.balance)!==null&&y!==void 0?y:to)<=to;if(_&&!a&&!e)return null;const P=!e&&_;if(j&&S!==void 0&&h.balance!==void 0){const D=parseFloat(vn(h.balance,x));if(Number.isFinite(D)){const $=D*S;$>=.01?O=Hl.format($):$>0?O="<$0.01":O=Hl.format(0)}}return n.jsxs(V4,{type:"button",onClick:()=>u(h),style:{opacity:P?.4:1,cursor:P?"not-allowed":"pointer"},children:[n.jsxs(Io,{children:[n.jsx(x0,{children:k}),e&&n.jsx(No,{children:C})]}),e?n.jsx(Vt,{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx(rn,{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"})}):n.jsxs(Io,{children:[n.jsx(b0,{children:A}),O?n.jsx(No,{style:{textAlign:"end"},children:O}):null]})]},w)}),!e&&n.jsx(Xo,{type:"button",onClick:()=>{c(!a)},children:a?"View less assets":"View all assets"})]}):l?n.jsx(Fo,{children:"Loading balances…"}):n.jsx(Fo,{children:"No supported tokens found for this network yet."});return n.jsxs(lo,{children:[n.jsx(we,{children:"Select asset"}),p()]})},g7={[ge.AUTOMATIC]:"Automatic",[ge.PASSWORD]:"Password",[ge.PASSKEY]:"Passkey"},v7=({recovery:e})=>{switch(e){case ge.PASSWORD:return n.jsx(mt,{});case ge.PASSKEY:return n.jsx(Gn,{});case ge.AUTOMATIC:return n.jsx(fn,{});default:return null}},m7=E.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
  background: var(--ck-body-background-secondary, #f0f0f0);
  color: var(--ck-body-color-muted, #999);
`,x7=E.div`
  max-height: min(400px, 50vh);
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--ck-body-color-muted, #c47a2a);
    border-radius: 4px;
  }
  scrollbar-width: thin;
  scrollbar-color: var(--ck-body-color-muted, #c47a2a) transparent;
`;function b7({chainType:e,wallet:t}){var r;const{setRoute:o}=U(),i=Vn({address:t.address,chainType:e,enabled:!!t.address}),a=e===ne.SVM?t.address.length>12?`${t.address.slice(0,4)}...${t.address.slice(-4)}`:t.address:i.status==="success"?(r=i.name)!==null&&r!==void 0?r:_t(t.address):_t(t.address),c=()=>{var d;if(t.id===tr)return n.jsx(v7,{recovery:t.recoveryMethod});if(e===ne.EVM){const u=(d=Object.entries(Jt).find(([p])=>p.includes(t.id)))===null||d===void 0?void 0:d[1];if(u)return u.icon}return null},s=()=>{if(e===ne.SVM){const d=rd(t);o($o(e,d));return}o($o(e,t))},l=t.recoveryMethod!=null?g7[t.recoveryMethod]:void 0;return n.jsx(xt,{children:n.jsxs(te,{onClick:s,children:[n.jsxs(Nt,{children:[a,l&&n.jsx(m7,{children:l})]}),n.jsx(it,{children:c()})]})})}const y7=new Set([L.CONNECTED,L.ETH_CONNECTED,L.SOL_CONNECTED]);function C7(){const{chainType:e}=ve(),{previousRoute:t}=U(),r=He(),o=Xe(),c=(e===ne.EVM?r:o).wallets.map(l=>n.jsx(b7,{chainType:e,wallet:l},l.id)),s=t!=null&&y7.has(t.route);return n.jsxs(Q,{onBack:s?"back":L.PROVIDERS,logoutOnBack:!s,children:[n.jsx(we,{children:"Select a wallet"}),n.jsx(x7,{children:c})]})}const w7=E.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`,Pi=E.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`,Di=E.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`,k7=E.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  text-align: left;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }
`,E7=E.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`,ql=E.span`
  font-size: ${e=>e.$primary?"15px":"13px"};
  font-weight: ${e=>e.$primary?600:500};
  color: ${e=>e.$primary?"var(--ck-body-color)":(e.$muted,"var(--ck-body-color-muted)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,S7=E.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ck-body-color-muted);
`,j7=E.div`
  position: relative;
  margin-top: 12px;

  > div {
    margin: 0;
  }
`,_7=E.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-body-background);
  color: var(--ck-body-color);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--ck-body-background-secondary);
  }
`,A7=E.span`
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
`,$i=E.span`
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--ck-body-color-danger);
`,l1=()=>{var e,t,r,o;const{sendForm:i,setSendForm:a,setRoute:c}=U(),{data:s}=Gt(),l=v.useMemo(()=>s?.find(P=>Dr(P,i.asset)),[s,i.asset]),d=l??s?.[0],u=d??i.asset,p=d?.balance,h=u.type==="erc20"&&(t=(e=u.metadata)===null||e===void 0?void 0:e.decimals)!==null&&t!==void 0?t:18,f=(o=(r=u.metadata)===null||r===void 0?void 0:r.symbol)!==null&&o!==void 0?o:"",g=v.useMemo(()=>{const P=Dn(i.amount);if(!P)return null;try{return ad(P,h)}catch{return null}},[i.amount,h]),m=od(i.recipient),b=g!==null&&p!==void 0?g>p:!1,w=g!==null&&g>BigInt(0)&&!b,C=m&&w,k=P=>{if(P.preventDefault(),!C)return;const D=Dn(i.amount);D&&(a($=>({...$,amount:D,asset:$.asset})),c(L.SEND_CONFIRMATION))},x=P=>{a(D=>({...D,recipient:P.target.value}))},S=P=>{const D=hr(P.target.value);(D===""||/^[0-9]*\.?[0-9]*$/.test(D))&&a($=>({...$,amount:D}))},O=()=>{if(!p)return;const P=vn(p,h);a(D=>({...D,amount:P}))},j=()=>{c(L.SEND_TOKEN_SELECT)},A=vs(p,h),_=!p;return n.jsxs(Q,{onBack:L.CONNECTED,children:[n.jsx(we,{children:"Send assets"}),n.jsxs(w7,{onSubmit:k,children:[n.jsxs(Pi,{children:[n.jsx(Di,{children:"Asset"}),n.jsxs(k7,{type:"button",onClick:j,children:[n.jsx(E7,{children:n.jsx(ql,{$primary:!0,children:f||"Select token"})}),n.jsxs(S7,{children:[n.jsx(ql,{children:A==="--"?"--":`${A} ${f??""}`}),n.jsx(Vt,{width:"13",height:"12",viewBox:"0 0 13 12",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx(rn,{stroke:"currentColor",d:"M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314",strokeWidth:"2",strokeLinecap:"round"})})]})]})]}),n.jsxs(Pi,{children:[n.jsx(Di,{children:"Amount"}),n.jsxs(j7,{children:[n.jsx(Mt,{placeholder:"0.00",value:i.amount,onChange:S,inputMode:"decimal",autoComplete:"off",style:{paddingRight:"86px"}}),n.jsx(_7,{type:"button",onClick:O,disabled:_,children:"Max"})]}),n.jsxs(A7,{children:["Available: ",A," ",f]}),i.amount&&g===null&&n.jsx($i,{children:"Enter a valid amount."}),b&&n.jsx($i,{children:"Insufficient balance for this transfer."})]}),n.jsxs(Pi,{children:[n.jsx(Di,{children:"Recipient address"}),n.jsx(Mt,{placeholder:"0x...",value:i.recipient,onChange:x,autoComplete:"off"}),i.recipient&&!m&&n.jsx($i,{children:"Enter a valid wallet address."})]}),n.jsx(te,{variant:"primary",disabled:!C,children:"Review transfer"})]})]})},T7={[ne.EVM]:l1},d1=()=>{const{chainType:e}=ve(),t=T7[e];return t?n.jsx(t,{}):n.jsx(l1,{})};function O7(e){if(!e)return{title:"Transaction failed",message:"An unknown error occurred."};const r=(e instanceof Error?e.message:String(e)).toLowerCase(),o=e instanceof Error?e.name:"";return o==="UserRejectedRequestError"||r.includes("user rejected")||r.includes("user denied")||r.includes("user cancelled")||r.includes("user canceled")||r.includes("rejected the request")||r.includes("transaction was rejected")?{title:"Transaction cancelled",message:"You cancelled the transaction."}:o==="AccountNotFoundError"||r.includes("account not found")?{title:"Account not found",message:"No account is connected.",action:"Please connect your wallet and try again."}:o==="InsufficientFundsError"||r.includes("insufficient funds")||r.includes("insufficient balance")||r.includes("exceeds balance")||r.includes("insufficient eth")||r.includes("sender doesn't have enough funds")?{title:"Insufficient funds",message:"You don't have enough ETH to pay for the gas fee.",action:"Add more ETH to your wallet to cover the transaction fee."}:o==="EstimateGasExecutionError"||r.includes("gas estimation failed")||r.includes("cannot estimate gas")||r.includes("gas required exceeds allowance")||r.includes("out of gas")?r.includes("insufficient funds")?{title:"Insufficient funds",message:"You don't have enough ETH to pay for this transaction.",action:"Add more ETH to your wallet."}:{title:"Transaction would fail",message:"This transaction is likely to fail.",action:"Please check the recipient address and amount, then try again."}:o==="IntrinsicGasTooHighError"||o==="IntrinsicGasTooLowError"||r.includes("intrinsic gas too high")||r.includes("intrinsic gas too low")||r.includes("gas limit")?{title:"Gas limit error",message:"The gas limit for this transaction is incorrect.",action:"Please try again or contact support."}:o==="NonceTooLowError"||r.includes("nonce too low")?{title:"Transaction pending",message:"A transaction is already pending.",action:"Please wait for your pending transaction to complete."}:o==="NonceTooHighError"||o==="NonceMaxValueError"||r.includes("nonce too high")?{title:"Transaction error",message:"Transaction nonce is invalid.",action:"Please refresh the page and try again."}:o==="FeeCapTooLowError"||o==="TipAboveFeeCapError"||r.includes("transaction underpriced")||r.includes("replacement transaction underpriced")||r.includes("fee cap too low")?{title:"Gas fee too low",message:"The gas fee is too low for this transaction.",action:"Try again with a higher gas fee."}:o==="FeeCapTooHighError"||r.includes("fee cap too high")?{title:"Gas fee too high",message:"The gas fee is unusually high.",action:"Please check the fee and try again."}:o==="TransactionTypeNotSupportedError"||r.includes("transaction type not supported")?{title:"Transaction not supported",message:"This transaction type is not supported on this network.",action:"Please try a different transaction method."}:o==="TransactionExecutionError"?{title:"Transaction failed",message:"The transaction failed to execute.",action:"Please check the transaction details and try again."}:o==="WaitForTransactionReceiptTimeoutError"||r.includes("timeout")?{title:"Transaction timeout",message:"The transaction is taking longer than expected.",action:"It may still be processing. Check your wallet or block explorer."}:o==="ExecutionRevertedError"||r.includes("execution reverted")?{title:"Transaction failed",message:"The transaction was rejected by the contract.",action:"Please check the transaction details and try again."}:o==="ContractFunctionExecutionError"||o==="ContractFunctionRevertedError"||o==="CallExecutionError"||o==="RawContractError"?{title:"Contract error",message:"The contract rejected this transaction.",action:"Please verify the transaction parameters and try again."}:o==="ContractFunctionZeroDataError"?{title:"Contract error",message:"The contract returned no data.",action:"This contract may not exist on this network."}:o.includes("Abi")||r.includes("abi encoding")||r.includes("abi decoding")?{title:"Contract error",message:"Unable to encode or decode the contract data.",action:"Please contact support if this issue persists."}:o==="ChainMismatchError"||o==="ChainNotFoundError"||o==="InvalidChainIdError"||r.includes("chain")&&(r.includes("mismatch")||r.includes("wrong"))?{title:"Wrong network",message:"Your wallet is connected to a different network.",action:"Please switch to the correct network in your wallet."}:o==="SwitchChainError"||r.includes("switch chain")?{title:"Network switch failed",message:"Unable to switch to the requested network.",action:"Please manually switch networks in your wallet."}:o==="ChainDisconnectedError"||o==="ProviderDisconnectedError"||r.includes("disconnected")?{title:"Connection lost",message:"Lost connection to the network.",action:"Please check your internet connection and try again."}:o==="HttpRequestError"||o==="WebSocketRequestError"||o==="RpcRequestError"||o==="TimeoutError"||r.includes("network")||r.includes("timed out")||r.includes("connection")||r.includes("failed to fetch")||r.includes("request failed")||r.includes("could not detect network")||r.includes("bad gateway")||r.includes("service unavailable")?{title:"Network error",message:"Unable to connect to the network.",action:"Check your internet connection and try again."}:o==="InternalRpcError"||o==="UnknownRpcError"||r.includes("internal json-rpc error")||r.includes("internal error")?{title:"Network error",message:"The network encountered an internal error.",action:"Please try again in a moment."}:o==="MethodNotFoundRpcError"||o==="MethodNotSupportedRpcError"||o==="UnsupportedProviderMethodError"||r.includes("method")&&(r.includes("not found")||r.includes("not supported"))?{title:"Method not supported",message:"This operation is not supported by the current network.",action:"Try switching to a different RPC provider."}:o==="InvalidInputRpcError"||o==="InvalidParamsRpcError"||o==="InvalidRequestRpcError"?{title:"Invalid request",message:"The request contains invalid parameters.",action:"Please check the transaction details and try again."}:o==="TransactionRejectedRpcError"||r.includes("transaction rejected")?{title:"Transaction rejected",message:"The network rejected this transaction.",action:"Please check the transaction details and try again."}:o==="LimitExceededRpcError"||o==="ResourceNotFoundRpcError"||o==="ResourceUnavailableRpcError"?{title:"Network busy",message:"The network is currently busy or unavailable.",action:"Please wait a moment and try again."}:o==="UnauthorizedProviderError"||r.includes("unauthorized")?{title:"Unauthorized",message:"This action requires authorization.",action:"Please connect your wallet and try again."}:r.includes("wallet")&&(r.includes("not connected")||r.includes("not found"))?{title:"Wallet not connected",message:"Your wallet is not connected.",action:"Please connect your wallet and try again."}:r.includes("provider")&&r.includes("not found")?{title:"Wallet not found",message:"No wallet extension detected.",action:"Please install a wallet extension and try again."}:{title:"Transaction failed",message:"An error occurred while processing your transaction.",action:"Please try again."}}const R7=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
`,no=E.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-align: left;
`,ro=E.span`
  font-size: 14px;
  color: var(--ck-body-color-muted);
`,Ts=E.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
  text-align: right;
  word-break: break-all;
`,L7=E(Ts)`
  color: var(--ck-body-color);
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`,Zl=E(Ts)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`,I7=E(Ts)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  text-decoration: ${e=>e.$completed?"line-through":"none"};
  opacity: ${e=>e.$completed?.6:1};
`,N7=E.span`
  color: var(--ck-body-color);
  line-height: 0;
  display: inline-flex;
  align-items: center;
  
  svg {
    width: 16px;
    height: 16px;
  }
`,Kl=E.span`
  color: var(--ck-body-color-muted);
  opacity: 0.6;
  line-height: 0;
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    display: block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
`,Yl=E.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
`,F7=E.div`
  margin-top: 16px;
  font-size: 14px;
  font-weight: ${e=>e.$status==="idle"?"600":"500"};
  color: ${e=>e.$status==="success"?"var(--ck-body-color-valid)":e.$status==="error"?"var(--ck-body-color-danger)":"var(--ck-body-color)"};
  text-align: center;
`,M7=E.div`
  margin-top: 16px;
  padding: 16px;
  background: var(--ck-body-background-secondary);
  border-radius: 12px;
  border: 1px solid var(--ck-body-color-danger, rgba(255, 71, 71, 0.2));
`,P7=E.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color-danger);
  margin-bottom: 8px;
`,D7=E.div`
  font-size: 14px;
  color: var(--ck-body-color);
  margin-bottom: 8px;
  line-height: 1.4;
`,$7=E.div`
  font-size: 13px;
  color: var(--ck-body-color-muted);
  line-height: 1.4;
`,Xl=()=>n.jsxs("svg",{"aria-hidden":"true",width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("circle",{cx:"7",cy:"7",r:"6",stroke:"currentColor",strokeWidth:"1.5"}),n.jsx("path",{d:"M7 10V6.5M7 4.5H7.005",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),B7=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:4}),W7=({account:e,to:t,value:r,data:o,chainId:i,nativeSymbol:a,enabled:c=!0,hideInfoIcon:s=!1})=>{var l,d,u;const{data:p}=Gt(),h=(u=(d=(l=p?.find(b=>b.type==="native"))===null||l===void 0?void 0:l.metadata)===null||d===void 0?void 0:d.fiat)===null||u===void 0?void 0:u.value,f=hn({queryKey:["gas-estimate",e,t,r,o,i],queryFn:async()=>{var b;if(!e||!t||!i)return null;try{const y=gr(i),w=xr({transport:vr(y)}),[C,k]=await Promise.all([w.estimateGas({account:e,to:t,value:r??BigInt(0),data:o??"0x"}),w.estimateFeesPerGas()]);return{estimatedCost:C*((b=k.maxFeePerGas)!==null&&b!==void 0?b:BigInt(0)),gasLimit:C}}catch(y){return Z.error("Failed to estimate gas:",y),null}},enabled:c&&!!e&&!!t&&!!i});if(!f.data||f.error)return n.jsx(n.Fragment,{children:"--"});const g=f.data.estimatedCost,m=f.data.gasLimit;if(h!==void 0){const y=Number.parseFloat(vn(g,18))*h;return n.jsxs(n.Fragment,{children:["≈ ",B7.format(y),!s&&n.jsx(Tr,{message:`${m.toString()} gas units (paid in ${a})`,delay:.2,children:n.jsx(Kl,{children:n.jsx(Xl,{})})})]})}return n.jsxs(n.Fragment,{children:["≈ ",vs(g,18)," ",a,!s&&n.jsx(Tr,{message:`${m.toString()} gas units`,delay:.2,children:n.jsx(Kl,{children:n.jsx(Xl,{})})})]})};function V7(e){return new Set([5,11155111,80001,84532,421614,97,4002]).has(e)}const U7=()=>{var e,t,r,o,i,a;const c=He(),{chainType:s}=ve(),{sendForm:l,setRoute:d,triggerResize:u,walletConfig:p}=U(),h=c.status==="connected"?c.address:void 0,f=c.status==="connected"?c.chainId:void 0,g=f?{name:N1(f),blockExplorers:{default:{url:S0(ne.EVM,{chainId:f})}},testnet:V7(f)}:void 0,m=od(l.recipient)?l.recipient:void 0,b=Dn(l.amount),{data:y}=Gt(),w=v.useMemo(()=>y?.find(Ae=>Dr(Ae,l.asset)),[y,l.asset]),C=w??y?.[0],k=C??l.asset,x=k.type==="erc20",S=lg({address:h??"",chainType:s,chainId:f??84532,cluster:s===ne.SVM?"devnet":void 0,enabled:!!h&&!x}),O=S.refetch,j=hn({queryKey:["erc20-balance",h,k.type==="erc20"?k.address:null,f],queryFn:async()=>{if(!x||!h||!f)return{value:BigInt(0),decimals:18,symbol:"ERC20"};try{const Ae=gr(f);return{value:await xr({transport:vr(Ae)}).readContract({address:k.address,abi:ii,functionName:"balanceOf",args:[h]}),decimals:18,symbol:Ke(k)}}catch(Ae){return Z.error("Failed to fetch ERC20 balance:",Ae),{value:BigInt(0),decimals:18,symbol:Ke(k)}}},enabled:!!(x&&h&&f)}),A=j.refetch,_=b&&k&&_r(k)!==void 0?(()=>{try{return ad(b,_r(k))}catch{return null}})():null;v.useEffect(()=>{(!m||_===null||_<=BigInt(0))&&Z.log("INVALID - recipientAddress:",m,"parsedAmount:",_)},[m,_,d]);const P=S.status==="success"?S.value:void 0,D=j.data&&!j.error?(e=j.data)===null||e===void 0?void 0:e.value:void 0,$=x?D:P,q=S.status==="success"?S.symbol:"ETH",B=_!==null&&$!==void 0?_>$:!1,[W,H]=v.useState(!1),K=v.useRef(void 0),Y=v.useRef(null),ue=v.useRef(!1),[G,I]=v.useState(void 0),[N,R]=v.useState(!1),[M,T]=v.useState(null),[oe,V]=v.useState(void 0),[de,ce]=v.useState(!1),[se,J]=v.useState(null),me=G??oe,ae=async Ae=>{R(!0),T(null);try{if(!c.activeWallet)throw new Error("Wallet not available");const pt=await(await c.activeWallet.getProvider()).request({method:"eth_sendTransaction",params:[{from:h,to:Ae.to,value:`0x${Ae.value.toString(16)}`}]});return I(pt),pt}catch(Ze){const pt=Ze instanceof Error?Ze:new Error(String(Ze));throw T(pt),pt}finally{R(!1)}},ie=async Ae=>{ce(!0),J(null);try{if(!c.activeWallet)throw new Error("Wallet not available");const Ze=await c.activeWallet.getProvider(),pt=Bs({abi:Ae.abi,functionName:Ae.functionName,args:Ae.args}),Os=await Ze.request({method:"eth_sendTransaction",params:[{from:h,to:Ae.address,data:pt}]});return V(Os),Os}catch(Ze){const pt=Ze instanceof Error?Ze:new Error(String(Ze));throw J(pt),pt}finally{ce(!1)}},Fe=m&&_!==null&&_>BigInt(0)&&k.type==="erc20"?Bs({abi:ii,functionName:"transfer",args:[m,_]}):void 0,he=hn({queryKey:["tx-receipt",me,f],queryFn:async()=>{if(!me||!f)return null;try{const Ae=gr(f);return await xr({transport:vr(Ae)}).waitForTransactionReceipt({hash:me})}catch(Ae){throw Z.error("Failed to get transaction receipt:",Ae),Ae}},enabled:!!(me&&f)}),Oe=he.data,ye=he.isLoading,xe=he.data&&!he.error&&((t=he.data)===null||t===void 0?void 0:t.status)==="success",qe=(r=he.error)!==null&&r!==void 0?r:null,ke=N||de,Le=ke||ye,ee=M||se||qe;v.useEffect(()=>{ke&&K.current===void 0&&(K.current=$)},[ke,$]),v.useEffect(()=>{if(xe&&K.current!==void 0){H(!0);const Ae=x?A:O;Ae(),Y.current=setInterval(()=>{Ae()},3e3)}return()=>{Y.current&&(clearInterval(Y.current),Y.current=null)}},[xe,x,A,O]),v.useEffect(()=>{W&&$!==void 0&&K.current!==void 0&&$!==K.current&&(H(!1),Y.current&&(clearInterval(Y.current),Y.current=null))},[W,$]);const Se=async()=>{if(!ue.current&&!(!m||!_||_<=BigInt(0)||B)){ue.current=!0;try{k.type==="native"?await ae({to:m,value:_,chainId:f}):await ie({abi:ii,address:k.address,functionName:"transfer",args:[m,_],chainId:f})}catch{}finally{ue.current=!1}}},tt=()=>{d(L.SEND)},Ge=()=>{Y.current&&(clearInterval(Y.current),Y.current=null),H(!1),d(L.CONNECTED)},dt=(xe?"success":ee?"error":"idle")==="error"?O7(ee):null,Be=(i=(o=g?.blockExplorers)===null||o===void 0?void 0:o.default)===null||i===void 0?void 0:i.url,ut=()=>{Oe?.transactionHash&&Be&&window.open(`${Be}/tx/${Oe.transactionHash}`,"_blank","noopener,noreferrer")};v.useEffect(()=>{setTimeout(u,10)},[dt,B,Oe?.transactionHash,Le,u]);const Zn=v.useMemo(()=>{var Ae;const Ze=(Ae=p?.ethereum)===null||Ae===void 0?void 0:Ae.ethereumFeeSponsorshipId;return Ze?typeof Ze=="string"?!0:Ze[f??0]!==void 0:!1},[(a=p?.ethereum)===null||a===void 0?void 0:a.ethereumFeeSponsorshipId,f]);if(xe){const Ae=b||"0",Ze=Ke(k);return n.jsxs(Q,{children:[n.jsx(ze,{isSuccess:!0,header:"Transfer Sent",description:`${Ae} ${Ze} sent successfully`}),n.jsxs(Yl,{children:[n.jsx(te,{variant:"primary",onClick:ut,children:"View on Explorer"}),n.jsx(te,{variant:"secondary",onClick:Ge,children:"Back to profile"})]})]})}return n.jsxs(Q,{children:[n.jsx(we,{children:"Confirm transfer"}),n.jsx(X,{children:"Review the transaction details before sending."}),n.jsxs(R7,{children:[n.jsxs(no,{children:[n.jsx(ro,{children:"Sending"}),n.jsxs(L7,{children:[b||"0"," ",Ke(k)]})]}),n.jsxs(no,{children:[n.jsx(ro,{children:"From"}),n.jsx(Zl,{children:h?n.jsx(Ft,{size:"1rem",value:h,children:_t(h)}):"--"})]}),n.jsxs(no,{children:[n.jsx(ro,{children:"To"}),n.jsx(Zl,{children:m?n.jsx(Ft,{size:"1rem",value:m,children:_t(m)}):"--"})]}),n.jsxs("div",{children:[n.jsxs(no,{children:[n.jsx(ro,{children:"Estimated fees"}),n.jsxs(I7,{$completed:Zn,children:[n.jsx(W7,{account:h,to:k.type==="erc20"?k.address:m,value:k.type==="native"&&_?_:void 0,data:Fe,chainId:f,nativeSymbol:q,enabled:!!(h&&m&&_&&_>BigInt(0)),hideInfoIcon:Zn}),n.jsx(N7,{children:n.jsx($n,{})})]})]}),Zn&&n.jsx("div",{style:{textAlign:"end",marginTop:"4px",width:"100%",color:"var(--ck-body-color-valid)",fontSize:"12px"},children:"Sponsored transaction"})]})]}),B&&!xe&&n.jsx(F7,{$status:"error",children:"Insufficient balance for this transfer."}),dt&&n.jsxs(M7,{children:[n.jsx(P7,{children:dt.title}),n.jsx(D7,{children:dt.message}),dt.action&&n.jsx($7,{children:dt.action})]}),n.jsxs(Yl,{children:[n.jsx(te,{variant:"primary",onClick:xe?ut:Se,disabled:xe?!1:!m||!_||_<=BigInt(0)||B,waiting:Le,icon:xe?n.jsx($n,{style:{width:18,height:18}}):void 0,children:xe?"Confirmed":Le?"Confirming...":"Confirm"}),xe?n.jsx(te,{variant:"secondary",onClick:Ge,children:"Back to profile"}):n.jsx(te,{variant:"secondary",onClick:tt,disabled:Le,children:"Cancel"})]})]})},z7=()=>{const{remainingSocialProviders:e}=As();return n.jsxs(Q,{children:[n.jsx(we,{children:"Other socials"}),n.jsx(ys,{mobileDirection:"horizontal",children:e.map(t=>n.jsx(s1,{provider:t},t))}),n.jsx($r,{showDisclaimer:!0})]})},H7=e=>{const{route:t}=U(),[r,o]=v.useState();return v.useEffect(()=>{t.route!==e?Z.error(`Route mismatch: must be used with route '${e.toUpperCase()}' but current route is '${t.route.toUpperCase()}'.
Please contact support if you see this message as this is likely a bug.`):o(t)},[]),t.route===e?t:r},G7=n.jsxs("svg",{"aria-hidden":"true",width:20,height:20,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("g",{filter:"url(#filter0_ii_927_5781)",children:n.jsxs("g",{clipPath:"url(#clip0_927_5781)",children:[n.jsx("path",{d:"M1.58771 0V12.2727H6.06498L10.0002 5.45455H20.0002V0H1.58771Z",fill:"#DB4437"}),n.jsx("path",{d:"M1.58771 0V12.2727H6.06498L10.0002 5.45455H20.0002V0H1.58771Z",fill:"url(#paint0_linear_927_5781)"}),n.jsx("path",{d:"M6.17038 12.2272L1.64538 4.46582L1.57947 4.57946L6.07265 12.284L6.17038 12.2272Z",fill:"black",fillOpacity:"0.15"}),n.jsx("path",{d:"M0 20.0003H9.51932L13.9375 15.5821V12.273H6.0625L0 1.87305V20.0003Z",fill:"#0F9D58"}),n.jsx("path",{d:"M0 20.0003H9.51932L13.9375 15.5821V12.273H6.0625L0 1.87305V20.0003Z",fill:"url(#paint1_linear_927_5781)"}),n.jsx("path",{d:"M13.8412 12.4208L13.7469 12.3662L9.38324 19.9969H9.51392L13.8435 12.4242L13.8412 12.4208Z",fill:"#263238",fillOpacity:"0.15"}),n.jsx("path",{d:"M10.0006 5.45459L13.9381 12.2728L9.51996 20H20.0006V5.45459H10.0006Z",fill:"#FFCD40"}),n.jsx("path",{d:"M10.0006 5.45459L13.9381 12.2728L9.51996 20H20.0006V5.45459H10.0006Z",fill:"url(#paint2_linear_927_5781)"}),n.jsx("path",{d:"M9.9996 5.45459L13.9371 12.2728L9.51892 20H19.9996V5.45459H9.9996Z",fill:"#FFCD40"}),n.jsx("path",{d:"M9.9996 5.45459L13.9371 12.2728L9.51892 20H19.9996V5.45459H9.9996Z",fill:"url(#paint3_linear_927_5781)"}),n.jsx("path",{d:"M1.58691 0V12.2727H6.06419L9.99941 5.45455H19.9994V0H1.58691Z",fill:"#DB4437"}),n.jsx("path",{d:"M1.58691 0V12.2727H6.06419L9.99941 5.45455H19.9994V0H1.58691Z",fill:"url(#paint4_linear_927_5781)"}),n.jsx("path",{d:"M10 5.45459V7.83527L18.9091 5.45459H10Z",fill:"url(#paint5_radial_927_5781)"}),n.jsx("path",{d:"M0 19.9998H9.51932L11.9318 15.9089L13.9375 12.2726H6.0625L0 1.87256V19.9998Z",fill:"#0F9D58"}),n.jsx("path",{d:"M0 19.9998H9.51932L12.1023 15.5112L13.9375 12.2726H6.0625L0 1.87256V19.9998Z",fill:"url(#paint6_linear_927_5781)"}),n.jsx("path",{d:"M1.58771 4.59668L8.09339 11.1012L6.06384 12.2728L1.58771 4.59668Z",fill:"url(#paint7_radial_927_5781)"}),n.jsx("path",{d:"M9.52661 19.9884L11.9084 11.1021L13.938 12.2725L9.52661 19.9884Z",fill:"url(#paint8_radial_927_5781)"}),n.jsx("path",{d:"M10.0003 14.5455C12.5107 14.5455 14.5458 12.5104 14.5458 10C14.5458 7.48966 12.5107 5.45459 10.0003 5.45459C7.48996 5.45459 5.4549 7.48966 5.4549 10C5.4549 12.5104 7.48996 14.5455 10.0003 14.5455Z",fill:"#F1F1F1"}),n.jsx("path",{d:"M9.99995 13.6365C12.0083 13.6365 13.6363 12.0084 13.6363 10.0001C13.6363 7.99183 12.0083 6.36377 9.99995 6.36377C7.99164 6.36377 6.36359 7.99183 6.36359 10.0001C6.36359 12.0084 7.99164 13.6365 9.99995 13.6365Z",fill:"#4285F4"}),n.jsx("path",{d:"M10.0003 5.34082C7.48899 5.34082 5.4549 7.37491 5.4549 9.88628V9.99991C5.4549 7.48855 7.48899 5.45446 10.0003 5.45446H20.0003V5.34082H10.0003Z",fill:"black",fillOpacity:"0.2"}),n.jsx("path",{d:"M13.9318 12.273C13.1455 13.6299 11.6818 14.5458 10 14.5458C8.31818 14.5458 6.85227 13.6299 6.06818 12.273H6.06364L0 1.87305V1.98668L6.06818 12.3867C6.85455 13.7435 8.31818 14.6594 10 14.6594C11.6818 14.6594 13.1455 13.7446 13.9318 12.3867H13.9375V12.273H13.9307H13.9318Z",fill:"white",fillOpacity:"0.1"}),n.jsx("path",{opacity:"0.1",d:"M10.1133 5.45459C10.094 5.45459 10.0758 5.45686 10.0565 5.458C12.5406 5.48868 14.5452 7.50913 14.5452 10C14.5452 12.491 12.5406 14.5114 10.0565 14.5421C10.0758 14.5421 10.094 14.5455 10.1133 14.5455C12.6247 14.5455 14.6588 12.5114 14.6588 10C14.6588 7.48868 12.6247 5.45459 10.1133 5.45459Z",fill:"black"}),n.jsx("path",{d:"M13.9769 12.4204C14.3632 11.7522 14.5871 10.9795 14.5871 10.1522C14.5874 9.68602 14.5157 9.22262 14.3746 8.77832C14.4826 9.16696 14.5451 9.57377 14.5451 9.99764C14.5451 10.8249 14.3212 11.5976 13.9348 12.2658L13.9371 12.2704L9.51892 19.9976H9.65074L13.9769 12.4204Z",fill:"white",fillOpacity:"0.2"}),n.jsx("path",{d:"M10 0.113636C15.5034 0.113636 19.9682 4.56023 20 10.0568C20 10.0375 20.0011 10.0193 20.0011 10C20.0011 4.47727 15.5239 0 10.0011 0C4.47841 0 0 4.47727 0 10C0 10.0193 0.00113639 10.0375 0.00113639 10.0568C0.0318182 4.56023 4.49659 0.113636 10 0.113636Z",fill:"white",fillOpacity:"0.2"}),n.jsx("path",{d:"M10 19.8865C15.5034 19.8865 19.9682 15.4399 20 9.94336C20 9.96268 20.0011 9.98086 20.0011 10.0002C20.0011 15.5229 15.5239 20.0002 10.0011 20.0002C4.47841 20.0002 0 15.5229 0 10.0002C0 9.98086 0.00113639 9.96268 0.00113639 9.94336C0.0318182 15.4399 4.49659 19.8865 10.0011 19.8865H10Z",fill:"black",fillOpacity:"0.15"})]})}),n.jsxs("defs",{children:[n.jsxs("filter",{id:"filter0_ii_927_5781",x:0,y:"-0.235294",width:20,height:"20.4706",filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n.jsx("feFlood",{floodOpacity:0,result:"BackgroundImageFix"}),n.jsx("feBlend",{mode:"normal",in:"SourceGraphic",in2:"BackgroundImageFix",result:"shape"}),n.jsx("feColorMatrix",{in:"SourceAlpha",type:"matrix",values:"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",result:"hardAlpha"}),n.jsx("feOffset",{dy:"0.235294"}),n.jsx("feGaussianBlur",{stdDeviation:"0.235294"}),n.jsx("feComposite",{in2:"hardAlpha",operator:"arithmetic",k2:-1,k3:1}),n.jsx("feColorMatrix",{type:"matrix",values:"0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"}),n.jsx("feBlend",{mode:"normal",in2:"shape",result:"effect1_innerShadow_927_5781"}),n.jsx("feColorMatrix",{in:"SourceAlpha",type:"matrix",values:"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",result:"hardAlpha"}),n.jsx("feOffset",{dy:"-0.235294"}),n.jsx("feGaussianBlur",{stdDeviation:"0.235294"}),n.jsx("feComposite",{in2:"hardAlpha",operator:"arithmetic",k2:-1,k3:1}),n.jsx("feColorMatrix",{type:"matrix",values:"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"}),n.jsx("feBlend",{mode:"normal",in2:"effect1_innerShadow_927_5781",result:"effect2_innerShadow_927_5781"})]}),n.jsxs("linearGradient",{id:"paint0_linear_927_5781",x1:"2.42521",y1:"7.61591",x2:"8.39112",y2:"4.13068",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#A52714",stopOpacity:"0.6"}),n.jsx("stop",{offset:"0.66",stopColor:"#A52714",stopOpacity:0})]}),n.jsxs("linearGradient",{id:"paint1_linear_927_5781",x1:"11.6932",y1:"17.7844",x2:"5.06136",y2:"13.8981",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#055524",stopOpacity:"0.4"}),n.jsx("stop",{offset:"0.33",stopColor:"#055524",stopOpacity:0})]}),n.jsxs("linearGradient",{id:"paint2_linear_927_5781",x1:"12.9438",y1:"4.75004",x2:"14.6143",y2:"12.0569",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#EA6100",stopOpacity:"0.3"}),n.jsx("stop",{offset:"0.66",stopColor:"#EA6100",stopOpacity:0})]}),n.jsxs("linearGradient",{id:"paint3_linear_927_5781",x1:"12.9428",y1:"4.75004",x2:"14.6132",y2:"12.0569",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#EA6100",stopOpacity:"0.3"}),n.jsx("stop",{offset:"0.66",stopColor:"#EA6100",stopOpacity:0})]}),n.jsxs("linearGradient",{id:"paint4_linear_927_5781",x1:"2.42441",y1:"7.61591",x2:"8.39032",y2:"4.13068",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#A52714",stopOpacity:"0.6"}),n.jsx("stop",{offset:"0.66",stopColor:"#A52714",stopOpacity:0})]}),n.jsxs("radialGradient",{id:"paint5_radial_927_5781",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(9.56818 5.44891) scale(9.55455)",children:[n.jsx("stop",{stopColor:"#3E2723",stopOpacity:"0.2"}),n.jsx("stop",{offset:1,stopColor:"#3E2723",stopOpacity:0})]}),n.jsxs("linearGradient",{id:"paint6_linear_927_5781",x1:"11.6932",y1:"17.7839",x2:"5.06136",y2:"13.8976",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#055524",stopOpacity:"0.4"}),n.jsx("stop",{offset:"0.33",stopColor:"#055524",stopOpacity:0})]}),n.jsxs("radialGradient",{id:"paint7_radial_927_5781",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(1.57975 4.60463) scale(8.86818)",children:[n.jsx("stop",{stopColor:"#3E2723",stopOpacity:"0.2"}),n.jsx("stop",{offset:1,stopColor:"#3E2723",stopOpacity:0})]}),n.jsxs("radialGradient",{id:"paint8_radial_927_5781",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(9.97775 10.0157) scale(9.98523)",children:[n.jsx("stop",{stopColor:"#263238",stopOpacity:"0.2"}),n.jsx("stop",{offset:1,stopColor:"#263238",stopOpacity:0})]}),n.jsx("clipPath",{id:"clip0_927_5781",children:n.jsx("rect",{width:20,height:20,rx:10,fill:"white"})})]})]}),q7=n.jsxs("svg",{"aria-hidden":"true",width:20,height:20,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsxs("g",{clipPath:"url(#clip0_927_5847)",children:[n.jsx("path",{d:"M19.011 6.71023C18.5898 5.69685 17.7355 4.60269 17.0665 4.25681C17.5436 5.18063 17.8747 6.17276 18.0481 7.19792L18.0499 7.21417C16.954 4.48315 15.0963 3.38023 13.5782 0.981835C13.5014 0.860539 13.4246 0.738994 13.3498 0.610696C13.3071 0.537418 13.2728 0.471393 13.2431 0.410621C13.1801 0.288713 13.1316 0.159878 13.0985 0.0267267C13.0985 0.0205825 13.0963 0.0146369 13.0923 0.0100242C13.0882 0.00541151 13.0826 0.00245454 13.0765 0.00171737C13.0705 7.85858e-05 13.0642 7.85858e-05 13.0582 0.00171737C13.057 0.00171737 13.055 0.00396821 13.0535 0.0044684C13.052 0.00496859 13.0487 0.00721943 13.0465 0.00821981L13.0502 0.00171737C10.6156 1.42725 9.78901 4.06574 9.71399 5.38624C8.74136 5.45292 7.81141 5.81121 7.04549 6.41437C6.96561 6.34671 6.88212 6.28343 6.79539 6.2248C6.57456 5.45174 6.56514 4.6336 6.76813 3.85566C5.87401 4.28877 5.07954 4.90279 4.43501 5.65884H4.43051C4.04636 5.17191 4.07337 3.5663 4.09538 3.23093C3.98174 3.2766 3.87326 3.33419 3.77176 3.40274C3.43264 3.64477 3.11562 3.91635 2.8244 4.2143C2.49255 4.55075 2.18946 4.91441 1.91831 5.30146V5.30296V5.3012C1.29521 6.18444 0.853213 7.18234 0.617826 8.23731L0.604821 8.30133C0.586564 8.38661 0.52079 8.81377 0.509535 8.90656C0.509535 8.91381 0.508035 8.92056 0.507285 8.92781C0.42244 9.36882 0.369864 9.81542 0.349976 10.2641V10.3141C0.354259 12.7396 1.26772 15.0754 2.91002 16.8604C4.55233 18.6454 6.80415 19.7498 9.22094 19.9556C11.6377 20.1615 14.0439 19.4538 15.9644 17.9723C17.8849 16.4908 19.1803 14.3431 19.5947 11.9532C19.6109 11.8282 19.6242 11.7044 19.6387 11.5781C19.8384 9.92791 19.6222 8.25404 19.01 6.70873L19.011 6.71023ZM7.83928 14.2981C7.88455 14.3198 7.92707 14.3433 7.97358 14.3641L7.98034 14.3684C7.93332 14.3458 7.8863 14.3224 7.83928 14.2981ZM18.0501 7.21692V7.20767L18.0519 7.21792L18.0501 7.21692Z",fill:"url(#paint0_linear_927_5847)"}),n.jsx("path",{d:"M19.0109 6.71026C18.5898 5.69688 17.7354 4.60272 17.0664 4.25684C17.5435 5.18066 17.8746 6.17278 18.0481 7.19794V7.20719L18.0498 7.21745C18.797 9.35551 18.689 11.6997 17.7482 13.7599C16.6373 16.1435 13.9493 18.5867 9.7402 18.4667C5.19349 18.3379 1.18699 14.9629 0.439211 10.5437C0.30291 9.84668 0.439211 9.4933 0.507737 8.92684C0.414265 9.36685 0.362102 9.81463 0.351929 10.2643V10.3144C0.356212 12.7399 1.26967 15.0757 2.91198 16.8607C4.55429 18.6456 6.8061 19.7501 9.2229 19.9559C11.6397 20.1617 14.0458 19.4541 15.9664 17.9725C17.8869 16.491 19.1822 14.3434 19.5966 11.9535C19.6129 11.8284 19.6262 11.7046 19.6407 11.5783C19.8403 9.92819 19.6242 8.25431 19.0119 6.70901L19.0109 6.71026Z",fill:"url(#paint1_radial_927_5847)"}),n.jsx("path",{d:"M19.0109 6.71026C18.5898 5.69688 17.7354 4.60272 17.0664 4.25684C17.5435 5.18066 17.8746 6.17278 18.0481 7.19794V7.20719L18.0498 7.21745C18.797 9.35551 18.689 11.6997 17.7482 13.7599C16.6373 16.1435 13.9493 18.5867 9.7402 18.4667C5.19349 18.3379 1.18699 14.9629 0.439211 10.5437C0.30291 9.84668 0.439211 9.4933 0.507737 8.92684C0.414265 9.36685 0.362102 9.81463 0.351929 10.2643V10.3144C0.356212 12.7399 1.26967 15.0757 2.91198 16.8607C4.55429 18.6456 6.8061 19.7501 9.2229 19.9559C11.6397 20.1617 14.0458 19.4541 15.9664 17.9725C17.8869 16.491 19.1822 14.3434 19.5966 11.9535C19.6129 11.8284 19.6262 11.7046 19.6407 11.5783C19.8403 9.92819 19.6242 8.25431 19.0119 6.70901L19.0109 6.71026Z",fill:"url(#paint2_radial_927_5847)"}),n.jsx("path",{d:"M14.2993 7.84794C14.3203 7.8627 14.3398 7.87745 14.3595 7.89221C14.1161 7.46047 13.813 7.06519 13.4592 6.71802C10.4456 3.70439 12.6696 0.18557 13.0445 0.00550206L13.0483 0C10.6136 1.42553 9.78706 4.06402 9.71204 5.38452C9.82508 5.37677 9.93712 5.36726 10.0527 5.36726C10.9164 5.36893 11.7644 5.59929 12.5103 6.03492C13.2562 6.47055 13.8734 7.09592 14.2993 7.84744V7.84794Z",fill:"url(#paint3_radial_927_5847)"}),n.jsx("path",{d:"M10.0577 8.45061C10.0417 8.6917 9.18992 9.52326 8.89206 9.52326C6.13602 9.52326 5.68835 11.1906 5.68835 11.1906C5.8104 12.5947 6.78877 13.7516 7.97146 14.3618C8.02548 14.3898 8.08025 14.4151 8.13502 14.4399C8.22989 14.4819 8.32476 14.5207 8.41963 14.5564C8.82553 14.7 9.25065 14.7821 9.68085 14.7997C14.5127 15.0263 15.448 9.02257 11.9615 7.27942C12.7839 7.1724 13.6168 7.37463 14.2986 7.84688C13.8727 7.09536 13.2555 6.46999 12.5096 6.03436C11.7637 5.59873 10.9158 5.36837 10.052 5.3667C9.93695 5.3667 9.82441 5.3762 9.71136 5.38396C8.73874 5.45064 7.80879 5.80893 7.04286 6.41209C7.19067 6.53714 7.35748 6.7042 7.70886 7.05058C8.36661 7.69857 10.0535 8.36983 10.0572 8.44861L10.0577 8.45061Z",fill:"url(#paint4_radial_927_5847)"}),n.jsx("path",{d:"M10.0577 8.45061C10.0417 8.6917 9.18992 9.52326 8.89206 9.52326C6.13602 9.52326 5.68835 11.1906 5.68835 11.1906C5.8104 12.5947 6.78877 13.7516 7.97146 14.3618C8.02548 14.3898 8.08025 14.4151 8.13502 14.4399C8.22989 14.4819 8.32476 14.5207 8.41963 14.5564C8.82553 14.7 9.25065 14.7821 9.68085 14.7997C14.5127 15.0263 15.448 9.02257 11.9615 7.27942C12.7839 7.1724 13.6168 7.37463 14.2986 7.84688C13.8727 7.09536 13.2555 6.46999 12.5096 6.03436C11.7637 5.59873 10.9158 5.36837 10.052 5.3667C9.93695 5.3667 9.82441 5.3762 9.71136 5.38396C8.73874 5.45064 7.80879 5.80893 7.04286 6.41209C7.19067 6.53714 7.35748 6.7042 7.70886 7.05058C8.36661 7.69857 10.0535 8.36983 10.0572 8.44861L10.0577 8.45061Z",fill:"url(#paint5_radial_927_5847)"}),n.jsx("path",{d:"M6.59134 6.0923C6.66987 6.14231 6.73464 6.18583 6.79141 6.2251C6.57058 5.45204 6.56117 4.63389 6.76415 3.85596C5.87003 4.28907 5.07556 4.90308 4.43103 5.65913C4.4783 5.65788 5.88432 5.63262 6.59134 6.0923Z",fill:"url(#paint6_radial_927_5847)"}),n.jsx("path",{d:"M0.437567 10.5439C1.1856 14.963 5.19185 18.3393 9.73855 18.4668C13.9476 18.5859 16.6361 16.1425 17.7466 13.7601C18.6873 11.6998 18.7954 9.35569 18.0482 7.21762V7.20837C18.0482 7.20111 18.0467 7.19686 18.0482 7.19911L18.0499 7.21537C18.3938 9.46046 17.2519 11.6345 15.4665 13.1076L15.4609 13.1201C11.9821 15.9536 8.6534 14.8292 7.98064 14.3706C7.93363 14.348 7.88661 14.3246 7.83959 14.3003C5.81158 13.3309 4.97352 11.4842 5.15358 9.89862C4.67218 9.90573 4.19905 9.77307 3.79151 9.51672C3.38397 9.26038 3.05952 8.89134 2.85747 8.45433C3.38987 8.1282 3.99692 7.94382 4.62077 7.91878C5.24461 7.89374 5.86448 8.02887 6.42131 8.31128C7.56906 8.83225 8.87507 8.8836 10.0602 8.45433C10.0564 8.37555 8.36954 7.70405 7.71179 7.05631C7.36041 6.70993 7.1936 6.54312 7.04579 6.41782C6.96591 6.35016 6.88243 6.28688 6.7957 6.22825C6.73818 6.18898 6.6734 6.14647 6.59562 6.09545C5.88861 5.63578 4.48258 5.66104 4.43607 5.66229H4.43156C4.04742 5.17535 4.07443 3.56975 4.09644 3.23438C3.9828 3.28005 3.87431 3.33764 3.77282 3.40619C3.4337 3.64822 3.11667 3.91979 2.82546 4.21774C2.49242 4.55325 2.18808 4.91607 1.91562 5.3024V5.3039V5.30215C1.29252 6.18539 0.850521 7.18329 0.615133 8.23825C0.610381 8.25801 0.266002 9.76357 0.435816 10.5444L0.437567 10.5439Z",fill:"url(#paint7_radial_927_5847)"}),n.jsx("path",{d:"M13.459 6.71761C13.8128 7.06516 14.1159 7.46087 14.3593 7.89305C14.4126 7.93331 14.4624 7.97333 14.5046 8.01209C16.7022 10.0378 15.5508 12.9014 15.465 13.104C17.2502 11.6332 18.3911 9.45763 18.0485 7.21179C16.952 4.47826 15.0923 3.37535 13.5768 0.976952C13.5 0.855657 13.4232 0.734111 13.3484 0.605813C13.3057 0.532535 13.2714 0.466511 13.2417 0.405738C13.1787 0.283831 13.1302 0.154995 13.0971 0.0218439C13.0971 0.0156997 13.0949 0.0097541 13.0909 0.0051414C13.0868 0.000528701 13.0812 -0.00242828 13.0751 -0.00316545C13.0691 -0.00480423 13.0628 -0.00480423 13.0568 -0.00316545C13.0556 -0.00316545 13.0536 -0.000914601 13.0521 -0.000414413C13.0506 8.57743e-05 13.0473 0.00233662 13.0451 0.00333699C12.6702 0.181154 10.4466 3.70222 13.4602 6.71335L13.459 6.71761Z",fill:"url(#paint8_radial_927_5847)"}),n.jsx("path",{d:"M14.5043 8.01315C14.462 7.97439 14.4122 7.93437 14.359 7.8941C14.3392 7.87935 14.3197 7.86459 14.2987 7.84984C13.6169 7.37759 12.784 7.17536 11.9616 7.28238C15.4479 9.02553 14.5125 15.0278 9.68095 14.8027C9.25075 14.785 8.82562 14.703 8.41973 14.5594C8.32486 14.5238 8.22999 14.485 8.13512 14.4428C8.08035 14.4178 8.02558 14.3928 7.97156 14.3648L7.97831 14.369C8.65206 14.829 11.9798 15.9526 15.4586 13.1186L15.4641 13.1061C15.5509 12.9035 16.7023 10.0399 14.5038 8.01415L14.5043 8.01315Z",fill:"url(#paint9_radial_927_5847)"}),n.jsx("path",{d:"M5.68842 11.1892C5.68842 11.1892 6.13583 9.52179 8.89212 9.52179C9.18998 9.52179 10.0425 8.69023 10.0578 8.44914C8.8727 8.8784 7.56669 8.82706 6.41894 8.30608C5.86211 8.02367 5.24224 7.88855 4.61839 7.91359C3.99455 7.93863 3.3875 8.123 2.8551 8.44914C3.05715 8.88615 3.3816 9.25518 3.78914 9.51153C4.19668 9.76787 4.66981 9.90053 5.15121 9.89343C4.97165 11.4783 5.80946 13.3247 7.83722 14.2951C7.88249 14.3168 7.925 14.3403 7.97152 14.3611C6.78783 13.7496 5.81046 12.5932 5.68842 11.1899V11.1892Z",fill:"url(#paint10_radial_927_5847)"}),n.jsx("path",{d:"M19.0112 6.71023C18.59 5.69685 17.7357 4.60269 17.0667 4.25681C17.5438 5.18063 17.8749 6.17276 18.0483 7.19792L18.0501 7.21417C16.9542 4.48315 15.0965 3.38023 13.5784 0.981835C13.5016 0.860539 13.4249 0.738994 13.3501 0.610696C13.3073 0.537418 13.2731 0.471393 13.2433 0.410621C13.1803 0.288713 13.1318 0.159878 13.0987 0.0267267C13.0988 0.0205825 13.0966 0.0146369 13.0925 0.0100242C13.0884 0.00541151 13.0828 0.00245454 13.0767 0.00171737C13.0708 7.85859e-05 13.0644 7.85859e-05 13.0585 0.00171737C13.0572 0.00171737 13.0552 0.00396821 13.0537 0.0044684C13.0522 0.00496859 13.049 0.00721943 13.0467 0.00821981L13.0505 0.00171737C10.6158 1.42725 9.78925 4.06574 9.71422 5.38624C9.82726 5.37848 9.9393 5.36898 10.0548 5.36898C10.9186 5.37065 11.7666 5.60101 12.5125 6.03664C13.2584 6.47227 13.8756 7.09764 14.3014 7.84916C13.6196 7.37691 12.7868 7.17468 11.9643 7.2817C15.4506 9.02485 14.5153 15.0271 9.68371 14.802C9.25351 14.7843 8.82838 14.7023 8.42248 14.5587C8.32761 14.5232 8.23275 14.4843 8.13788 14.4421C8.08311 14.4171 8.02834 14.3921 7.97432 14.3641L7.98107 14.3684C7.93405 14.3458 7.88703 14.3224 7.84002 14.2981C7.88528 14.3198 7.9278 14.3433 7.97432 14.3641C6.79062 13.7524 5.81326 12.5959 5.69121 11.1929C5.69121 11.1929 6.13863 9.52554 8.89491 9.52554C9.19277 9.52554 10.0453 8.69398 10.0606 8.45289C10.0568 8.37411 8.36996 7.7026 7.71222 7.05486C7.36084 6.70848 7.19402 6.54167 7.04622 6.41637C6.96634 6.34871 6.88285 6.28543 6.79612 6.2268C6.57529 5.45374 6.56588 4.6356 6.76886 3.85766C5.87474 4.29077 5.08027 4.90479 4.43574 5.66084H4.43124C4.04709 5.17391 4.0741 3.5683 4.09611 3.23293C3.98247 3.2786 3.87399 3.33619 3.77249 3.40474C3.43337 3.64677 3.11635 3.91835 2.82514 4.2163C2.49328 4.55275 2.19019 4.91641 1.91905 5.30345V5.30496V5.30321C1.29595 6.18644 0.853946 7.18434 0.618558 8.23931L0.605554 8.30333C0.587297 8.38861 0.505516 8.82177 0.493762 8.91481C0.418959 9.36194 0.371188 9.81318 0.350708 10.2661V10.3161C0.354992 12.7416 1.26845 15.0774 2.91076 16.8624C4.55307 18.6474 6.80488 19.7518 9.22168 19.9576C11.6385 20.1635 14.0446 19.4558 15.9652 17.9743C17.8857 16.4928 19.181 14.3451 19.5954 11.9552C19.6117 11.8302 19.6249 11.7064 19.6394 11.5801C19.8391 9.92991 19.623 8.25604 19.0107 6.71073L19.0112 6.71023ZM18.0496 7.20817L18.0513 7.21842L18.0496 7.20817Z",fill:"url(#paint11_linear_927_5847)"})]}),n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"paint0_linear_927_5847",x1:"17.728",y1:"3.09786",x2:"1.63621",y2:"18.6237",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{offset:"0.048",stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.111",stopColor:"#FFE847"}),n.jsx("stop",{offset:"0.225",stopColor:"#FFC830"}),n.jsx("stop",{offset:"0.368",stopColor:"#FF980E"}),n.jsx("stop",{offset:"0.401",stopColor:"#FF8B16"}),n.jsx("stop",{offset:"0.462",stopColor:"#FF672A"}),n.jsx("stop",{offset:"0.534",stopColor:"#FF3647"}),n.jsx("stop",{offset:"0.705",stopColor:"#E31587"})]}),n.jsxs("radialGradient",{id:"paint1_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(17.1052 2.25108) scale(20.2076)",children:[n.jsx("stop",{offset:"0.129",stopColor:"#FFBD4F"}),n.jsx("stop",{offset:"0.186",stopColor:"#FFAC31"}),n.jsx("stop",{offset:"0.247",stopColor:"#FF9D17"}),n.jsx("stop",{offset:"0.283",stopColor:"#FF980E"}),n.jsx("stop",{offset:"0.403",stopColor:"#FF563B"}),n.jsx("stop",{offset:"0.467",stopColor:"#FF3750"}),n.jsx("stop",{offset:"0.71",stopColor:"#F5156C"}),n.jsx("stop",{offset:"0.782",stopColor:"#EB0878"}),n.jsx("stop",{offset:"0.86",stopColor:"#E50080"})]}),n.jsxs("radialGradient",{id:"paint2_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(9.6024 10.5042) scale(20.2076)",children:[n.jsx("stop",{offset:"0.3",stopColor:"#960E18"}),n.jsx("stop",{offset:"0.351",stopColor:"#B11927",stopOpacity:"0.74"}),n.jsx("stop",{offset:"0.435",stopColor:"#DB293D",stopOpacity:"0.343"}),n.jsx("stop",{offset:"0.497",stopColor:"#F5334B",stopOpacity:"0.094"}),n.jsx("stop",{offset:"0.53",stopColor:"#FF3750",stopOpacity:0})]}),n.jsxs("radialGradient",{id:"paint3_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(12.1034 -2.25084) scale(14.638)",children:[n.jsx("stop",{offset:"0.132",stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.252",stopColor:"#FFDC3E"}),n.jsx("stop",{offset:"0.506",stopColor:"#FF9D12"}),n.jsx("stop",{offset:"0.526",stopColor:"#FF980E"})]}),n.jsxs("radialGradient",{id:"paint4_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(7.35173 15.7558) scale(9.62111)",children:[n.jsx("stop",{offset:"0.353",stopColor:"#3A8EE6"}),n.jsx("stop",{offset:"0.472",stopColor:"#5C79F0"}),n.jsx("stop",{offset:"0.669",stopColor:"#9059FF"}),n.jsx("stop",{offset:1,stopColor:"#C139E6"})]}),n.jsxs("radialGradient",{id:"paint5_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(10.5799 8.76923) rotate(-13.5916) scale(5.10194 5.97309)",children:[n.jsx("stop",{offset:"0.206",stopColor:"#9059FF",stopOpacity:0}),n.jsx("stop",{offset:"0.278",stopColor:"#8C4FF3",stopOpacity:"0.064"}),n.jsx("stop",{offset:"0.747",stopColor:"#7716A8",stopOpacity:"0.45"}),n.jsx("stop",{offset:"0.975",stopColor:"#6E008B",stopOpacity:"0.6"})]}),n.jsxs("radialGradient",{id:"paint6_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(9.35238 1.50057) scale(6.9226)",children:[n.jsx("stop",{stopColor:"#FFE226"}),n.jsx("stop",{offset:"0.121",stopColor:"#FFDB27"}),n.jsx("stop",{offset:"0.295",stopColor:"#FFC82A"}),n.jsx("stop",{offset:"0.502",stopColor:"#FFA930"}),n.jsx("stop",{offset:"0.732",stopColor:"#FF7E37"}),n.jsx("stop",{offset:"0.792",stopColor:"#FF7139"})]}),n.jsxs("radialGradient",{id:"paint7_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(14.8545 -3.00121) scale(29.5361)",children:[n.jsx("stop",{offset:"0.113",stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.456",stopColor:"#FF980E"}),n.jsx("stop",{offset:"0.622",stopColor:"#FF5634"}),n.jsx("stop",{offset:"0.716",stopColor:"#FF3647"}),n.jsx("stop",{offset:"0.904",stopColor:"#E31587"})]}),n.jsxs("radialGradient",{id:"paint8_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(12.3996 -1.36343) rotate(83.976) scale(21.6445 14.2051)",children:[n.jsx("stop",{stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.06",stopColor:"#FFE847"}),n.jsx("stop",{offset:"0.168",stopColor:"#FFC830"}),n.jsx("stop",{offset:"0.304",stopColor:"#FF980E"}),n.jsx("stop",{offset:"0.356",stopColor:"#FF8B16"}),n.jsx("stop",{offset:"0.455",stopColor:"#FF672A"}),n.jsx("stop",{offset:"0.57",stopColor:"#FF3647"}),n.jsx("stop",{offset:"0.737",stopColor:"#E31587"})]}),n.jsxs("radialGradient",{id:"paint9_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(9.35233 4.00165) scale(18.4369)",children:[n.jsx("stop",{offset:"0.137",stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.48",stopColor:"#FF980E"}),n.jsx("stop",{offset:"0.592",stopColor:"#FF5634"}),n.jsx("stop",{offset:"0.655",stopColor:"#FF3647"}),n.jsx("stop",{offset:"0.904",stopColor:"#E31587"})]}),n.jsxs("radialGradient",{id:"paint10_radial_927_5847",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(14.1041 5.00184) scale(20.1801)",children:[n.jsx("stop",{offset:"0.094",stopColor:"#FFF44F"}),n.jsx("stop",{offset:"0.231",stopColor:"#FFE141"}),n.jsx("stop",{offset:"0.509",stopColor:"#FFAF1E"}),n.jsx("stop",{offset:"0.626",stopColor:"#FF980E"})]}),n.jsxs("linearGradient",{id:"paint11_linear_927_5847",x1:"17.5331",y1:"3.01533",x2:"3.84302",y2:"16.708",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{offset:"0.167",stopColor:"#FFF44F",stopOpacity:"0.8"}),n.jsx("stop",{offset:"0.266",stopColor:"#FFF44F",stopOpacity:"0.634"}),n.jsx("stop",{offset:"0.489",stopColor:"#FFF44F",stopOpacity:"0.217"}),n.jsx("stop",{offset:"0.6",stopColor:"#FFF44F",stopOpacity:0})]}),n.jsx("clipPath",{id:"clip0_927_5847",children:n.jsx("rect",{width:20,height:20,fill:"white"})})]})]});n.jsxs("svg",{"aria-hidden":"true",width:20,height:20,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M17.2924 5.22043L17.7256 4.15905L16.4982 2.8883C15.8339 2.22404 14.4187 2.61393 14.4187 2.61393L12.8158 0.794434H7.16242L5.55231 2.62115C5.55231 2.62115 4.13715 2.23848 3.47289 2.8883L2.24545 4.15183L2.67866 5.21321L2.13715 6.78721L3.9422 13.6681C4.31765 15.141 4.57036 15.7114 5.63173 16.4623L8.93137 18.7006C9.24906 18.8955 9.63895 19.2349 9.99274 19.2349C10.3465 19.2349 10.7364 18.8955 11.0541 18.7006L14.3538 16.4623C15.4151 15.7114 15.6678 15.141 16.0433 13.6681L17.8483 6.78721L17.2924 5.22043Z",fill:"url(#paint0_linear_927_5861)"}),n.jsx("path",{d:"M13.9711 3.78343C13.9711 3.78343 16.0433 6.28884 16.0433 6.81592C16.0433 7.35744 15.7834 7.49462 15.5234 7.77621L13.9711 9.43686C13.8267 9.58126 13.5162 9.82675 13.6967 10.2527C13.8772 10.686 14.1299 11.2203 13.8411 11.769C13.5523 12.3249 13.0469 12.6932 12.722 12.6354C12.2387 12.4786 11.7777 12.2602 11.3502 11.9856C11.0758 11.8051 10.1949 11.0758 10.1949 10.7943C10.1949 10.5127 11.1047 10 11.278 9.89895C11.444 9.78343 12.2166 9.33577 12.231 9.16249C12.2455 8.9892 12.2455 8.94588 12.0144 8.51267C11.7834 8.07946 11.379 7.50184 11.4368 7.12639C11.509 6.75094 12.1588 6.54877 12.6426 6.36827L14.1372 5.80509C14.2527 5.74733 14.2238 5.69679 13.8772 5.66068C13.5307 5.6318 12.5559 5.50184 12.1155 5.62458C11.6751 5.74733 10.9386 5.93505 10.8664 6.03614C10.8086 6.13722 10.7509 6.13722 10.8159 6.48379L11.2346 8.75816C11.2635 9.04697 11.3213 9.24191 11.018 9.31411C10.7003 9.38632 10.1733 9.50906 9.99276 9.50906C9.81225 9.50906 9.27796 9.38632 8.96749 9.31411C8.65702 9.24191 8.71478 9.04697 8.75088 8.75816C8.77976 8.46935 9.09745 6.82314 9.16243 6.48379C9.23464 6.13722 9.16965 6.13722 9.11189 6.03614C9.03969 5.93505 8.29601 5.74733 7.85558 5.62458C7.42236 5.50184 6.44041 5.6318 6.09384 5.66791C5.74727 5.69679 5.71839 5.74011 5.83391 5.81231L7.3285 6.36827C7.80503 6.54877 8.46929 6.75094 8.53428 7.12639C8.60648 7.50906 8.19493 8.07946 7.95666 8.51267C7.71839 8.94588 7.72561 8.9892 7.74005 9.16249C7.75449 9.33577 8.53428 9.78343 8.69312 9.89895C8.86641 10.0073 9.77615 10.5127 9.77615 10.7943C9.77615 11.0758 8.91695 11.8051 8.62814 11.9856C8.20063 12.2602 7.73957 12.4786 7.2563 12.6354C6.93139 12.6932 6.42597 12.3249 6.12994 11.769C5.84113 11.2203 6.10106 10.686 6.27435 10.2527C6.45485 9.81953 6.1516 9.58848 5.99998 9.43686L4.44763 7.77621C4.19493 7.50906 3.935 7.36466 3.935 6.83036C3.935 6.29606 6.0072 3.79787 6.0072 3.79787L7.97832 4.11556C8.20937 4.11556 8.722 3.92061 9.19132 3.75455C9.66063 3.61014 9.98554 3.5957 9.98554 3.5957C9.98554 3.5957 10.3032 3.5957 10.7798 3.75455C11.2563 3.91339 11.7617 4.11556 11.9928 4.11556C12.231 4.11556 13.9783 3.77621 13.9783 3.77621L13.9711 3.78343ZM12.4188 13.3719C12.5487 13.4441 12.4693 13.6029 12.3465 13.6896L10.5126 15.1192C10.3682 15.2636 10.1372 15.4802 9.98554 15.4802C9.83391 15.4802 9.61009 15.2636 9.45846 15.1192C8.8506 14.6351 8.23683 14.1586 7.61731 13.6896C7.50178 13.6029 7.42236 13.4513 7.54511 13.3719L8.62814 12.7943C9.05864 12.5665 9.51417 12.3897 9.98554 12.2672C10.0938 12.2672 10.7798 12.5127 11.3357 12.7943L12.4188 13.3719Z",fill:"white"}),n.jsx("path",{d:"M14.4332 2.62115L12.8159 0.794434H7.16243L5.55232 2.62115C5.55232 2.62115 4.13716 2.23848 3.4729 2.8883C3.4729 2.8883 5.35016 2.72223 5.99998 3.77638L7.99276 4.11573C8.2238 4.11573 8.73644 3.92079 9.20575 3.75472C9.67507 3.61032 9.99998 3.59588 9.99998 3.59588C9.99998 3.59588 10.3177 3.59588 10.7942 3.75472C11.2707 3.91357 11.7761 4.11573 12.0072 4.11573C12.2455 4.11573 13.9928 3.77638 13.9928 3.77638C14.6426 2.72223 16.5198 2.8883 16.5198 2.8883C15.8556 2.22404 14.4404 2.61393 14.4404 2.61393",fill:"url(#paint1_linear_927_5861)"}),n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"paint0_linear_927_5861",x1:"2.13715",y1:"10.1991",x2:"17.8483",y2:"10.1991",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{offset:"0.4",stopColor:"#FF5500"}),n.jsx("stop",{offset:"0.6",stopColor:"#FF2000"})]}),n.jsxs("linearGradient",{id:"paint1_linear_927_5861",x1:"3.73384",y1:"2.4883",x2:"16.5198",y2:"2.4883",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#FF452A"}),n.jsx("stop",{offset:1,stopColor:"#FF2000"})]})]})]});const Z7=n.jsxs("svg",{"aria-hidden":"true",width:20,height:20,viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsxs("g",{clipPath:"url(#clip0_927_5865)",children:[n.jsx("path",{d:"M18.0547 14.8828C17.7865 15.0222 17.5099 15.1448 17.2266 15.25C16.3293 15.584 15.3792 15.7533 14.4219 15.75C10.7266 15.75 7.50781 13.2109 7.50781 9.94531C7.51262 9.50803 7.63385 9.07993 7.85905 8.70506C8.08424 8.33019 8.40526 8.0221 8.78906 7.8125C5.44531 7.95312 4.58594 11.4375 4.58594 13.4766C4.58594 19.2578 9.90625 19.8359 11.0547 19.8359C11.6719 19.8359 12.6016 19.6562 13.1641 19.4766L13.2656 19.4453C15.4183 18.7014 17.2534 17.2465 18.4688 15.3203C18.5041 15.2618 18.5192 15.1933 18.5119 15.1253C18.5046 15.0574 18.4752 14.9937 18.4282 14.944C18.3812 14.8944 18.3192 14.8615 18.2518 14.8505C18.1843 14.8394 18.1151 14.8508 18.0547 14.8828Z",fill:"url(#paint0_linear_927_5865)"}),n.jsx("path",{opacity:"0.35",d:"M18.0547 14.8828C17.7865 15.0222 17.5099 15.1448 17.2266 15.25C16.3293 15.584 15.3792 15.7533 14.4219 15.75C10.7266 15.75 7.50781 13.2109 7.50781 9.94531C7.51262 9.50803 7.63385 9.07993 7.85905 8.70506C8.08424 8.33019 8.40526 8.0221 8.78906 7.8125C5.44531 7.95312 4.58594 11.4375 4.58594 13.4766C4.58594 19.2578 9.90625 19.8359 11.0547 19.8359C11.6719 19.8359 12.6016 19.6562 13.1641 19.4766L13.2656 19.4453C15.4183 18.7014 17.2534 17.2465 18.4688 15.3203C18.5041 15.2618 18.5192 15.1933 18.5119 15.1253C18.5046 15.0574 18.4752 14.9937 18.4282 14.944C18.3812 14.8944 18.3192 14.8615 18.2518 14.8505C18.1843 14.8394 18.1151 14.8508 18.0547 14.8828Z",fill:"url(#paint1_radial_927_5865)"}),n.jsx("path",{d:"M8.2578 18.8516C7.56239 18.4196 6.95961 17.854 6.48436 17.1875C5.94166 16.4447 5.56809 15.5921 5.38987 14.6896C5.21165 13.787 5.23311 12.8565 5.45272 11.9631C5.67234 11.0697 6.08479 10.2353 6.66115 9.51826C7.23751 8.80123 7.96379 8.21903 8.78905 7.8125C9.03905 7.69531 9.45311 7.49219 10.0078 7.5C10.3981 7.50302 10.7824 7.59627 11.1308 7.77245C11.4791 7.94864 11.7819 8.20299 12.0156 8.51562C12.3299 8.93835 12.5023 9.4498 12.5078 9.97656C12.5078 9.96094 14.4219 3.75781 6.2578 3.75781C2.82811 3.75781 0.00780015 7.00781 0.00780015 9.86719C-0.00584162 11.3776 0.317079 12.8721 0.953112 14.2422C1.99473 16.4602 3.81447 18.2185 6.06689 19.1834C8.3193 20.1483 10.8476 20.2526 13.1719 19.4766C12.3576 19.7337 11.4972 19.811 10.6501 19.7031C9.80297 19.5952 8.98941 19.3047 8.26561 18.8516H8.2578Z",fill:"url(#paint2_linear_927_5865)"}),n.jsx("path",{opacity:"0.41",d:"M8.2578 18.8516C7.56239 18.4196 6.95961 17.854 6.48436 17.1875C5.94166 16.4447 5.56809 15.5921 5.38987 14.6896C5.21165 13.787 5.23311 12.8565 5.45272 11.9631C5.67234 11.0697 6.08479 10.2353 6.66115 9.51826C7.23751 8.80123 7.96379 8.21903 8.78905 7.8125C9.03905 7.69531 9.45311 7.49219 10.0078 7.5C10.3981 7.50302 10.7824 7.59627 11.1308 7.77245C11.4791 7.94864 11.7819 8.20299 12.0156 8.51562C12.3299 8.93835 12.5023 9.4498 12.5078 9.97656C12.5078 9.96094 14.4219 3.75781 6.2578 3.75781C2.82811 3.75781 0.00780015 7.00781 0.00780015 9.86719C-0.00584162 11.3776 0.317079 12.8721 0.953112 14.2422C1.99473 16.4602 3.81447 18.2185 6.06689 19.1834C8.3193 20.1483 10.8476 20.2526 13.1719 19.4766C12.3576 19.7337 11.4972 19.811 10.6501 19.7031C9.80297 19.5952 8.98941 19.3047 8.26561 18.8516H8.2578Z",fill:"url(#paint3_radial_927_5865)"}),n.jsx("path",{d:"M11.9062 11.625C11.8359 11.7031 11.6406 11.8203 11.6406 12.0625C11.6406 12.2656 11.7734 12.4688 12.0156 12.6328C13.1328 13.4141 15.25 13.3047 15.2578 13.3047C16.0907 13.3041 16.9081 13.0802 17.625 12.6562C18.3467 12.2341 18.9456 11.6307 19.3622 10.9057C19.7788 10.1808 19.9986 9.35955 20 8.52344C20.0234 6.77344 19.375 5.60937 19.1172 5.09375C17.4531 1.85937 13.8828 4.89564e-08 10 4.89564e-08C7.37202 -0.00025981 4.84956 1.03398 2.97819 2.87904C1.10682 4.7241 0.0369559 7.23166 0 9.85938C0.0390625 7.00781 2.875 4.70312 6.25 4.70312C6.52344 4.70312 8.08594 4.72656 9.53125 5.48438C10.5466 5.98895 11.3875 6.78627 11.9453 7.77344C12.4219 8.60156 12.5078 9.65625 12.5078 10.0781C12.5078 10.5 12.2969 11.1172 11.8984 11.6328L11.9062 11.625Z",fill:"url(#paint4_radial_927_5865)"}),n.jsx("path",{d:"M11.9062 11.625C11.8359 11.7031 11.6406 11.8203 11.6406 12.0625C11.6406 12.2656 11.7734 12.4688 12.0156 12.6328C13.1328 13.4141 15.25 13.3047 15.2578 13.3047C16.0907 13.3041 16.9081 13.0802 17.625 12.6562C18.3467 12.2341 18.9456 11.6307 19.3622 10.9057C19.7788 10.1808 19.9986 9.35955 20 8.52344C20.0234 6.77344 19.375 5.60937 19.1172 5.09375C17.4531 1.85937 13.8828 4.89564e-08 10 4.89564e-08C7.37202 -0.00025981 4.84956 1.03398 2.97819 2.87904C1.10682 4.7241 0.0369559 7.23166 0 9.85938C0.0390625 7.00781 2.875 4.70312 6.25 4.70312C6.52344 4.70312 8.08594 4.72656 9.53125 5.48438C10.5466 5.98895 11.3875 6.78627 11.9453 7.77344C12.4219 8.60156 12.5078 9.65625 12.5078 10.0781C12.5078 10.5 12.2969 11.1172 11.8984 11.6328L11.9062 11.625Z",fill:"url(#paint5_radial_927_5865)"})]}),n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"paint0_linear_927_5865",x1:"4.58594",y1:"13.8281",x2:"18.5234",y2:"13.8281",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#0C59A4"}),n.jsx("stop",{offset:1,stopColor:"#114A8B"})]}),n.jsxs("radialGradient",{id:"paint1_radial_927_5865",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(12.2813 13.9332) scale(7.45313 7.08047)",children:[n.jsx("stop",{offset:"0.7",stopOpacity:0}),n.jsx("stop",{offset:"0.9",stopOpacity:"0.5"}),n.jsx("stop",{offset:1})]}),n.jsxs("linearGradient",{id:"paint2_linear_927_5865",x1:"11.9297",y1:"7.78125",x2:"3.23436",y2:"17.2578",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"#1B9DE2"}),n.jsx("stop",{offset:"0.2",stopColor:"#1595DF"}),n.jsx("stop",{offset:"0.7",stopColor:"#0680D7"}),n.jsx("stop",{offset:1,stopColor:"#0078D4"})]}),n.jsxs("radialGradient",{id:"paint3_radial_927_5865",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(5.51209 15.5419) rotate(-81.3844) scale(11.202 9.05011)",children:[n.jsx("stop",{offset:"0.8",stopOpacity:0}),n.jsx("stop",{offset:"0.9",stopOpacity:"0.5"}),n.jsx("stop",{offset:1})]}),n.jsxs("radialGradient",{id:"paint4_radial_927_5865",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(2.02266 3.69656) rotate(92.2906) scale(15.8251 33.7043)",children:[n.jsx("stop",{stopColor:"#35C1F1"}),n.jsx("stop",{offset:"0.1",stopColor:"#34C1ED"}),n.jsx("stop",{offset:"0.2",stopColor:"#2FC2DF"}),n.jsx("stop",{offset:"0.3",stopColor:"#2BC3D2"}),n.jsx("stop",{offset:"0.7",stopColor:"#36C752"})]}),n.jsxs("radialGradient",{id:"paint5_radial_927_5865",cx:0,cy:0,r:1,gradientUnits:"userSpaceOnUse",gradientTransform:"translate(18.7547 6.03906) rotate(73.7398) scale(7.60156 6.18159)",children:[n.jsx("stop",{stopColor:"#66EB6E"}),n.jsx("stop",{offset:1,stopColor:"#66EB6E",stopOpacity:0})]}),n.jsx("clipPath",{id:"clip0_927_5865",children:n.jsx("rect",{width:20,height:20,fill:"white"})})]})]});var Bi={Chrome:G7,FireFox:q7,Edge:Z7};const K7=E(F.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 32px;
  max-height: 32px;
  width: 100%;
  height: 100%;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`,Ia=fe.forwardRef(({browser:e},t)=>{const r=e??id();let o;switch(r){case"chrome":o=Bi.Chrome;break;case"firefox":o=Bi.FireFox;break;case"edge":o=Bi.Edge;break}return o?n.jsx(K7,{children:o}):null});Ia.displayName="BrowserIcon";const Y7=E(F.div)`
  z-index: 4;
  position: relative;
  width: 100px;
  height: 100px;
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`,X7=E(F.div)`
  z-index: 2;
  position: absolute;
  overflow: hidden;
  inset: 6px;
  border-radius: 50px;
  background: var(--ck-body-background);
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  img {
    pointer-events: none;
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    ${e=>e.$small&&pe`
        width: 85%;
        height: 85%;
      `}
  }
`,Q7=E(F.div)`
  position: absolute;
  inset: -5px;
`,J7=E(F.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  background: var(--ck-body-background);
  div:first-child {
    position: absolute;
    left: 50%;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--ck-spinner-color);
      transform-origin: 0% 50%;
      animation: rotateExpiringSpinner 5000ms ease-in both;
    }
  }
  div:last-child {
    position: absolute;
    left: 0;
    right: 50%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--ck-spinner-color);
      transform-origin: 100% 50%;
      animation: rotateExpiringSpinner 5000ms ease-out 5000ms both;
    }
  }
  @keyframes rotateExpiringSpinner {
    0% {
      transform: rotate(-180deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`,ex=E(F.div)`
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: 0;
  svg {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    animation: rotateSpinner 1200ms linear infinite;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,tx=({logo:e,smallLogo:t,connecting:r=!0,unavailable:o=!1,countdown:i=!1})=>{const a=v.useId();return n.jsxs(Y7,{transition:{duration:.5,ease:[.175,.885,.32,.98]},children:[n.jsx(X7,{$small:!o&&t,style:o?{borderRadius:0}:void 0,children:e}),n.jsx(Q7,{children:n.jsxs(Ve,{children:[r&&n.jsx(ex,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,transition:{duration:i?1:0}},children:n.jsxs("svg",{"aria-hidden":"true",width:"102",height:"102",viewBox:"0 0 102 102",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("path",{d:"M52 100C24.3858 100 2 77.6142 2 50",stroke:`url(#paint0_linear_${a})`,strokeWidth:"3.5",strokeLinecap:"round",strokeLinejoin:"round"}),n.jsx("defs",{children:n.jsxs("linearGradient",{id:`paint0_linear_${a}`,x1:"2",y1:"48.5",x2:"53",y2:"100",gradientUnits:"userSpaceOnUse",children:[n.jsx("stop",{stopColor:"var(--ck-spinner-color)"}),n.jsx("stop",{offset:"1",stopColor:"var(--ck-spinner-color)",stopOpacity:"0"})]})})]})},"Spinner"),i&&n.jsxs(J7,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.25},children:[n.jsx("div",{}),n.jsx("div",{})]},"ExpiringSpinner")]})})]})},be={CONNECTED:"connected",CONNECTING:"connecting",FAILED:"failed",REJECTED:"rejected",NOTCONNECTED:"notconnected",UNAVAILABLE:"unavailable",SIWE:"siwe",RECOVER_ADDRESS_MISMATCH:"recoverAddressMismatch"},Kt={initial:{willChange:"transform,opacity",position:"relative",opacity:0,scale:.95},animate:{position:"relative",opacity:1,scale:1,transition:{ease:[.16,1,.3,1],duration:.4,delay:.05,position:{delay:0}}},exit:{position:"absolute",opacity:0,scale:.95,transition:{ease:[.16,1,.3,1],duration:.3}}},nx=({forceState:e})=>{var t,r,o,i,a,c,s,l,d,u,p;const{setOpen:h}=U(),f=ot(),{connectWithSiwe:g}=ps(),m=H7(L.CONNECT),{linkedAccounts:b,user:y}=Rr(),{triggerResize:w,connector:C}=U(),k=C.id,x=an(k),S=v.useCallback(()=>{W(be.CONNECTED),setTimeout(()=>{w()},250),setTimeout(()=>{h(!1)},1250)},[h,w]),O=v.useCallback(async(G,I)=>{var N,R,M;if(!f)return;const T=f.disconnect,oe=f.getConnectorAccounts;if(m.connectType==="recover"&&oe){(await oe(G.connector)).some(se=>{var J;return se===((J=m.wallet)===null||J===void 0?void 0:J.address)})?S():(W(be.RECOVER_ADDRESS_MISMATCH),await T());return}const V=y?b?.filter(ce=>{var se,J,me;return ce.walletClientType===((J=(se=G.connector)===null||se===void 0?void 0:se.name)===null||J===void 0?void 0:J.toLowerCase())||ce.walletClientType===((me=G.connector)===null||me===void 0?void 0:me.id)}):[];if(V&&V.length>0&&oe&&(await oe(G.connector)).some(se=>V.some(J=>J.accountId===se))){S();return}W(be.SIWE);const de=(N=I?.accounts)===null||N===void 0?void 0:N[0];g({address:de,connectorType:(R=G.connector)===null||R===void 0?void 0:R.type,walletClientType:(M=G.connector)===null||M===void 0?void 0:M.id,onError:(ce,se)=>{Z.error("[ConnectWithInjector] SIWE failed:",ce),T(),W(be.FAILED)},onConnect:()=>{S()}})},[f,y,b,S,m.connectType,"wallet"in m?(t=m.wallet)===null||t===void 0?void 0:t.address:void 0,g]),j=v.useCallback(G=>{if(P(!0),setTimeout(()=>P(!1),3500),G?.code!==void 0)switch(G.code){case-32002:W(be.NOTCONNECTED);break;case 4001:W(be.REJECTED);break;default:W(be.FAILED);break}else G?.message&&G.message==="User rejected request"?W(be.REJECTED):W(be.FAILED)},[]),A={name:x?.name,shortName:(r=x?.shortName)!==null&&r!==void 0?r:x?.name,icon:(o=x?.iconConnector)!==null&&o!==void 0?o:x?.icon,iconShape:(i=x?.iconShape)!==null&&i!==void 0?i:"circle",iconShouldShrink:x?.iconShouldShrink},[_,P]=v.useState(!1),D=id(),$=(a=x?.downloadUrls)===null||a===void 0?void 0:a[D],q=x?.downloadUrls?{name:Object.keys(x?.downloadUrls)[0],label:((c=Object.keys(x?.downloadUrls)[0])===null||c===void 0?void 0:c.charAt(0).toUpperCase())+((s=Object.keys(x?.downloadUrls)[0])===null||s===void 0?void 0:s.slice(1)),url:x?.downloadUrls[Object.keys(x?.downloadUrls)[0]]}:void 0,[B,W]=v.useState(e||(x?.isInstalled?be.CONNECTING:be.UNAVAILABLE)),H=bt({CONNECTORNAME:(l=A.name)!==null&&l!==void 0?l:"UNKNOWN CONNECTOR",CONNECTORSHORTNAME:(u=(d=A.shortName)!==null&&d!==void 0?d:A.name)!==null&&u!==void 0?u:"UNKNOWN CONNECTOR",SUGGESTEDEXTENSIONBROWSER:(p=q?.label)!==null&&p!==void 0?p:"your browser"}),K=v.useCallback(async()=>{if(!f||!x?.isInstalled||!x?.connector){W(be.UNAVAILABLE);return}f.account.isConnected&&await f.disconnect(),W(be.CONNECTING);try{let G;if(f.connectAsync){const I=await f.connectAsync({connector:x.connector});G=I&&typeof I=="object"&&"accounts"in I?I:void 0}else{f.connect({connector:x.connector});return}if(!x){W(be.FAILED),Z.error("[ConnectWithInjector] No wallet found after connect");return}Z.log("[ConnectWithInjector] Connect type is:",m.connectType),await O(x,G)}catch(G){Z.error("[ConnectWithInjector] Connection error",G instanceof Error?G.message:G),j(G&&typeof G=="object"&&"code"in G?G:{message:G instanceof Error&&G.message==="User rejected request"?"User rejected request":"Connection failed"})}setTimeout(w,100)},[f,x,m.connectType,O,j,w]);let Y;if(v.useEffect(()=>{if(B!==be.UNAVAILABLE)return Y=setTimeout(K,600),()=>{clearTimeout(Y)}},[]),!x)return n.jsx(Q,{children:n.jsxs(Oi,{children:[n.jsx(we,{children:"Invalid State"}),n.jsx(Te,{children:n.jsx(Or,{children:"No connectors match the id given. This state should never happen."})})]})});if(Pa(x?.connector.id))return n.jsx(Q,{children:n.jsxs(Oi,{children:[n.jsx(we,{children:"Invalid State"}),n.jsx(Te,{children:n.jsx(Or,{children:"WalletConnect does not have an injection flow. This state should never happen."})})]})});const ue=B===be.FAILED||B===be.REJECTED||B===be.RECOVER_ADDRESS_MISMATCH;return n.jsx(Q,{children:n.jsxs(Oi,{children:[n.jsx(Dm,{children:n.jsxs($m,{$shake:ue,$circle:A.iconShape==="circle",children:[n.jsx(Ve,{children:ue&&n.jsx(R0,{"aria-label":"Retry",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},whileTap:{scale:.9},transition:{duration:.1},onClick:K,children:n.jsx(L0,{children:n.jsx(Tr,{open:_&&ue,message:H.tryAgainQuestion,xOffset:-6,children:n.jsx(C0,{})})})})}),A.iconShape==="circle"?n.jsx(tx,{logo:B===be.UNAVAILABLE?n.jsx("div",{style:{transform:"scale(1.14)",position:"relative",width:"100%"},children:A.icon}):A.icon,smallLogo:A.iconShouldShrink,connecting:B===be.CONNECTING||B===be.SIWE,unavailable:B===be.UNAVAILABLE}):n.jsx(Mo,{logo:B===be.UNAVAILABLE?n.jsx("div",{style:{transform:"scale(1.14)",position:"relative",width:"100%"},children:A.icon}):A.icon,connecting:B===be.CONNECTING||B===be.SIWE})]})}),n.jsx(d4,{children:n.jsxs(Ve,{initial:!1,children:[B===be.FAILED&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{children:[n.jsxs(Me,{$error:!0,children:[n.jsx(Rv,{}),H.injectionScreen_failed_h1]}),n.jsx(X,{children:H.injectionScreen_failed_p})]})},be.FAILED),B===be.REJECTED&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{style:{paddingBottom:28},children:[n.jsx(Me,{children:H.injectionScreen_rejected_h1}),n.jsx(X,{children:H.injectionScreen_rejected_p})]})},be.REJECTED),B===be.RECOVER_ADDRESS_MISMATCH&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{style:{paddingBottom:28},children:[n.jsx(Me,{children:"Wallet mismatch"}),n.jsx(X,{children:"The wallet address you are trying to recover does not belong to this user."})]})},be.RECOVER_ADDRESS_MISMATCH),B===be.CONNECTING&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{style:{paddingBottom:28},children:[n.jsx(Me,{children:x.connector.id==="injected"?H.injectionScreen_connecting_injected_h1:H.injectionScreen_connecting_h1}),n.jsx(X,{children:x.connector.id==="injected"?H.injectionScreen_connecting_injected_p:H.injectionScreen_connecting_p})]})},be.CONNECTING),B===be.SIWE&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{style:{paddingBottom:28},children:[n.jsx(Me,{children:"Confirm in your wallet"}),n.jsx(X,{children:"Sign the message in your wallet to confirm that you own this wallet and complete the connection."})]})},be.SIWE),B===be.CONNECTED&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{children:[n.jsxs(Me,{$valid:!0,children:[n.jsx($n,{})," Connected"]}),n.jsxs(X,{children:["Successfully connected with ",A.name,"."]})]})},be.CONNECTED),B===be.NOTCONNECTED&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:n.jsxs(Te,{children:[n.jsx(Me,{children:H.injectionScreen_notconnected_h1}),n.jsx(X,{children:H.injectionScreen_notconnected_p})]})},be.NOTCONNECTED),B===be.UNAVAILABLE&&n.jsx(Zt,{initial:"initial",animate:"animate",exit:"exit",variants:Kt,children:$?n.jsxs(n.Fragment,{children:[n.jsxs(Te,{style:{paddingBottom:18},children:[n.jsx(Me,{children:H.injectionScreen_install_h1}),n.jsx(X,{children:H.injectionScreen_install_p})]}),!x.isInstalled&&$&&n.jsx(te,{href:$,icon:n.jsx(Ia,{}),children:H.installTheExtension})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Te,{style:{paddingBottom:12},children:[n.jsx(Me,{children:H.injectionScreen_unavailable_h1}),n.jsx(X,{children:H.injectionScreen_unavailable_p})]}),!x.isInstalled&&q&&n.jsxs(te,{href:q?.url,icon:n.jsx(Ia,{browser:q?.name}),children:["Install on ",q?.label]})]})},be.UNAVAILABLE)]})})]})})},Ot={INIT:"init",REDIRECT:"redirect",CONNECTING:"connecting",ERROR:"error"},rx=()=>{const{connector:e,setRoute:t,triggerResize:r}=U(),{client:o,user:i}=ve(),[a,c]=v.useState(Ot.INIT),[s,l]=v.useState(void 0);return v.useEffect(()=>{(async()=>{const d=typeof window<"u"?window:null,u=typeof document<"u"?document:null;if(!d||!u)return;if(e.type!=="oauth")throw new Error("Invalid connector type");const p=F1(d.location.href),h=!!p.searchParams.get("openfortAuthProviderUI"),f=e.id;switch(a){case Ot.INIT:h?c(Ot.CONNECTING):setTimeout(()=>c(Ot.REDIRECT),150);break;case Ot.CONNECTING:{const g=M1(),m=p.searchParams.get("user_id"),b=p.searchParams.get("access_token"),y=p.searchParams.get("error");if(["openfortAuthProviderUI","access_token","user_id","error"].forEach(w=>{p.searchParams.delete(w)}),d.history.replaceState({},u.title,p.toString()),g(),!m||!b||y){Z.error(`Missing user id or access token: userId=${m}, accessToken=${b&&`${b.substring(0,10)}...`}`),c(Ot.ERROR),l(y&&y==="email_doesn't_match"?"The email associated with this OAuth provider does not match your account email.":"There was an error during authentication. Please try again."),r();return}await o.auth.storeCredentials({token:b,userId:m}),t(L.LOADING);break}case Ot.REDIRECT:{if(h)return;const g=d.location.origin+d.location.pathname,m=d.location.hash,b=Object.fromEntries([...p.searchParams.entries()].filter(([w])=>["openfortAuthProviderUI","refresh_token","access_token","player_id"].includes(w)));b.openfortAuthProviderUI=f;const y=`${g}?${new URLSearchParams(b).toString()}${m}`;try{if(i){if(!await o.getAccessToken()){Z.error("No auth token found"),t(L.LOADING);return}const C=await o.auth.initLinkOAuth({provider:f,redirectTo:y});Z.log(C),d.location.href=C}else{const w=await o.auth.initOAuth({provider:f,redirectTo:y});Z.log(w),d.location.href=w}}catch(w){Z.error("Error during OAuth initialization:",w),c(Ot.ERROR),r(),w instanceof Error&&(w.message.includes("not enabled")?l(`The ${f} provider is not enabled. Please contact support.`):l("There was an error during authentication. Please try again."))}break}}})()},[a]),n.jsx(Q,{children:n.jsx(ze,{header:`Connecting with ${e.id}`,icon:ln[e.id],isError:a===Ot.ERROR,description:s,onRetry:()=>{c(Ot.INIT),l(void 0)}})})},ox=()=>{var e,t,r,o;const i=ot(),a=(t=(e=i?.account)===null||e===void 0?void 0:e.isConnected)!==null&&t!==void 0?t:!1,c=(r=i?.account)===null||r===void 0?void 0:r.address,s=(o=i?.account)===null||o===void 0?void 0:o.ensName,{connector:l,setRoute:d}=U(),u=an(l.id),{connectWithSiwe:p}=ps(),[h,f]=v.useState(void 0),[g,m]=v.useState(void 0),b=v.useCallback(()=>{m("Requesting signature to verify wallet..."),p({walletClientType:l.id,onConnect:()=>d(L.CONNECTED),onError:y=>{f(y||"Connection failed"),m(void 0)}})},[p,l.id,d]);return v.useEffect(()=>{a&&b()},[a,b]),n.jsxs(Q,{children:[n.jsxs(X,{style:{textAlign:"center"},children:["Connected with ",n.jsx(Ft,{value:c||"",children:s??_t(c)})]}),n.jsx(ze,{header:"Sign in to your wallet",icon:u?.icon,isError:!!h,description:h??g,onRetry:b})]})},ix=()=>{const{connector:e}=U(),t=an(e.id),{open:r}=e1(),[o,i]=v.useState(void 0),a=v.useRef(!1),c=v.useCallback(async()=>{i(void 0);const{error:s}=await r();s&&i(s)},[r]);return v.useEffect(()=>{a.current||(a.current=!0,c())},[c]),n.jsx(Q,{children:n.jsx(ze,{header:o?"Error connecting wallet.":"Connecting...",icon:t?.icon,isError:!!o,description:o,onRetry:c})})},ax=()=>{var e,t;const{connector:r,triggerResize:o}=U(),i=ot(),a=(t=(e=i?.account)===null||e===void 0?void 0:e.isConnected)!==null&&t!==void 0?t:!1;return v.useEffect(()=>{o()},[a]),an(r.id)?a?n.jsx(ox,{}):n.jsx(ix,{}):n.jsx(ze,{header:`Connector not found: ${r.id}`,isError:!0})},Bt={QRCODE:"qrcode",INJECTOR:"injector"};function sx(e){return e.startsWith("acc_")}const cx=()=>{const e=U(),t=e.connector.id,r=sx(t),i=an(r?"":t),a=!i?.isInstalled&&i?.getWalletConnectDeeplink,c=e.connector.type==="oauth",[s,l]=v.useState(a?Bt.QRCODE:Bt.INJECTOR);return v.useEffect(()=>{r&&(e.setConnector({id:""}),e.setRoute(L.PROVIDERS))},[r,e]),v.useEffect(()=>{const d=e.connector;if(Z.log("ConnectUsing",{status:s,isQrCode:a,isOauth:c,connector:d}),c)return;const u=async()=>{var p,h;await((h=(p=i?.connector)===null||p===void 0?void 0:p.getProvider)===null||h===void 0?void 0:h.call(p))||(l(Bt.QRCODE),setTimeout(e.triggerResize,10))};s===Bt.INJECTOR&&u()},[]),r?null:c?n.jsx(rx,{}):i?n.jsxs(Ve,{children:[s===Bt.QRCODE&&n.jsx(F.div,{initial:"initial",animate:"animate",exit:"exit",variants:gl,children:n.jsx(ax,{})},Bt.QRCODE),s===Bt.INJECTOR&&n.jsx(F.div,{initial:"initial",animate:"animate",exit:"exit",variants:gl,children:n.jsx(nx,{switchConnectMethod:d=>{l(Bt.QRCODE),setTimeout(e.triggerResize,10)}})},Bt.INJECTOR)]}):n.jsxs(Or,{children:["Connector not found ",e.connector.id]})};function lx(e){v.useEffect(()=>{if(typeof window>"u")return;const t=()=>{document.visibilityState==="visible"&&e()},r=()=>{e()};return document.addEventListener("visibilitychange",t),window.addEventListener("focus",r),()=>{document.removeEventListener("visibilitychange",t),window.removeEventListener("focus",r)}},[e])}const Ct={INIT:"init",CONNECTING:"connecting",ERROR:"error"},dx=E.div`
  margin-top: 30px;
  color: var(--ck-body-color-muted);
`,ux=()=>{var e,t,r,o,i,a,c;const{connector:s,setRoute:l}=U(),d=Object.keys(Jt).find(x=>x.split(",").map(S=>S.trim()).indexOf(s.id)!==-1),u=an(s.id)||d&&Jt[d]||{},p=ot(),h=(o=((e=p?.account)===null||e===void 0?void 0:e.isConnected)&&((r=(t=p?.account)===null||t===void 0?void 0:t.connector)===null||r===void 0?void 0:r.id)!==tr)!==null&&o!==void 0?o:!1,[f,g]=v.useState(h?Ct.CONNECTING:Ct.INIT),[m,b]=v.useState(void 0),[y,w]=v.useState(!1),{connectWithSiwe:C}=ps(),k=()=>{var x;const S=(x=u?.getWalletConnectDeeplink)===null||x===void 0?void 0:x.call(u,"");S?window.location.href=S.replace("?uri=",""):(g(Ct.ERROR),b("Wallet does not support deeplink"))};return lx(()=>{setTimeout(()=>{w(!0)},250)}),v.useEffect(()=>{y&&(w(!1),h?g(Ct.CONNECTING):(g(Ct.ERROR),b("Connection failed or cancelled")))},[y,h]),v.useEffect(()=>{switch(f){case Ct.INIT:break;case Ct.CONNECTING:b("Requesting signature to verify wallet..."),C({walletClientType:d,onConnect:()=>l(L.CONNECTED),onError:x=>{g(Ct.ERROR),b(x||"Connection failed")}});break}},[f]),n.jsxs(Q,{children:[n.jsx(ze,{header:`Connecting with ${s.id.split(",")[0]}`,icon:u?.icon,isError:f===Ct.ERROR,description:m,onRetry:()=>{g(h?Ct.CONNECTING:Ct.INIT),b("")}}),h?n.jsx(te,{onClick:()=>{k()},children:"Sign in App"}):n.jsx(te,{onClick:()=>{k()},children:"Sign in App"}),n.jsx(dx,{children:n.jsxs(Pe,{children:["Don't have ",(i=u.name)!==null&&i!==void 0?i:s.id.split(",")[0]," installed?"," ",n.jsx("a",{style:{marginLeft:5},href:P1()?(a=u?.downloadUrls)===null||a===void 0?void 0:a.android:(c=u?.downloadUrls)===null||c===void 0?void 0:c.ios,target:"_blank",rel:"noreferrer",children:"GET"})]})})]})},px=v.lazy(()=>Na(()=>import("./index-CHbOYlJd.js"),__vite__mapDeps([7,1,2,3,4,5,6])));function hx(){return{onboarding:n.jsx(o6,{}),about:n.jsx(W4,{}),loading:n.jsx(V8,{}),loadWallets:n.jsx(K8,{}),connectedSuccess:n.jsx(Zm,{}),createGuestUser:n.jsx(d9,{}),socialProviders:n.jsx(z7,{}),emailLogin:n.jsx(E8,{}),emailOtp:n.jsx(A8,{}),phoneOtp:n.jsx(u6,{}),forgotPassword:n.jsx(I8,{}),emailVerification:n.jsx(T8,{}),linkEmail:n.jsx(N8,{}),createWallet:n.jsx(_a,{}),recoverWallets:n.jsx(La,{}),download:n.jsx(w8,{}),connectors:n.jsx(Cs,{}),mobileConnectors:n.jsx(t6,{}),selectWalletToRecover:n.jsx(C7,{}),providers:n.jsx(K6,{}),connect:n.jsx(cx,{}),connected:n.jsx(Po,{}),profile:n.jsx(g6,{}),linkedProviders:n.jsx(W8,{}),linkedProvider:n.jsx($8,{}),removeLinkedProvider:n.jsx(f7,{}),connectWithMobile:n.jsx(ux,{}),noAssetsAvailable:n.jsx(r6,{}),assetInventory:n.jsx(av,{}),send:n.jsx(d1,{}),sendConfirmation:n.jsx(U7,{}),sendTokenSelect:n.jsx(Gl,{isBuyFlow:!1}),buyTokenSelect:n.jsx(Gl,{isBuyFlow:!0}),buySelectProvider:n.jsx(mm,{}),buyProcessing:n.jsx(Qv,{}),buyComplete:n.jsx($v,{}),buyProviderSelect:n.jsx(pm,{}),receive:n.jsx(Ra,{}),buy:n.jsx(y0,{}),exportKey:n.jsx(O8,{}),walletOverview:n.jsx(Po,{})}}const fx={[ne.EVM]:{"eth:connected":n.jsx(Po,{}),"eth:createWallet":n.jsx(_a,{}),"eth:recoverWallet":n.jsx(La,{}),"eth:switchNetworks":n.jsx(v.Suspense,{fallback:null,children:n.jsx(px,{})}),"eth:send":n.jsx(d1,{}),"eth:receive":n.jsx(Ra,{}),"eth:buy":n.jsx(y0,{}),"eth:connectors":n.jsx(Cs,{})},[ne.SVM]:{"sol:connected":n.jsx(Po,{}),"sol:createWallet":n.jsx(_a,{}),"sol:recoverWallet":n.jsx(La,{}),"sol:receive":n.jsx(Ra,{})}},gx={[ne.EVM]:L.ETH_CONNECTED,[ne.SVM]:L.SOL_CONNECTED},vx={},mx=({mode:e="auto",theme:t="auto",customTheme:r=vx,lang:o="en-US"})=>{var i;const a=U(),c=ve(),s=Wo(),l=v.useMemo(()=>({user:c.user,embeddedAccounts:c.embeddedAccounts,activeEmbeddedAddress:c.activeEmbeddedAddress,chainType:a.chainType,embeddedState:c.embeddedState}),[c.user,c.embeddedAccounts,c.activeEmbeddedAddress,a.chainType,c.embeddedState]),d=(i=s?.isConnected(l))!==null&&i!==void 0?i:!1,u=s?.getChainId(),p=u!=null&&a.chains.some(k=>k.id===u),h=v.useRef(d);v.useEffect(()=>{const k=h.current;h.current=d,!k&&d&&a.open&&a.setOpen(!1)},[d]);const f=!(a.uiConfig.enforceSupportedChains&&d&&!p),g=a.route.route,m=a.chainType,b=v.useMemo(hx,[]),y=v.useMemo(()=>({...b,...fx[m]}),[b,m]),w=g in y&&y[g]!=null?g:gx[m];v.useEffect(()=>{w!==g&&a.setRoute(w)},[w,g,a.setRoute]);function C(){a.setOpen(!1)}return v.useEffect(()=>{if(typeof window>"u")return;const k=new URL(window.location.href.replace("?access_token=","&access_token=")),x=k.searchParams.get("openfortAuthProviderUI"),S=k.searchParams.get("openfortEmailVerificationUI"),O=k.searchParams.get("openfortForgotPasswordUI");if(Z.log("Checking for search parameters",{url:k,provider:x,emailVerification:S,forgotPassword:O}),S){a.setOpen(!0),a.setRoute(L.EMAIL_VERIFICATION);return}if(O){a.setOpen(!0),a.setRoute(L.FORGOT_PASSWORD);return}function j(A){return A?Object.values(bn).includes(A):!1}j(x)&&(Z.log("Found auth provider",x),a.setOpen(!0),a.setConnector({id:x,type:"oauth"}),a.setRoute({route:L.CONNECT,connectType:"linkIfUserConnectIfNoUser"}))},[]),v.useEffect(()=>a.setMode(e),[e]),v.useEffect(()=>a.setTheme(t),[t]),v.useEffect(()=>a.setCustomTheme(r),[r]),v.useEffect(()=>a.setLang(o),[o]),v.useEffect(()=>{var k;const x=(k=a.uiConfig.appName)!==null&&k!==void 0?k:"Openfort";if(!x||!a.open)return;const S=document.createElement("meta");return S.setAttribute("property","og:title"),S.setAttribute("content",x),document.head.prepend(S),()=>{document.head.removeChild(S)}},[a.open]),n.jsx(Dg,{theme:t,customTheme:r,mode:e,children:n.jsx(k4,{open:a.open,pages:y,pageId:w,onClose:f?C:void 0})})},wx=Object.freeze(Object.defineProperty({__proto__:null,default:mx},Symbol.toStringTag,{value:"Module"}));export{pe as A,te as B,re as C,Lv as D,Fg as F,Te as M,S4 as O,Q as P,_o as R,Tr as T,X as a,Ve as b,D3 as c,Ue as d,Or as e,Un as f,Pg as g,o0 as h,Ao as i,dg as j,wx as k,F as m,E as s,bt as u};
