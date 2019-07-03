## 目录
1. 所有目录
```
src:
    ├─api                   ->放置和后端请求相关的代码，包括ajax等
    ├─base
    │  ├─confirm            ->删除时候的提示框，是否真正删除
    │  ├─listview           ->歌手列表的核心组件(singer中使用)
    │  ├─loading            ->等待数据加载时显示的组件(就是一个转圈圈的图案)
    │  ├─no-result          ->搜索结果不存在时候显示的组件
    │  ├─progress-bar       ->播放器页面的进度条
    │  ├─progress-circle    ->mini播放器的播放按钮
    │  ├─scroll             ->用于给组件实现滚动
    │  ├─search-box         ->搜索框组件
    │  ├─search-list        ->根据搜索结果显示的搜索列表
    │  ├─slider             ->轮播图组件
    │  ├─song-list          ->只用于显示所有歌曲(只要获取歌曲就需要这个组件)
    │  ├─switches
    │  └─top-tip
    ├─common                ->放置静态资源，像图片，字体等
    │  ├─fonts
    │  ├─image
    │  ├─js
    │  ├─scss
    │  └─stylus
    ├─components            ->公共组件
    │  ├─add-song           ->添加歌曲到队列
    │  ├─disc               ->歌单详情页
    │  ├─m-header           ->首页顶部
    │  ├─music-list         ->歌手详情页主要组件(在singer-detail中被使用)
    │  ├─player             ->播放器页面(大的播放器，mini播放器)
    │  ├─playlist           ->mini播放器右下角的歌曲列表
    │  ├─rank               ->所有榜单页面
    │  ├─recommend          ->歌单页面
    │  ├─search             ->整个搜索页面的实现
    │  ├─singer             ->所有歌手列表页(引用listview)
    │  ├─singer-detail      ->歌手详情页(引用music-list)
    │  ├─suggest            ->搜索页面核心组件，数据获取等
    │  ├─tab                ->导航栏(歌手，排行等)
    │  ├─top-list           ->榜单详情页面
    │  └─user-center
    ├─router                ->路由相关文件
    ├─store                 ->vuex相关代码
    ├─main.js               ->入口相关文件
    └─App.vue
index.html                  ->添加meta标签，移动端常见设置
package.json                ->添加了
                                ->"fastclick": "^1.0.6"：解决移动端点击300毫秒延迟
                                ->"babel-runtime": "^6.26.0",:对es语法进行转义
                                ->"babel-polyfill": "^6.26.0",对es6api进行转义，例如promise等
```

## 项目初始化
1. 解决300毫秒延迟的问题
    + src/main.js目录
    + import fastclick from 'fastclick'
    + fastclick.attach(document.body)
2. 写header
    + src/components/mHeader
    + src/App.vue中引入
    + 先import，然后在components上添加组件，然后使用组件<m-header></m-header>
3. 别名的配置
    + 在webpack.base.conf.js下配置
        ```
        resolve: {
            alias: {
                'common': resolve('src/common'), 
            }
        }
        function resolve (dir) {
          return path.join(__dirname, '..', dir)
        }
        ```
    + 此时common就代表了src/common
    + 同理，也可以多配制几个别名
        ```
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
              'vue$': 'vue/dist/vue.esm.js',
              'src': resolve('src'),
              'api': resolve('src/api'),
              'base': resolve('src/base'),
              'common': resolve('src/common'),
              'components': resolve('src/components'),
              'router': resolve('src/router'),
              'store': resolve('src/store')
            }
          },
        ```
4. 改变默认背景色
    + 背景色：src/common/stylus/variable.styl的background
    + 图标：src/components/mHeader
5. 引入路由：
    + src/router/index.js
    + 引入并注册
    ```
        import Router from 'vue-router'
        Vue.use(Router)
    ```
    + 在src/main.js添加路由，并注册到实例身上
        ```
        import router from './router'
        new Vue({
          router
        })
        ```
    + 然后添加router-view，对应渲染router那些组件，那么这些组件怎么切换的呢？->通过导航栏tab(src/components/tab)在App.vue文件中
    + 引入tab(mHeader也是这么引入的)
        ```
        里面有详细注释
        1. import Tab from 'components/tab/tab'
        2. components: {
            MHeader,
            Tab,
           }
        3. 在template中引入
            <m-header></m-header>
            <tab></tab>
        ```
6. 默认显示组件
    + router/index.js中routes下配置{path: '/', redirect:'/recommend'},
7. jsonp原理：利用动态创建一个script标签，因为script标签是没有同源策略限制的，然后把script的src指向我们请求支持的服务端地址，地址后面有个callback函数
8. jsonp使用：
    + 安装： npm i jsonp
    + 封装一个jsonp:src/common/js/jsonp.js（具体见代码注释）
    + 封装获取数据的jsonp的方法：src/api/recommend.js（具体见代码注释）
    + 调用方法获取数据：src/components/recommend.vue
        ```
        src/components/recommend.vue
        1. 引入：import { getRecommend} from 'api/recommend'
                 import { ERR_OK } from 'api/config'
        2. 创建方法
            methods:{
                _getRecommend(){
                  getRecommend().then((res) => {
                    不是直接使用数字，是为了语义化更好
                    if(res.code == ERR_OK){
                      console.log(res.data.slider);
                    }
                  })
                },
            }
        3. 在生命周期函数created时候执行
            created(){
                this._getRecommend()
            },
        ```
9. 轮播图组件
    + src下创建base目录，base下创建silder文件夹，然后创建silder.vue组件(具体见代码注释)
    + 在components/recommend.vue文件中引入插件
        ```
        1. 引入：import Slider from 'base/slider/slider'
        2. components: {
            Slider,
          },
        3. 在template中添加插件
            <div class="slider-wrapper">
                <slider>
                  <div v-for="">     
                  </div>
                </slider>
            </div>
        ```
    + 渲染轮播图组件
        ```
        1. jsonp获取数据成功后，用recommends接收数据
            data(){
                return{
                  recommends: [],
                }
              },
            if(res.code == ERR_OK){
              // 当jsonp获取数据成功后，用数组接收数据，然后用来渲染轮播图组件
              this.recommends = res.data.slider;
            } 
        2. 用得来的数据渲染轮播图组件
            <slider>
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl">
                </a>
              </div>
            </slider>
        ```
    + 编写轮播图js(见src/base/slider.vue,有详细注释)
    + 在slider.vue中使用better-scroll：
    ```
        官网：https://github.com/ustbhuangyi/better-scroll
             https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
        1. 引入：import BScroll from 'better-scroll'
        2. 定义相关方法
        3. 在生命周期函数mounted时候执行方法
        4. 使用scroll的时候一定一定要注意，必须保证当前 能得到组件的正确高度才能滚动！！！！
    ```
    + 轮播图整体功能：
        ```
        1. 设置每个子元素宽度，保证样式正确，获取整个轮播图的图片总宽度
        2. 实现轮播图下面点dots的问题，怎么确定当前页，并且更改的点的样式
        3. 设置轮播图属性，例如：是否能循环播放，间隔等
        4. 自动播放方法autoPlay实现，
        ```
    + 出现问题：报错
        ```
        1. 单纯报错
            原因：见src/base/slider和src/components/recommend组件
            因为我获取数据执行周期是created,而且是异步的
            数据渲染的执行周期是mounted
            但是此时可能还没有 得到数据，所以会报错
        2. 轮播图滑动不连续，轮播图小点不在图片下面，在整个页面最底部
                better-scroll源码有更新，现在的使用方法，和原来的有差异
                小点父元素position没有定位，相对的元素是body，所以在页面最底部 
        3. 轮播图自动播放到最后一页就停了，
                新版api改变了，或者就继续用这种方法，或者用next，不过动画效果没有了
        4. 手机端，电脑端切换时候轮播图宽度出现错误
                监听 窗口改变 事件，当改变时候重新计算宽度
                但是没每次重新计算时候，_setSliderWidth中的width都会width += 2 * sliderWidth，这样是不对
                所以，我们在_setSliderWidth中传入一个参数，判断此时方法的执行是不是重新resize过来的，然后再重新渲染轮播图
                剩余详细见代码注释src/base/slider
        5. 在手机模式下，点击轮播图，不能进行页面跳转
            由于better-scroll穿了一个参数是click为true
            然后它在better-scroll内部实现的时候，会阻止浏览器默认的click
            然后自己开发一个click，然后，它开发的click恰好又被fastClick这个库监听到
            ，然后它又阻止了这个事件，导致click不能被执行，
            解决：就是删掉click:true，因为a链接本身就能实现跳转，所以不需要监听click
        ```
    + 优化：
        ```
        1. 当我们推荐页面切换到歌手页面，再切回来的时候，会出现闪烁的效果
            原因：我们每切换一次的话，都会重新发送一个数据请求，所有dom都会重新渲染，
            生命周期都会重新走一遍获取数据，然后重新初始化slider，体验不好，且没有必要
            解决：给App.vue中添加keep-alive,这样就可以将他们的dom都缓存到内存中
                    这样就不会多发送请求，其次也不会有闪的效果
                    <keep-alive>
                      <router-view></router-view>
                    </keep-alive>
        2. 当slider被切走的时候实际上会调用destroyed()，然后在这里把定时器等资源进行清理，有利于内存的释放
        ```
