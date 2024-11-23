<template>
    <header class="header" >
        <div class="container between">
            <div class="header__left" >
                <nuxt-link to="/" class="logo">猫哥影视</nuxt-link>
                <nav class="hidden-sm-and-down">
                    <ul >
                        <!-- <li :class="route.path === '/' ? 'active' : ''">
                            <NuxtLink to="/">首页</NuxtLink>
                        </li> -->
                        <li :class="(route.path === '/' && item.id == 0)||item.id == route.params.column ? 'active' : ''" v-for="(item,index) in ng.data.index_top_nav" :key="item.id" >
                            <nuxt-link :to="`/`"  v-if="item.id==0">{{ item.name }}</nuxt-link>
                            <nuxt-link :to="`/column/${item.id}`" v-else>{{ item.name }}</nuxt-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="header__right items-center">
                <el-input class="w-50 m-2 mr-20" placeholder="请输入搜索的影视名" :suffix-icon="ElIconSearch"
                    v-model="searchValue" @keyup.enter="handleSearch" />
                <ClientOnly>
                    <template v-if="token">
                        <el-dropdown @command="handleCommand">
                            <el-button circle :icon="ElIconUserFilled" color="#155FAA"></el-button>
                            <!-- <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="user">个人中心</el-dropdown-item>
                                    <el-dropdown-item divided command="logOut">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </template> -->
                        </el-dropdown>
                    </template>
                    <template v-else>
                        <el-button circle :icon="ElIconUserFilled" @click="goLogin"></el-button>
                    </template>
                </ClientOnly>
            </div>
        </div>
        <div class="mobile-nav hidden-sm-only hidden-sm-and-up"   v-if="route.path.indexOf('/video')===-1">
            <ul>
                <<li :class="(route.path === '/' && item.id == 0)||item.id == route.params.column ? 'active' : ''" v-for="(item,index) in ng.data.index_top_nav" :key="item.id" >
                            <nuxt-link :to="`/`"  v-if="item.id==0">{{ item.name }}</nuxt-link>
                            <nuxt-link :to="`/column/${item.id}`" v-else>{{ item.name }}</nuxt-link>
                        </li>
            </ul>
        </div>
    </header>
    <div class="header__height__placeholder"></div>
</template>

<script setup lang="ts">
const route = useRoute()
const selectid = ref(0);

const searchValue = ref<string>('')
const token = ref<string | undefined>(undefined)

function handleCommand(command: string) {
    switch (command) {
        case 'logOut':
            logOut()
            break;
        default:
            navigateTo('/user')
            break;
    }
}

function logOut() { }

function goLogin() { }

function handleSearch() {
    navigateTo('/search?keyword=' + searchValue.value)
}

// 请求获取栏目数据接口
// http://api.yinchunyu.com/swagger-ui#/焦点图管理/ColumnController_all

import { get_sign,get_pack,get_timestamp } from '~/utils/globalMethods';
const timestamp = get_timestamp();
let params = {"timestamp":timestamp};
const pack = get_pack(JSON.stringify(params));
const sign = get_sign(pack);
// console.log('pack:',pack,'sign:',sign);
// const ng = ref({"msg":"获取成功","data":{"index_top_nav":[{"id":0,"name":"推荐"},{"id":1,"name":"电影"},{"id":2,"name":"剧集"},{"id":3,"name":"综艺"},{"id":4,"name":"动漫"},{"id":36,"name":"爽剧"}],"movie_screen":{"filter":[{"id":1,"name":"电影","class":["类型","Netflix","剧情","科幻","动作","喜剧","爱情","冒险","儿童","歌舞","音乐","奇幻","动画","恐怖","惊悚","战争","传记","纪录","犯罪","悬疑","西部","灾难","古装","武侠","家庭","短片","校园","文艺","运动","青春","同性","励志","历史"],"area":["地区","大陆","香港","台湾","美国","日本","韩国","英国","法国","德国","印度","泰国","丹麦","瑞典","巴西","加拿大","俄罗斯","意大利","比利时","爱尔兰","西班牙","澳大利亚","其它"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]},{"id":2,"name":"剧集","class":["类型","Netflix","欧美","短剧","古装","武侠","励志","家庭","剧情","喜剧","战争","科幻","惊悚","恐怖","悬疑","犯罪","动作","冒险","历史","同性"],"area":["地区","大陆","香港","韩国","美国","日本","法国","英国","德国","台湾","泰国","印度","其他"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]},{"id":3,"name":"综艺","class":["类型","Netflix","脱口秀","真人秀","选秀","八卦","访谈","情感","生活","晚会","搞笑","音乐","时尚","游戏","少儿","体育","纪实","科教","曲艺","歌舞","财经","汽车","播报"],"area":["地区","大陆","韩国","香港","台湾","美国","其它"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]},{"id":4,"name":"动漫","class":["类型","Netflix","欧美","国产","热血","科幻","美少女","魔幻","经典","励志","少儿","冒险","搞笑","推理","恋爱","治愈","幻想","校园","动物","机战","亲子","儿歌","运动","悬疑","怪物","战争","益智","青春","童话","竞技","动作","社会","友情"],"area":["地区","大陆","日本","欧美","其它"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]},{"id":36,"name":"爽剧","class":["类型","古代","现代","穿越","玄幻","霸总","英雄救美","未婚妻","师姐","绝美","逆袭","美女","爱情","甜宠","虐恋","爽剧","搞笑","情感","动漫","萌宝","都市","言情","重生","乡村","神医","幻想","反转","复仇","修仙","古装","男频"],"area":["地区","大陆","香港","韩国","美国","日本","法国","英国","德国","台湾","泰国","印度","其他"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]},{"id":26,"name":"福利","class":["类型","剧情","科幻","情色","动作","喜剧","爱情","冒险","奇幻","动画","恐怖","惊悚","战争","伦理","纪录","犯罪","悬疑","同性","灾难","家庭","短片","校园","青春"],"area":["地区","大陆","香港","台湾","美国","日本","韩国","英国","法国","德国","印度","泰国","丹麦","瑞典","巴西","加拿大","俄罗斯","意大利","比利时","爱尔兰","西班牙","澳大利亚","菲律宾","其它"],"year":["年份","2024","2023","2022","2021","2020","10年代","00年代","90年代","80年代","更早"]}],"sort":[{"name":"综合","value":"by_default"},{"name":"最新","value":"by_time"},{"name":"最热","value":"by_hits"},{"name":"评分","value":"by_score"}]},"movie_search_screen":{"res_type":[{"name":"按影片名称","value":"by_movie_name"},{"name":"按演员姓名","value":"by_actor_name"}],"type":[{"id":0,"name":"类型"},{"id":1,"name":"电影"},{"id":2,"name":"剧集"},{"id":3,"name":"综艺"},{"id":4,"name":"动漫"},{"id":36,"name":"爽剧"},{"id":26,"name":"福利"}],"sort":[{"name":"综合","value":"by_default"},{"name":"最新","value":"by_time"},{"name":"最热","value":"by_hits"},{"name":"评分","value":"by_score"}]},"new_notice":"12","feedback":[{"name":"播放问题","value":1000},{"name":"集数不全","value":1001},{"name":"资源缺失","value":1002},{"name":"信息有误","value":1003},{"name":"积分兑换","value":1004},{"name":"BUG反馈","value":1005}],"about":[{"text":"TG交流群","link":"https://t.me/+FHSplxcimaoyMzA1"},{"text":"反馈邮箱","link":"dianyinglieshou@gmail.com"},{"text":"官网下载","link":"https://dyls.site/"}],"start_countdown":3}});
const runtimeConfig = useRuntimeConfig();
const ng = ref(runtimeConfig.public.navigation);
// const { data: ng } = await configRequest<{ data: any }>('app/config', {
//     query: { pack: pack,signature:sign }
// });
// console.log('netNg:',ng);

