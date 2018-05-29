import Vue from 'vue'
import Router from 'vue-router'
import Goods from '../components/goods.vue'
import Seller from '../components/seller.vue'
import Ratings from '../components/ratings.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: Seller
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: Ratings
    }
  ]
})
