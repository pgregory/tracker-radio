webpackJsonp([6],{"1QA5":function(t,e){},XaKJ:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={props:{artist:Object,empty:Boolean},methods:{click:function(){this.$gtm.trackEvent({event:"artist-selected",action:"select",category:"Artist",label:"Artist Selected",artist_id:this.artist.id}),this.$emit("artist-selected")},getRandomAvatar:function(){return"/static/cover-"+("000"+Math.ceil(6*Math.random())).slice(-3)+".png"}}},s={render:function(){var t=this.$createElement;return(this._self._c||t)("b-card",{staticClass:"artist mb-2 mx-1",staticStyle:{"min-width":"10rem"},attrs:{title:this.artist.name,"img-src":this.getRandomAvatar(),"img-alt":"Image","img-top":"","no-body":"","border-variant":"light"},on:{click:this.click}},[this._v("\n  "+this._s(this.artist.name)+"\n")])},staticRenderFns:[]};var r=i("VU/8")(a,s,!1,function(t){i("1QA5")},"data-v-8053e880",null);e.default=r.exports}});
//# sourceMappingURL=6.4de41f8d0fbadd45fdcb.js.map