const navigation = ref({
  "data": [
    {
      "createTime": "2023-03-09T19:23:10.107Z",
      "updateTime": "2023-04-21T04:27:09.000Z",
      "createBy": "admin",
      "updateBy": "admin",
      "remark": "",
      "id": 1,
      "name": "电影",
      "type": "1",
      "value": "movie",
      "order": 1,
      "status": "0"
    },
    {
      "createTime": "2023-03-09T19:23:25.987Z",
      "updateTime": "2023-03-09T19:23:25.987Z",
      "createBy": "admin",
      "updateBy": "admin",
      "remark": "",
      "id": 2,
      "name": "电视剧",
      "type": "1",
      "value": "tv",
      "order": 2,
      "status": "0"
    },
    {
      "createTime": "2023-03-09T19:26:01.304Z",
      "updateTime": "2023-03-09T19:26:01.304Z",
      "createBy": "admin",
      "updateBy": "admin",
      "remark": "",
      "id": 4,
      "name": "动漫",
      "type": "1",
      "value": "cartoon",
      "order": 3,
      "status": "0"
    },
    {
      "createTime": "2023-03-09T19:26:13.648Z",
      "updateTime": "2023-03-09T19:26:13.648Z",
      "createBy": "admin",
      "updateBy": "admin",
      "remark": "",
      "id": 5,
      "name": "综艺",
      "type": "1",
      "value": "variety",
      "order": 4,
      "status": "0"
    }
  ]
})

</script>


<style lang="scss">
.header {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 55px;
    background-color: #292838;

    &__left {
        display: flex;

        .logo {
            display: flex;
            width: 150px;
            height: 55px;
            line-height: 55px;
            font-size: 24px;
            color: #FF9900;
            font-weight: bold;
            background-position: 50% 50% !important;
            background-size: cover !important;
            overflow: hidden;
        }

        nav {
            ul {
                display: flex;

                li {
                    a {
                        display: inline-block;
                        height: 55px;
                        line-height: 55px;
                        font-size: 15px;
                        padding: 0 20px;
                        color: #fff;
                    }

                    &.active {
                        a {
                            background-color: #155FAA;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }

    &__height__placeholder {
        height: 55px;
    }
}


@media only screen and (max-width:991px) {
    .header {
        position: relative;

        .mobile-nav {
            border-top: #666 solid 1px;
            background: #292838;
            position: absolute;
            height: 46px;
            bottom: -46px;
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            box-sizing: border-box;
            padding-top: 8px;
            z-index: 9;

            &::-webkit-scrollbar {
                display: none;
            }

            ul {
                white-space: nowrap;

                li {
                    display: inline-block;
                    position: relative;

                    &.active {
                        a {
                            color: #1583f3;
                        }
                    }

                    a {
                        display: inline-block;
                        padding: 5px 19px;
                        color: #ffffff;
                        font-size: 16px;
                    }
                }
            }
        }
    }

    .header__height__placeholder {
        height: 46px;
    }
}
</style>
