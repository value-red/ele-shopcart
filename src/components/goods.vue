<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for='(item,index) in goods'
            class="menu-item"
            :class="{current: currentIndex===index}"
            @click="selectMenu(index)"
            :key='index'>
          <div class="menu-name border-1px">
            <span class="icon" v-if="item.type>=0" :class="classMap[item.type]"></span>
            <span class=name>{{item.name}}</span>
          </div>
          <div class="food-count" v-show="selectFoods[index]>0">{{selectFoods[index]}}</div>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list" ref="foodList" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.name" class="food-item" @click="selectFoodDesc(food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57"/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice">&#165;{{food.price}}</span>
                  <span v-if="food.oldPrice" class="oldPrice">&#165;{{food.oldPrice}}</span>
                </div>
                <div class="btn-wrapper">
                  <keep-alive>
                    <cartcontrol :food="food" @add="addFood" @dec="decFood"></cartcontrol>
                  </keep-alive>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <food-desc
      :food="selectedFood" ref="foodDesc"
      @add="addFood"
      @dec="decFood">
    </food-desc>
    <shopcart
      :minPrice="seller.minPrice"
      :deliveryPrice="seller.deliveryPrice"
      :cartFoods="cartFoods"
      @add="addFood"
      @dec="decFood"
      @empty="empty"
      ref="shopcart">
    </shopcart>
  </div>
</template>

<script>
  import IScroll from 'iscroll/build/iscroll-probe'
  import shopcart from './shopcart'
  import cartcontrol from './cartcontrol'
  import foodDesc from './foodDesc'

  export default {
    props: ['seller'],
    created () {
      this.$axios.get('/api/goods')
        .then(res => {
          res = res.data
          if (res.errno === 0) {
            this.goods = res.data
            // iscroll 不会自动刷新必须使用在内容已经渲染完毕的组件上
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
            })
          }
        })
        .catch(error => {
          alert(error)
        })
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        cartFoods: [],
        // 商品栏滚动的偏移量
        scrollY: 0,
        // 被选中并且要展示在商品详情页的食品
        selectedFood: {},
        classMap: ['decrease', 'discount', 'special', 'guarantee', 'invoice']
      }
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let h1 = this.listHeight[i]
          let h2 = this.listHeight[i + 1]
          if (this.scrollY >= h1 && this.scrollY < h2) {
            return i
          }
        }
        return 0
      },
      // 存储用户选择的商品单价及数量
      selectFoods () {
        let foods = [] // 用来装购物车中商品的数组
        let menuCount = {} // 用来展示 menu中不同分类产品数量的对象
        let menuIdenx = 0
        this.goods.forEach(good => {
          let foodcount = 0
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food)
              foodcount += food.count
            }
          })
          menuCount[menuIdenx] = foodcount
          menuIdenx += 1
        })
        this.refreshCartFoods(foods)
        return menuCount
      }
    },
    methods: {
      _initScroll () {
        this.menuScroll = new IScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new IScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        })
        let self = this
        // 给foodList做滚动监听
        this.foodsScroll.on('scroll', function () {
          self.scrollY = Math.abs(Math.round(this.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodList
        // 获取每一组左上角的y轴坐标
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _drop (target) {
//        console.log(target)
        // 如果将ref属性绑定到自定义组件上,该ref代表的是自定义组件实例对象
        // 可以直接调用子组件的属性和方法(父组件调用子组件方法就是通过ref)
        let shopcart = this.$refs.shopcart
        shopcart.drop(target)
      },
      selectMenu (index) {
        if (index !== this.currentIndex) {
          let height = this.listHeight[index] + 2
          this.foodsScroll.scrollTo(0, -height, 300)
        }
      },
      refreshCartFoods (foods) {
        this.cartFoods = foods
      },
      addFood ({food, target, drop}) {
        if (!food.count) {
          this.$set(food, 'count', 1)
        } else {
          food.count++
        }
        if (!drop) { // 该参数不存在代表需要下落小球
          this._drop(target)
        }
      },
      decFood ({food}) {
        food.count--
      },
      empty () {
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              food.count = 0
            }
          })
        })
      },
      selectFoodDesc (food) {
        this.selectedFood = food
        this.$refs.foodDesc.show()
      }
    },
    components: {
      shopcart,
      cartcontrol,
      foodDesc
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    top 168px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        position relative
        width 56px
        height 54px
        padding 0 12px
        line-height 14px
        font-size 0
        display table
        &.current
          position: relative
          z-index 10
          background #fff
          font-weight 700
          margin-top -1px
        .menu-name
          /*利用table-cell实现垂直居中*/
          display table-cell
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display inline-block
            vertical-align top
            margin-left 2px
            width 12px
            height 12px
            iconImg("../common/img/", 3)
            background-size 12px 12px
            background-repeat no-repeat
          .name
            font-size 12px
        .food-count
          position absolute
          right 0
          top: 5px
          width 14px
          height 14px
          line-height 12px
          border-radius 50% 50% 50% 0
          font-size 9px
          font-weight 700
          color #fff
          background-color rgb(240, 20, 20)
          text-align center
    .foods-wrapper
      flex 1
      font-size 0
      .title
        padding-left 14px
        border-left 2px solid #d9dde1
        font-size 12px
        line-height 26px
        height 26px
        background #f3f5f7
        color rgb(147, 153, 159)
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
          img
            border-radius 4px
        .content
          flex 1
          .name
            margin 2px 0 8px
            font-size 14px
            line-height 14px
            color rgb(7, 17, 27)
          .description, .extra
            font-size 12px
            line-height 12px
            color rgb(147, 153, 159)
            margin-bottom 8px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            color rgb(147, 153, 159)
            .newPrice
              font-size 14px
              color rgb(240, 20, 20)
              margin-right 8px
            .oldPrice
              font-size 10px
              text-decoration line-through
          .btn-wrapper
            position absolute
            right 0
            bottom 12px
</style>
