<template>
    <div class="container mt-20 show">

        <Head>
            <Title>{{ title }}</Title>
            <!-- <Meta name="description" :content="`最新最全的${title}${info.data.name}尽在淳渔影视。`" /> -->
        </Head>
        
        <el-row :gutter="40">
            <el-col :span="18" :xs="24">
                <!-- <div class="panel_hd between items-center">
                    <div class="panel_hd__left">
                        <h3 class="title items-center">
                            <el-icon>
                                <ElIconVideoCamera />
                            </el-icon><a href="/">筛选</a>
                        </h3>
                    </div>
                </div> -->
                <el-form>
                    <el-form-item label="类型">
                        <ul class="show__type-filter"
                            v-for="v in navigation.data.movie_screen.filter.filter(item => item.id == route.params.column)">
                            <!-- <li :class="route.query.c === '' || route.query.c === undefined ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path, query: { ...route.query, c: '' } }">全部</nuxt-link>
                            </li> -->
                            <li @click="class_index = item" v-for="(item, index) in v.class"
                                :class="class_index === item ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path }">{{
                                    item.replace("类型", '全部')
                                    }}</nuxt-link>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="地区">
                        <ul class="show__type-filter"
                            v-for="v in navigation.data.movie_screen.filter.filter(item => item.id == route.params.column)">
                            <!-- <li :class="route.query.c === '' || route.query.c === undefined ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path, query: { ...route.query, c: '' } }">全部</nuxt-link>
                            </li> -->
                            <li @click="area_index = item" v-for="(item, index) in v.area"
                                :class="area_index === item ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path }">{{
                                    item.replace("地区", '全部')
                                    }}</nuxt-link>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="年份">
                        <ul class="show__type-filter"
                            v-for="v in navigation.data.movie_screen.filter.filter(item => item.id == route.params.column)">
                            <!-- <li :class="route.query.y === '' || route.query.y === undefined ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path, query: { ...route.query, y: '' } }">全部</nuxt-link>
                            </li> -->
                            <li @click="year_index = item" v-for="(item, index) in v.year"
                                :class="year_index === item ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path }">{{
                                    item.replace("年份", '全部')
                                    }}</nuxt-link>
                            </li>
                        </ul>
                    </el-form-item>
                    <!-- <el-form-item label="按语言">
                        <ul class="show__type-filter">
                            <li :class="route.query.l === '' || route.query.l === undefined ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path, query: { ...route.query, l: '' } }">全部</nuxt-link>
                            </li>
                            <li v-for="(item, index) in languageList.data"
                                :class="route.query.l === item.name ? 'active' : ''">
                                <nuxt-link :to="{ path: route.path, query: { ...route.query, l: item.name } }">{{
                                    item.name }}</nuxt-link>
                            </li>
                        </ul>
                    </el-form-item> -->
                </el-form>
                <el-tabs v-model="orderBy" @tab-change="handleTabChange">
                    <el-tab-pane label="综合" name="by_default" :disabled="pending" aria-selected="true"></el-tab-pane>
                    <el-tab-pane label="最新" name="by_time" :disabled="pending"></el-tab-pane>
                    <el-tab-pane label="最热" name="by_hits" :disabled="pending"></el-tab-pane>
                    <el-tab-pane label="人气" name="by_score" :disabled="pending"></el-tab-pane>
                </el-tabs>
                <div class="video-list" v-loading="pending">
                    <el-row :gutter="20" v-if="movie_List">
                        <el-col :sm="4" :xs="8" v-for="item in movie_List.data.list">
                            <div class="video-list__block">
                                <nuxt-link :to="`/column/${route.params.column}/video/${item.id}`" class="img-box">
                                    <el-image class="video-list__block__img" :src="item.cover" fit="cover" />
                                    <span v-if="item.label">{{ item.label === '' ? '暂无' :
                                        item.label }}</span>
                                </nuxt-link>
                                <div class="video-list__detail">
                                    <h4 class="title text-overflow">{{ item.name }}</h4>
                                    <p class="text-overflow">
                                        <span style="padding-right: 5px" v-if="item.type_name != ''">{{ item.type_name
                                            }}/{{ item.dynamic }}</span>
                                        <span style="padding-right: 5px" v-else>{{ item.dynamic }}</span>
                                    </p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="pagination" v-if="movie_List">
                        <el-pagination background layout="prev, pager, next" :current-page="currentPage"
                            :page-size="pagesize" :pager-count="5" :total="movie_List.data.total"
                            @current-change="handleCurrentChange" />
                    </div>
                    <el-empty description="未找到相关数据" v-if="movie_List == null"></el-empty>
                </div>
            </el-col>

            <el-col :span="6" class="hidden-sm-and-down">
                <div v-if="rank_list">
                    <div class="panel_hd items-center">
                        <h3 class="title items-center">
                            {{ columnName }}榜单
                        </h3>
                    </div>
                    <ul class="col-pd" v-for="info in rank_list.data.filter(d => d.title === columnName)">
                        <li v-for="(item, index) in info.list">
                            <nuxt-link :to="`/search?keyword=${item.word}`" class="between">
                                <div>
                                    <span class="badge">{{ index + 1 }}</span>
                                    {{ item.word }}
                                </div>
                                <span class="text-muted">热度{{ item.hot }}</span>
                            </nuxt-link>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { getPanel } from "element-plus/es/components/date-picker/src/panel-utils.mjs";
