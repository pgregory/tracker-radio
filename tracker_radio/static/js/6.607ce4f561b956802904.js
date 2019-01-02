webpackJsonp([6],{ImSY:function(t,a){},Rwbn:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e("woOf"),s=e.n(i),n=e("mtWM"),r=e.n(n),c=e("H33K"),o=e("iwwE"),l=e("kxiW"),u=e.n(l),d=e("TPW+"),k={data:function(){return{tracks:[],headers:[{text:"Title",align:"left",sortable:!0,class:"track-title",value:"title"},{text:"",sortable:!1,class:"track-play"},{text:"",sortable:!1,class:"track-edit"},{text:"",sortable:!1,class:"track-favourite"},{text:"Average Rating",align:"right",sortable:!0,value:"average_rating"}],playlists:[],isFavourites:{}}},props:{user:Object,artistId:Number},watch:{artistId:function(t,a){this.updateArtistTracks(t)},user:function(t,a){this.updateArtistTracks(t),this.updatePlaylists()}},mixins:[d.a],methods:{getArtistTracksFromBackend:function(){var t=this;if(this.artistId){var a="https://indigobeetle.pythonanywhere.com/api/artists/"+this.artistId+"/tracks";if(this.user){var e=this;this.user.getIdToken(!0).then(function(t){r.a.get(a,{headers:{Authorization:"bearer "+t}}).then(function(t){e.tracks=t.data,e.$emit("num-tracks",e.tracks.length)}).catch(function(t){console.log(t)})})}else r.a.get(a).then(function(a){t.tracks=a.data,t.$emit("num-tracks",t.tracks.length)}).catch(function(t){console.log(t)})}},onTrackChanged:function(t){var a=this;this.getSingleTrackFromBackend(t).then(function(e){var i=a.tracks.find(function(a){return a.id===t});i&&s()(i,e)}).catch(function(t){console.log(t)})},getPlaylistsFromBackend:function(){var t=this;this.user&&this.user.getIdToken(!0).then(function(a){r.a.get("https://indigobeetle.pythonanywhere.com/api/playlists",{headers:{Authorization:"bearer "+a}}).then(function(a){t.playlists=a.data}).catch(function(t){console.log(t)})})},getArtistTracks:function(){this.tracks=[],this.getArtistTracksFromBackend()},getPlaylists:function(){this.playlists=[],this.getPlaylistsFromBackend()},updateArtistTracks:function(t){this.getArtistTracksFromBackend()},updatePlaylists:function(){this.getPlaylistsFromBackend()},trackSelected:function(t,a){this.$router.push({name:"track",params:{id:t.id}})},onPlayTrack:function(t){this.$emit("play-track",t.id)},addTrackToPlaylist:function(t,a){var e="https://indigobeetle.pythonanywhere.com/api/playlists/"+a+"/tracks/"+t,i=u.a.auth().currentUser,s=this;i&&i.getIdToken(!0).then(function(i){s.$gtm.trackEvent({event:"playlist-add-track",action:"add-track",category:"Playlist",label:"Track Added to Playlist",track_id:t,playlist_id:a}),r.a.put(e,{},{headers:{Authorization:"bearer "+i}}).then(function(t){console.log(t)}).catch(function(t){console.log(t)})})},getTrackLocation:function(t){return"http://app.wetracker.xyz/#/loadsong?url="+encodeURI("https://modland.com/pub/modules/Fasttracker 2/"+t.location)}},components:{TrackRating:c.default,TrackFavourite:o.default},created:function(){this.getArtistTracks(),this.getPlaylists()}},h={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-layout",{attrs:{row:""}},[e("v-flex",{attrs:{sm12:""}},[e("v-card",[e("v-data-table",{staticClass:"elevation-1 tracks",attrs:{headers:t.headers,items:t.tracks,"hide-actions":""},scopedSlots:t._u([{key:"items",fn:function(a){return[e("tr",{on:{click:function(e){t.trackSelected(a.item)}}},[e("td",{staticClass:"track-title"},[t._v(t._s(a.item.title))]),t._v(" "),e("td",{staticClass:"track-play"},[e("v-icon",{attrs:{large:""},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.onPlayTrack(a.item)}}},[t._v("play_arrow")])],1),t._v(" "),e("td",{staticClass:"track-edit"},[e("v-menu",{attrs:{bottom:"",left:""},nativeOn:{click:function(t){t.stopPropagation(),t.preventDefault()}}},[e("v-btn",{attrs:{slot:"activator",icon:""},slot:"activator"},[e("v-icon",[t._v("more_vert")])],1),t._v(" "),e("v-list",{attrs:{dense:""}},[e("v-menu",{attrs:{"offset-x":"","open-on-hover":""}},[e("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[e("v-list-tile-title",[t._v("Add to Playlist")]),t._v(" "),e("v-list-tile-action",{staticClass:"justify-end"},[e("v-icon",[t._v("play_arrow")])],1)],1),t._v(" "),e("v-list",{attrs:{dense:""}},t._l(t.playlists,function(i){return e("v-list-tile",{key:i.id,on:{click:function(e){t.addTrackToPlaylist(a.item.id,i.id)}}},[t._v("\n                          "+t._s(i.title)+"\n                      ")])}),1)],1),t._v(" "),e("v-list-tile",[e("a",{attrs:{href:t.getTrackLocation(a.item),target:"_blank"}},[t._v("\n                      Open in WeTracker\n                    ")])])],1)],1)],1),t._v(" "),e("td",{staticClass:"track-favourite"},[e("track-favourite",{attrs:{user:t.user,track:a.item},on:{"track-changed":function(a){t.onTrackChanged(a)}}})],1),t._v(" "),e("td",{staticClass:"track-rating"},[e("track-rating",{attrs:{user:t.user,track:a.item},on:{"track-changed":function(a){t.onTrackChanged(a)}}})],1)])]}}])})],1)],1)],1)},staticRenderFns:[]};var v=e("VU/8")(k,h,!1,function(t){e("ImSY"),e("u4hm")},"data-v-2608631c",null);a.default=v.exports},u4hm:function(t,a){}});
//# sourceMappingURL=6.607ce4f561b956802904.js.map