10. 歌单组件（src/components/recommend.vue包含歌单组件）
    + 数据的抓取
        ```
        见同目录8的详细方法
        1. 在src/api/recommend.js中封装获取歌单数据的jsonp的方法
        2. 在src/components/recommend.vue中调用歌单数据
        ```
    + 问题：
        ```
        获取数据失败，因为有一个host和referer的限制，前端之间不能修改request-header的，通过后端代理的方式处理
        那么后端代理怎么做呢？
        开发vue时会启动一个server，这个server就是nodejs气的devServer的逻辑
        那么需要我们手动代理这样的请求
        1. 在build/webpack.dev.conf.js下写服务器代理
            第一步
                // 接口代理绕过主机和引用程序
                // browser: XMLHttpRequst, node.js: http
                const axios = require('axios')
                var apiRoutes = express.Router()
                // 最后一步，将api注册使用
                app.use('/api', apiRoutes)
            第二步
                在devServer中配置接口，因为直接请求会出错，referer和host不一样，不让请求
                通过axios该改变headers之后带着浏览器发送过来的参数，重新发送请求
        2. src/api/recommend.js封装获取歌单数据的ajax的方法
        见webpack.dev.conf.js文件和src/api/recommend.js，有详细注释 
        课外：大公司是怎么防止我们抓取数据的呢？
            可以设置：获取数据时候带一个独有的签名，我才给你数据
        ```
    + 数据的渲染,见src/components/recommend.vue，其实和轮播图获取数据一样的
    + 优化：
        ```
        1. 想实现可滑动，但是总写很多次better-scroll很麻烦
            那我就将可滑动的部分封装成一个单独的组件，然后将所有可滑动的部分都放scroll组件中去
            better-scroll详细解释在src/base/slider.vue中有
        2. 什么时候重新refresh计算的
        （1）在src/components/recommend.vue组件中，为什么向scroll组件中传的是discList，而不是recommends？
            因为轮播图接口获取的数据优先于歌单获取的数据，就是当歌单获取的discList，
            再调用refresh的时候轮播图部分高度已经撑开了，也就是说scroll是可以正确计算到高度的
            若是我们延迟1s获取轮播图数据，那么就是discList先获取到，然后计算完scroll的高度之后，recommends才获取到数据
            那么造成的问题就是，我们的歌单下面有一部分滚动不了，因为它把轮播图的高度算在了scroll高度中
            那么歌单部分就有差不多轮播图高度的部分不能滑动
            那么说明，我refresh时机不对，不应该是watch到data改变之后refresh()
        （2）那么什么时候重新计算滚动区高度也就是refresh呢？
            在图片加载完，将上面的部分撑起来了，这个时候我才refresh，
            但是我不需要等到所有图片加载完，只要一个图片撑开就可以了，
            所以设置一个变量记录this.checkloaded
        ```
    + 图片懒加载:src/main.js和src/components/recommend.vue
        ```
        官网：https://github.com/hilongjw/vue-lazyload
        1. 安装：npm i vue-lazyload
        2. src/main.js中引入组件
        3. 注册
            Vue.use(VueLazyload, {
              loading: require('common/image/default.png')
            })
        4. 图片路径不用src，用v-lazy
        5. 最好看一下lazyload源码
        ```
    + 问题：src/components/recommend.vue
        ```
        better-scroll和fastclick冲突时候，可以利用class="needsclick"解决
        就是当fastclick监听到某个dom结点上的点击事件的时候，发现有class="needsclick"
        它就不会手动拦截这个过程，详细见recommend.vue
        ```
    + loadin组件，就是当歌单列表没有获取来之前，展示一个转圈的loading
        ```
        见src/base/loading和src/components/recommend.vue
        ```
11. 歌手组件
    + 封装获取数据的jsonp的方法：src/api/singer.js（具体见代码注释）
    + 获取数据：在src/components/singer.vue中,具体见此文件中的注释
        ```
            data() {
                return {
                    singers: []
                }
            },
            created() {
                this._getSingerList() // get singer data
            },
            methods:{
                _getSingerList() {
                    getSingerList().then(res => {
                        if (res.code === ERR_OK) {
                          console.log(res.data.list);
                        }
                    })
                },
            }
        ```
    + 数据处理：src/components/singer.vue
        ```
        1. 将数据分类：
            1. 热门数据，(前10条数据)
            2. 按字母分类的数据('A', 'B', 'C' ......)
        2. 因为获取数据过程中，有很多重复的操作或者数据，所以需要优化：
            单独封装一个歌手类，见src/common/singer.js
        3. 将数据格式化：将数据处理成我们需要的数据格式
        ```
    + 数据渲染：
        ```
        将歌手列表单独封装成一个组件src/base/listview.vue，代码有详细注释
        然后在src/components/singer.vue中引入组件
        ```

12. 快速入口组件，字母列表(src/base/listview.vue)
    + 根据title，得到字母集合
        ```
        computed: {
            shortcutList() { // ['A','B','C'...]
              return this.data.map(group => {
                return group.title.substr(0, 1)
            })
        },
        ```
    + 绑定事件，当触摸字母列表时候可以实现一些功能
        ```
        1. 点击某个字母，左侧可以直接定位到这个字母下的歌手名(详细见src/base/listview.vue)
            better-scroll本身有个api就是scrollToElement，可以滚动到某个元素 
            (1)先将每个字母绑定一个属性data-index，用来唯一标识字母
            (2)在给每个字母绑定方法，touchstart触发"onShortCutTouchStart"方法
            (3)"onShortCutTouchStart"先获取当前字母data-index
            (封装一个单独的类(src/common/js/dom.js)用来获取data-index)
            (4)scrollToElement跳到左侧这个索引指定位置
        2. 指尖滑动时候，左侧也跟着一起滑动
                通过计算pageY值
        3. 左侧滚动，右侧字母表有高亮的效果
            (1)先在src/base/scroll/scroll.vue中添加相应属性及方法
                // 要不要监听滚动事件
                props: {
                    listenScroll: {
                      type: Boolean,
                      default: false
                    },
                },
                methods: {
                    _initScroll() {
                        if (this.listenScroll) {
                            const that = this
                            // 监听scroll的滚动事件，并且拿到位置，也就是事件的回调
                            this.scroll.on('scroll', pos => {
                              that.$emit('scroll', pos)
                            })
                        }
                    }
                }
            (2) src/base/listview中的相应组件传递给子组件值，并且获取子组件传来的值
                <scroll @scroll="scroll" :listenScroll="listenScroll"></scroll>
                然后大致思路就是根据偏移值，计算当前在哪个字母下，然后让右侧该字母高亮
            详细将代码listview.vue
        ```
    + 出现问题：
        ```
        1. 手指滑动，左侧跟着动，但是滑动位置不对，索引相加的时候没有转化为整型，记得加上一个parseInt
        2. 写字母高亮功能的时候，左侧计算出来的索引位置不对，因为src/base/scroll/scroll.vue中设置probeType:1，改为3就好了
        3. 当歌手列表滚动到最顶部的时候将滚动逻辑进行优化，src/base/listview.vue
            分为三种情况
                (1) 当滚动到最顶部的时候
                (2) 当滚动到中间部分
                (3) 当滚动到最底部的时候 
        4. 直接点击右侧字母表，并不会高亮
            因为直接点击并不会触发滚动事件，所以不会派发一个pos事件，我们这里手动设置
            this.scrollY = -this.listHeight[index]，实现高亮
        5. 点击字母表上下两个区块的时候是有问题的，是可以点击的，但是我们不想让那部分可点击
            所以加上判断，如果点击部分为null那么不做任何事情，返回
            if (!index && index !== 0) { // click on the blank
                return
            }
        6. 当拖动时候，拖动到顶部，或者拖动到底部时候做一个边界处理
        ```
    + 整体思路：5-8的6:36部分重新捋了一下
    + 滚动固定标题实现src/base/listview.vue
        ```
         <div class="list-fixed" ref="fixed">
          <h2 class="fixed-title">{{fixedTitle}}</h2>
        </div>    
        list-fixed使用了绝对定位，所以会定到那里
        ```
    + 问题：
        ```
        1. 当我们滑动到最底部，又滑回到最顶部的时候，会出现两个热门的title，这样是不对的
            解决：当 当前滑动的scrollY为正数时，设置fixedTitle为''，
            然后上面的list-fixed结构，添加v-show，如果fixedTitle为空就不显示
        2. 当滑动时候，两个fixedTitle相遇后的效果不好
            是下面那个慢慢上去，然后一点一点覆盖的，这样的体验是不好的
            解决：通过计算两个title的差值diff，当差值大于0，什么都不变，当title小于0，就让上面的title偏移差值距离，就会实现下一个往上顶的效果
        3. 数据没有请求到的时候，有一个loading的效果
            (1)先引入import loading from 'base/loading/loading'
            (2)注册组件 components: {
                        loading
                    },
            (3)如果没有数据，就显示这个组件
                <div class="loading-container" v-show="!data.length">
                  <loading></loading>
                </div>
        ```
