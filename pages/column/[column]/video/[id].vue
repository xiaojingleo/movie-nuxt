<template>
  <div class="container mt-20">
    <Head>
      <Title>{{ detail?.data.type_name }} {{ detail?.data.name }} 在线观看</Title>
      <!-- <Meta name="description" :content="detail.content" /> -->
    </Head>
    <el-row :gutter="40" class="mt-20">
      <el-col :span="18" :xs="24">
        <div id="mse">
          <!-- <el-button @click="playNextEpisode">下一集</el-button> -->
        </div>
        <div>
          <h1 class="mb-10 mt-10 video-detail__title">
            {{ detail?.data.type_name }} {{ detail?.data.name }}
            <span :class="detail?.data.score != '' ? 'rate' : ''">
              {{ detail?.data.score != '' ? detail?.data.score : '暂无评分' }}
            </span>
          </h1>
          <el-form :inline="true">
            <el-form-item><el-tag type="primary">
                {{ detail?.data.type_name }}
              </el-tag></el-form-item>
            <el-form-item>
              <template v-for="item in detail?.data.tags">
                <el-tag type="success">{{ item.name }}</el-tag>
              </template>
            </el-form-item>
            <el-form-item><el-tag type="warning">{{ detail?.data.year }}</el-tag></el-form-item>
            <el-form-item label="演员">
              <div class="expandable-text" @click="isExpanded1 = !isExpanded1">
                <template v-for="(item, index) in detail?.data.members" v-if="isExpanded1">
                  <el-tag type="success">{{ item.name }}</el-tag>
                </template>
                <template v-for="(item, index) in detail?.data.members" v-else>
                  <el-tag type="success" v-if="index < 3">{{ item.name }}</el-tag>
                  <el-tag type="success" v-if="index == 3">更多...</el-tag>
                </template>
              </div>

            </el-form-item>
            <el-form-item label="简介" size="large">
              <div class="expandable-text" @click="isExpanded = !isExpanded">
                <span v-if="!isExpanded">{{ detail?.data.content.slice(0, 25) }}... </span>
                <span v-else>{{ detail?.data.content }}</span>
              </div>
              <!-- <p class="expandable-text">{{ detail.data.content }}</p> -->
            </el-form-item>

          </el-form>
        </div>
        <div>
          <!-- <div class="panel_hd between items-center">
            <div class="panel_hd__left">
              <h3 class="title items-center">
                <el-icon>
                  <ElIconVideoCamera />
                </el-icon>相关视频
              </h3>
            </div>
          </div> -->
          <!-- <div class="related_video" v-if="detail.data.length">
            <ul class="clearfix">
              <li v-for="item in detail.data.play_from">
                <nuxt-link :to="`/column/${detail.movie.columnValue}/video/${item.id}`">
                  <el-image class="img" fit="cover" :src="item.cover || item.video?.poster || ''"></el-image>
                  <p :title="item.title"><span :class="+item.id === +route.params.id ? 'animate' : ''">{{+item.id === +route.params.id ? '正在播放: ' : '' }}{{ item.title }}</span></p>
                </nuxt-link>
              </li>
            </ul>
          </div> -->
        </div>
        <div>
          <el-form-item label="换源">
            <el-radio-group v-model="radio_source" size="small" v-for="(item, index) in detail?.data.play_from"
              @change="sourceChanged(item, index)">
              <el-radio-button :label="item.name" :value="item.code" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="选集">
            <el-radio-group v-model="radio_episode" size="small" v-for="(item, index) in episode_list?.data"
              @change="episodeChange(item, index)">
              <el-radio-button :label="item.episode_name" :value="item.play_url" />
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="mt-20">
          <div class="panel_hd between items-center">
            <div class="panel_hd__left">
              <h3 class="title items-center">
                <el-icon>
                  <ElIconVideoCamera />
                </el-icon><a href="/">猜你喜欢</a>
              </h3>
            </div>
          </div>
          <div class="video-list">
            <el-row :gutter="20" v-if="likeRows">
              <el-col :sm="6" :xs="8" v-for="item in likeRows.data.list">
                <div class="video-list__block">
                  <nuxt-link :to="`/column/${typeid}/video/${item.id}`">
                    <el-image class="video-list__block__img" :src="item.cover" fit="cover" />
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
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="hidden-sm-and-down">
        <div class="qr_code items-center column mb-20">
          <qrcode-vue :value="qrcodeUrl" :size="160" level="H" />
          <p class="mt-10">扫描二维码用手机观看</p>
          
        </div>
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
    <div id="vs"></div>

  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import 'xgplayer/es/plugins/danmu/index.css'