import { computed, ref } from "vue";
import { useServerRequest } from "~/composables/useServerRequest";
import { get_sign, get_pack, get_timestamp } from '~/utils/globalMethods';

const route = useRoute()
definePageMeta({
    key: route => route.fullPath
})
const { query, params } = route
const class_index = ref('类型');
const area_index = ref('地区');
const year_index = ref('年份');
const orderBy = ref('by_default')
const currentPage = ref<number>(1)
const page_index = ref(1);
const page_maxpage = ref(1);
const type_id = ref(params.column);
const pagesize = ref(24);
const pack = computed(()=>{
    let global_params = {
    "type_id": params.column,
    "sort": orderBy.value,
    "class": class_index.value,
    "area": area_index.value,
    "year": year_index.value,
    "page": currentPage.value,
    "pageSize": pagesize.value,
    "timestamp": get_timestamp()
    };

    let param = JSON.stringify(global_params);
    return get_pack(param);
});
const sign = computed(()=>{return get_sign(pack.value)});

const getmovieList = () => {

}
// console.log('pack:',pack,'sign',sign)

const pack1 = get_pack('{"timestamp": ' + get_timestamp() + '}');
const sign1 = get_sign(pack1);
const [{ data: movie_List, refresh, pending }, { data: rank_list }] = await Promise.all([
    myServerRequest<{ data: any }>('movie/screen/list', {
        query: { pack: pack, signature: sign }
    }),
    myServerRequest<{ data: any }>('movie/search_ranking', {
        query: { pack: pack1, signature: sign1 }
    })
]);

const columnName = ref('电影')
const title = computed(() => {
    const tmp = navigation.value.data.index_top_nav.filter(d => d.id == params.column);
    columnName.value = tmp[0].name;
    let year = year_index.value == "年份" ? "" : year_index.value + '_';
    let area = area_index.value == "地区" ? "" : area_index.value + '_';
    let clas = class_index.value == "类型" ? "" : class_index.value + '_';
    let html = year + clas + area + tmp[0].name;
    return html
})
const runtimeConfig = useRuntimeConfig();
const navigation = ref(runtimeConfig.public.navigation);
const genreList = ref([])
const countryList = ref([])
const languageList = ref([])
const weekList = ref([])
const monthList = ref([])

// const [
//     { data: info },
//     { data: movieList }
// ] = await Promise.all([
//     useServerRequest<any>(`column`, {
//         query: {
//             value: 'movie'
//         }
//     }),
//     // 此处代码后面修改
//     useServerRequest('movie/list', {
//         query: {
//             columnValue: params.column,
//             genres: query.t,
//             country: query.c,
//             language: query.l,
//             year: query.y,
//             pageNum: query.page || 1,
//             pageSize: 30,
//             orderBy: orderBy.value
//         }
//     })
// ])

async function handleCurrentChange(page: number) {
    console.log("page:", page);
    currentPage.value = page;
    // pack.value = get_pack(JSON.stringify(global_params.value));
    sign.value = get_sign(pack.value);
    await navigateTo({
        path: route.path,
    })
    if (process.client) {
        window.scrollTo(0, 0)
    }
}

async function handleTabChange() {
    // 此处代码后面修改
    refresh()
}

</script>

<style lang="scss" scoped>
.show {
    .title {
        .el-icon {
            margin-right: 15px;
        }
    }

    &__type-filter {
        li {
            display: inline-block;
            margin-right: 15px;
            padding: 0 10px;
            height: 24px;
            line-height: 24px;

            &.active {
                background: #FF9900;

                a {
                    color: #ffffff;
                }
            }
        }
    }

    @media (max-width: 768px) {
        &__type-filter {
            white-space: nowrap;
            width: 300px;
            overflow-x: auto;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    .pagination {
        padding: 20px;
        display: flex;
        justify-content: center;
    }
}
</style>