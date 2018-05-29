<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <ul ref='supports'>
            <li v-for='(item,index) in sliderSupports' :key='index'>
              <span class="icon" :class='classMap[item.type]'></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="support-count">
        <div v-if="seller.supports"
             class='count'
             @click="showDetailfn">{{seller.supports.length}}个<i class='icon-keyboard_arrow_right'></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetailfn">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="150%"/>
    </div>
    <div class="detail" v-show='showDetail'>
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <start :size="48" :score="seller.score"></start>
          </div>
          <div class="title" v-if="seller.supports">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li v-for='(item,index) in seller.supports' :key='index'>
              <span class="icon" :class='classMap[item.type]'></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class=content>{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="showDetailfn">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import start from './star.vue'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    updated () {
      // 如果当前商家没有优惠不进行轮播
      if (this.seller.supports.length > 1) {
        clearInterval(this.timer)
        let ele = this.$refs.supports
        this.transitonEnd(ele, () => {
          if (this.index >= this.seller.supports.length) {
            this.transitionAgain(ele)
          }
        })
        this.timer = setInterval(() => {
          this.index++
          this.addTransition(ele)
          this.setTranslate(ele, -this.index * 20) // 优惠信息自身高16又有向下4边距
        }, 1500)
      }
    },
    data () {
      return {
        timer: 0,
        index: 0,
        showDetail: false,
        classMap: ['decrease', 'discount', 'special', 'guarantee', 'invoice']
      }
    },
    components: {
      start
    },
    computed: {
      sliderSupports () {
        let supports = this.seller.supports
        if (supports && supports.length > 1) {
          return supports.concat(supports[0])
        }
        return supports
      }
    },
    methods: {
      showDetailfn () {
        this.showDetail = !this.showDetail
      },
      addTransition (ele) {
        ele.style.transition = 'all 0.5s'
        ele.style.webkitTransition = 'all 0.5s'
      },
      setTranslate (ele, offset) {
        ele.style.transform = `translateY(${offset}px)`
        ele.style.webkitTransform = `translateY(${offset}px)`
      },
      transitonEnd (ele, callback) {
        ele.addEventListener('transitionEnd', function () {
          callback && callback() // 如果存在callback函数才执行
        })
        ele.addEventListener('webkitTransitionEnd', function () {
          callback && callback() // 如果存在callback函数才执行
        })
      },
      removeTransition (ele) {
        ele.style.transition = 'none'
        ele.style.webkitTransition = 'none'
      },
      transitionAgain (ele) {
        this.index = 0
        this.removeTransition(ele)
        this.setTranslate(ele, 0)
      }
    }
  }
</script>

<style lang='stylus' scoped>
  @import "../common/stylus/mixin.styl"
  .header
    color #fff
    font-size 0
    position relative
    overflow hidden
    background-color rgba(7, 17, 27, 0.5)
    .content-wrapper
      position relative
      padding 20px 14px 14px 20px
      box-sizing border-box
      @media screen and (max-width: 321px)
        padding 20px 14px 14px 10px
        .support
          width 169px
      .avatar
        display inline-block
        vertical-align top
        img
          border-radius 4px
      .content
        display inline-block
        margin-left 12px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            bg-image ("../common/img/brand")
            background-size 30px 18px
            background-repeat no-repeat
            vertical-align top
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          display inline-block
          font-size 12px
          line-height 12px
          font-weight 200
          margin-bottom 10px
        .support
          height 16px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          li
            margin-bottom 4px
            &:last-child
              margin-bottom 0
          .icon
            margin-right 4px
            display inline-block
            width 16px
            height 16px
            vertical-align top
            iconImg("../common/img/", 1)
            background-size 16px 16px
            background-repeat no-repeat
          .text
            line-height 16px
            font-size 12px
            font-weight 200
            overflow hidden
            text-overflow ellipsis
      .support-count
        position absolute
        right 12px
        bottom 14px
        height 24px
        padding 0 8px
        line-height 24px
        background-color rgba(0, 0, 0, 0.2)
        border-radius 12px
        .count
          font-size 12px
          vertical-align top
          font-weight 200
          i
            display inline-block
            margin-right -2px
    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background rgba(7, 17, 27, 0.2)
      .bulletin-title
        display inline-block
        vertical-align top
        width 22px
        margin-top 8px
        height 12px
        bg-image("../common/img/bulletin")
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        vertical-align top
        font-size 12px
        margin 0 8px 0 8px
      .icon-keyboard_arrow_right
        position absolute
        right 8px
        top 10px
        font-size 12px
        @media screen and (max-width: 321px)
          right 4px
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      top 0
      left 0
      height 100%
      width 100%
      z-index 100
      background rgba(7, 17, 27, 0.8)
      .detail-wrapper
        min-height 100%
        width 100%
        clear both
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
          .star-wrapper
            margin-top 16px
            padding 2px 0
            text-align center
          .title
            display flex
            width 80%
            margin 28px auto 24px
            .line
              flex 1
              position relative
              top -6px
              border-bottom 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding 0 12px
              font-size 14px
              font-weight 700
          .supports
            width 80%
            margin 0 auto
            li
              padding 0 12px
              margin-bottom 12px
              &:last-child
                margin-bottom 0
              .icon
                margin-right 6px
                display inline-block
                width 16px
                height 16px
                vertical-align top
                iconImg("../common/img/", 2)
                background-size 16px 16px
                background-repeat no-repeat
              .text
                line-height 16px
                font-size 12px
                font-weight 200
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              font-size 12px
              font-weight 200
              line-height 24px
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        clear both
        font-size 32px
</style>
