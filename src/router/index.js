import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

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
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  const { name, path, query } = location || {}
  const trigger = query ? query.trigger : ''
  if (trigger !== 'tags') {
    const routes = router.getRoutes()
    let route
    if (path) route = routes.find(item => item.path === path)
    if (name) route = routes.find(item => item.name === name)
    route && store.commit('tagsView/DEL_CACHED_VIEW', route)
  }
  return originalPush.call(this, location).catch(err => err)
}

export default router
