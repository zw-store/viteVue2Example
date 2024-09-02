import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '',
    component: () => import('@/views/dashboard'),
  },
  {
    path: '/user',
    component: () => import('@/views/user'),
  },
  {
    path: '/client',
    component: () => import('@/views/client'),
  },
  {
    path: '/camera',
    component: () => import('@/views/camera'),
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
  },
  {
    path: '/test2',
    component: () => import('@/views/test2'),
  },
  {
    path: '/other',
    component: () => import('@/views/other'),
  },
  {
    path: '/waterfall',
    component: () => import('@/views/waterfall'),
  },
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

export default router
