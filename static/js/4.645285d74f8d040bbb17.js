webpackJsonp([4],{NSSj:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("Dd8w"),i=e.n(s),o=e("kvay"),a=e("m40h"),r=e("9cIF"),c=e("T452"),u=e("NYxO"),d=e("PvFA"),f={components:{MusicList:o.a},data:function(){return{songs:[]}},created:function(){this._getSongList()},computed:i()({},Object(u.c)(["disc"]),{title:function(){return this.disc.dissname},bgImage:function(){return this.disc.imgurl}}),methods:{_getSongList:function(){var t=this;this.disc.dissid?Object(a.c)(this.disc.dissid).then(function(n){n.code===c.a&&(t.songs=t._normalizeSongs(n.cdlist[0].songlist))}):this.$router.push("/recommend")},_normalizeSongs:function(t){var n=[];return t.forEach(function(t){var e=t.songid,s=t.albummid;e&&s&&Object(r.b)(t.songmid).then(function(e){if(e.code===c.a){var s=e.data.items[0].vkey,i=Object(d.b)(t,s);n.push(i)}})}),n}}},m={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("music-list",{attrs:{title:this.title,"bg-image":this.bgImage,songs:this.songs}})],1)},staticRenderFns:[]};var g=e("VU/8")(f,m,!1,function(t){e("sea8")},"data-v-196898f6",null);n.default=g.exports},m40h:function(t,n,e){"use strict";n.b=function(){var t=a()({},c.b,{platform:"h5",uin:0,needNewCode:1});return Object(r.a)("https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",t,c.c)},n.a=function(){var t=a()({},c.b,{platform:"yqq.json",hostUin:0,sin:0,ein:19,sortId:5,needNewCode:0,categoryId:1e7,rnd:Math.random(),format:"json"});return d.a.get("/api/getDiscList",{params:t}).then(function(t){return i.a.resolve(t.data)})},n.c=function(t){var n=a()({},c.b,{disstid:t,type:1,json:1,utf8:1,onlysong:0,platform:"yqq.json",needNewCode:0,g_tk:1790477011,inCharset:"utf8",outCharset:"utf-8",notice:0,format:"json"});return d.a.get("/api/getSongList",{params:n}).then(function(t){return i.a.resolve(t.data)})};var s=e("//Fk"),i=e.n(s),o=e("woOf"),a=e.n(o),r=e("Gak4"),c=e("T452"),u=e("mtWM"),d=e.n(u)},sea8:function(t,n){}});
//# sourceMappingURL=4.645285d74f8d040bbb17.js.map