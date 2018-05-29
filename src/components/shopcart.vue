<template>
  <div class="footer">
    <div class="content" @click="fadeToggle">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight: totalCount>0}"><i class="icon-shopping_cart"></i></div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price">&#165;12</div>
        <div class="desc">另需配送费&#165;{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="play" :class="{enough:totalPrice>=minPrice}">{{payBtnText}}</div>
      </div>
    </div>
    <div class="ball-wrapper">
      <div v-for="(ball,index) in balls" :key="index">
        <transition name="drop"
                    @before-enter="beforeDrop"
                    @enter="droping"
                    @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="shopcart-list" v-show="listShow">
        <div class='list-head'>
          <div class="title">购物车</div>
          <div class="empty" @click="()=>{this.$emit('empty')}">清空</div>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="(food,index) in cartFoods" class="food border-1px" :key="index">
              <div class="list-left">
                <span class="foodname">{{food.name}}</span>
              </div>
              <div class="list-right">
                <div class="price">
                  <span>&#165;{{food.price}}</span>
                </div>
                <div class="btn-wrapper">
                  <cartcontrol @add="add" @dec="dec" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="listShow" @click="hideList"></div>
    </transition>

  </div>
</template>

<script>
  import cartcontrol from './cartcontrol'
  import IScorll from 'iscroll/build/iscroll-probe'

  export default {
    props: {
      minPrice: {
        type: Number,
        default: 0
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      cartFoods: {
        type: Array,
        // 类型为引用数据类型的默认值必须是一个工厂函数
        default () {
          return []
        }
      }
    },
    data () {
      return {
        fadeIn: true,
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: []
      }
    },
    components: {
      cartcontrol
    },
    computed: {
      totalPrice () {
        let price = 0
        this.cartFoods.forEach(f => {
          price += f.count * f.price
        })
        return price
      },
      totalCount () {
        let count = 0
        this.cartFoods.forEach(f => {
          count += f.count
        })
        return count
      },
      payBtnText () {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差¥${this.minPrice - this.totalPrice}元起送`
        } else {
          return '立即购买'
        }
      },
      listShow () {
        if (!this.totalCount) {
          /* eslint-disable */
          this.fadeIn = true
          return false
        }
        let show = !this.fadeIn
        if (show) {
          this.$nextTick(() => {
            if (!this.scorll) {
              this.scorll = new IScorll(this.$refs.listContent, {
                click: true
              })
            } else {
              // 当Iscoll容器内容发生变化时刷新 iscorll
              this.scorll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      fadeToggle () {
        if (!this.totalCount) {
          return
        }
        this.fadeIn = !this.fadeIn
      },
      hideList () {
        this.fadeIn = true
      },
      add (item) {
        this.$emit('add', {...item, drop: true})
      },
      dec (item) {
        this.$emit('dec', item)
      },
      drop (target) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) { // 小球还未展示,将此小球作为将要下落的小球
            ball.show = true
            ball.el = target
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop (el) { // el小球自身
        // 倒叙取小球防止当前一个小球还没下落完毕,就出现第二个小球
        // 这时balls第一个对象为true 但是我们需要第二个
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) { // 该小球要起飞
            // 获取小球起飞的位置
            let rect = ball.el.getBoundingClientRect() //获取元素相对于窗口的位置
            let x = rect.left - 32
            // logo中心的位置距离按钮的位置就是小球偏移量  38 => 22bottom + 16 小球高度
            let y = -(window.innerHeight - rect.top - 38) // 小球向上的偏移量
            el.style.webkitTransform = `translate3D(0,${y}px,0)`
            el.style.transform = `translate3D(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner')[0]
            inner.style.webkitTransform = `translate3D(${x}px,0,0)`
            inner.style.transform = `translate3D(${x}px,0,0)`
          }
        }
      },
      droping (el, done) {
        let rf = el.offsetWidth
        this.$nextTick(() => {
          el.style.webkitTransform = `translate3D(0,0,0)`
          el.style.transform = `translate3D(0,0,0)`
          let inner = el.getElementsByClassName('inner')[0]
          inner.style.webkitTransform = `translate3D(0,0,0)`
          inner.style.transform = `translate3D(0,0,0)`
          el.addEventListener('webkitTransitionEnd', done)
          el.addEventListener('transitionEnd', done)
          // Done 一定要有代表该函数执行完毕,调用下个动画声明周期钩子
          // 如果不执行done,动画将停在此函数不在向下执行
        })
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift() //先下落完成的小球肯定在dropBalls第一个
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/mixin.styl"
  .footer
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 46px
    .content
      display flex
      background #141d27
      color rgba(255, 255, 255, 0.4)
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -12px
          width 44px
          height 44px
          padding 6px
          margin 0 12px
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0, 160, 220)
              .icon-shopping_cart
                color rgb(255, 255, 255)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color rgba(255, 255, 255, 0.4)
          .num
            position absolute
            right 0
            top 0
            width 24px
            height 16px
            line-height 16px
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            text-align center
        .price
          display: inline-block
          font-size 16px
          font-weight 700
          line-height 24px
          margin 12px 0
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.4)
          &.highlight
            color #fff
        .desc
          display inline-block
          font-size 10px
          font-weight 200
          line-height 24px
          margin 12px 0
          padding-left 12px
      .content-right
        flex 0 0 105px
        width 105px
        background #2b343c
        .play
          font-size 13px
          font-weight 700
          height 46px
          line-height 46px
          text-align center
          padding 0 8px
          &.enough
            background #00b43c
            color white
    .ball-wrapper
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.46, -0.3, 0.75, -0.15)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      width 100%
      z-index -1
      transition all .4s
      transform translateY(-100%)
      &.fade-enter, &.fade-leave-to
        transform translateY(0)
      .list-head
        height 40px
        line-height 40px
        background #f3f5f7
        padding 0 18px
        .title
          float left
          font-size 14px
          font-weight 200
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        background #fff
        width 100%
        max-height 217px
        overflow hidden
        .food
          display flex
          margin 0 18px
          padding 12px 0
          height 48px
          line-height 24px
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .list-left
            flex 1
          .list-right
            flex 0 0 110px
            width 110px
            position relative
            .price
              position absolute
              left 0
              font-size 14px
              line-height 24px
              font-weight 700
              color rgb(240, 20, 20)
            .btn-wrapper
              position absolute
              right 0
              top -6px
    .mask
      position fixed
      left 0
      top 0
      width 100%
      height 100%
      opacity 1
      background rgba(7, 17, 27, 0.6)
      z-index -2
      transition all 0.4s
      &.fade-enter, &.fade-leave-to
        opacity 0
        background rgba(7, 17, 27, 0)
</style>
