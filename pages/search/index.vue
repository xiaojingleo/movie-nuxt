<template>
   <Head>
            <Title> {{ title }} </Title>
            <!-- <Meta name="description" :content="`最新最全的${title}${info.data.name}尽在淳渔影视。`" /> -->
        </Head>
  <div class="container mt-20 show">
    <ClientOnly>
      <el-row :gutter="40">
        <el-col :span="18" :xs="24">
          <div class="search-form">
            <el-form  :inline="true" @submit.prevent="null">
              <el-form-item>
                <el-input style="min-width: 400px; left: 0px; margin: 0px;" v-model="form.keyword" placeholder="请输入搜索的影视名" @keyup.enter="keyword=form.keyword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="keyword = form.keyword">搜 索</el-button>
              </el-form-item>
            </el-form>
            <el-form  >
                <el-form-item >
                  <el-radio-group v-model="typeid" size="small" v-for="(item,index) in ng.data.index_top_nav" style="padding: 0px;margin: 0px;">
                  <el-radio-button :label="item.name.replace('推荐','类型')" :value="item.id" />
                  </el-radio-group>
                </el-form-item>
            </el-form>
          </div>
            <el-tabs v-model="orderBy" @tab-change="refresh">
                    <el-tab-pane label="综合" name="by_default" :disabled="pending" aria-selected="true"></el-tab-pane>
                    <el-tab-pane label="最新" name="by_time" :disabled="pending"></el-tab-pane>
                    <el-tab-pane label="最热" name="by_hits" :disabled="pending"></el-tab-pane>
                    <el-tab-pane label="人气" name="by_score" :disabled="pending"></el-tab-pane>
              <div class="video-list">
                <el-row :gutter="20">
                  <el-col v-for="(item,index) in newMovie?.data.list" :key="index" :sm="4" :xs="8">
                    <div class="video-list__block">
                      <nuxt-link :to="`/column/0/video/${item.id}`" class="img-box">
                        <el-image class="video-list__block__img" :src="item.cover" fit="cover" />
                        <span v-if="item.movieRate">{{
                          +item.label === 0 ? '暂无评分' : item.label.toFixed(1)
                        }}</span>
                      </nuxt-link>
                      <div class="video-list__detail">
                        <h4 class="title text-overflow">{{ item.name }}</h4>
                        <p class="text-overflow">
                          <template v-for="actor in item.members">
                            {{ actor.name }}-
                          </template>
                        </p>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <div class="pagination">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :pager-count="5"
                    :total="newMovie?.data.total"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </div>
                </el-tabs>
        </el-col>
        <el-col :span="6" class="hidden-sm-and-down">
              <div v-for="(info,idx) in rank_list?.data" :key="idx" >
                <div class="panel_hd items-center" v-if="idx==0 || idx==(typeid>4? Math.ceil(8-typeid/10):typeid)">
                        <h3 class="title items-center">
                            {{ info.title }}榜单
                        </h3>
                    </div>
                    <ul class="col-pd" v-for="(item, index) in info.list" v-if="idx==0 || idx==(typeid>4? Math.ceil(8-typeid/10):typeid)">
                        <li >
                            <nuxt-link :to="`/search?keyword=${item.word}`" class="between" @click="keyword=item.word;form.keyword=item.word">
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
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  // import { useClientRequest } from '~/composables/useClientRequest';
  import { myServerRequest } from '~/composables/useServerRequest';
  const runtimeConfig = useRuntimeConfig();
  const ng = ref(runtimeConfig.public.navigation);
  const orderBy = ref('by_default')
  const typeid = ref(0);
  const route = useRoute();
  const activeName = ref('first');
  const keyword = ref('');
  const form = reactive<{ keyword: string | undefined }>({
    keyword: undefined
  });
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(24);

  const title = computed(()=>{
    let html = "搜索【"+keyword.value+"】的页面";
    return html;
  })
  form.keyword = route.query.keyword as string;
  keyword.value = route.query.keyword as string;
  // if (route.query.page) {
  //   currentPage.value = +route.query.page;
  // }
  const pack = computed(()=>{
    let json_data = {
      "keyword":keyword.value,
      "sort":orderBy.value,
      "type_id":typeid.value,
      "page":currentPage.value,
      "pageSize":pageSize.value,
      "res_type":"by_movie_name",
      "timestamp":get_timestamp()
    };
    return get_pack(JSON.stringify(json_data));
  })
  const sign = computed(()=>{
    return get_sign(pack.value);
  });
  const {data:newMovie,refresh} = await myServerRequest <{data:any}>('movie/search',{
    query:{pack:pack,signature:sign}
  })
  console.log(newMovie);
  // const [{ data, refresh }, { data: newMovie }] = await Promise.all([
  //   useAsyncData('data', () =>
  //     useClientRequest<ResPage<MovieItem[]>>('movie/list', {
  //       query: {
  //         keyword: form.keyword,
  //         pageNum: currentPage.value,
  //         pageSize: 30
  //       }
  //     })
  //   ),
  //   useServerRequest<ResPage<MovieItem[]>>('movie/list', { query: { pageSize: 15 } })
  // ]);

  function handleCurrentChange(page: number) {
    currentPage.value = page;
    console.log('pageindex;',currentPage.value)
    refresh();
    if (process.client) {
      window.scrollTo(0, 0);
    }
  }


  const pack1 = get_pack('{"timestamp": ' + get_timestamp() + '}');
const sign1 = get_sign(pack1);
const [{ data: rank_list }] = await Promise.all([
    myServerRequest<{ data: any }>('movie/search_ranking', {
        query: { pack: pack1, signature: sign1 }
    })
]);

</script>

<style lang="scss" scoped>
  .search-form {
    padding: 20px 0;
  }
  .pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
</style>
