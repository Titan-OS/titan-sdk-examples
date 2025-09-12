import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import GuardedView from '../views/GuardedView.vue'

const router = createRouter({
  // Using createWebHashHistory is STRONGLY recommended for TV and embedded devices.
  // It's more resilient and doesn't rely on server-side configuration.
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      // This is the new route for the page that simulates the navigation guard issue.
      path: '/guarded',
      name: 'guarded',
      component: GuardedView
    }
  ]
})

export default router

