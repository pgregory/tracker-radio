webpackJsonp([7],{"7IOM":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=r("mtWM"),n=r.n(s),i=r("TPW+"),a={name:"Artists",props:{user:Object},data:function(){return{artists:[],artistId:null,trackId:null,letters:["All","0-9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],current_letter:"A",search_string:""}},methods:{filteredArtists:function(){var t=this.search_string.toLowerCase();return this.artists.filter(function(e){return-1!==e.name.toLowerCase().indexOf(t)})},getArtistsFromBackend:function(){var t=this;n.a.get("https://indigobeetle.pythonanywhere.com/api/artists",{params:{letter:this.current_letter}}).then(function(e){t.artists=e.data}).catch(function(t){console.log(t)})},getArtists:function(){this.artists=[],this.tracks=[],this.getArtistsFromBackend()},selectLetter:function(t){this.current_letter=t,this.getArtists()},onArtistSelected:function(t){this.$router.push({path:"/artists/"+t})}},components:{},mixins:[i.a],created:function(){this.getArtists()}},c={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{attrs:{id:"content"}},[r("div",{attrs:{id:"artists-panel"}},[r("v-layout",{attrs:{row:"","justify-center":""}},[r("h2",[t._v("Artists")])]),t._v(" "),r("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[r("v-flex",{attrs:{xs6:""}},[r("v-text-field",{attrs:{hint:"Search within current set",placeholder:"Search",clearable:""},model:{value:t.search_string,callback:function(e){t.search_string=e},expression:"search_string"}})],1),t._v(" "),r("v-flex",{attrs:{xs6:""}},t._l(t.letters,function(e){return r("v-chip",{key:e,class:{active:e==t.current_letter},attrs:{dark:"",small:""},on:{click:function(r){t.selectLetter(e)}}},[r("span",[t._v(t._s(e))])])}),1)],1),t._v(" "),r("v-container",{attrs:{"grid-list-lg":""}},[r("v-layout",{ref:"artists",attrs:{row:"",wrap:"","align-start":"","justify-start":"","fill-height":""}},t._l(t.filteredArtists(),function(e,s){return r("v-flex",{key:e.id,ref:"artist",refInFor:!0,attrs:{shrink:"","data-index":s}},[r("v-card",{attrs:{hover:"",width:"150",height:"100%"},on:{click:function(r){t.onArtistSelected(e.id)}}},[r("v-img",{attrs:{src:t.getRandomAvatar(e.id)}}),t._v(" "),r("v-card-title",[t._v("\n              "+t._s(e.name)+"\n            ")])],1)],1)}),1)],1)],1)])},staticRenderFns:[]};var l=r("VU/8")(a,c,!1,function(t){r("UEtT")},"data-v-f66f925c",null);e.default=l.exports},UEtT:function(t,e){}});
//# sourceMappingURL=7.ad233b31ee9628e054d3.js.map