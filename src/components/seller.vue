<template>
  <div class="seller" ref="seller">
    <div>
      <div class="over-view">
        <h1 class="title">{{seller.name}}</h1>
        <div class=desc>
          <star :size="36" :score="seller.score"></star>
          <span>({{seller.ratingCount}})</span>
          <span>月售{{seller.sellCount}}单</span>
        </div>
        <div class="favorite" @click="togglefavoriteSeller">
          <i class="icon-favorite" :class="{active:favorite}"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span>{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span>{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span>{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content">{{seller.bulletin}}</div>
        <ul v-if="seller.supports.length">
          <li v-for="support in seller.supports" class="support-item" :key="support.type">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-pic">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul>
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos" :key="info">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from './star'
  import split from './widget/split'
  import IScroll from 'iscroll/build/iscroll-probe'

  export default {
    props: ['seller'],
    data () {
      return {
        favorite: false,
        classMap: ['decrease', 'discount', 'special', 'guarantee', 'invoice']
      }
    },
    created () {
      this.$nextTick(() => {
        this._initScroll()
        this._initSliderScroll()
      })
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    methods: {
      togglefavoriteSeller () {
        this.favorite = !this.favorite
//        let str = this.favorite ? '收藏成功' : '取消收藏'
//        alert(str)
      },
      _initScroll () {
        if (!this.sellerScroll) {
          this.sellerScroll = new IScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.sellerScroll.refresh()
        }
      },
      _initSliderScroll () {
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new IScroll(this.$refs.picWrapper, {
              scrollX: true,
              scrollY: false
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    components: {
      star,
      split
    },
    wathch: {
      seller () {
        this.$nextTick(() => {
          this._initScroll()
          this._initSliderScroll()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/mixin.styl"
  .seller
    overflow hidden
    position absolute
    top 174px
    bottom 0
    width 100%
    .title
      margin-bottom 8px
      font-size 14px
      line-height 16px
      color rgb(7, 17, 27)
    .over-view
      margin 0 18px
      padding 18px 0
      position relative
      .desc
        font-size 0
        padding-bottom 18px
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .star
          display inline-block
          margin-right 8px
        span
          vertical-align top
          font-size 10px
          line-height 18px
          color rgb(77, 85, 93)
      .favorite
        position absolute
        right 0
        top 18px
        text-align center
        color rgb(77, 85, 93)
        .icon-favorite
          display block
          font-size 24px
          line-height 24px
          &.active
            color rgb(240, 20, 20)
        .text
          display inline-block
          width 36px
          font-size 10px
          line-height 10px
      .remark
        display flex
        margin-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-right none
          h2
            margin-bottom 8px
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .content
            font-weight 200
            font-size 10px
            color rgb(7, 17, 27)
            line-height 24px
            span
              font-size 24px
    .bulletin
      padding 18px 18px 0
      .content
        padding 0 12px 16px
        font-size 12px
        line-height 24px
        font-weight 200
        color rgb(240, 20, 20)
      .support-item
        border-top 1px solid rgba(7, 17, 27, 0.1)
        padding 16px 12px
        font-size 0
        .icon
          display inline-block
          vertical-align top
          height 16px
          width 16px
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          iconImg("../common/img/", 4)
        .text
          font-size 12px
          font-weight 200
          line-height 16px
          color rgb(7, 17, 27)
    .seller-pic
      padding 18px 0
      .title
        margin 0 0 12px 18px
      .pic-wrapper
        white-space nowrap
        overflow hidden
        padding-left 18px
        width 100%
        ul
          display inline-block
          font-size 0
        .pic-item
          display inline-block
          margin-right 6px
          width 120px
          height 90px
    .info
      padding 18px 18px 0 18px
      .info-item
        padding 16px 12px
        font-size 12px
        font-weight 200
        line-height 16px
        border-top 1px solid rgba(7, 17, 27, 0.1)
        color rgb(7, 17, 27)
</style>
