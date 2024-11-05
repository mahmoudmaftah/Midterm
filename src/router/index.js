import { createRouter, createWebHistory } from 'vue-router'


import Home from '../views/home.vue'
import Auth from '../views/auth.vue'
import Profile from '../views/profile.vue'

const routes = [
  { path: '/Home', component: Home },
  { path: '/Auth', component: Auth },
  { path: '/Profile', component: Profile }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
