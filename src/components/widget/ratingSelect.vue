<template>
  <div class="rating-select">
    <div class="select-type border-1px">
      <div class="inline-block positive"
           :class="{active:rateConfig.selectType===2}"
           @click="$emit('select',2)">
        <span class="type">{{rateConfig.desc.all}}</span>
        <span class="count">{{ratings.length}}</span>
      </div>
      <div class="inline-block positive"
           :class="{active:rateConfig.selectType===0}"
           @click="$emit('select',0)">
        <span class="type">{{rateConfig.desc.positive}}</span>
        <span class="count">{{positves.length}}</span>
      </div>
      <div class="inline-block negative"
           :class="{active:rateConfig.selectType===1}"
           @click="$emit('select',1)">
        <span class="type">{{rateConfig.desc.negative}}</span>
        <span class="count">{{negatves.length}}</span>
      </div>
    </div>
    <div class="has-content"
         :class="{on:rateConfig.onlyContent}"
         @click="$emit('toggle')">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NAGATIVE = 1
  const All = 2
  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      /* 传递商品评论的默认参数 */
      rateConfig: {
        type: Object,
        default () {
          return {
            selectType: All,
            onlyContent: false,
            desc: {
              all: '全部',
              positive: '满意',
              negative: '不满意'
            }
          }
        }
      }
    },
    computed: {
      positves () {
        return this.ratings.filter(r => r.rateType === POSITIVE)
      },
      negatves () {
        return this.ratings.filter(r => r.rateType === NAGATIVE)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .rating-select
    .select-type
      padding-bottom 18px
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .inline-block
        display inline-block
        font-size 12px
        line-height 16px
        padding 8px 12px
        margin-right 6px
        border-radius 2px
        color rgb(77, 85, 93)
        &.positive
          background rgba(0, 160, 220, 0.2)
          &.active
            background rgb(0, 160, 220)
            color #fff
        &.negative
          background rgba(77, 85, 93, 0.2)
          &.active
            background rgb(77, 85, 93)
            color #fff
    .has-content
      padding 12px 18px
      color rgb(147, 153, 159)
      font-size 0
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      &.on
        .icon-check_circle
          color rgb(0, 160, 220)
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        font-size 12px
        line-height 24px
</style>
