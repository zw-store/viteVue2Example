import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '',
    component: () => import('@/views/dashboard'),
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
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
    path: '/test2',
    component: () => import('@/views/test2'),
  },
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

export default router