13. 歌手详情页面组件src/components/singer-detail,这个组件主要就是负责数据部分，然后传递给子组件，最后，调用子组件
    + 引入路由
        ```
        (1) 先在router/index.js中引入，并且添加路由
            import SingerDetail from 'components/singer-detail/singer-detail'
            {
                path: '/singer', 
                component: Singer,
                children: [
                  {
                  // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
                  path: ':id',
                  component: SingerDetail,
                  }
                (3)在src/base/listview.vue中添加事件,当某个歌手被点击了，向外派发一个事件，告诉外部我被点击了，并且被点击的元素是什么
            selectItem(item) {
              this.$emit('select', item)
            },
        (4)父组件src/components/singer.vue接受子组件传来的值，然后利用this.$router.push分，跳转到该歌手页面
        (5)在src/components/singer-detail上给路由加上动画效果
            <transition name="slide">
                <div class="singer-detail"></div>
            </transition>
        ```
    + 使用vuex管理状态,将歌手存进去
    + 抓取数据
        ```
        1. 利用jsonp抓取数据，见src/api/singer.js中getSingerDetail，有详细注释
        2. 在src/components/singer-detail中获取数据
            (1)先引入
                import { getSingerDetail } from 'api/singer'
                import { ERR_OK } from 'api/config'
            (2)定义好方法，然后再created生命周期时候执行

        ```
    + 封装歌曲数据
        ```
        因为有很多组件都需要整个歌曲的数据，所以将歌曲的数据封装成一个单独的src/api/song.js文件，用来获取歌曲的数据
        见src/common/js/song.js有详细注释
        1. 先创建一个歌曲类Song
        2. 每次都需要new，然后传进去很多参数，很麻烦，所以，再新建一个方法createSong,在这里返回一个new的实例对象
            实际上这也是一种工厂方法模式，就是不直接new，是调用一个方法，返回一个实例对象
        3. 在src/components/singer-detail中使用
        ```
14. vuex
    + 用state.管理状态，详情都见store文件夹，都有注释
    + 调用vuex存储数据
        ```
        1. 在main.js中引入import store from './store'
        2. 在main.js中注册
                new Vue({
                  store
                })
        3. 在src/components/singer中使用
            import {mapMutations} from 'vuex'
            methods:{
                  // 经过这个映射，在代码中就可以调用this.setSinger
                ...mapMutations({
                  setSinger: 'SET_SINGER'
                })
              }
        ```
15. 歌手详情页面src/components/music-list.vue
    + 引入并传入数据
        ```
            import MusicList from 'components/music-list/music-list'
            <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
             components: {
                MusicList
              },
        ```
    + 写dom结构，完善歌手详情页面
    + 将显示歌曲列表的部分封装成一个单独的组件src/base/song-list.vue，因为有很多地方都需要用
    + 还有一点就是，把这个歌曲列表放到scroll组件中，因为歌单列表也是需要滚动效果的
16. 显示歌曲列表的组件src/base/song-list.vue(会在music-list中使用)
    + 很简单，就是从父组件获得歌曲列表所有值，然后在组件中进行渲染
    + 出现问题
        ```
        1. src/components/music-list中歌曲列表显示位置不对，直接跑到了最顶部
            将上面图片的高度计算出来，然后让显示歌曲列表组件的top设置成图片高度
        ```
17. 歌曲列表：src/components/music-list(会在sing-detail中被使用)
    + 在滑动歌曲列表时，想要实现在手指往上滑的时候，歌曲列表是要适当覆盖最上面歌手图片的
        ```
        (1) 先将scroll组件样式中的overflow: hidden去掉
        (2) 只滚上去是不够的，要实现当手指往上滑的时候，字的后面背景部分(不是图片)也要一起向上滚
            在scroll组件上面放一个div，然后监听滚动距离，然后让这个div和字一起滚动
        ```
    + 但是，当向上滑了一段距离之后，就出现问题了
        ```
        因为bg-layer高度设置的是100%，也就是屏幕高度
        所以当手指滑动过屏幕高这么多距离之后，这个bg-layer就滑走了，就没有背景颜色显示了
        将最上方图片的高度记录下来，然后设置bg-layer最多滚动的距离不超过图片的高度
        ```
    + 但是我们要是实现这样的效果，就是不让歌曲列表滚动到顶部，顶部预留一些地方来
        ```
        那么只要调整背景的最多偏移量就可以了，就是设置最多偏移量小一点
        this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT， // bg-layer minTransalteY
        ```
    + 当向上滚动的时候，顶部的字覆盖在了图片的上面，我想要实现的效果是图片覆盖在字上面
        ```
        当滚动到顶部,还要再往上的时候，就设置图片的高度为RESERVED_HEIGHT,并且更改图片的zIndex值
        如果没滚动到顶部的时候，一切恢复原样(图片的高度)
        ```
    + 当往底下拉的时候，我想要实现图片跟随者放大或者缩小的效果
        ```
        当往底下拉的时候，通过percent = newY/this.imageHeight来设置图片放大的比例
        当new>0的时候，设置放大比例scale为scale = 1 + percent，并且zIndex为10，这样保证图片放大的时候，歌单列表不会覆盖图片
        为什么是这个比例呢？因为当往下拉的时候，以这个比例，图片增加的高度就是newY的大小
        ```
    + 为什么图片放大的时候总是从头部开始放大，因为bg-image设置了transform-origin为top，所以图片放大的时候总是从头部开始放大
    + 当我们手指往上滑的过程中，想要实现图片的模糊效果，并且，越往上，就越模糊
        ```
        设置一个属性blur，代表模糊的程度
        然后this.$refs.filter.style[backdrop] = `blur(${blur}px)`，通过css3来设置模糊效果
        ```
    + 因为不同浏览器前缀不一样，js中怎么自动加上呢？
        ```
        css中不用写浏览器前缀的原因是因为，vue-loader用到了autoprefixer插件，会帮我们自动补全前缀
        但是js中就不会了，就需要我们自己判断，那么我们可以封装一个方法来判断浏览器前缀是什么
        见src/common/js/dom.js文件
        ```
    + 随机播放全部按钮
        ```
        首先要等得到歌曲列表数据之后才显示
        其次，当我们手指向上滑动的过程中，因为按钮设置的位置是bottom为20，所以当图片高度改变了，按钮位置也改变了
            但是我们要的效果是，当手指滑动到最顶部的时候，整个按钮是消失的，所以
                // 设置随机播放全部的按钮，在滑动到最顶端时候消失
                this.$refs.playBtn.style.display = 'none'
                // 设置随机播放全部的按钮在正常情况下，display = ''，让它正常显示
                this.$refs.playBtn.style.display = ''
        ```
    + 在没有获取到数据的时候显示loading
        ```
        (1)引入import Loading from 'base/loading/loading'
        (2)注册组件
            components: {
                Loading
              },
        (3)在组件中应用
            <div v-show="!songs.length" class="loading-container">s
                <loading></loading>
            </div>
        ```
