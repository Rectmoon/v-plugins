import { h } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: {
      render: () => h('h1', 'hello')
    }
  },
  {
    path: '/dropdown',
    name: 'DropDown',
    component: () =>
      import(/* webpackChunkName: "DropDown" */ '../views/DropDown.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
