webpackJsonp([6],{"7t7E":function(t,a){},Pbam:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=e("mtWM"),n=e.n(r),c=e("X+2x"),o=e.n(c),i=e("kxiW"),s=e.n(i),l={data:function(){return{track:null}},props:{user:Object,trackId:Number},watch:{trackId:function(t,a){this.getTrackData()}},methods:{getTrackData:function(){var t=this;if(this.trackId){var a="https://indigobeetle.pythonanywhere.com/api/tracks/"+this.trackId;n.a.get(a).then(function(a){t.track=a.data,console.log(t.track)}).catch(function(t){console.log(t)})}},getTrackLocation:function(t){return"http://app.wetracker.xyz/#/loadsong?play=1&url="+encodeURI("https://modland.ziphoid.com/pub/modules/Fasttracker 2/"+t.location)},setRating:function(t,a){var e="https://indigobeetle.pythonanywhere.com/api/tracks/"+a+"/rate",r=s.a.auth().currentUser;r&&r.getIdToken(!0).then(function(a){n.a.post(e,{rating:t},{headers:{Authorization:"bearer "+a}}).then(function(t){console.log(t)}).catch(function(t){console.log(t)})})}},components:{StarRating:o.a},created:function(){this.getTrackData()}},u={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("b-container",{attrs:{id:"track"}},[e("b-row",{attrs:{id:"track-data-title"}},[e("b-col",[e("p",[t._v("Track")])])],1),t._v(" "),e("b-container",{attrs:{id:"track-data"}},[t.track?e("b-container",{staticClass:"track-data-inner"},[e("b-row",[e("p",{staticClass:"track-title"},[t._v(t._s(t.track.title))])]),t._v(" "),e("b-row",[e("a",{staticClass:"track-play",attrs:{href:t.getTrackLocation(t.track),target:"_blank"}},[t._v(">")])]),t._v(" "),e("b-row",[e("star-rating",{attrs:{"star-size":20,"read-only":null==t.user},on:{"rating-selected":function(a){t.setRating(a,t.data.item.id)}},model:{value:t.track.average_rating,callback:function(a){t.$set(t.track,"average_rating",a)},expression:"track.average_rating"}})],1)],1):t._e()],1)],1)},staticRenderFns:[]};var d=e("VU/8")(l,u,!1,function(t){e("7t7E")},"data-v-8078a2c0",null);a.default=d.exports}});
//# sourceMappingURL=6.5776efbb97dff07f1857.js.map