18. 播放器页面src/components/player/player.vue
    + 数据的存放：考虑多个组件都可以操作播放器，所以控制播放器的数据一定是个全局的，所以通过vuex来管理
        ```
        src/store/state.js              定义和组件相关的，最底层的数据
        src/store/getter.js             对数据的映射，可以是一个函数，函数类似计算属性，根据state.js中的值计算出新的值
        src/store/mutation-types.js     见代码，理清和mutations.js的关系
        src/store/mutations.js          定义数据修改的逻辑，但是定义mutations之前，先定义mutation-types
        ```
    + 显示播放器组件的流程：src/components/player/player（见代码）
        ```
        1. 在app.vue下引用src/components/player/player
            因为不是和路由相关的组件，切换到任何组件都不影响播放
        2. 在app.vue下不能默认展示player.vue这个组件，要在src/components/player/player中引入vuex，
            通过取vuex中的变量playlist,计算长度length，来控制player组件的显示，不能默认显示
        3. 因为点击歌曲，下回触发这个组件，所以src/base/song.list组件要添加部分事件逻辑
            当点击歌曲时候，触发事件selectItem，然后这个函数将触发的事件和当前歌曲索引传递给父组件src/music-list/music-list.vue
            问：为什么传递索引呢，因为播放歌曲列表的时候，要从当前歌曲开始播放，所以要获取索引
        4. 当点击歌曲列表的某首歌的时候要触发
            (1)设置playlist和sequencelist
            (2)根据点击的索引设置currentlist
            (3)设置playing，设置歌曲播放还是暂停的状态，因为点击的时候，歌曲要播放，
            (4)默认展开大的播放器，设置fullScreen
            注意：因为要改变很多state，所以封装一个action(见src/store/action.js)
        5. 因为要改变state，索引要使用action，所以要在src/components/music-list.vue中引入mapActions
        6. 总结流程：
            点击歌曲(src/base/song-list)
            提交action(src/components/music-list)
            提交mutation(src/store/action.js)修改state
            playlist.length > 0(src/components/player.vue)
            然后显示player.vue组件
        ```
    + 播放器交互动画(src/components/player.vue)
        ```
        给播放器添加样式
        1. 样式1(player.vue)：当切换展开的播放器或者缩小的播放器时有动画效果，样式详见player.scss
            (1)给展开的播放器添加transition样式为normal
            (2)给缩小版的播放器添加transition样式为mini
        2. 样式2 (player.vue)：当由缩小版的播放器切换为展开版的播放器时，左下的CD封面也会由小拉到大的 动画
            (1)我们要通过js方式获取css动画，所以引入了create-keyframe-animation插件
            因为设置动画需要获取参数，我们要定义的_getPosAndScale函数来获得相应参数
            在enter中设置动画
        3. 样式3(player.vue)：当由放大版的的播放器切换为缩的播放器时，CD封面从中间移到左下角的实现，不过没有样式2那种动画，是直接用js操作css样式实现的
            因为设置动画需要获取参数，我们要定义的_getPosAndScale函数来获得相应参数
            在leave中设置动画
        4. 样式4(player.scss)：当别的页面切换为大的播放器页面的时候动画效果
            效果1：背景有一个渐隐渐现的效果,纯利用transition和css3一起实现的
            效果2：头部和底部又一个回弹的效果，这个效果是利用贝塞尔曲线cubic-bezier实现的
        5. 点击播放后 大的，小的播放器实现CD封面旋转的样式
            样式已经写好了.play,.pause.pause，在src/components/player/player.scss
            <img class="image" :src="currentSong.image" :class="cdcls"/>
             cdCls() {
              return this.playing ? 'play' : 'play pause'
             },
        ```
    + 给样式填充数据
        ```
        填充数据
            1. 唱片图片:src="currentSong.image"
            2. 歌曲名： v-html="currentSong.name"
            3. 歌曲名称： v-html="currentSong.singer"
        添加方法
            1. 点击右上角的按钮实现返回：添加back方法，back方法中用Vuex的mutations设置fullScreen为false
            2. 点击小型播放器后显示大的播放器：在小型播放器样式上绑定@click="open",open方法中设置fullScreen为true
        ```
    + 播放功能：利用html5的audio实现
        ```
        1. 添加audio标签，当currentSong改变时候play方法执行，但是遇到了问题，见下面问题的1,有具体解决方法
        2. 设置歌曲播放和暂停：
            (1)在class名为i-center的dom元素上绑定方法togglePlaying，切换暂停或者播放状态
            (2)togglePlaying() { 
                this.setPlayingState(!this.playing)
                //setPlayingState: 获取更改state中playing的mutations方法
                //playing:这个playing就是通过getters从vuex state获取的playing
                }
            (3)仅通过改变状态是不能控制歌曲的播放或者暂停的
              我们可以watch这个playing，然后触发audio的play或者pause方法
              但是因为我点击歌曲的时候，就会触发watch的playing属性
              然后就会执行play，所以还是会出现问题1，解决方法也是一样
            (4)播放或着暂停的圆圈圈样式改变
                1. 添加计算属性
                     playIcon() {
                        return this.playing ? 'icon-pause' : 'icon-play'
                     },
                2. 添加样式<i :class="playIcon" @click="togglePlaying"></i>
            (5)小的播放器图标的改变miniIcon 同理 大播放器
                注意：当点击小的播放器播放按钮的时候，会产生冒泡事件，需要阻止冒泡事件
                    <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
            (6)播放时候CD封面转圈，停止的时候CD封面停止
                1. 给大的播放器CD绑定样式(小的同理)
                    <div class="cd" :class="cdCls">
                        <img class="image" :src="currentSong.image"/>
                    </div>
                2. 设置样式
                    cdCls() {
                      return this.playing ? 'play' : 'play pause'
                    },
        3. 点击播放下一首或者上一首歌曲
            因为我们在state中记录了当前歌曲的索引，并且我们也有当前歌曲列表
            所以向上或者向下只要改变索引就可以了
            (1)给播放下一首歌曲按钮绑定事件(播放上一首歌曲按钮同理)
                <div class="icon i-right">
                  <i @click="next" class="icon-next"></i>
                </div>
            (2)事件逻辑
                next() {
                    let index = this.currentIndex + 1
                    // 如果当前歌曲是最后一首歌
                    if (index === this.playlist.length) {
                      index = 0
                    }
                    this.setCurrentIndex(index)
                  this.songReady = false
                },
        4. 当歌曲播放到末尾实现自动切换
            因为audio并没有切换割去这样的功能，但是歌曲播放完了，会派发一个ended的事件，所以我们可以利用end自己实现
        5. 随机播放全部按钮实现事件交互src/components/music-list.vue
            1. 给按钮绑定事件：random
                random() {
                  this.randomPlay({
                    list: this.songs
                  })
                }
            2. 整个randomPlay是从action.js(src/store/action.js)中获取的，可以更改state中playList(当前播放歌曲列表)的action
        ```
    + 大的播放器底部进度条src/base/progress-bar/progress-bar.vue：
        ```
        1.获取当前播放时间和总时间
            (1)设置标签实现进度条<div class="progress-wrapper">
            (2)因为当audio标签中歌曲播放的时候会派发一个事件就是@timeupdate="updateTime"
            (3)updateTime(e) {
              // update会传进来一个e的事件，这个事件有一个target属性就是audio标签
              // 这个audio还有一个可以获取到当前播放时间的属性就是currenTime,
              // 这个currentTime是一个时间戳的形式,是可读写属性
              this.currentTime = e.target.currentTime // <audio> current time
            },
            (4)编写一个函数format，将currentTime格式化为分和秒的形式
        2. 设置单独的组件显示进度条,接受父组件src/components/player/player.vue传过来的百分比的值
            (1)根据百分比，求走过的距离，然后设置样式
            (2)根据百分比，用transform设置小球的偏移
        3. 拖拽或者点击，小球实现歌曲的实时播放
        ```
    + 小的播放器转圈圈的播放按钮src/base/progress-circle/progress-circle.vue：
        ```
        引入：import ProgressCircle from 'base/progress-circle/progress-circle'
        注册：
            components: {
                ProgressCircle,
            },
        dom中使用
              <progress-circle :radius="radius" :percent="percent">
                <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
              </progress-circle>
            这个i标签会在progress-circle组件中的slot标签中生效
        progress-circle里面放置了两个circle，一个是默认全部高亮，一个是设置偏移量，剩下部分高亮
        ```
    + 播放模式
        ```
        1. 样式的改变：
            从state中引入mode变量，根据mode给dom结构增加样式，
            点击切换模式时，引入mutations改变mode
        2. 播放列表的改变
            (1)如果是随即播放，需要将列表打乱，也就是洗牌，那么封装一个函数(src/common/js/util.js)完成洗牌
            (2)引入setPlayList:'SET_PLAY_LIST',为了改变当前播放列表
                如果是随机播放则将打乱(shuffle函数)的歌曲列表赋给playList
                如果不是随机播放，那么playList就等于sequenceList
            (3)因为当前歌曲是根据歌曲列表和索引设置的，所以如果歌曲列表改变的话，
                当前播放的歌曲也可能发生变化，所以我们要重新计算currentIndex
                resetCurrentIndex(list){
                  let index = list.findIndex((item) => {
                    return item.id == this.currentSong.id
                  })
                  this.setCurrentIndex = index;
                }
        ```
    + 歌词(大部分在src/components/player.vue中完成)
        ```
        1. 获取歌词数据
            (1)定义获取歌词数据接口src/api/song.js
            (2)在webpack.dev.conf.js中定义路由api/lyric，因为在src/api/song.js中是通过api/lyric来获取数据的
                注意：因为得到的好像还是一个jsonp形式的数据，所以我们这里要做一个小小的处理
            (3)在src/common/js/song.js中调用getLyric,把歌词和歌曲的其他数据都封装在一个song对象中，因为他们都是歌曲整个整体的一部分
            (4)需要将数据解码，所以利用插件base64
                src/common/js/song.js中引入import { Base64 } from 'js-base64'
               将得到的lyric解码
                this.lyric = Base64.decode(res.lyric)
            (5)因为得到的是各一个很长的字符串，我们需要转化为我们需要的格式，所以引入插件lyric-parser
                引入：import Lyric from 'lyric-parser'
                将歌词格式化,并且设置处理函数(this.handleLyric)：
                this.currentSong.getLyric().then(lyric => {
                  this.currentLyric = new Lyric(lyric, this.handleLyric)
                })
        2. 设置歌词高亮
            (1) 因为当歌词每一行发生"改变"时，会触发this.handleLyric这个方法，
                因为我们解析到的歌词是有很多数据的，包括每行歌词的开始时间，
                所以说这里的改变是指随着时间改变，歌词的改变
                这个方法handleLyric({ lineNum, txt }) 传入两个参数
                    // lineNum：当前行
                    // txt：当前行的歌词
            (2)设置一个变量记录当前行this.currentLineNum
                    this.currentLineNum = lineNum
            (3)在dom中遍历并显示所有歌词，如果遍历到的歌词等于当前行歌词，那就设置样式高亮显示
                <p 
                    v-for="(line,index) in currentLyric.lines" 
                    :key="index" 
                    :class="{'current': currentLineNum === index}"
                >
                {{line.txt}}
                </p>
        3. 设置歌词可以滚动
            引入scroll组件，然后传入数据:data="currentLyric && currentLyric.lines"
            传入数据目的就是确保歌词数据存在，并且当歌词数据改变的时候调用scroll的refresh方法
        4. 保证当前歌词总在中间的位置上
            handleLyric({ lineNum, txt }) {
              this.currentLineNum = lineNum
              if (lineNum > 5) {
                const lineEl = this.$refs.lyricLine[lineNum - 5]
                // 滚动到指定行，时间为1秒
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
              } else {
                // 滚动到指定位置，时间为1秒
                this.$refs.lyricList.scrollTo(0, 0, 1000)
              }
              // this.playingLyric = txt
            },
        5. 歌词和唱片左右滑动效果
            (1)先设置左右滑动的时候，底部小圆圈的样式
                <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
            (2)CD页面，往左滑时候，歌词列表页面可以滚过来，然后CD页面有渐隐的效果
                先绑定事件，设定变量
                    在.middle"上绑定三个事件
                        @touchstart.prevent="middleTouchStart"
                        @touchmove.prevent="middleTouchMove"
                        @touchend="middleTouchEnd"
                    设置变量touch = {},关联touchdown和touchmove
                事件逻辑：就那三个函数，自己看吧，我是没看懂
                    包括：左滑右滑dom元素位置的变化 offsetWidth
                          中间动画的效果           duration
                          dom元素渐隐渐现的的效果   opcity
        6. 当拖动进度条的时候，歌词部分高亮部分也要相应改变
            // 歌曲拖动的时候，歌词高亮部分也相应改变
            onProgressBarChange(percent) {
                if (this.currentLyric) {
                    // currentTime：是秒形式的
                    this.currentLyric.seek(currentTime * 1000)
                }
              }
        7. 在CD封面下面会显示当前歌词这一行
            创建显示结构
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{playingLyric}}</div>
                </div>
            当歌词改变时候，给playingLyric赋值
                handleLyric({ lineNum, txt }) {
                    this.playingLyric = txt
                }
        8. 收尾
        (1)当获取不到歌词，做容错处理
                 this.currentSong.getLyric().then(lyric => {
                    ......
            })
            // 当获取不到歌词的时候，变量都清空
            .catch(() => {
              this.currentLyric = null
              this.playingLyric = ''
              this.currentLineNum = 0
            })
        ```
    + 遇到问题
        ```
        1. 当设置<audio ref="audio" :src="currentSong.url"></audio>
            并且：
            watch: {
                currentSong(newSong, oldSong) { 
                    this.$refs.audio.play()//只写这一句是会报错的
                }
            }
            报错：The play() request was interrupted by a new request
            原因：dom异常，这时候调用play时候，我们同时请求src是不可以的，这个dom还没有ready 
            解决：我们设置一个延迟
                // 设置一个延迟
                this.$nextTick(() => {
                  this.$refs.audio.play()//只写这一句是会报错的
                })
        2. 获取播放源错误
            解决：https://blog.csdn.net/a151913232/article/details/85034283
        3. 点击按钮(播放上一首)后，发现歌曲虽然跳到了下一首，但是图标并没有，图标还是处于暂停状态
        解决：在next方法下添加如下语句
            if (!this.playing) {
              this.togglePlaying()
            }
        4. 不停点击下一首那个按钮，会报问题1的错误(pre同理)
            解决：查看audio官方文档，发现audio标签会派发两个事件，一个是canplay 和 error
            (1)<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error">
            (2)所以根据这个，我们data中设置一个标志位，
                data() {
                    return {
                      songReady: false,
                      }
                  }
            (3)然后
                ready() {
                  this.songReady = true
                  this.savePlayHistory(this.currentSong)
                },
            (4)然后next
                next(){
                    if (!this.songReady) {
                        return
                    }
                    // 点击之后this.songReady = false,确保下一首歌曲准备好时 才可以点击
                    this.songReady = false
                }
            (5)容错处理:当前歌曲播放不出来的话也可以实现点击下一首的功能
                事件：
                error(){
                    this.songReady = true
                }
                样式也要体现：当 当前歌曲出错的时候，图标有一个变灰的样式
                <div class="icon i-left" :class="disableCls">
                  <i @click="pre" class="icon-prev" ></i>
                </div>
        5. 进度条的小球拖拽过程中，进度条会出现跳的情况
            原因：当拖拽过程中，有两个事件改变进度条，
                一个是拖拽事件，一个是歌曲播放事件
                所以我们要设当拖拽过程中，拖拽事件权重更大一点
            解决：if (newPercent >= 0 && !this.touch.init)
                当没有拖拽事件的时候，才设置歌曲播放改变进度条
        6. 当拖拽完之后，进度条虽然同步了，但是已播放秒数还是没有改变
            拖拽完之后，重新计算进度条的百分比，然后改变audio的currentTime,然后进一步改变秒数 
            progressTouchEnd() {
              this._triggerPercent()
            },
            _triggerPercent() {
              const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
              const percent = this.$refs.progress.clientWidth / progressBarWidth 
              this.$emit('percentChange', percent)
            },
        7. 我把歌曲暂停了之后，点击切换播放模式,会发生歌曲还是继续播放的情况
            原因：当我切换播放模式之后，因为重新计算歌曲index，也算是改变了currentSong，
            所以就会被watch监听到，就会继续播放歌曲
            解决:
            watch: {
                currentSong(newSong, oldSong) {
                    if (newSong.id === oldSong.id) {
                        currentSong.id no change currentSong no change
                        return
                    }
                    this.$nextTick(() => {
                        this.$refs.audio.play()
                      })
                    },
                }
            }
        8. 当我点击随机播放了之后，再去点击歌曲列表，就会出现，点击的歌曲和实际播放的歌曲不一样
            原因：当我点击随机播放全部了之后，此时playList列表已经变为了随机播放列表，
            原本是顺序列表的时候，playList和currentIndex确定了当前播放的歌曲，
            但是现在playList已经变为了随机播放列表，所以不能获取到正确的歌曲
        9. 当切换很多歌曲的时候，会出现高亮部分一直在跳
            原因：开启了多个计时器，没有关掉
            当监听到currentSong改变了之后，我们要关掉当前歌词的计时器
        10. 当歌曲暂停的时候歌词并没有暂停，还在继续走
            解决：
                当togglePlaying的时候，将歌词也暂停
                if (this.currentLyric) { 
                    this.currentLyric.togglePlay()
                }
        11. 循环播放的时候，歌曲播放完了，歌词并没有回到最开始
            解决： 
                loop() {
                  if (this.currentLyric) {
                    // 将歌词偏移到最开始
                    this.currentLyric.seek(0) // <audio>, song jump to begin
                  }
                },
        12. 当只获取到一首歌的时候index = 0，我们点击next时候，下面这行语句执行
            let index = this.currentIndex + 1       //index = 1
            if (index === this.playlist.length) {
              index = 0                             //index = 0
            }
            也就是index的值并没有变，所以，watch监听到的currentSong也没变，也就是往后的语句都不会执行
            解决：在next()和prev()上加个逻辑判断，当只获取到一首歌的时候，调用loop函数，转为单曲循环模式
        13. 当程序在微信端运行的时候，js是不执行的，所以audio只会把当前歌曲播放完，之后就不执行了
            // 不用$nextTick，而是用setTimeout，这样就保证了我们微信从后台切到前台的时候，我们的歌曲又可以重新播放了
            setTimeout(() => {
                this.$refs.audio.play()//只写这一句是会报错的，因为调用play时候，我们同时请求src是不可以的，这个dom还没有ready
                this.getLyric()
              }, 1000)
        14. 问题·：底部mini播放器会占据正常播放列表页面最后一行
                    就比如说，薛之谦所有音乐，最后一个是"演员"，
                    整个mini播放器就会把演员列表那一行遮挡
              解决：将解决问题的逻辑封装成一个单独的文件src/common/js/mixin.js
                    关于mixin：https://www.jianshu.com/p/f34863f2eb6d
            思路：当playlist中有数据的时候，就将滚动组件的bottom设置为60px
            实现三部曲：
                先引入：import { playlistMixin } from 'common/js/mixin'
                再注册：export default {
                            mixins: [playlistMixin],
                        }
                实现handlePlaylist方法
            具体实现见：
                src/common/js/mixin.js
                src/components/music-list
                src/components/singer
                src/base/listview
                src/components/recommend
        ```
