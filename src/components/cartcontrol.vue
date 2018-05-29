<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline"
           v-show="food.count>0"
           @click.stop.prevent="dec"></div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>

    <div class="cart-add icon-add_circle" @click.stop.prevent="add($event)"></div>
  </div>
</template>

<script>
  export default {
    name: 'cartControl',
    props: ['food'],
    methods: {
      add (event) {
        this.$emit('add', {food: this.food, target: event.target})
      },
      dec () {
        if (this.food.count > 0) {
          this.$emit('dec', {food: this.food})
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cart-control
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      transition all 0.4s linear
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(24px) rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147, 153, 159)
      transition all 0.4s linear
      &.fade-enter, &.fade-leave-to
        opacity 0
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
