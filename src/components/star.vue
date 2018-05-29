<template>
  <div class="star" :class='starType'>
    <span v-for="(item,index) in itemClasses" class="star-item" :class="item" :key="index"></span>
  </div>
</template>

<script>
  const LENGTH = 5
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        while (result.length < LENGTH) {
          if (result.length + 1 <= score) { // 3.5  1 1 1 0.5
            result.push('on')
          } else if (result.length + 1 === Math.ceil(score) && score % 1 !== 0) {
            result.push('half')
          } else {
            result.push('off')
          }
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/mixin.styl"
  .star
    font-size 0
    .star-item
      background-repeat no-repeat
    &.star-48
      .star-item
        display inline-block
        width 20px
        height 20px
        margin-right 20px
        background-size 20px 20px
        &:last-child
          margin-right 0
        &.on
          bg-image("../common/img/star48_on")
        &.off
          bg-image("../common/img/star48_off")
        &.half
          bg-image("../common/img/star48_half")
    &.star-36
      .star-item
        display inline-block
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image("../common/img/star36_on")
        &.off
          bg-image("../common/img/star36_off")
        &.half
          bg-image("../common/img/star36_half")
    &.star-24
      .star-item
        display inline-block
        width 10px
        height 10px
        margin-right 2px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image("../common/img/star24_on")
        &.off
          bg-image("../common/img/star24_off")
        &.half
          bg-image("../common/img/star24_half")
</style>