20. 歌单详情页src/components/disc.vue(类似歌手详情页)
    + 这是一个二级路由，定义在router/index.js的recommend的children中，然后在recommend.vue中引入路由组件router-view
    + 点击歌单路由跳转：src/components/recommend.vue
        ```
        1. 点击li触发@click="selectItem(item)" selectItem(item)
        2. // 点击li，带参数的路由跳转
            selectItem(item) {
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                })
            }
        ```
    + 歌单部分数据的存放和获取
        ```
        1. 在vuex中的state，mutations，mutations-type中都设置有关歌单的变量
        2. src/components/recommend.vue中
            引入mutations
                在src/components/recommend.vue中利用this.setDisc(item)将vuex中的disc值设置为当前点击的li
                然后利用getters得到
           src/components/disc.vue中
            引入getters
                从vuex中获取当前歌单的标题，背景图等，传入到music-list组件中
        ```
    + 从qq音乐抓取每个歌单全部歌曲
        ```
        1. 在build/webpack.dev.conf.js中配置获取所有歌曲的接口，更改referer和host
        2. 在src/api/recommend.js中定义获取全部歌曲的方法getSongList，调用接口/api/getSongList
        2. 在src/components/disc.vue中使用该方法
            getSongList(this.disc.dissid).then(res => {
                if (res.code === ERR_OK) {
                  this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                }
              })
        3. 获取到songs之后，将songs传入到子组件music-list
        ```
    + 小问题：
        ```
        当刷新了之后，暂时获取不到数据，不能一直在这个页面等着，所以设置跳转到父组件
        _getSongList() {
            if (!this.disc.dissid) {
                this.$router.push('/recommend')
                return
            }
        },
        ```