import PresetPlayer, { Events } from "xgplayer";
import 'xgplayer/dist/index.min.css'
import HlsPlugin from 'xgplayer-hls';
import HlsJsPlugin from 'xgplayer-hls.js'
import { myServerRequest } from "~/composables/useServerRequest";
import '~/plugins/xgplayer/payTip/index.css'
import PayTip from "~/plugins/xgplayer/payTip";
import { get_recommend_params,get_pack,get_sign,get_detail_params } from '~/utils/globalMethods';
import { el, pa } from 'element-plus/es/locales.mjs';
import { dataType } from 'element-plus/es/components/table-v2/src/common.mjs';
import { computed, normalizeStyle, ref, watch } from 'vue';

const playNextEpisode = () => {
  console.log("next")
  episode_index.value = (episode_index.value + 1) % episode_list.value.data.length;
  
};
const isAutoNext = ref(false);
const isExpanded = ref(false);
const isExpanded1 = ref(false);
const token = ref('')
const radio_source = computed(()=>{
  return detail.value?.data.play_from[source_index.value].code;
});
const source_select = computed(()=>{
  return detail.value?.data.play_from[source_index.value];
});
const source_index = ref(0);
const episode_index = ref(0);
const episode_select = computed(()=>{
  return episode_list.value?.data[episode_index.value];
});
const currentPlay_url = computed(()=>{
  return episode_list.value?.data[episode_index.value].play_url;
});
const radio_episode = computed(() => {
  return episode_list.value?.data[episode_index.value].play_url;
});
// const episode_list = ref();
const route = useRoute()
const id = route.params.id
const typeid = route.params.column
const qrcodeUrl = ref('')
// 是否购买了影片
const isUserBuy = ref(false)
// 视频支付提示插件
let payTipInstance: PayTip | null = null
// 视频组件
let player: PresetPlayer | null = null

const param = get_detail_params(id);
const pack = get_pack(param);
const sign = get_sign(pack);
const { data: detail } = await myServerRequest<{ data: any }>('movie/detail', {
  query: { pack: pack, signature: sign }
});


// function setSource() {
//   radio_source.value = detail.value?.data.play_from[source_index.value].code;
//   // source_select.value = detail.value?.data.play_from[source_index.value];
//   // getEpisodeList(detail.value?.data.play_from[0]);
// }
// setSource();

const pack3 = computed(() => {
  let json_data = { "movie_id": id, "from_code": source_select.value ? source_select.value.code : 'hw8', "timestamp": get_timestamp() }
  // console.log('json_data', json_data)
  let par = JSON.stringify(json_data);
  return get_pack(par)
});
const sign3 = computed(() => {
  return get_sign(pack3.value);
});

const { data: episode_list } = await myServerRequest<{ data: any }>('movie_addr/list', {
  query: { pack: pack3, signature: sign3 }
});
// console.log('episode:', episode_list);
// console.log('detail:', detail);

watch(episode_list,(nval,oval)=>{
  console.log('episode_list','new',nval.data[0].play_url,'old',oval);
  // currentPlay_url.value = nval.data[episode_index].play_url;
})
watch(currentPlay_url,(nval,oval)=>{
  // console.log('currentPlayurl changed:',nval,oval)
  if(player!=null)
  {
    if(nval.indexOf('.m3u8'))
    {
      console.log('play Url',nval);
      player.switchURL(nval);
    
      // ParseUrl();
    }

  }
})
const ParseUrl =()=>{
    let pack4 = computed(() => {
    let jsd = {
      "from_code": episode_select?.value?.from_code,
      "play_url": currentPlay_url.value,
      "episode_id": episode_select?.value?.episode_id,
      "type": "play",
      "timestamp": get_timestamp()
    };
    console.log('=============jsdata===========', jsd)
    let par = JSON.stringify(jsd);
    return get_pack(par);
  })
    let signature = computed(() => {
      return get_sign(pack4.value);
    })
    myServerRequest<{ data: any }>('movie_addr/parse_url', {
      query: { pack: pack4, signature: signature }
    }).then((res)=>{
      console.log('res',res,'playurl=',res.data?.value?.data?.play_url);
      console.log('oldplayurl=',episode_list.value.data[episode_index.value].play_url );
      episode_list.value.data[episode_index.value].play_url = res.data?.value?.data?.play_url;
      // currentPlay_url.value = res.data.play_url;
    });
  
}
//选集
const episodeChange = (item: any, index: int) => {
  episode_index.value = index;
  console.log('URL:',item.play_url);

}

const sourceChanged = (item: any, index) => {
  // source_select.value = item;
  source_index.value = index;
  // if (player != null) 
  // {
  //   if (episode_list.value.data[episode_index.value].play_url.indexOf('.m3u8'))
  //     console.log('direct url:',episode_list.value.data[episode_index.value].play_url);
  //     player.switchURL(episode_list.value.data[episode_index.value].play_url)
  // }
  //   else {
  //     console.log('PlayUrl:',PlayUrl?.data.data.play_url);
  //     player.switchURL(PlayUrl?.data.data.play_url);
  //   }
  
}



