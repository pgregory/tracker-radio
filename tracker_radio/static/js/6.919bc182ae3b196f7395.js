webpackJsonp([6],{"+tKQ":function(t,a){},gSff:function(t,a){},lhpy:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e("mtWM"),r=e.n(i),n=e("X+2x"),s=e.n(n),o=e("kxiW"),c=e.n(o),l=e("TPW+"),u={data:function(){return{tracks:[],headers:[{text:"Title",align:"left",sortable:!0,class:"track-title",value:"track.title"},{text:"Artist",align:"left",sortable:!0,class:"track-artist",value:"track.artist.name"},{text:"",sortable:!1,class:"track-play"},{text:"",sortable:!1,class:"track-edit"},{text:"",sortable:!1,class:"track-favourite"},{text:"Average Rating",align:"right",sortable:!0,value:"track.average_rating"},{text:"Votes",align:"right",sortable:!0,value:"rating_count"}],playlists:[],isFavourites:{}}},props:{user:Object,artistId:Number},watch:{artistId:function(t,a){this.updatePopularTracks(t)},user:function(t,a){this.updatePopularTracks(t),this.updatePlaylists()}},mixins:[l.a],methods:{getPopularTracksFromBackend:function(){var t=this,a="https://indigobeetle.pythonanywhere.com/api/tracks/popular";if(this.user){var e=this;this.user.getIdToken(!0).then(function(t){r.a.get(a,{headers:{Authorization:"bearer "+t}}).then(function(t){e.tracks=t.data,e.$emit("num-tracks",e.tracks.length)}).catch(function(t){console.log(t)})})}else r.a.get(a).then(function(a){t.tracks=a.data,t.$emit("num-tracks",t.tracks.length)}).catch(function(t){console.log(t)})},getPlaylistsFromBackend:function(){var t=this;this.user&&this.user.getIdToken(!0).then(function(a){r.a.get("https://indigobeetle.pythonanywhere.com/api/playlists",{headers:{Authorization:"bearer "+a}}).then(function(a){t.playlists=a.data}).catch(function(t){console.log(t)})})},getPopularTracks:function(){this.tracks=[],this.getPopularTracksFromBackend()},getPlaylists:function(){this.playlists=[],this.getPlaylistsFromBackend()},updatePopularTracks:function(t){this.getPopularTracksFromBackend()},updatePlaylists:function(){this.getPlaylistsFromBackend()},trackSelected:function(t,a){this.$router.push({name:"track",params:{id:t.id}})},onPlayTrack:function(t){this.$emit("play-track",t.id)},onFavouriteTrack:function(t){var a=this;this.setFavourite(t).then(function(){a.getPopularTracksFromBackend()})},onSetRating:function(t,a){var e=this;this.setRating(t,a).then(function(){e.getPopularTracksFromBackend()})},addTrackToPlaylist:function(t,a){var e="https://indigobeetle.pythonanywhere.com/api/playlists/"+a+"/tracks/"+t,i=c.a.auth().currentUser,n=this;i&&i.getIdToken(!0).then(function(i){n.$gtm.trackEvent({event:"playlist-add-track",action:"add-track",category:"Playlist",label:"Track Added to Playlist",track_id:t,playlist_id:a}),r.a.put(e,{},{headers:{Authorization:"bearer "+i}}).then(function(t){console.log(t)}).catch(function(t){console.log(t)})})},getTrackLocation:function(t){return"http://app.wetracker.xyz/#/loadsong?url="+encodeURI("https://modland.com/pub/modules/Fasttracker 2/"+t.location)}},components:{StarRating:s.a},created:function(){this.getPopularTracks(),this.getPlaylists()}},v={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-layout",{attrs:{row:""}},[e("v-flex",{attrs:{sm12:""}},[e("v-card",[e("v-data-table",{staticClass:"elevation-1 tracks",attrs:{headers:t.headers,items:t.tracks,"hide-actions":"","disable-initial-sort":""},scopedSlots:t._u([{key:"items",fn:function(a){return[e("tr",{on:{click:function(e){t.trackSelected(a.item.track)}}},[e("td",{staticClass:"track-title"},[t._v(t._s(a.item.track.title))]),t._v(" "),e("td",{staticClass:"track-artist"},[t._v(t._s(a.item.track.artist.name))]),t._v(" "),e("td",{staticClass:"track-play"},[e("v-icon",{attrs:{large:""},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.onPlayTrack(a.item.track)}}},[t._v("play_arrow")])],1),t._v(" "),e("td",{staticClass:"track-edit"},[e("v-menu",{attrs:{bottom:"",left:""},nativeOn:{click:function(t){t.stopPropagation(),t.preventDefault()}}},[e("v-btn",{attrs:{slot:"activator",icon:""},slot:"activator"},[e("v-icon",[t._v("more_vert")])],1),t._v(" "),e("v-list",{attrs:{dense:""}},[e("v-menu",{attrs:{"offset-x":"","open-on-hover":""}},[e("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[e("v-list-tile-title",[t._v("Add to Playlist")]),t._v(" "),e("v-list-tile-action",{staticClass:"justify-end"},[e("v-icon",[t._v("play_arrow")])],1)],1),t._v(" "),e("v-list",{attrs:{dense:""}},t._l(t.playlists,function(i){return e("v-list-tile",{key:i.id,on:{click:function(e){t.addTrackToPlaylist(a.item.track.id,i.id)}}},[t._v("\n                          "+t._s(i.title)+"\n                      ")])}),1)],1),t._v(" "),e("v-list-tile",[e("a",{attrs:{href:t.getTrackLocation(a.item.track),target:"_blank"}},[t._v("\n                      Open in WeTracker\n                    ")])])],1)],1)],1),t._v(" "),e("td",{staticClass:"track-favourite"},[null==t.user?e("v-tooltip",{attrs:{bottom:""}},[e("v-btn",{attrs:{slot:"activator",icon:"",flat:""},on:{click:function(t){t.stopPropagation()}},slot:"activator"},[e("v-icon",{attrs:{medium:"",color:"grey"}},[t._v("favorite")])],1),t._v(" "),e("span",[t._v("Login/Sign Up to Choose Favourites")])],1):e("v-btn",{attrs:{icon:"",flat:""},on:{click:function(e){e.stopPropagation(),t.onFavouriteTrack(a.item.track)}}},[e("v-icon",{attrs:{medium:"",color:a.item.track.is_favourite_of_current_user?"red":"grey"}},[t._v("\n                  favorite\n                ")])],1)],1),t._v(" "),e("td",{staticClass:"track-rating"},[null==t.user?e("v-tooltip",{attrs:{bottom:""}},[e("star-rating",{attrs:{slot:"activator","star-size":20,"read-only":""},nativeOn:{click:function(t){t.preventDefault(),t.stopPropagation()}},slot:"activator",model:{value:a.item.track.average_rating,callback:function(e){t.$set(a.item.track,"average_rating",e)},expression:"props.item.track.average_rating"}}),t._v(" "),e("span",[t._v("Login/Sign Up to Rate Tracks")])],1):e("star-rating",{attrs:{"star-size":20},on:{"rating-selected":function(e){t.onSetRating(e,a.item.track)}},nativeOn:{click:function(t){t.preventDefault(),t.stopPropagation()}},model:{value:a.item.track.average_rating,callback:function(e){t.$set(a.item.track,"average_rating",e)},expression:"props.item.track.average_rating"}})],1),t._v(" "),e("td",{staticClass:"track-votes"},[t._v(t._s(a.item.rating_count))])])]}}])})],1)],1)],1)},staticRenderFns:[]};var k=e("VU/8")(u,v,!1,function(t){e("gSff"),e("+tKQ")},"data-v-0d02bf9e",null);a.default=k.exports}});
//# sourceMappingURL=6.919bc182ae3b196f7395.js.map