21. 所有排行榜页面src/components/rank/rank.vue
    + 抓取数据src/api/rank.js(rank.vue中有具体实现，一看应该就能懂)
    + 在页面内获取数据并使用(rank.vue中有具体实现，一看应该就能懂)
    + 设置组件可以滚动(rank.vue中有具体实现，一看应该就能懂)
        ```
        需要把数据传递给scroll，当数据全部存在时候，才能正确判断可滑动部分的高度
        ```
    + 数据未加载时候，显示一个转圈圈的图标loading
    + 当底部有mini播放器占位的时候，需要处理底部高度：使用mixin.js
        ```
        ```
22. 对于数据获取的总结：
    + json
        ```
        如果获取数据的接口要求传入的的参数中format:json,那么就用axios配合更改referer和host的方式
        先在webpack.dev.conf.js中
            定义接口改变referer和host，
            并且 获取来自 请求这个接口时 传过来的数据，
            然后再从qq音乐上获取数据
            由src/api/....js文件中的方法取得最终获取的数据
        ```
    + jsonp
        ```
        直接在src/api下的js文件中定义获取数据方法
        然后通过jsonp将所有请求数据连在一起 并请求网页
        然后src/api/js文件中的方法 中得到jsonp取得的数据
        ```
    + 使用，如果需要获取播放源的，需要先引入获取vkey的函数，在获取歌曲
23. 排行榜详情页面src/components/top-list.vue(和disc.vue很像很像)
    + 路由
        ```
        1. 编写路由：
            是一个二级路由，在route.js中的rank下面定义
            children: [
              {
              // 以id为变量，可以传入不同的id值，然后去渲染不同的歌手详情页
              path: ':id',
              component: TopList,
              }
            ]
        2. 跳转路由src/components/rank/rank.vue
            给遍历排行榜的li添加点击事件@click="selectItem(item)"
            selectItem(item) {
              this.$router.push({
                path: `/rank/${item.id}`
              })
              this.setTopList(item)
            },
        3. 添加<router-view></router-view>
        ```
    + 关于排行榜内的所有歌曲数据
        ```
        1. 在src/api/rank.js中获取数据
        2. src/components/top-list下使用数据
        ```
    + 将获取的song传进music-list，然后设置没有数据时候(this.$route.push)默认返回上一级父元素
    + 设置榜单样式src/base/song-list.vue
        ```
        1. 设置变量，默认rank为false，代表默认没有排行的样式
            props: {
                rank: {
                  type: Boolean,
                  default: false
                }
            }
        2. 设置事件改变样式，当排行在前三名时显示图片，往后显示数字
        3. 因为是top-list引入music-list，然后music-list中引用song-list，所以由top-list传入rank的值，覆盖默认值
        ```
