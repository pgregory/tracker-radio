webpackJsonp([4,5],{"5HUa":function(t,a){},O77W:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("KfGB"),r=e("xsBa"),n=e("YMQP"),i={name:"Playlists",props:{user:Object},data:function(){return{playlistId:null,trackId:null}},methods:{},components:{PlaylistList:s.default,PlaylistTrackList:r.default,TrackPlayer:n.default}},l={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"content"}},[null!=t.user?e("b-container",{attrs:{id:"playlists-panel"}},[e("b-row",[e("b-col",{staticClass:"lists",attrs:{sm:"8"}},[e("b-row",{staticClass:"playlists"},[e("b-col",{attrs:{sm:"12"}},[e("PlaylistList",{attrs:{"allow-edit":"true",user:t.user},on:{"playlist-selected":function(a){t.playlistId=a}}})],1)],1),t._v(" "),e("b-row",{staticClass:"tracks"},[e("b-col",{attrs:{sm:"12"}},[e("PlaylistTrackList",{attrs:{playlistId:t.playlistId,user:t.user},on:{"track-selected":function(a){t.trackId=a}}})],1)],1)],1),t._v(" "),e("b-col",{attrs:{sm:"4"}},[e("TrackPlayer",{attrs:{trackId:t.trackId,user:t.user}})],1)],1)],1):e("b-container",[e("b-jumbotron",{attrs:{header:"Playlists"}},[e("p",[t._v("To use playlists, login or sign up using the link at the right of the navigation bar above.")])])],1)],1)},staticRenderFns:[]};var c=e("VU/8")(i,l,!1,function(t){e("mWYd")},"data-v-3c675fe3",null);a.default=c.exports},mWYd:function(t,a){},xsBa:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("mtWM"),r=e.n(s),n=e("X+2x"),i=e.n(n),l=e("kxiW"),c=e.n(l),o={data:function(){return{track_fields:["title","artist","rating","remove"],tracks:[]}},props:{user:Object,playlistId:Number},watch:{playlistId:function(t,a){this.updatePlaylistTracks(t),this.$emit("track-selected",null)}},methods:{getPlaylistTracksFromBackend:function(){if(this.playlistId){var t=c.a.auth().currentUser;if(t){var a=this;t.getIdToken(!0).then(function(t){var e="https://indigobeetle.pythonanywhere.com/api/playlists/"+a.playlistId+"/tracks";r.a.get(e,{headers:{Authorization:"bearer "+t}}).then(function(t){a.tracks=t.data}).catch(function(t){console.log(t)})})}}},getPlaylistTracks:function(){this.tracks=[],this.getPlaylistTracksFromBackend()},updatePlaylistTracks:function(t){this.getPlaylistTracksFromBackend()},trackSelected:function(t,a){this.$emit("track-selected",t.id)},onRemoveTrack:function(t){if(this.playlistId){var a=c.a.auth().currentUser;if(a){var e=this;a.getIdToken(!0).then(function(a){var s="https://indigobeetle.pythonanywhere.com/api/playlists/"+e.playlistId+"/tracks/"+t;r.a.delete(s,{headers:{Authorization:"bearer "+a}}).then(function(t){e.getPlaylistTracksFromBackend()}).catch(function(t){console.log(t)})})}}}},components:{StarRating:i.a},created:function(){this.getPlaylistTracks()}},d={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("b-card",{staticClass:"panel",attrs:{id:"tracks","no-body":"",header:"Tracks"}},[e("b-card-body",{staticClass:"tracks-list"},[e("b-table",{attrs:{striped:"",hover:"",responsive:"",items:t.tracks,fields:t.track_fields,small:""},on:{"row-clicked":t.trackSelected},scopedSlots:t._u([{key:"artist",fn:function(a){return[t._v("\n        "+t._s(a.item.artist.name)+"\n      ")]}},{key:"rating",fn:function(a){return[e("star-rating",{attrs:{"star-size":20,"read-only":!0},model:{value:a.item.average_rating,callback:function(e){t.$set(a.item,"average_rating",e)},expression:"data.item.average_rating"}})]}},{key:"remove",fn:function(a){return[e("b-button",{attrs:{size:"sm",variant:"danger"},on:{click:function(e){t.onRemoveTrack(a.item.id)}}},[e("font-awesome-icon",{attrs:{icon:"trash"}})],1)]}}])})],1)],1)},staticRenderFns:[]};var u=e("VU/8")(o,d,!1,function(t){e("5HUa")},"data-v-dd257bb0",null);a.default=u.exports}});
//# sourceMappingURL=4.3c5d8f33e57a047b302d.js.map