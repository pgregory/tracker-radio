webpackJsonp([1,7,9],{"+U2f":function(t,e){},"1QA5":function(t,e){},"7IOM":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r("mtWM"),i=r.n(n),a=r("bm7V"),o=r.n(a),s=r("XaKJ"),c=r("Rwbn"),l=r("Pbam"),u=r("YMQP"),f={name:"Artists",props:{user:Object},data:function(){return{artists:[],artistId:null,trackId:null,letters:["All","0-9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],current_letter:"A",search_string:""}},methods:{filteredArtists:function(){var t=this.search_string.toLowerCase();return this.artists.filter(function(e){return-1!==e.name.toLowerCase().indexOf(t)})},getArtistsFromBackend:function(){var t=this;i.a.get("https://indigobeetle.pythonanywhere.com/api/artists",{params:{letter:this.current_letter}}).then(function(e){t.artists=e.data}).catch(function(t){console.log(t)})},getArtists:function(){this.artists=[],this.tracks=[],this.getArtistsFromBackend()},selectLetter:function(t){this.current_letter=t,this.getArtists()},outerWidth:function(t){var e=t.offsetWidth,r=getComputedStyle(t);return e+=parseInt(r.marginLeft)+parseInt(r.marginRight)},scrollLeft:function(){var t=this.outerWidth(this.$refs.artist[0].$el),e=Math.floor(this.$refs.artists.offsetWidth/t),r=Math.floor(this.$refs.artists.scrollLeft/t),n=Math.min(r+e,this.$refs.artist.length),i=document.querySelector('.artist[data-index="'+n+'"]'),a={container:this.$refs.artists,easing:"ease-in-out",force:!0,x:!0,y:!1};o.a.scrollTo(i,500,a)},scrollRight:function(){var t=this.outerWidth(this.$refs.artist[0].$el),e=Math.floor(this.$refs.artists.offsetWidth/t),r=Math.floor(this.$refs.artists.scrollLeft/t),n=Math.max(r-e,0),i=document.querySelector('.artist[data-index="'+n+'"]'),a={container:this.$refs.artists,easing:"ease-in-out",force:!0,x:!0,y:!1};o.a.scrollTo(i,500,a)}},components:{Artist:s.default,TrackList:c.default,TrackData:l.default,TrackPlayer:u.default},created:function(){this.getArtists()}},d={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"content"}},[r("b-container",{attrs:{id:"artists-panel"}},[r("b-row",{staticClass:"panel-title",attrs:{id:"artists-title"}},[r("b-col",[r("span",[t._v("Artists")])])],1),t._v(" "),r("b-row",{staticClass:"letters"},t._l(t.letters,function(e){return r("b-col",{key:e,staticClass:"letter",class:{active:e==t.current_letter},on:{click:function(r){t.selectLetter(e)}}},[r("span",[t._v(t._s(e))])])})),t._v(" "),r("b-row",{staticClass:"search"},[r("b-form-input",{attrs:{type:"text",placeholder:"Search"},model:{value:t.search_string,callback:function(e){t.search_string=e},expression:"search_string"}}),t._v(" "),r("b-button",{on:{click:function(e){t.search_string=""}}},[t._v("X")])],1),t._v(" "),r("b-row",{ref:"artists",staticClass:"artists"},[r("b-card-group",{staticClass:"artist-list d-flex flex-nowrap mx-0",attrs:{deck:""}},t._l(t.filteredArtists(),function(e,n){return r("artist",{key:e.id,ref:"artist",refInFor:!0,attrs:{"data-index":n,artist:e},on:{"artist-selected":function(r){t.artistId=e.id}}})}))],1),t._v(" "),r("div",{attrs:{id:"prev-button"},on:{click:t.scrollRight}},[r("font-awesome-icon",{attrs:{icon:"chevron-left",size:"1x"}})],1),t._v(" "),r("div",{attrs:{id:"next-button"},on:{click:t.scrollLeft}},[r("font-awesome-icon",{attrs:{icon:"chevron-right",size:"1x"}})],1)],1),t._v(" "),r("b-container",{attrs:{id:"track-panel"}},[r("b-row",[r("b-col",{attrs:{sm:"4"}},[r("TrackList",{attrs:{artistId:t.artistId,user:t.user},on:{"track-selected":function(e){t.trackId=e}}})],1),t._v(" "),r("b-col",{attrs:{sm:"4"}},[r("TrackData",{attrs:{trackId:t.trackId,user:t.user}})],1),t._v(" "),r("b-col",{attrs:{sm:"4"}},[r("TrackPlayer",{attrs:{trackId:t.trackId,user:t.user}})],1)],1)],1)],1)},staticRenderFns:[]};var v=r("VU/8")(f,d,!1,function(t){r("+U2f")},"data-v-71a8573a",null);e.default=v.exports},OjVv:function(t,e){},Rwbn:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r("mtWM"),i=r.n(n),a=r("X+2x"),o={data:function(){return{track_fields:["title","rating"],tracks:[]}},props:{user:Object,artistId:Number},watch:{artistId:function(t,e){this.updateArtistTracks(t),this.$emit("track-selected",null)}},methods:{getArtistTracksFromBackend:function(){var t=this;if(this.artistId){var e="https://indigobeetle.pythonanywhere.com/api/artists/"+this.artistId+"/tracks";i.a.get(e).then(function(e){t.tracks=e.data}).catch(function(t){console.log(t)})}},getArtistTracks:function(){this.tracks=[],this.getArtistTracksFromBackend()},updateArtistTracks:function(t){this.getArtistTracksFromBackend()},getTrackLocation:function(t){return"http://app.wetracker.xyz/#/loadsong?play=1&url="+encodeURI("https://modland.ziphoid.com/pub/modules/Fasttracker 2/"+t.location)},trackSelected:function(t,e){this.$emit("track-selected",t.id)}},components:{StarRating:r.n(a).a},created:function(){this.getArtistTracks()}},s={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("b-card",{staticClass:"panel",attrs:{id:"tracks","no-body":"",header:"Tracks"}},[r("b-card-body",{staticClass:"tracks-list"},[r("b-table",{attrs:{striped:"",hover:"",responsive:"",items:t.tracks,fields:t.track_fields,small:""},on:{"row-clicked":t.trackSelected},scopedSlots:t._u([{key:"artist",fn:function(e){return[t._v("\n        "+t._s(e.item.artist[0].name)+"\n      ")]}},{key:"rating",fn:function(e){return[r("star-rating",{attrs:{"star-size":20,"read-only":!0},model:{value:e.item.average_rating,callback:function(r){t.$set(e.item,"average_rating",r)},expression:"data.item.average_rating"}})]}}])})],1)],1)},staticRenderFns:[]};var c=r("VU/8")(o,s,!1,function(t){r("OjVv")},"data-v-04ebbd75",null);e.default=c.exports},XaKJ:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={props:{artist:Object,empty:Boolean},methods:{click:function(){this.$gtm.trackEvent({event:"artist-selected",action:"select",category:"Artist",label:"Artist Selected",artist_id:this.artist.id}),this.$emit("artist-selected")},getRandomAvatar:function(){return"/static/cover-"+("000"+Math.ceil(6*Math.random())).slice(-3)+".png"}}},i={render:function(){var t=this.$createElement;return(this._self._c||t)("b-card",{staticClass:"artist mb-2 mx-1",staticStyle:{"min-width":"10rem"},attrs:{title:this.artist.name,"img-src":this.getRandomAvatar(),"img-alt":"Image","img-top":"","no-body":"","border-variant":"light"},on:{click:this.click}},[this._v("\n  "+this._s(this.artist.name)+"\n")])},staticRenderFns:[]};var a=r("VU/8")(n,i,!1,function(t){r("1QA5")},"data-v-8053e880",null);e.default=a.exports},bm7V:function(t,e,r){var n;n=function(){"use strict";var t=4,e=.001,r=1e-7,n=10,i=11,a=1/(i-1),o="function"==typeof Float32Array;function s(t,e){return 1-3*e+3*t}function c(t,e){return 3*e-6*t}function l(t){return 3*t}function u(t,e,r){return((s(e,r)*t+c(e,r))*t+l(e))*t}function f(t,e,r){return 3*s(e,r)*t*t+2*c(e,r)*t+l(e)}var d=function(s,c,l,d){if(!(0<=s&&s<=1&&0<=l&&l<=1))throw new Error("bezier x values must be in [0, 1] range");var v=o?new Float32Array(i):new Array(i);if(s!==c||l!==d)for(var h=0;h<i;++h)v[h]=u(h*a,s,l);function m(o){for(var c=0,d=1,h=i-1;d!==h&&v[d]<=o;++d)c+=a;var m=c+(o-v[--d])/(v[d+1]-v[d])*a,p=f(m,s,l);return p>=e?function(e,r,n,i){for(var a=0;a<t;++a){var o=f(r,n,i);if(0===o)return r;r-=(u(r,n,i)-e)/o}return r}(o,m,s,l):0===p?m:function(t,e,i,a,o){var s,c,l=0;do{(s=u(c=e+(i-e)/2,a,o)-t)>0?i=c:e=c}while(Math.abs(s)>r&&++l<n);return c}(o,c,c+a,s,l)}return function(t){return s===c&&l===d?t:0===t?0:1===t?1:u(m(t),c,d)}},v={ease:[.25,.1,.25,1],linear:[0,0,1,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]},h=!1;try{var m=Object.defineProperty({},"passive",{get:function(){h=!0}});window.addEventListener("test",null,m)}catch(t){}var p={$:function(t){return"string"!=typeof t?t:document.querySelector(t)},on:function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{passive:!1};e instanceof Array||(e=[e]);for(var i=0;i<e.length;i++)t.addEventListener(e[i],r,!!h&&n)},off:function(t,e,r){e instanceof Array||(e=[e]);for(var n=0;n<e.length;n++)t.removeEventListener(e[n],r)},cumulativeOffset:function(t){var e=0,r=0;do{e+=t.offsetTop||0,r+=t.offsetLeft||0,t=t.offsetParent}while(t);return{top:e,left:r}}},g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},b=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},y=["mousedown","wheel","DOMMouseScroll","mousewheel","keyup","touchmove"],k={container:"body",duration:500,easing:"ease",offset:0,force:!0,cancelable:!0,onStart:!1,onDone:!1,onCancel:!1,x:!1,y:!0};function w(t){k=b({},k,t)}var _=function(){var t=void 0,e=void 0,r=void 0,n=void 0,i=void 0,a=void 0,o=void 0,s=void 0,c=void 0,l=void 0,u=void 0,f=void 0,h=void 0,m=void 0,b=void 0,w=void 0,_=void 0,A=void 0,T=void 0,x=void 0,L=function(t){o&&(x=t,T=!0)},S=void 0,$=void 0,I=void 0,O=void 0;function M(t){if(T)return C();$||($=t),I=t-$,O=Math.min(I/r,1),O=S(O),F(e,b+A*O,h+_*O),I<r?window.requestAnimationFrame(M):C()}function C(){T||F(e,w,m),$=!1,p.off(e,y,L),T&&l&&l(x,t),!T&&c&&c(t)}function F(t,e,r){f&&(t.scrollTop=e),u&&(t.scrollLeft=r),"body"===t.tagName.toLowerCase()&&(f&&(document.documentElement.scrollTop=e),u&&(document.documentElement.scrollLeft=r))}return function($,I){var O=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if("object"===(void 0===I?"undefined":g(I))?O=I:"number"==typeof I&&(O.duration=I),!(t=p.$($)))return console.warn("[vue-scrollto warn]: Trying to scroll to an element that is not on the page: "+$);e=p.$(O.container||k.container),r=O.duration||k.duration,n=O.easing||k.easing,i=O.offset||k.offset,a=O.hasOwnProperty("force")?!1!==O.force:k.force,o=O.hasOwnProperty("cancelable")?!1!==O.cancelable:k.cancelable,s=O.onStart||k.onStart,c=O.onDone||k.onDone,l=O.onCancel||k.onCancel,u=void 0===O.x?k.x:O.x,f=void 0===O.y?k.y:O.y;var C=p.cumulativeOffset(e),F=p.cumulativeOffset(t);if("function"==typeof i&&(i=i()),b=function(t){var e=t.scrollTop;return"body"===t.tagName.toLowerCase()&&(e=e||document.documentElement.scrollTop),e}(e),w=F.top-C.top+i,h=function(t){var e=t.scrollLeft;return"body"===t.tagName.toLowerCase()&&(e=e||document.documentElement.scrollLeft),e}(e),m=F.left-C.left+i,T=!1,A=w-b,_=m-h,!a){var E=b,P=E+e.offsetHeight,R=w,j=R+t.offsetHeight;if(R>=E&&j<=P)return}return"string"==typeof n&&(n=v[n]||v.ease),S=d.apply(d,n),A||_?(s&&s(t),p.on(e,y,L,{passive:!0}),window.requestAnimationFrame(M),function(){x=null,T=!0}):void 0}}(),A=[];function T(t){var e=function(t){for(var e=0;e<A.length;++e)if(A[e].el===t)return A[e]}(t);return e||(A.push(e={el:t,binding:{}}),e)}function x(t){t.preventDefault();var e=T(this).binding;if("string"==typeof e.value)return _(e.value);_(e.value.el||e.value.element,e.value)}var L={bind:function(t,e){T(t).binding=e,p.on(t,"click",x)},unbind:function(t){!function(t){for(var e=0;e<A.length;++e)if(A[e].el===t)return A.splice(e,1),!0}(t),p.off(t,"click",x)},update:function(t,e){T(t).binding=e},scrollTo:_,bindings:A},S=function(t,e){e&&w(e),t.directive("scroll-to",L),t.prototype.$scrollTo=L.scrollTo};return"undefined"!=typeof window&&window.Vue&&(window.VueScrollTo=L,window.VueScrollTo.setDefaults=w,window.Vue.use(S)),L.install=S,L},t.exports=n()}});
//# sourceMappingURL=1.5d82905edd01537c66a1.js.map