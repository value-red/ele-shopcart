<template>
  <div class="ratings" ref="ratings">
    <div>
      <div class="over-view">
        <div class="overviwe-left">
          <h2 class="score">{{seller.score}}</h2>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overviwe-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="rating-wrapper">
        <rating-select
          :rateConfig="rateConfig"
          :ratings="ratings"
          @select="selectRating"
          @toggle="toggleContent"
        ></rating-select>
        <ul>
          <li v-for="(rating,index) in ratings"
              :key="index"
              class="rating-tiem"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar"/>
            </div>
            <div class="content">
              <h2 class="name">{{rating.username}}</h2>
              <star :size="24" :score="rating.score"></star>
              <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-if="rating.recommend.length">
              <span class='icon'
                    :class="rating.rateType===1?'icon-thumb_down':'icon-thumb_up'">
              </span>
              <span v-for="(r,i) in rating.recommend" :key="i" class="item">{{r}}</span>
            </div>
            <div class="time">
              {{rating.rateTime | formatDate}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from './star'
  import split from './widget/split'
  import ratingSelect from './widget/ratingSelect'
  import IScroll from 'iscroll/build/iscroll-probe'
  import { getTemplateDate } from '../common/js/date'

  export default {
    props: {
      seller: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        rateConfig: {
          selectType: 2,
          onlyContent: false,
          desc: {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        },
        ratings: []
      }
    },
    created () {
      this.$axios.get('/api/ratings')
        .then(res => {
          res = res.data
          if (res.errno === 0) {
            this.ratings = res.data
            this.$nextTick(() => {
              if (!this.rscroll && this.$refs.ratings) {
                this.rscroll = new IScroll(this.$refs.ratings, {
                  click: true
                })
              }
              if (this.rscroll && this.$refs.ratings) {
                this.rscroll.refresh()
              }
            })
          }
        })
        .catch(error => {
          alert(error)
        })
    },
    methods: {
      selectRating (num) {
        this.rateConfig.selectType = num
        // 刷新页面
        this.$nextTick(() => {
          this.rscroll.refresh()
        })
      },
      toggleContent () {
        this.rateConfig.onlyContent = !this.rateConfig.onlyContent
        // 刷新页面
        this.$nextTick(() => {
          this.rscroll.refresh()
        })
      },
      needShow (type, text) {
        let config = this.rateConfig
        if (config.onlyContent && !text) {
          return false
        }
        if (config.selectType === 2) {
          return true
        } else if (config.selectType === type) {
          return true
        } else {
          return false
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return getTemplateDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      star,
      split,
      ratingSelect
    }
  }
</script>

<style lang="stylus" scoped>
  .ratings
    position fixed
    width 100%
    top 168px
    bottom 0
    overflow hidden
    .over-view
      display flex
      padding 18px 0
      font-size 0
      .overviwe-left
        flex 0 0 137px
        width 137px
        padding-bottom 6px
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        @media only screen and (max-width 374px)
          flex 0 0 117px
          width 117px
        .score
          font-size 24px
          line-height 28px
          color rgb(255, 153, 0)
          margin-bottom 6px
        .title
          margin-bottom 8px
          font-size 12px
          line-height 12px
          color rgb(7, 17, 27)
        .rank
          font-size 10px
          line-height 10px
          color rgb(147, 153, 159)
      .overviwe-right
        flex 1
        padding 0 24px
        @media only screen and (max-width 374px)
          padding 0 5px
        .score-wrapper
          margin-bottom 8px
          &:last-child
            margin-bottom 0
          .title
            font-size 12px
            vertical-align top
            line-height 18px
            color rgb(7, 17, 27)
          .star
            display inline-block
            margin 0 12px
            vertical-align top
          .score
            display inline-block
            vertical-align top
            font-size 12px
            line-height 18px
            color rgb(255, 153, 0)
          .delivery
            font-size 12px
            line-height 18px
            color rgb(147, 153, 159)
            margin-left 12px
    .rating-wrapper
      padding-top 18px
      .rating-tiem
        position relative
        font-size 0
        margin 0 18px
        padding 18px 0 14px 0
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .avatar
          display inline-block
          margin-right 12px
          img
            border-radius 50%
        .content
          display inline-block
          margin-bottom 6px
          .name
            margin-bottom 4px
            font-size 10px
            line-height 12px
            color rgb(7, 17, 27)
          .star
            display inline-block
            margin-right 6px
          .delivery
            vertical-align top
            font-size 10px
            line-height 12px
            font-weight 200
            color rgb(147, 153, 159)
        .text
          margin 0 0 8px 40px
          display block
          font-size 12px
          line-height 18px
          color rgb(7, 17, 27)
        .recommend
          margin-left 40px
          .icon
            display: inline-block
            margin-right 16px
            font-size 12px
            vertical-align top
            line-height 16px
            color rgb(183, 187, 191)
            &.icon-thumb_up
              color rgb(0, 160, 220)
          .item
            display inline-block
            padding 0 6px
            margin 0 8px 4px 0
            border-radius 2px
            border 1px solid rgba(7, 17, 27, 0.1)
            font-size 9px
            line-height 16px
            color rgb(147, 153, 159)
        .time
          position absolute
          right 0
          top 18px
          font-size 10px
          font-weight 200px
          color rgb(147, 153, 159)
</style>