24. 搜索页面src/components/search.vue
    + 搜索框组件src/base/search-box.vue(在src/components/search.vue中引用)
        ```
        1. 默认搜索框中的内容是"搜索歌曲、歌手",但是可以更改，所以在src/base/search-box.vue设置
                <input ref="query" class="box" :placeholder="placeholder"/>
                props: {
                    placeholder: {
                      type: String,
                      default: '搜索歌曲、歌手'
                    }
                },
        2. 获取来自搜索框中输入的内容
            <input ref="query" class="box" :placeholder="placeholder" v-model="query"/>
            data() {
                // 获取来自输入搜索框中的内容，利用双线绑定v-model
                return {
                  query: ''
                }
            },
        3. 通过是否输入内容，控制输入框后面的"×"图标是否显示，当输入内容不为空的时候才显示
            <i class="icon-dismiss" v-show="query"></i>
        4. 点击×图标的时候，输入框中的内容为空
            <i class="icon-dismiss" v-show="query" @click="clear"></i>
            clear() {
              this.query = ''
            },
        5. 监听query的改变，传递给父元素
            created() {
                // 这种写法和直接在下面写watch差不多
                this.$watch(
                  'query',
                  debounce(newQuery => {
                    this.$emit('query', newQuery)
                  }, 200)
                )
            },
        ```
    + 热门搜索
        ```
        1. 数据：
            获取数据：因为不是jsonp方式，见22标题
            使用数据，在src/components/search.vue中调用方法getHotKey
                1). 引入import { getHotKey } from 'api/search'
                2). 在created时调用
                    created() {
                        this._getHotKey()
                    },
                3). this._getHotKey
                    _getHotKey() {
                      getHotKey().then(res => {
                        if (res.code === ERR_OK) {
                          this.hotKey = res.data.hotkey.slice(0, 10)
                        }
                      })
                    }
                4). 将hotkey数据填入到dom结构                  中
                    <li class="item" v-for="(item,index) in hotKey" :key="index">
                        <span>{{item.k}}</span>
                    </li>
        2. 逻辑
            点击热门搜索的数据，可以自动将数据填充到搜索框中
                在src/base/search-box中设置改变query的方法
                在父组件src/components/search中，
                    //query为 当前点击的 热门搜索中的内容
                this.$refs.searchBox.setQuery(query)
            当搜索框中有关键词的时候，应该显示一个搜索结果的列表见src/components/suggest.vue
        ```
    + 搜索组件(当点击搜索框中内容不为空的时候，显示搜索列表)
    src/components/suggest.vue
        ```
        1. 获取数据
            (1)search: 用于获取数据
            (2)_genResult:将获取到的数据格式化，得到我们想要的格式
                如果根据检索词返回数据中zhida的值不为空，那么说明检索到了包含检索词的歌手
                将zhida中的内容加上type:singer键值对形成一个新的对象加入到ret中
                再将所有和检索词有关的歌曲放入到ret中
        2. 遍历数据
             <li class="suggest-item" v-for="(item,index) in result" :key="index">
        3. 设置样式，因为歌手和歌曲显示的图标和文字都是不一样的
            <div class="icon">
                <!-- 图标是动态的，也就是歌手和歌曲显示的图标是不一样的-->
              <i :class="getIconCls(item)"></i>
            </div>
            <div class="name">
                <!-- 歌手与歌曲显示的数据也是不一样的 -->
              <p class="text" v-html="getDisplayName(item)"></p>
            </div>
        4. 总体思路：
            在src/components/search.vue中引入组件
                src/base/SearchBox：负责搜索框的内容
                src/components/Suggest：  负责根据搜索框中内容的查找相关歌曲或者歌手
            逻辑：在searchbox组件中，监听搜索框中内改变，然后将改变的值传递给父组件search组件
                父组件接受事件，并将query的值传递给子组件suggest.vue
                suggest.vue子组件监听到query的改变，调用search方法从qq音乐福端请求数据
        5. 优化：将根据检索词返回的数据中的res.data.song.list格式化
           利用common/js/song.js中的createSong处理
                this._normalizeSongs(data.song.list)：
                _normalizeSongs(list) { // filter
                  const ret = []
                  list.forEach(musicData => {
                    if (musicData.songid && musicData.albummid) {
                      ret.push(createSong(musicData))
                    }
                  })
                  return ret
                },
        6. 搜索列表实现滚动功能
            引入scroll组件
        7. 上拉刷新功能(扩展scroll组件)（视频：10-5:17:30）
            (1)
               src/base/scroll.vue
               props: {
                    // 是否开启上拉刷新功能，默认是false
                    pullup: {
                      type: Boolean,
                      default: false
                    },
                }
            (2)
                在scroll组件初始化的时候，判断是否开启了上拉刷新该功能
                如果开启了，监听scrollEnd事件，就是当停止滚动的时候派发一个scrollEnd事件
                如果此时滚动到了底部，那就向父组件派发一个事件，代表父元素可以进行上拉刷新功能了
                    if (this.pullup) { // pullup: drop-down refresh
                            // scrollEnd:停止滚动了
                            // scrollToEnd:滚动到底部了
                        this.scroll.on('scrollEnd', () => {
                            //当满足这个条件的时候，表示当前已经滚动到底部了
                          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd') 
                          }
                        })
                  }
             (3)
              当滚动到底部，scroll向父组件派发事件，父组件接收事件，并触发searchMore方法
              <scroll :pullup="pullup" @scrol`lToEnd="searchMore">
              //上拉刷新
              searchMore() {
                  // 如果此时数据已经加载完了，就不能实现上拉刷新的功能了
                  // _checkMore来检测是否数据都请求完毕，也就是是否改变hasMore
                  if (!this.hasMore) {
                    return
                  }
                  this.page++
                    // 刷新一次，page++,再请求page对应页数的数据
                  search(this.query, this.page, this.showSinger, perpage).then(res => {
                    if (res.code === ERR_OK) {
                      this.result = this.result.concat(this._genResult(res.data))
                      this._checkMore(res.data)
                    }
                  })
                },
            (4)当刷新时候显示转圈圈的样式，
                引入loading组件：import Loading from 'base/loading/loading'
                loading显示的条件是hasmore为true
                改变hasMore的条件是
                if(!song.list.length || song.curnum + (song.curpage) * perpage > song.totalnum){
                    this.hasMore = false
                }
            (5)当滑动到页面底部的时候，scroll给父组件传递事件
                父组件调用searchMore方法处理获取下一页的数据
                也就是请求数据时候，将page++传递过去
                每次请求，获取数据之后都判断一下是否数据都请求完毕:_checkMore(){}
            (6)优化
                search() {
                    // query改变的时候，第一次调用search，page都要从第一个开始
                    this.page = 1
                    // query改变的时候，第一次调用search，都要滚动到底部
                    this.$refs.suggest.scrollTo(0, 0)
                }
        8. 点击搜索到的内容，跳转相应页面
            (1)对搜索列表中歌手的点击：
                设置路由：当搜索内容含有歌手的时候，跳转路由，跳到歌手详情页
                当点击click搜索列表的时候，绑定selectItem事件
                如果点击的是歌手，那么跳转路由，并且设置vuex中singer的值改变
                 if (item.type === TYPE_SINGER) {
                    this.$router.push({
                      path: `/search/${singer.id}`
                    })
                    //调用mutations改变vuex中state中的值
                    //...mapMutations({
                    //  setSinger: 'SET_SINGER'
                    //}),
                    this.setSinger(singer)
                }
            (2)对搜索列表中歌曲的点击：
                如果点击歌曲，state中的playlist和sequencelist和currentIndex这三个变量都要改变
                else{
                    this.insertSong(item)
                }
                所以我们要在action中进行一个封装，见src/store/action.js的insertSong
                注意，点击歌曲要：
                    1. 歌曲播放
                    2. playlist和sequenceList中要添加歌曲
                        还要判断之前有没有这首歌，如果有
                        还要判断这首歌在currentSong的前面还是后面，以便调用不用的删除方
                        只保留当前新添加的歌曲(位置)
            (3)出现问题：报什么do not mutate vuex store state outside mutations......
            原因：在actions中
                let playlist = state.playlist
                后来直接操作playlist是不行
            解决：let playlist = state.playlist.slice()
            currentIndex就不会报这个错，因为基本数据类型是值传递
        9. 优化： 
            (1)当搜索列表为空的时候，显示相应的组件src/base/no-result.vue
            (2)每输入一个字符都会派发一个事件，但是我们不想派发这么频繁，所以在src/base/search-box中进行更改
            (3)移动端，输入搜索内容的时候，会调起键盘，当搜索结束后不会收起键盘
                逻辑：监听到滚动事件，input失去焦点，键盘收起
                由scroll.vue组件在滚动前(beforeScroll)派发事件
                由suggest.vue组件接受来自scroll组件的事件，并传递给父组件search
                由search接收来自suggest组件的事件，并调用search-box中的事件来使search-box中的搜索框失去焦点，
        10. 最大的问题：
            因为getmusic获取vkey需要时间，在没有获到数据的时候，是拿不到返回的歌曲列表的
            所以在ret.concat(this._normalizeSongs(dta.song.list))是拿不到数据的，就没办法渲染
            解决：将ret传进去，把之前返回值的初始值(我设置的是[]),直接设置成ret而不是[]
        ```
    + 搜索历史
        ```
        1. 数据的存取因为很多地方都用到了搜索历史，所以我们将他保存到全局的vuex中
            state,mutation-type, mutations
        2. 在suggest中点击搜索；列表，派发事件(因为每个组件都实现特定的功能，实现功能分离)
        3. 要将结果缓存到localStorage中，所以封装一个单独的js文件src/common/js/cache.js，专门操作localStorage
            需要安装插件good-storage操作localStorage，用法见：https://github.com/ustbhuangyi/storage
            因为localStroage存储数据格式什么的很麻烦，这个插件封装了一下，操作简单
            具体见src/common/js/cache.js的saveSearch方法
            saveSearch
                将搜索历史列表存入到localStorage
                将搜索历史列表返回给vuex
            在我们刷新页面之后，搜索历史就不见了
            因为我们在vuex中state最初设置searchHistory为[]，所以搜索历史刷新之后就不见了，
            解决：searchHistory最初就从localStorage中拿，具体见src/common/js/cache.js的loadSearch方法和store/state.js
        4. 总逻辑：当点击搜索列表的时候，suggest向父组件search传递当前被点击元素item
                调用actions，将query加入到搜索历史中
                由actions调用commit方法将的新的数组提交给mutations，
                mutations将最终的数组存到vuex中
        5. 将vuex中的搜索历史 数据渲染到dom上
            取数据：mapGetters
            引用组件 search-list
            因为很多地方都要用显示列表的组件，所以单独封装一个组件src/base/search-list
            当需要显示列表的时候，引入并将列表数据传给组件，就可以了
        6. 当点击搜索历史中的数据的时候，要进行搜索
            在search-list组件中，绑定点击事件，向父元素search传当前点击的item
            父组件search接受子组件search-list传来的事件，并且触发addQuery事件，完成逻辑
        7. 当点击搜索历史中数据后面的×的时候，将该条历史删除，或者点击垃圾桶，清空历史
            和存储搜索历史差不多
            点击×：  
                由search-list派发事件给父组件search
                由search处理事件，调用actions中的deleteSearchHistory方法
                在actions封装方法deleteSearchHistory
                deleteSearchHistory方法中调用cache.js中的deleteSearch方法
                经过deleteSearch后，将处理过的数组重新赋给vuex state中的searchHistory
            点击垃圾桶图标：
                点击时，触发事件actions中的clearSearchHistory方法
                在actions封装方法clearSearchHistory
                clearSearchHistory方法中调用cache.js中的clearSearch方法
                经过clearSearch后，将处理过的数组重新赋给vuex state中的searchHistory   
        8. 优化：点击垃圾桶时候，有一个弹出的框提醒用户是否全部删除
            (1)弹框组件：src/base/confirm
                当点击清空按钮的时候，触发的不是清空历史的操作了，是显示弹窗的操作
                然后当点击弹窗中的确定或者取消的时候，confirm会触发响应的事件
                事件中定义：弹窗的隐藏，和向父组件传递当前点击的是确定还是取消操作
            (2)当搜索历史有点多的时候，设置滚动事件
                给热门搜索和搜索历史加上滚动事件
                因为它们两个是两个div，所以我们应该在最外层添加一个div
                否则scroll默认是第一个div添加滚动事件，
                还有就是数据的问题，我们不能只监听一个div数据的改变，所以设置计算属性
                shortcut()
                    {
                        return this.hotKey.concat(this.searchHistory)
                    }
                问题：当已经搜索歌曲 高度在屏幕大小的边缘的时候，再添加一首的话不出现滚动情况
                因为什么这个时候，dom是在搜索结果页面，而不是在search页面
                所以要加一个逻辑，在search中watch  query的改变，
                    因为在组件切换的过程中，query有一个从有到无的状态，
                    所以如果newquery为空的话，手动刷新scroll
            (3)当歌曲播放的时候，也就是最下方的mini播放器显示的时候，要重新计算搜索列表的高度
                mixin配合handlePlaylist
                见search组件
        ```

25. 歌曲列表组件src/components/playlist.vue，就是一般在右下角那个歌曲列表那个
    + 在src/components/player.vue中引入
    + 交互逻辑：
        ```
        1. 显示和隐藏
            <div class="playlist" v-show="showFlag">
            showFlag默认是false，可以通过shiw和hide这两个方法进行改变
                show() {
                  this.showFlag = true
                },
                hide() {
                  this.showFlag = false
                },
            显示：点击歌曲列表按钮(src/components/player.vue的control)时触发方法show()
            隐藏：点击歌曲列表蒙层(.playlist)的时候，或者点击关闭(.list-close)的时候
                在playlist.vue中的蒙层部分和关闭部分绑定事件，点击就触发hide方法
                补充：因为蒙层代表的是整个playlist组件，我们要是点击弹出框内容的时候，也会造成playlist组件消失
                所以在.list-wrapper上添加阻止默认事件@click.stop
        2. 数据：
            vuex中导出sequenceList，在dom中遍历
            当数据很多的时候，要实现滚动效果，引入scroll组件
            保证获取到所有数据正确的高度，scroll才能正常滚动：当调用show方法的时候，延迟20秒获取数据
                show() {
                  this.showFlag = true
                  // 当点击按钮显示组件的时候，要延迟20秒之后刷新一下scroll，因为这样才能正确的到数据的高度，才能确保滚动
                  setTimeout(() => {
                    this.$refs.listContent.refresh()
                  }, 20)
        3. 当前歌曲样式
            遍历的歌曲中如果某一首歌曲和vuex中currentSong匹配上的话，那么这首歌曲设置特殊样式
            click:
                getCurrentIcon(item) {
                  if (this.currentSong.id === item.id) {
                    return 'icon-play'
                  }
                  return ''
                },
        4. 切歌
            如果点击歌曲列表中的某首歌，那么当前播放歌曲要改变，，并且设置歌曲状态改变为true
            selectItem(item, index) {
              // 当前遍历的是sequenceList，然而如果是随机模式的话，playList中是被打乱的数组
              // 那么只能通过找到索引，因为歌曲的播放是依赖于数组和索引的，然后通过playList[index]找到歌曲
              if (this.mode === playMode.random) {
                index = this.playlist.findIndex(song => {
                  return song.id === item.id
                })
              }
              this.setCurrentIndex(index)
              // 点击完歌曲，同时设置歌曲状态为true
              this.setPlayingState(true)
            },
        5. 当点击歌曲列表的某一首歌之后，也要实现滚动效果，并且，当前播放的歌曲始终在列表的顶部显示
            当监听到当前播放歌曲改变的时候或者当显示这个playlist组件的时候，触发scrollToCurrent事件
             scrollToCurrent(current) {
              // 找到当前播放歌曲对应在sequenceList中的位置
              const index = this.sequenceList.findIndex(song => {
                return current.id === song.id
              }) 
              // 跳到指定位置
              // this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
              this.$refs.listContent.scrollToElement(this.$refs.listItem[index])
            },
            watch: {
                currentSong(newSong, oldSong) {
                  if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                  }
                  // setTimeout(() => {
                    this.scrollToCurrent(newSong)
                  // }, 20)
                }
              }
        6. 点击×的时候，将这首从当前播放列表中删除
            点击按钮，触发deleteOne事件
            deleteOne调用actions中的deleteSong事件
            delteSong：删除playlist，sequenceList中的歌曲，重新计算currentIndex
            出现问题，当删掉歌曲列表唯一的一首歌时候，报错，
            因为歌曲改变会触发player的watch
            watch中：
                newSong根本没有，所以newSong != oldsong 所以所有逻辑都会执行，所以我们应该当newSong没有的时候，直接返回
            动画：
                将ul替换为transition-group
        7. 点击垃圾桶图标，删除播放列表所有歌曲
            playlist组件：，
                使用actions中封装好的方法deleteSongList
                引用confirm组件
                注意：要将confirm的点击事件阻止冒泡
        8. 在player和playlist组件中有很多相同的逻辑，所以将相同的逻辑放在mixin中，实现复用
            在player和playlist组件中引入mixin
                import { playerMixin } from 'common/js/mixin'
                mixins: [playerMixin]
            然后在提取组件的过程中，在mixin中该引入引入，该配置配置，最后大功告成   
        ```
26. 添加歌曲列表页面src/components/add-song
    + 控制组件的显示或者隐藏
        ```
        1. 设置v-show="showflag"
            showFlag默认是false
            show和hide可以实现改变showflag的值，控制组件隐藏
            在playlist组件中点击"添加歌曲......"按钮，触发add-song中的show方法
            addSong() {
              this.$refs.addSong.show()
            }
            show(){

            }
        ```
    + 搜索歌曲
        ```
        引用search-box，suggest
        设置query(搜索框中的关键词)
        还可以利用query设置最近播放/搜索历史的显示与隐藏
        注意suggest中是将歌手一起搜索到的，但是我们这里不需要搜索歌手
            设置变量showSinger(false)并传递给子组件：   suggest组件，
            <suggest :query="query" :showSinger="showSinger"></suggest>
        因为这里很多功能很search组件都是I重复的，所以我们定义在mixin中，然后又是一顿大整改，然后就没有然后了
        ```
    + 最近播放和搜索历史(src/base/switches)
        ```
        1. 切换和样式的改变：
            (1)由currentIndex控制哪个部分高亮(最近播放/搜索历史)
                默认是0，代表最近播放，当点击：最近播放/搜索历史，任何一部分的话，都会给父组件add-song派发事件，参数为index
                由父组件监听事件，改变currentIndex，传入子组件，进而改变哪部分高亮
        ```
    + 最近播放和搜索历史列表：(src/components/add-list)
        ```
        1. 最近播放部分：
            (1)player中，audio标签在歌曲准备好的时候就会派发一个ready事件
                在ready方法中,利用mapActions将当前歌曲加入到最近播放
                this.savePlayHistory(this.currentSong)
                mapActions：调用cache.js中的方法将数据存到localStorage中或者从本地取
            (2)拿到数据之后渲染
                1)数据利用mapgetters从vuex中取
                2)组件可滚动：scroll
                3)数据渲染：song-list组件
        2. 搜索历史：复用search-list
            search-list中很多方法和数据都在mixin共享中都
        ```
    + 优化
        ```
        1. 删除搜索历史的时候添加动画效果src/base/search-list
            transition-group
        2. 有时最近播放是不能滚动的src/components/add-song
            原因：因为scroll没有正确计算高度
            解决：每次add-song调用show()的时候，都重新计算高度
        3. 还是发现歌曲列表高度不对
            原因：监听到数据改变，需要100ms刷新数据，20ms不够
            解决：改变scroll组件中的刷新的时间，之前是20，是个定值
                    我们这里改为变量，变量的值默认是20ms，但是可以更改
            然后在playlist组件中传入值refreshDelay: 120，改变playlist
            同理 search和add-Song中要改变刷新时间
            因为这两个组件都用到了mixin，所以I在mixin中设置refreshDelay的值就可以了
            这个refreshDelay目的就是保证在这个时间内去refresh，我们的高度已经计算出来了
        ```
    + 当添加歌曲到歌曲列表的时候，有一个提示框src/base/top-tips
        ```
        1. 显示和隐藏，参见add-song的显示和隐藏，一样一样的
        2. 当点击最近播放中的歌曲，或者搜索结果中歌曲都能触发show方法显示toptip组件
        3. 几秒自动关闭,或者点击直接隐藏
            this.timer = setTimeout(() => {
                this.hide()
            }, 2000)
        ```
    + 突然想起来：有一个函数节流的思想，但是！！ 我忘记在哪用过了，应该是搜索部分，就是以最后一次输入为准
