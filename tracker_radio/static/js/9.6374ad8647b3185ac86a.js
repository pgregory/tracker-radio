webpackJsonp([9],{"8++G":function(t,l){},O77W:function(t,l,a){"use strict";Object.defineProperty(l,"__esModule",{value:!0});var e=a("woOf"),i=a.n(e),s=a("xsBa"),n=a("2xgZ"),o=a("YMQP"),r=a("mtWM"),c=a.n(r),d=a("TPW+"),y={name:"Playlists",props:{user:Object},data:function(){return{playlistId:null,playlist:[],trackId:null,editablePlaylist:!1,playlists:[],editPlaylistModalShow:!1,selectedPlaylist:null,newPlaylistTitle:"",newPlaylistModalShow:!1,autoPlaylists:[]}},watch:{user:function(t,l){this.getPlaylistsFromBackend()}},methods:{getPlaylistsFromBackend:function(){var t=this;this.user&&this.user.getIdToken(!0).then(function(l){c.a.get("https://indigobeetle.pythonanywhere.com/api/playlists",{headers:{Authorization:"bearer "+l}}).then(function(l){t.playlists=l.data}).catch(function(t){console.log(t)})});c.a.get("https://indigobeetle.pythonanywhere.com/api/autoplaylists").then(function(l){t.autoPlaylists=l.data}).catch(function(t){console.log(t)})},onPlaylistSelected:function(t){this.playlistId=t.id,this.$router.push({path:"/playlists/"+this.playlistId})},onAutoPlaylistSelected:function(t){this.playlistId=t.id,this.$router.push({path:"/autoplaylists/"+this.playlistId})},onEditPlaylist:function(t){this.selectedPlaylist=t,this.cachedPlaylist=i()({},this.selectedPlaylist),this.editPlaylistModalShow=!0},onEditPlaylistSubmit:function(){var t=this;this.user&&this.user.getIdToken(!0).then(function(l){var a="https://indigobeetle.pythonanywhere.com/api/playlists/"+t.selectedPlaylist.id;c.a.patch(a,{title:t.selectedPlaylist.title},{headers:{Authorization:"bearer "+l}}).then(function(l){t.editPlaylistModalShow=!1}).catch(function(l){console.log(l),t.editPlaylistModalShow=!1})})},onEditPlaylistCancel:function(){this.selectedPlaylist=i()(this.selectedPlaylist,this.cachedPlaylist),this.editPlaylistModalShow=!1},onDeletePlaylist:function(t){var l=this;this.user&&this.user.getIdToken(!0).then(function(a){var e="https://indigobeetle.pythonanywhere.com/api/playlists/"+t.id;c.a.delete(e,{headers:{Authorization:"bearer "+a}}).then(function(t){l.getPlaylistsFromBackend()}).catch(function(t){console.log(t)})})},addPlaylist:function(){this.newPlaylistModalShow=!0},onNewPlaylistSubmit:function(){var t=this;this.user&&this.user.getIdToken(!0).then(function(l){c.a.post("https://indigobeetle.pythonanywhere.com/api/playlists",{title:t.newPlaylistTitle},{headers:{Authorization:"bearer "+l}}).then(function(l){t.getPlaylistsFromBackend()}).catch(function(t){console.log(t)})})},onNewPlaylistCancel:function(){this.newPlaylistModalShow=!1}},components:{PlaylistTrackList:s.default,AutoPlaylistTrackList:n.default,TrackPlayer:o.default},mixins:[d.a],created:function(){this.getPlaylistsFromBackend()}},v={render:function(){var t=this,l=t.$createElement,a=t._self._c||l;return a("v-container",{attrs:{id:"content"}},[a("v-container",{attrs:{id:"my-playlists-panel"}},[a("v-layout",{attrs:{row:"","justify-center":""}},[a("h2",[t._v("My Playlists")])]),t._v(" "),a("v-container",{attrs:{"grid-list-lg":""}},[a("v-layout",{ref:"playlists",attrs:{row:"",wrap:"","align-start":"","justify-start":"","fill-height":""}},t._l(t.playlists,function(l,e){return a("v-flex",{key:l.id,ref:"playlist",refInFor:!0,attrs:{shrink:"","data-index":e}},[a("v-card",{attrs:{hover:"",width:"150",height:"100%"}},[a("v-img",{attrs:{src:t.getRandomAvatar(l.id)},on:{click:function(a){t.onPlaylistSelected(l)}}}),t._v(" "),a("v-card-title",[t._v("\n              "+t._s(l.title)+"\n            ")]),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-menu",{attrs:{bottom:"",left:""}},[a("v-btn",{attrs:{slot:"activator",icon:""},slot:"activator"},[a("v-icon",[t._v("more_vert")])],1),t._v(" "),a("v-list",[a("v-list-tile",{on:{click:function(a){t.onEditPlaylist(l)}}},[t._v("\n                    Edit\n                  ")]),t._v(" "),a("v-list-tile",{on:{click:function(a){t.onDeletePlaylist(l)}}},[t._v("\n                    Delete\n                  ")])],1)],1)],1)],1)],1)}),1),t._v(" "),a("v-btn",{attrs:{fab:""},on:{click:t.addPlaylist}},[a("v-icon",[t._v("add")])],1)],1)],1),t._v(" "),a("v-container",{attrs:{id:"auto-playlists-panel"}},[a("v-layout",{attrs:{row:"","justify-center":""}},[a("h2",[t._v("Auto Playlists")])]),t._v(" "),a("v-container",{attrs:{"grid-list-lg":""}},[a("v-layout",{ref:"auto-playlists",attrs:{row:"",wrap:"","align-start":"","justify-start":"","fill-height":""}},t._l(t.autoPlaylists,function(l,e){return a("v-flex",{key:l.id,ref:"playlist",refInFor:!0,attrs:{shrink:"","data-index":e}},[a("v-card",{attrs:{hover:"",width:"150",height:"100%"}},[a("v-img",{attrs:{src:t.getRandomAvatar(l.ref)},on:{click:function(a){t.onAutoPlaylistSelected(l)}}}),t._v(" "),a("v-card-title",[t._v("\n              "+t._s(l.title)+"\n            ")]),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-menu",{attrs:{bottom:"",left:""}},[a("v-btn",{attrs:{slot:"activator",icon:""},slot:"activator"},[a("v-icon",[t._v("more_vert")])],1)],1)],1)],1)],1)}),1)],1)],1),t._v(" "),a("v-dialog",{ref:"editPlaylistModal",attrs:{id:"edit-playlist-modal",title:"Edit Playlist","max-width":"600px"},on:{ok:t.onEditPlaylistSubmit},model:{value:t.editPlaylistModalShow,callback:function(l){t.editPlaylistModalShow=l},expression:"editPlaylistModalShow"}},[t.selectedPlaylist?a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("Edit Playlist")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{wrap:""}},[a("v-flex",{attrs:{xs12:"",sm6:"",md4:""}},[a("v-text-field",{attrs:{label:"Title*",required:""},model:{value:t.selectedPlaylist.title,callback:function(l){t.$set(t.selectedPlaylist,"title",l)},expression:"selectedPlaylist.title"}})],1)],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},on:{click:t.onEditPlaylistCancel}},[t._v("\n          Close\n        ")]),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},on:{click:t.onEditPlaylistSubmit}},[t._v("\n          Save\n        ")])],1)],1):t._e()],1),t._v(" "),a("v-dialog",{ref:"newPlaylistModal",attrs:{id:"new-playlist-modal",title:"New Playlist","max-width":"600px"},on:{ok:t.onNewPlaylistSubmit},model:{value:t.newPlaylistModalShow,callback:function(l){t.newPlaylistModalShow=l},expression:"newPlaylistModalShow"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("New Playlist")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{wrap:""}},[a("v-flex",{attrs:{xs12:"",sm6:"",md4:""}},[a("v-text-field",{attrs:{label:"Title*",required:""},model:{value:t.newPlaylistTitle,callback:function(l){t.newPlaylistTitle=l},expression:"newPlaylistTitle"}})],1)],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},on:{click:t.onNewPlaylistCancel}},[t._v("\n          Close\n        ")]),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},on:{click:t.onNewPlaylistSubmit}},[t._v("\n          Save\n        ")])],1)],1)],1)],1)},staticRenderFns:[]};var u=a("VU/8")(y,v,!1,function(t){a("8++G")},"data-v-2d72dccc",null);l.default=u.exports}});
//# sourceMappingURL=9.6374ad8647b3185ac86a.js.map