// const getRealplayUrl = function (episode_id, play_url, from_code) {
//   // console.log(json_data);

//   if (player != null) {
//     player.switchURL(PlayUrl?.play_url);
//   }

// }
/** 获取猜你喜欢、周榜单、月榜单数据 */
const recompar = get_recommend_params(id, typeid);
const pack2 = get_pack(recompar);
const sign2 = get_sign(pack2);
const { data: likeRows } = await myServerRequest<{ data: any }>('movie/' + id + '/recommend', {
  query: { pack: pack2, signature: sign2 }
})
const runtimeConfig = useRuntimeConfig();
const navigation = ref(runtimeConfig.public.navigation);
const pack1 = get_pack('{"timestamp": ' + get_timestamp() + '}');
const sign1 = get_sign(pack1);
const columnName = computed(()=>{
  const tmp = navigation.value.data.index_top_nav.filter(d => d.id == route.params.column);
    return tmp[0].name.replace('推荐','热搜');
});
const [ { data: rank_list }] = await Promise.all([
    myServerRequest<{ data: any }>('movie/search_ranking', {
        query: { pack: pack1, signature: sign1 }
    })
]);



/** 查询用户是否购买影片 */
getUserMovie()
async function getUserMovie() {
  // ...
}


onMounted(async () => {
  qrcodeUrl.value = window.location.href
  // const [Player, Danmu, PayTip] 
  const [Player, Danmu, PayTip] = await Promise.all([
    import('xgplayer'),
    // import("xgplayer-mp4"),
    import('xgplayer/es/plugins/danmu'),
    import('~/plugins/xgplayer/payTip')
  ])
  player = new Player.default({
    id: 'mse',
    controls: {
      autoHide: true,
      mode:'normal'
    },
    autoplay: true,
    volume: 0.3,
    url: currentPlay_url.value,
    // url: process.env.NODE_ENV === 'development' ? detail.videoInfo?.url.replace('https://cms.yinchunyu.com', '/server') : detail.videoInfo?.url,
    playsinline: true,
    height: '100%',
    width: '100%',
    plugins: [HlsPlugin, Danmu.default],
    danmu: {
      comments: [
        {
          duration: 15000,
          id: '1',
          start: 3000,
          txt: '.',
          //弹幕自定义样式
          style: {
            color: '#ff9500',
            fontSize: '20px',
            border: 'solid 1px #ff9500',
            borderRadius: '50px',
            padding: '5px 11px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      ],
      area: {
        start: 0,
        end: 1
      }
    }
  })
  player.on(Events.ENDED,()=>{
    console.log('ended');
    episode_index.value = (episode_index.value +1)%episode_list.value.data.length;
    player?.playNext({url:currentPlay_url.value});
  })
  player.on('error', (error) => {
    if(source_index.value+1 < detail.value?.data.play_from.length)
    {
      console.log('切换视频源')
      source_index.value++;
    }
})
  // payTipInstance = player.getPlugin('payTip')
})

/** 购买影视 */
function buyMovie(player: PresetPlayer) {
  ElMessageBox.confirm(
    `确定要支付10金币购买此影片吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then()
}

</script>

<style lang="scss" scoped>
#mse {
  width: 100%;
  height: 500px !important;
  background: #000;
}

@media (max-width: 768px) {
  #mse {
    height: 300px !important;
  }
}

.title {
  .el-icon {
    margin-right: 15px;
  }
}

.related_video {
  overflow-x: auto;
  width: 100%;
  overflow-y: hidden;

  .img {
    width: 160px;
    height: 100px;
  }

  ul {
    white-space: nowrap;

    li {
      display: inline-block;
      margin-right: 20px;
      position: relative;
      overflow: hidden;

      p {
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }
  }
}

.animate {
  padding-left: 20px;
  white-space: nowrap;
  display: inline-block;
  animation: 15s wordsLoop linear infinite normal;
  color: #ffffff;
}

@keyframes wordsLoop {
  0% {
    transform: translateX(0px);
    -webkit-transform: translateX(0px);
  }

  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

@-webkit-keyframes wordsLoop {
  0% {
    transform: translateX(0px);
    -webkit-transform: translateX(0px);
  }

  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

.video-detail__title {
  line-height: 1.2;

  span {
    color: lightgray;
    font-size: 14px;

    &.rate {
      font-size: 24px;
      color: #06d706;
    }
  }
}



.expandable-text {
  cursor: pointer;
  /* 鼠标悬停时显示为可点击状态 */
  /* 可以添加其他样式，如字体、颜色等 */
}
</style>