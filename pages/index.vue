<template>
  <div class="container index">
    <Head>

            <Title>{{ title }}</Title>
            <!-- <Meta name="description" :content="`最新最全的${title}${info.data.name}尽在淳渔影视。`" /> -->
        </Head>

    <div class="banner">
      <el-carousel :interval="3000" arrow="always">

        <div v-if="recommend_list">
          <el-carousel-item v-for="item in recommend_list.data[0].list">
            <nuxt-link :to="`/column/0/video/${item.click}`">
              <div class="image-container">
                
                <el-image :src="item.image" fit="cover" style=" background: #f0f0f0; width: 100%; height: auto; " >
                
              </el-image>
              <div class="overlay-text">
                {{ item.title }}
            </div>
              </div>
            </nuxt-link>
          </el-carousel-item>
        </div>
      </el-carousel>
    </div>

    <div v-if="recommend_list">
      <el-row :gutter="40" class="mt-20"
        v-for="(categoryItem, idx) in recommend_list.data.filter(d => d.title != 'carousel')">
        <el-col :sm="18">
          <div class="panel_hd between items-center">
            <div class="panel_hd__left">
              <h3 class="title items-center">
                <!-- <i class="icon-movie-box"></i> -->
                {{ categoryItem.title }}
              </h3>
            </div>
            <div class="panel_hd__right items-center">
              <ul class="items-center">
                <li>
                  <nuxt-link :to="`/column/${categoryItem.right.data.index}`" class="items-center" v-if="idx > 0"  >
                    更多 <el-icon>
                      <ElIconArrowRight />
                    </el-icon>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="video-list">
            <el-row :gutter="20">
              <el-col :sm="8" :xs="8" v-for="item in categoryItem.list">
                <div class="video-list__block">
                  <nuxt-link :to="`/column/0/video/${item.id}`" class="img-box">
                    <el-image lazy class="video-list__block__img" :src="item.cover" fit="cover" />
                    <span>{{ item.label }}</span>
                  </nuxt-link>
                  <div class="video-list__detail">
                    <h4 class="title text-overflow">{{ item.name }}</h4>
                    <p class="text-overflow">
                      <!-- <span style="padding-right: 5px" v-for="user in item.casts">{{ user.actor.name }}</span> -->
                      <span style="padding-right: 5px" v-if="item.type_name!=''">{{ item.type_name }}/{{ item.year }}/{{ item.dynamic }}</span>
                      <span style="padding-right: 5px" v-else>{{ item.year }}/{{ item.dynamic }}</span>
                    </p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        
        <el-col :span="6" class="hidden-sm-and-down" v-if="idx<7">
          <div v-if="rank_list">
            <div class="panel_hd items-center">
              <h3 class="title items-center">
                {{ rank_list.data[idx].title }}榜单
              </h3>
            </div>
            <ul class="col-pd">
              <li v-for="(item, index) in rank_list.data[idx].list">
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
    
    <div class="friendly-link flex items-center mt-20">
      <el-icon><ElIconLink/></el-icon>
      友情链接
    </div>
    <div class="friendly-link__content">
      <a v-for="item in linkList.data" :href="item.url" target="_blank">{{ item.text }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useServerRequest} from "~/composables/useServerRequest";
import { get_sign, get_pack, get_timestamp } from '~/utils/globalMethods';
const timestamp = get_timestamp();
let params = { "timestamp": timestamp };
const pack = get_pack(JSON.stringify(params));
const sign = get_sign(pack);
const runtimeConfig = useRuntimeConfig();
const navigation = ref(runtimeConfig.public.navigation);
const title = computed(() => {
    const html = '推荐';
    return html
})
// 获取友情链接
const linkList = ref({data:[
  { text: 'Nuxt3教程', url: 'http://www.yinchunyu.com' }
]})
const [ { data: recommend_list },{data:rank_list}] = await Promise.all([
  myServerRequest<{ data: any }>('movie/index_recommend', {
    query: { pack: pack, signature: sign }
  }),
  myServerRequest<{ data: any }>('movie/search_ranking', {
    query: { pack: pack, signature: sign }
  })
])
// console.log('ranklist',rank_list)
</script>

<style lang="scss">
.index {
  padding-top: 20px;

  .banner {
    .el-carousel__container {
      height: 380px;
    }

    .el-image {
      height: 380px;
    }

    @media (max-width: 768px){
      .el-carousel__container {
        height: 200px;
      }

      .el-image {
        height: 200px;
      }
    }
  }

  .friendly-link {
    border-bottom: #eee solid 1px;
    padding: 10px 0;
    font-size: 18px;
    > img {
      margin-right: 10px;
    }
    &__content {
      padding: 20px 0;
      a {
        padding-right: 15px;
      }
    }
  }
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.col-pd {
  li {
    a {
      font-size: 14px;
      padding: 10px 0 10px;
      border-bottom: dotted 1px #eeeeee;

      .badge {
        display: inline-block;
        margin-right: 10px;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        border-radius: 2px;
        font-size: 12px;
        background-color: #eee;
        color: #333;
      }

      .text-muted {
        color: #999;
      }
    }

    &:nth-child(1) {
      .badge {
        background-color: #ff4a4a;
        color: #fff;
      }
    }

    &:nth-child(2) {
      .badge {
        background-color: #ff7701;
        color: #fff;
      }
    }

    &:nth-child(3) {
      .badge {
        background-color: #ffb400;
        color: #fff;
      }
    }
  }
}

.panel_hd {
  border-bottom: #eeeeee solid 1px;
  height: 46px;
  margin-bottom: 15px;
  .title {
    font-size: 18px;
    line-height: 24px;

    img {
      margin-right: 10px;
    }
  }
  &__right {
    li {
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 1px;
        height: 10px;
        background: #eee;
        position: absolute;
        top: 50%;
        transform: translateY(-30%);
        right: 0;
      }
      &:last-child::before {
        display: none;
      }
      a {
        padding: 0 10px;
        color: #999;
        font-size: 14px;
      }
    }
  }
}

.video-list {
  &__block {
    padding: 10px 0;
    &__img {
      width: 100%;
      height: 218px;
    }
    .img-box {
      position: relative;
      height: 218px;
      display: block;
      span {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        left: 0;
        display: inline-block;
        background-image: linear-gradient(transparent,rgba(0,0,0,.5));
        color: #fff;
        font-size: 12px;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
      }
    }
  }

  &__detail {
    .title {
      font-size: 14px;
      color: #333;
      padding-top: 10px;
    }

    p {
      min-height: 19px;
      font-size: 12px;
      margin-bottom: 0;
      margin-top: 5px;
      color: #999;
    }
  }
}

@media only screen and (max-width:991px){
  .video-list {
    &__block {
      &__img, .img-box {
        height: 170px;
      }
    }
  }
}


.image-container {
  position: relative;
  display: flex; /* 或者其他你需要的布局方式 */
}
 
.overlay-text {
  position: absolute;
  bottom: 50%; /* 根据需要调整 */
  left: 50%; /* 根据需要调整 */
  transform: translate(-50%, -50%); /* 使文字居中 */
  color: white; /* 根据图片背景选择适当的颜色 */
  font-size: 20px; /* 根据需要调整字体大小 */
  font-weight: bold; /* 可选，增加文字的粗细 */
  text-align: center; /* 如果文字有多行，可以使其居中 */
  background-color: rgba(0, 0, 0, 0.5); /* 可选，为文字添加半透明背景 */
  padding: 10px; /* 可选，为文字添加内边距 */
  border-radius: 5px; /* 可选，为文字背景添加圆角 */
}
</style>