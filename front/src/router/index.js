import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/Auth.vue'
import Home from '../views/Home.vue'
import Account from '../views/Account.vue'
import Signup from '../components/Signup.vue'
import Login from '../components/Login.vue'
import PublicationDetail from '../components/PublicationDetail.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: '/auth/signup',
        name: 'Signup',
        component: Signup
      },
      {
        path: '/auth/login',
        name: 'Login',
        component: Login
      },
    ]
  },
  {
    path: '/users/:userName',
    name: 'Account',
    component: Account,
    children: [
      //   {
      //   path: "/publications/:id",
      //   name: 'PubliDetail',
      //   component: PublicationDetail
      // }
    ]
  },
  {
    path: "/users/:userName/publications/:id",
    name: 'PubliDetail',
    component: PublicationDetail
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
 
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
