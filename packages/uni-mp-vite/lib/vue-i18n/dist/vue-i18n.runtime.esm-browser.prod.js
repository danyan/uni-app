/*!
  * vue-i18n v9.1.9
  * (c) 2021 kazuya kawaguchi
  * Released under the MIT License.
  */
import{ref as e,getCurrentInstance as t,computed as a,watch as n,createVNode as r,Text as l,h as o,Fragment as s,inject as i,onMounted as c,onUnmounted as u,isRef as m}from"vue";const f="function"==typeof Symbol&&"symbol"==typeof Symbol.toStringTag,g=e=>f?Symbol(e):e,p=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),_=e=>"number"==typeof e&&isFinite(e),b=e=>"[object RegExp]"===O(e),d=e=>I(e)&&0===Object.keys(e).length;function h(e,t){"undefined"!=typeof console&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const v=Object.assign;function k(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const F=Object.prototype.hasOwnProperty;function y(e,t){return F.call(e,t)}const w=Array.isArray,W=e=>"function"==typeof e,L=e=>"string"==typeof e,M=e=>"boolean"==typeof e,$=e=>null!==e&&"object"==typeof e,T=Object.prototype.toString,O=e=>T.call(e),I=e=>"[object Object]"===O(e),S=[];S[0]={w:[0],i:[3,0],"[":[4],o:[7]},S[1]={w:[1],".":[2],"[":[4],o:[7]},S[2]={w:[2],i:[3,0],0:[3,0]},S[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]},S[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]},S[5]={"'":[4,0],o:8,l:[5,0]},S[6]={'"':[4,0],o:8,l:[6,0]};const C=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function j(e){if(null==e)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function E(e){const t=e.trim();return("0"!==e.charAt(0)||!isNaN(parseInt(e)))&&(C.test(t)?function(e){const t=e.charCodeAt(0);return t!==e.charCodeAt(e.length-1)||34!==t&&39!==t?e:e.slice(1,-1)}(t):"*"+t)}const P=new Map;function H(e,t){if(!$(e))return null;let a=P.get(t);if(a||(a=function(e){const t=[];let a,n,r,l,o,s,i,c=-1,u=0,m=0;const f=[];function g(){const t=e[c+1];if(5===u&&"'"===t||6===u&&'"'===t)return c++,r="\\"+t,f[0](),!0}for(f[0]=()=>{void 0===n?n=r:n+=r},f[1]=()=>{void 0!==n&&(t.push(n),n=void 0)},f[2]=()=>{f[0](),m++},f[3]=()=>{if(m>0)m--,u=4,f[0]();else{if(m=0,void 0===n)return!1;if(n=E(n),!1===n)return!1;f[1]()}};null!==u;)if(c++,a=e[c],"\\"!==a||!g()){if(l=j(a),i=S[u],o=i[l]||i.l||8,8===o)return;if(u=o[0],void 0!==o[1]&&(s=f[o[1]],s&&(r=a,!1===s())))return;if(7===u)return t}}(t),a&&P.set(t,a)),!a)return null;const n=a.length;let r=e,l=0;for(;l<n;){const e=r[a[l]];if(void 0===e)return null;r=e,l++}return r}function N(e){if(!$(e))return e;for(const t in e)if(y(e,t))if(t.includes(".")){const a=t.split("."),n=a.length-1;let r=e;for(let e=0;e<n;e++)a[e]in r||(r[a[e]]={}),r=r[a[e]];r[a[n]]=e[t],delete e[t],$(r[a[n]])&&N(r[a[n]])}else $(e[t])&&N(e[t]);return e}const R=e=>e,D=e=>"",x=e=>0===e.length?"":e.join(""),U=e=>null==e?"":w(e)||I(e)&&e.toString===T?JSON.stringify(e,null,2):String(e);function z(e,t){return e=Math.abs(e),2===t?e?e>1?1:0:1:e?Math.min(e,2):0}function A(e={}){const t=e.locale,a=function(e){const t=_(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(_(e.named.count)||_(e.named.n))?_(e.named.count)?e.named.count:_(e.named.n)?e.named.n:t:t}(e),n=$(e.pluralRules)&&L(t)&&W(e.pluralRules[t])?e.pluralRules[t]:z,r=$(e.pluralRules)&&L(t)&&W(e.pluralRules[t])?z:void 0,l=e.list||[],o=e.named||{};_(e.pluralIndex)&&function(e,t){t.count||(t.count=e),t.n||(t.n=e)}(a,o);function s(t){const a=W(e.messages)?e.messages(t):!!$(e.messages)&&e.messages[t];return a||(e.parent?e.parent.message(t):D)}const i=I(e.processor)&&W(e.processor.normalize)?e.processor.normalize:x,c=I(e.processor)&&W(e.processor.interpolate)?e.processor.interpolate:U,u={list:e=>l[e],named:e=>o[e],plural:e=>e[n(a,e.length,r)],linked:(t,a)=>{const n=s(t)(u);return L(a)?(r=a,e.modifiers?e.modifiers[r]:R)(n):n;var r},message:s,type:I(e.processor)&&L(e.processor.type)?e.processor.type:"text",interpolate:c,normalize:i};return u}let J=0;function V(e={}){const t=L(e.version)?e.version:"9.1.9",a=L(e.locale)?e.locale:"en-US",n=w(e.fallbackLocale)||I(e.fallbackLocale)||L(e.fallbackLocale)||!1===e.fallbackLocale?e.fallbackLocale:a,r=I(e.messages)?e.messages:{[a]:{}},l=I(e.datetimeFormats)?e.datetimeFormats:{[a]:{}},o=I(e.numberFormats)?e.numberFormats:{[a]:{}},s=v({},e.modifiers||{},{upper:e=>L(e)?e.toUpperCase():e,lower:e=>L(e)?e.toLowerCase():e,capitalize:e=>L(e)?`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`:e}),i=e.pluralRules||{},c=W(e.missing)?e.missing:null,u=!M(e.missingWarn)&&!b(e.missingWarn)||e.missingWarn,m=!M(e.fallbackWarn)&&!b(e.fallbackWarn)||e.fallbackWarn,f=!!e.fallbackFormat,g=!!e.unresolving,p=W(e.postTranslation)?e.postTranslation:null,_=I(e.processor)?e.processor:null,d=!M(e.warnHtmlMessage)||e.warnHtmlMessage,k=!!e.escapeParameter,F=W(e.messageCompiler)?e.messageCompiler:undefined,y=W(e.onWarn)?e.onWarn:h,T=e,O=$(T.__datetimeFormatters)?T.__datetimeFormatters:new Map,S=$(T.__numberFormatters)?T.__numberFormatters:new Map,C=$(T.__meta)?T.__meta:{};J++;return{version:t,cid:J,locale:a,fallbackLocale:n,messages:r,datetimeFormats:l,numberFormats:o,modifiers:s,pluralRules:i,missing:c,missingWarn:u,fallbackWarn:m,fallbackFormat:f,unresolving:g,postTranslation:p,processor:_,warnHtmlMessage:d,escapeParameter:k,messageCompiler:F,onWarn:y,__datetimeFormatters:O,__numberFormatters:S,__meta:C}}function q(e,t,a,n,r){const{missing:l}=e;if(null!==l){const n=l(e,a,t,r);return L(n)?n:t}return t}function B(e,t,a){const n=e;n.__localeChainCache||(n.__localeChainCache=new Map);let r=n.__localeChainCache.get(a);if(!r){r=[];let e=[a];for(;w(e);)e=G(r,e,t);const l=w(t)?t:I(t)?t.default?t.default:null:t;e=L(l)?[l]:l,w(e)&&G(r,e,!1),n.__localeChainCache.set(a,r)}return r}function G(e,t,a){let n=!0;for(let r=0;r<t.length&&M(n);r++){L(t[r])&&(n=Y(e,t[r],a))}return n}function Y(e,t,a){let n;const r=t.split("-");do{n=Z(e,r.join("-"),a),r.splice(-1,1)}while(r.length&&!0===n);return n}function Z(e,t,a){let n=!1;if(!e.includes(t)&&(n=!0,t)){n="!"!==t[t.length-1];const r=t.replace(/!/g,"");e.push(r),(w(a)||I(a))&&a[r]&&(n=a[r])}return n}function K(e,t,a){e.__localeChainCache=new Map,B(e,a,t)}const Q=()=>"",X=e=>W(e);function ee(e,...t){const{fallbackFormat:a,postTranslation:n,unresolving:r,fallbackLocale:l,messages:o}=e,[s,i]=ae(...t),c=(M(i.missingWarn),M(i.fallbackWarn),M(i.escapeParameter)?i.escapeParameter:e.escapeParameter),u=!!i.resolvedMessage,m=L(i.default)||M(i.default)?M(i.default)?s:i.default:a?s:"",f=a||""!==m,g=L(i.locale)?i.locale:e.locale;c&&function(e){w(e.list)?e.list=e.list.map((e=>L(e)?k(e):e)):$(e.named)&&Object.keys(e.named).forEach((t=>{L(e.named[t])&&(e.named[t]=k(e.named[t]))}))}(i);let[p,b,d]=u?[s,g,o[g]||{}]:function(e,t,a,n,r,l){const{messages:o}=e,s=B(e,n,a);let i,c={},u=null;const m="translate";for(let a=0;a<s.length&&(i=s[a],c=o[i]||{},null===(u=H(c,t))&&(u=c[t]),!L(u)&&!W(u));a++){const a=q(e,t,i,0,m);a!==t&&(u=a)}return[u,i,c]}(e,s,g,l),h=s;if(u||L(p)||X(p)||f&&(p=m,h=p),!(u||(L(p)||X(p))&&L(b)))return r?-1:s;let v=!1;const F=X(p)?p:te(e,s,b,p,h,(()=>{v=!0}));if(v)return p;const y=function(e,t,a){return t(a)}(0,F,A(function(e,t,a,n){const{modifiers:r,pluralRules:l}=e,o={locale:t,modifiers:r,pluralRules:l,messages:n=>{const r=H(a,n);if(L(r)){let a=!1;const l=te(e,n,t,r,n,(()=>{a=!0}));return a?Q:l}return X(r)?r:Q}};e.processor&&(o.processor=e.processor);n.list&&(o.list=n.list);n.named&&(o.named=n.named);_(n.plural)&&(o.pluralIndex=n.plural);return o}(e,b,d,i)));return n?n(y):y}function te(e,t,a,n,r,l){const{messageCompiler:o,warnHtmlMessage:s}=e;if(X(n)){const e=n;return e.locale=e.locale||a,e.key=e.key||t,e}const i=o(n,function(e,t,a,n,r,l){return{warnHtmlMessage:r,onError:e=>{throw l&&l(e),e},onCacheKey:e=>((e,t,a)=>p({l:e,k:t,s:a}))(t,a,e)}}(0,a,r,0,s,l));return i.locale=a,i.key=t,i.source=n,i}function ae(...e){const[t,a,n]=e,r={};if(!L(t)&&!_(t)&&!X(t))throw Error(14);const l=_(t)?String(t):(X(t),t);return _(a)?r.plural=a:L(a)?r.default=a:I(a)&&!d(a)?r.named=a:w(a)&&(r.list=a),_(n)?r.plural=n:L(n)?r.default=n:I(n)&&v(r,n),[l,r]}function ne(e,...t){const{datetimeFormats:a,unresolving:n,fallbackLocale:r}=e,{__datetimeFormatters:l}=e,[o,s,i,c]=re(...t);M(i.missingWarn);M(i.fallbackWarn);const u=!!i.part,m=L(i.locale)?i.locale:e.locale,f=B(e,r,m);if(!L(o)||""===o)return new Intl.DateTimeFormat(m).format(s);let g,p={},_=null;for(let t=0;t<f.length&&(g=f[t],p=a[g]||{},_=p[o],!I(_));t++)q(e,o,g,0,"datetime format");if(!I(_)||!L(g))return n?-1:o;let b=`${g}__${o}`;d(c)||(b=`${b}__${JSON.stringify(c)}`);let h=l.get(b);return h||(h=new Intl.DateTimeFormat(g,v({},_,c)),l.set(b,h)),u?h.formatToParts(s):h.format(s)}function re(...e){const[t,a,n,r]=e;let l,o={},s={};if(L(t)){if(!/\d{4}-\d{2}-\d{2}(T.*)?/.test(t))throw Error(16);l=new Date(t);try{l.toISOString()}catch(e){throw Error(16)}}else if("[object Date]"===O(t)){if(isNaN(t.getTime()))throw Error(15);l=t}else{if(!_(t))throw Error(14);l=t}return L(a)?o.key=a:I(a)&&(o=a),L(n)?o.locale=n:I(n)&&(s=n),I(r)&&(s=r),[o.key||"",l,o,s]}function le(e,t,a){const n=e;for(const e in a){const a=`${t}__${e}`;n.__datetimeFormatters.has(a)&&n.__datetimeFormatters.delete(a)}}function oe(e,...t){const{numberFormats:a,unresolving:n,fallbackLocale:r}=e,{__numberFormatters:l}=e,[o,s,i,c]=se(...t);M(i.missingWarn);M(i.fallbackWarn);const u=!!i.part,m=L(i.locale)?i.locale:e.locale,f=B(e,r,m);if(!L(o)||""===o)return new Intl.NumberFormat(m).format(s);let g,p={},_=null;for(let t=0;t<f.length&&(g=f[t],p=a[g]||{},_=p[o],!I(_));t++)q(e,o,g,0,"number format");if(!I(_)||!L(g))return n?-1:o;let b=`${g}__${o}`;d(c)||(b=`${b}__${JSON.stringify(c)}`);let h=l.get(b);return h||(h=new Intl.NumberFormat(g,v({},_,c)),l.set(b,h)),u?h.formatToParts(s):h.format(s)}function se(...e){const[t,a,n,r]=e;let l={},o={};if(!_(t))throw Error(14);const s=t;return L(a)?l.key=a:I(a)&&(l=a),L(n)?l.locale=n:I(n)&&(o=n),I(r)&&(o=r),[l.key||"",s,l,o]}function ie(e,t,a){const n=e;for(const e in a){const a=`${t}__${e}`;n.__numberFormatters.has(a)&&n.__numberFormatters.delete(a)}}const ce="9.1.9",ue=g("__transrateVNode"),me=g("__datetimeParts"),fe=g("__numberParts"),ge=g("__setPluralRules"),pe=g("__injectWithOption");let _e=0;function be(e){return(a,n,r,l)=>e(n,r,t()||void 0,l)}function de(e,t){const{messages:a,__i18n:n}=t,r=I(a)?a:w(n)?{}:{[e]:{}};if(w(n)&&n.forEach((({locale:e,resource:t})=>{e?(r[e]=r[e]||{},ve(t,r[e])):ve(t,r)})),t.flatJson)for(const e in r)y(r,e)&&N(r[e]);return r}const he=e=>!$(e)||w(e);function ve(e,t){if(he(e)||he(t))throw Error(20);for(const a in e)y(e,a)&&(he(e[a])||he(t[a])?t[a]=e[a]:ve(e[a],t[a]))}function ke(t={}){const{__root:o}=t,s=void 0===o;let i=!M(t.inheritLocale)||t.inheritLocale;const c=e(o&&i?o.locale.value:L(t.locale)?t.locale:"en-US"),u=e(o&&i?o.fallbackLocale.value:L(t.fallbackLocale)||w(t.fallbackLocale)||I(t.fallbackLocale)||!1===t.fallbackLocale?t.fallbackLocale:c.value),m=e(de(c.value,t)),f=e(I(t.datetimeFormats)?t.datetimeFormats:{[c.value]:{}}),g=e(I(t.numberFormats)?t.numberFormats:{[c.value]:{}});let p=o?o.missingWarn:!M(t.missingWarn)&&!b(t.missingWarn)||t.missingWarn,d=o?o.fallbackWarn:!M(t.fallbackWarn)&&!b(t.fallbackWarn)||t.fallbackWarn,h=o?o.fallbackRoot:!M(t.fallbackRoot)||t.fallbackRoot,k=!!t.fallbackFormat,F=W(t.missing)?t.missing:null,y=W(t.missing)?be(t.missing):null,T=W(t.postTranslation)?t.postTranslation:null,O=!M(t.warnHtmlMessage)||t.warnHtmlMessage,S=!!t.escapeParameter;const C=o?o.modifiers:I(t.modifiers)?t.modifiers:{};let j,E=t.pluralRules||o&&o.pluralRules;j=V({version:"9.1.9",locale:c.value,fallbackLocale:u.value,messages:m.value,datetimeFormats:f.value,numberFormats:g.value,modifiers:C,pluralRules:E,missing:null===y?void 0:y,missingWarn:p,fallbackWarn:d,fallbackFormat:k,unresolving:!0,postTranslation:null===T?void 0:T,warnHtmlMessage:O,escapeParameter:S,__datetimeFormatters:I(j)?j.__datetimeFormatters:void 0,__numberFormatters:I(j)?j.__numberFormatters:void 0,__v_emitter:I(j)?j.__v_emitter:void 0,__meta:{framework:"vue"}}),K(j,c.value,u.value);const P=a({get:()=>c.value,set:e=>{c.value=e,j.locale=c.value}}),N=a({get:()=>u.value,set:e=>{u.value=e,j.fallbackLocale=u.value,K(j,c.value,e)}}),R=a((()=>m.value)),D=a((()=>f.value)),x=a((()=>g.value));function U(e,t,a,n,r,l){let s;if(s=e(j),_(s)&&-1===s){const[e,a]=t();return o&&h?n(o):r(e)}if(l(s))return s;throw Error(14)}function z(...e){return U((t=>ee(t,...e)),(()=>ae(...e)),0,(t=>t.t(...e)),(e=>e),(e=>L(e)))}const A={normalize:function(e){return e.map((e=>L(e)?r(l,null,e,0):e))},interpolate:e=>e,type:"vnode"};function J(e){return m.value[e]||{}}_e++,o&&(n(o.locale,(e=>{i&&(c.value=e,j.locale=e,K(j,c.value,u.value))})),n(o.fallbackLocale,(e=>{i&&(u.value=e,j.fallbackLocale=e,K(j,c.value,u.value))})));return{id:_e,locale:P,fallbackLocale:N,get inheritLocale(){return i},set inheritLocale(e){i=e,e&&o&&(c.value=o.locale.value,u.value=o.fallbackLocale.value,K(j,c.value,u.value))},get availableLocales(){return Object.keys(m.value).sort()},messages:R,datetimeFormats:D,numberFormats:x,get modifiers(){return C},get pluralRules(){return E||{}},get isGlobal(){return s},get missingWarn(){return p},set missingWarn(e){p=e,j.missingWarn=p},get fallbackWarn(){return d},set fallbackWarn(e){d=e,j.fallbackWarn=d},get fallbackRoot(){return h},set fallbackRoot(e){h=e},get fallbackFormat(){return k},set fallbackFormat(e){k=e,j.fallbackFormat=k},get warnHtmlMessage(){return O},set warnHtmlMessage(e){O=e,j.warnHtmlMessage=e},get escapeParameter(){return S},set escapeParameter(e){S=e,j.escapeParameter=e},t:z,rt:function(...e){const[t,a,n]=e;if(n&&!$(n))throw Error(15);return z(t,a,v({resolvedMessage:!0},n||{}))},d:function(...e){return U((t=>ne(t,...e)),(()=>re(...e)),0,(t=>t.d(...e)),(()=>""),(e=>L(e)))},n:function(...e){return U((t=>oe(t,...e)),(()=>se(...e)),0,(t=>t.n(...e)),(()=>""),(e=>L(e)))},te:function(e,t){return null!==H(J(L(t)?t:c.value),e)},tm:function(e){const t=function(e){let t=null;const a=B(j,u.value,c.value);for(let n=0;n<a.length;n++){const r=H(m.value[a[n]]||{},e);if(null!=r){t=r;break}}return t}(e);return null!=t?t:o&&o.tm(e)||{}},getLocaleMessage:J,setLocaleMessage:function(e,t){m.value[e]=t,j.messages=m.value},mergeLocaleMessage:function(e,t){m.value[e]=m.value[e]||{},ve(t,m.value[e]),j.messages=m.value},getDateTimeFormat:function(e){return f.value[e]||{}},setDateTimeFormat:function(e,t){f.value[e]=t,j.datetimeFormats=f.value,le(j,e,t)},mergeDateTimeFormat:function(e,t){f.value[e]=v(f.value[e]||{},t),j.datetimeFormats=f.value,le(j,e,t)},getNumberFormat:function(e){return g.value[e]||{}},setNumberFormat:function(e,t){g.value[e]=t,j.numberFormats=g.value,ie(j,e,t)},mergeNumberFormat:function(e,t){g.value[e]=v(g.value[e]||{},t),j.numberFormats=g.value,ie(j,e,t)},getPostTranslationHandler:function(){return W(T)?T:null},setPostTranslationHandler:function(e){T=e,j.postTranslation=e},getMissingHandler:function(){return F},setMissingHandler:function(e){null!==e&&(y=be(e)),F=e,j.missing=y},[ue]:function(...e){return U((t=>{let a;const n=t;try{n.processor=A,a=ee(n,...e)}finally{n.processor=null}return a}),(()=>ae(...e)),0,(t=>t[ue](...e)),(e=>[r(l,null,e,0)]),(e=>w(e)))},[fe]:function(...e){return U((t=>oe(t,...e)),(()=>se(...e)),0,(t=>t[fe](...e)),(()=>[]),(e=>L(e)||w(e)))},[me]:function(...e){return U((t=>ne(t,...e)),(()=>re(...e)),0,(t=>t[me](...e)),(()=>[]),(e=>L(e)||w(e)))},[ge]:function(e){E=e,j.pluralRules=E},[pe]:t.__injectWithOption}}function Fe(e={}){const t=ke(function(e){const t=L(e.locale)?e.locale:"en-US",a=L(e.fallbackLocale)||w(e.fallbackLocale)||I(e.fallbackLocale)||!1===e.fallbackLocale?e.fallbackLocale:t,n=W(e.missing)?e.missing:void 0,r=!M(e.silentTranslationWarn)&&!b(e.silentTranslationWarn)||!e.silentTranslationWarn,l=!M(e.silentFallbackWarn)&&!b(e.silentFallbackWarn)||!e.silentFallbackWarn,o=!M(e.fallbackRoot)||e.fallbackRoot,s=!!e.formatFallbackMessages,i=I(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,u=W(e.postTranslation)?e.postTranslation:void 0,m=!L(e.warnHtmlInMessage)||"off"!==e.warnHtmlInMessage,f=!!e.escapeParameterHtml,g=!M(e.sync)||e.sync;let p=e.messages;if(I(e.sharedMessages)){const t=e.sharedMessages;p=Object.keys(t).reduce(((e,a)=>{const n=e[a]||(e[a]={});return v(n,t[a]),e}),p||{})}const{__i18n:_,__root:d,__injectWithOption:h}=e;return{locale:t,fallbackLocale:a,messages:p,flatJson:e.flatJson,datetimeFormats:e.datetimeFormats,numberFormats:e.numberFormats,missing:n,missingWarn:r,fallbackWarn:l,fallbackRoot:o,fallbackFormat:s,modifiers:i,pluralRules:c,postTranslation:u,warnHtmlMessage:m,escapeParameter:f,inheritLocale:g,__i18n:_,__root:d,__injectWithOption:h}}(e)),a={id:t.id,get locale(){return t.locale.value},set locale(e){t.locale.value=e},get fallbackLocale(){return t.fallbackLocale.value},set fallbackLocale(e){t.fallbackLocale.value=e},get messages(){return t.messages.value},get datetimeFormats(){return t.datetimeFormats.value},get numberFormats(){return t.numberFormats.value},get availableLocales(){return t.availableLocales},get formatter(){return{interpolate:()=>[]}},set formatter(e){},get missing(){return t.getMissingHandler()},set missing(e){t.setMissingHandler(e)},get silentTranslationWarn(){return M(t.missingWarn)?!t.missingWarn:t.missingWarn},set silentTranslationWarn(e){t.missingWarn=M(e)?!e:e},get silentFallbackWarn(){return M(t.fallbackWarn)?!t.fallbackWarn:t.fallbackWarn},set silentFallbackWarn(e){t.fallbackWarn=M(e)?!e:e},get modifiers(){return t.modifiers},get formatFallbackMessages(){return t.fallbackFormat},set formatFallbackMessages(e){t.fallbackFormat=e},get postTranslation(){return t.getPostTranslationHandler()},set postTranslation(e){t.setPostTranslationHandler(e)},get sync(){return t.inheritLocale},set sync(e){t.inheritLocale=e},get warnHtmlInMessage(){return t.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(e){t.warnHtmlMessage="off"!==e},get escapeParameterHtml(){return t.escapeParameter},set escapeParameterHtml(e){t.escapeParameter=e},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(e){},get pluralizationRules(){return t.pluralRules||{}},__composer:t,t(...e){const[a,n,r]=e,l={};let o=null,s=null;if(!L(a))throw Error(15);const i=a;return L(n)?l.locale=n:w(n)?o=n:I(n)&&(s=n),w(r)?o=r:I(r)&&(s=r),t.t(i,o||s||{},l)},rt:(...e)=>t.rt(...e),tc(...e){const[a,n,r]=e,l={plural:1};let o=null,s=null;if(!L(a))throw Error(15);const i=a;return L(n)?l.locale=n:_(n)?l.plural=n:w(n)?o=n:I(n)&&(s=n),L(r)?l.locale=r:w(r)?o=r:I(r)&&(s=r),t.t(i,o||s||{},l)},te:(e,a)=>t.te(e,a),tm:e=>t.tm(e),getLocaleMessage:e=>t.getLocaleMessage(e),setLocaleMessage(e,a){t.setLocaleMessage(e,a)},mergeLocaleMessage(e,a){t.mergeLocaleMessage(e,a)},d:(...e)=>t.d(...e),getDateTimeFormat:e=>t.getDateTimeFormat(e),setDateTimeFormat(e,a){t.setDateTimeFormat(e,a)},mergeDateTimeFormat(e,a){t.mergeDateTimeFormat(e,a)},n:(...e)=>t.n(...e),getNumberFormat:e=>t.getNumberFormat(e),setNumberFormat(e,a){t.setNumberFormat(e,a)},mergeNumberFormat(e,a){t.mergeNumberFormat(e,a)},getChoiceIndex:(e,t)=>-1,__onComponentInstanceCreated(t){const{componentInstanceCreatedListener:n}=e;n&&n(t,a)}};return a}const ye={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>"parent"===e||"global"===e,default:"parent"},i18n:{type:Object}},we={name:"i18n-t",props:v({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>_(e)||!isNaN(e)}},ye),setup(e,t){const{slots:a,attrs:n}=t,r=e.i18n||Ce({useScope:e.scope,__useComponent:!0}),l=Object.keys(a).filter((e=>"_"!==e));return()=>{const a={};e.locale&&(a.locale=e.locale),void 0!==e.plural&&(a.plural=L(e.plural)?+e.plural:e.plural);const i=function({slots:e},t){return 1===t.length&&"default"===t[0]?e.default?e.default():[]:t.reduce(((t,a)=>{const n=e[a];return n&&(t[a]=n()),t}),{})}(t,l),c=r[ue](e.keypath,i,a),u=v({},n);return L(e.tag)||$(e.tag)?o(e.tag,u,c):o(s,u,c)}}};function We(e,t,a,n){const{slots:r,attrs:l}=t;return()=>{const t={part:!0};let i={};e.locale&&(t.locale=e.locale),L(e.format)?t.key=e.format:$(e.format)&&(L(e.format.key)&&(t.key=e.format.key),i=Object.keys(e.format).reduce(((t,n)=>a.includes(n)?v({},t,{[n]:e.format[n]}):t),{}));const c=n(e.value,t,i);let u=[t.key];w(c)?u=c.map(((e,t)=>{const a=r[e.type];return a?a({[e.type]:e.value,index:t,parts:c}):[e.value]})):L(c)&&(u=[c]);const m=v({},l);return L(e.tag)||$(e.tag)?o(e.tag,m,u):o(s,m,u)}}const Le=["localeMatcher","style","unit","unitDisplay","currency","currencyDisplay","useGrouping","numberingSystem","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","notation","formatMatcher"],Me={name:"i18n-n",props:v({value:{type:Number,required:!0},format:{type:[String,Object]}},ye),setup(e,t){const a=e.i18n||Ce({useScope:"parent",__useComponent:!0});return We(e,t,Le,((...e)=>a[fe](...e)))}},$e=["dateStyle","timeStyle","fractionalSecondDigits","calendar","dayPeriod","numberingSystem","localeMatcher","timeZone","hour12","hourCycle","formatMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName"],Te={name:"i18n-d",props:v({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},ye),setup(e,t){const a=e.i18n||Ce({useScope:"parent",__useComponent:!0});return We(e,t,$e,((...e)=>a[me](...e)))}};function Oe(e){const t=(t,{instance:a,value:n})=>{if(!a||!a.$)throw Error(22);const r=function(e,t){const a=e;if("composition"===e.mode)return a.__getInstance(t)||e.global;{const n=a.__getInstance(t);return null!=n?n.__composer:e.global.__composer}}(e,a.$),l=function(e){if(L(e))return{path:e};if(I(e)){if(!("path"in e))throw Error(19,"path");return e}throw Error(20)}(n);t.textContent=r.t(...function(e){const{path:t,locale:a,args:n,choice:r,plural:l}=e,o={},s=n||{};L(a)&&(o.locale=a);_(r)&&(o.plural=r);_(l)&&(o.plural=l);return[t,s,o]}(l))};return{beforeMount:t,beforeUpdate:t}}function Ie(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[ge](t.pluralizationRules||e.pluralizationRules);const a=de(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(a).forEach((t=>e.mergeLocaleMessage(t,a[t]))),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach((a=>e.mergeDateTimeFormat(a,t.datetimeFormats[a]))),t.numberFormats&&Object.keys(t.numberFormats).forEach((a=>e.mergeNumberFormat(a,t.numberFormats[a]))),e}function Se(e={}){const a=!M(e.legacy)||e.legacy,n=!!e.globalInjection,r=new Map,l=a?Fe(e):ke(e),o=g(""),s={get mode(){return a?"legacy":"composition"},async install(e,...r){e.__VUE_I18N_SYMBOL__=o,e.provide(e.__VUE_I18N_SYMBOL__,s),!a&&n&&function(e,t){const a=Object.create(null);je.forEach((e=>{const n=Object.getOwnPropertyDescriptor(t,e);if(!n)throw Error(22);const r=m(n.value)?{get:()=>n.value.value,set(e){n.value.value=e}}:{get:()=>n.get&&n.get()};Object.defineProperty(a,e,r)})),e.config.globalProperties.$i18n=a,Ee.forEach((a=>{const n=Object.getOwnPropertyDescriptor(t,a);if(!n||!n.value)throw Error(22);Object.defineProperty(e.config.globalProperties,`$${a}`,n)}))}(e,s.global),function(e,t,...a){const n=I(a[0])?a[0]:{},r=!!n.useI18nComponentName;(!M(n.globalInstall)||n.globalInstall)&&(e.component(r?"i18n":we.name,we),e.component(Me.name,Me),e.component(Te.name,Te)),e.directive("t",Oe(t))}(e,s,...r),a&&e.mixin(function(e,a,n){return{beforeCreate(){const r=t();if(!r)throw Error(22);const l=this.$options;if(l.i18n){const t=l.i18n;l.__i18n&&(t.__i18n=l.__i18n),t.__root=a,this===this.$root?this.$i18n=Ie(e,t):(t.__injectWithOption=!0,this.$i18n=Fe(t))}else this.$i18n=l.__i18n?this===this.$root?Ie(e,l):Fe({__i18n:l.__i18n,__injectWithOption:!0,__root:a}):e;e.__onComponentInstanceCreated(this.$i18n),n.__setInstance(r,this.$i18n),this.$t=(...e)=>this.$i18n.t(...e),this.$rt=(...e)=>this.$i18n.rt(...e),this.$tc=(...e)=>this.$i18n.tc(...e),this.$te=(e,t)=>this.$i18n.te(e,t),this.$d=(...e)=>this.$i18n.d(...e),this.$n=(...e)=>this.$i18n.n(...e),this.$tm=e=>this.$i18n.tm(e)},mounted(){},beforeUnmount(){const e=t();if(!e)throw Error(22);delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,n.__deleteInstance(e),delete this.$i18n}}}(l,l.__composer,s))},get global(){return l},__instances:r,__getInstance:e=>r.get(e)||null,__setInstance(e,t){r.set(e,t)},__deleteInstance(e){r.delete(e)}};return s}function Ce(e={}){const a=t();if(null==a)throw Error(16);if(!a.appContext.app.__VUE_I18N_SYMBOL__)throw Error(17);const n=i(a.appContext.app.__VUE_I18N_SYMBOL__);if(!n)throw Error(22);const r="composition"===n.mode?n.global:n.global.__composer,l=d(e)?"__i18n"in a.type?"local":"global":e.useScope?e.useScope:"local";if("global"===l){let t=$(e.messages)?e.messages:{};"__i18nGlobal"in a.type&&(t=de(r.locale.value,{messages:t,__i18n:a.type.__i18nGlobal}));const n=Object.keys(t);if(n.length&&n.forEach((e=>{r.mergeLocaleMessage(e,t[e])})),$(e.datetimeFormats)){const t=Object.keys(e.datetimeFormats);t.length&&t.forEach((t=>{r.mergeDateTimeFormat(t,e.datetimeFormats[t])}))}if($(e.numberFormats)){const t=Object.keys(e.numberFormats);t.length&&t.forEach((t=>{r.mergeNumberFormat(t,e.numberFormats[t])}))}return r}if("parent"===l){let t=function(e,t,a=!1){let n=null;const r=t.root;let l=t.parent;for(;null!=l;){const t=e;if("composition"===e.mode)n=t.__getInstance(l);else{const e=t.__getInstance(l);null!=e&&(n=e.__composer),a&&n&&!n[pe]&&(n=null)}if(null!=n)break;if(r===l)break;l=l.parent}return n}(n,a,e.__useComponent);return null==t&&(t=r),t}if("legacy"===n.mode)throw Error(18);const o=n;let s=o.__getInstance(a);if(null==s){const t=a.type,n=v({},e);t.__i18n&&(n.__i18n=t.__i18n),r&&(n.__root=r),s=ke(n),function(e,t,a){c((()=>{}),t),u((()=>{e.__deleteInstance(t)}),t)}(o,a),o.__setInstance(a,s)}return s}const je=["locale","fallbackLocale","availableLocales"],Ee=["t","rt","d","n","tm"];export{Te as DatetimeFormat,Me as NumberFormat,we as Translation,ce as VERSION,Se as createI18n,Ce as useI18n,Oe as vTDirective};
