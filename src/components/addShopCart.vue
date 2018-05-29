<template>
  <transition name='fadeOut'>
    <div class="add-shopcart" @click.stop.prevent="add($event)">
      <div class="text">加入购物车</div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'cartControl',
    props: ['food'],
    methods: {
      add (event) {
        this.$emit('add', {food: this.food, target: event.target})
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .add-shopcart
    position absolute
    right 5px
    bottom 7px
    height 24px
    width 74px
    line-height 24px
    padding 0 12px
    box-sizing border-box
    border-radius 12px
    background rgb(0, 160, 220)
    text-align center
    font-size 0
    transition all .2s linear
    opacity 1
    &.fadeOut-enter, &.fadeOut-leave-to
      opacity 0
      transform scaleY(0)
    .text
      color #fff
      font-size 10px

</style>
