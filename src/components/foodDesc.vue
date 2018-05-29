<template>
  <transition name="show">
    <div class="food-desc" v-show="showFlag" ref="food">
      <div>
        <div class="image">
          <img :src="food.image"/>
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h2 class="name">{{food.name}}</h2>
          <div class="desc">
            <span class="count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="new-price">&#165;{{food.price}}</span>
            <span class="old-price" v-show="food.oldPrice">&#165;{{food.oldPrice}}</span>
          </div>
          <div class="btn-wrapper">
            <component
              :is='currenAddBtn'
              :food="food"
              @add="_add"
              @dec="_dec">
            </component>
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h2 class="title">商品介绍</h2>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h2 class="title">商品评价</h2>
          <rating-select
            :ratings="food.ratings"
            :rateConfig="rateConfig"
            @select="selectRating"
            @toggle="toggleContent"
          ></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length">
              <li class="rating-item border-1px"
                  v-for="(rating,index) in food.ratings"
                  :key="index"
                  v-show="needShowRating(rating.rateType,rating.text)">
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <div class="rating-text">
                  <i :class="rating.rateType===1?'icon-thumb_down':'icon-thumb_up'"></i>
                  <span class=text>{{rating.text}}</span>
                </div>
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img width="12" height="12" :src="rating.avatar"/>
                </div>
              </li>
            </ul>
            <div class="no-rating"
                 v-show="!food.ratings||!food.ratings.length">暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import cartcontrol from './cartcontrol'
  import addShopCart from './addShopCart'
  import split from './widget/split'
  import ratingSelect from './widget/ratingSelect'
  import IScroll from 'iscroll/build/iscroll-probe'
  import { getTemplateDate } from '../common/js/date'

  export default {
    props: ['food'],
    data () {
      return {
        showFlag: false,
        rateConfig: {
          selectType: 2,
          onlyContent: false,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      }
    },
    computed: {
      currenAddBtn () {
        if (!this.food.count) {
          return 'addShopCart'
        } else {
          return 'cartcontrol'
        }
      }
    },
    methods: {
      show () {
        this.showFlag = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new IScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      selectRating (num) {
        this.rateConfig.selectType = num
        // 刷新页面
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      toggleContent () {
        this.rateConfig.onlyContent = !this.rateConfig.onlyContent
        // 刷新页面
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShowRating (type, text) {
        if (this.rateConfig.onlyContent && !text) {
          return false
        }
        if (this.rateConfig.selectType === 2) {
          return true
        } else if (type === this.rateConfig.selectType) {
          return true
        } else {
          return false
        }
      },
      _add (item) {
        this.$emit('add', item)
      },
      _dec (item) {
        this.$emit('dec', item)
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return getTemplateDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol,
      addShopCart,
      ratingSelect,
      split
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/mixin.styl"
  .food-desc
    position fixed
    left 0
    top 0
    bottom 46px
    width 100%
    z-index 30
    background #fff
    transition all .2s linear
    &.show-enter, &.show-leave-to
      transform translateX(100%)
    .image
      position relative
      width 100%
      height 325px
      img
        width 100%
        height 325px
      .back
        position fixed
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff

    .content
      position relative
      padding 18px
      .name
        margin-bottom 8px
        font-size 14px
        line-height 14px
        font-weight 700
        color rgb(7, 17, 27)
      .desc
        margin-bottom 18px
        font-size 0
        line-height 10px
        color rgb(147, 153, 159)
        .count
          margin-right 12px
          font-size 10px
        .rating
          font-size 10px
      .price
        font-weight 700
        line-height 24px
        font-size 0
        .new-price
          font-size 14px
          color rgb(240, 20, 20)
          margin-right 8px
        .old-price
          font-size 10px
          color rgb(147, 153, 159)
          text-decoration line-through
      .btn-wrapper
        position absolute
        right 12px
        bottom 12px
    .info
      padding 16px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        padding 0 8px
        font-size 12px
        font-weight 200
        color rgb(77, 85, 93)
        line-height 24px
    .rating
      padding-top 18px
      .title
        margin-left 18px
        line-height 14px
        margin-bottom 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        .rating-item
          position relative
          margin 0 18px
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .time
            font-size 10px
            color rgb(147, 153, 159)
            line-height 12px
            margin-bottom 6px
          .rating-text
            font-size 0
            .icon-thumb_down, .icon-thumb_up
              margin-right 4px
              line-height 16px
              font-size 12px
              color rgb(147, 153, 159)
            .icon-thumb_up
              color rgb(0, 160, 220)
            .text
              font-size 12px
              color rgb(7, 17, 27)

          .user
            position absolute
            right 0
            top 18px
            line-height 12px
            font-size 0
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
            img
              border-radius 50%
</style>
