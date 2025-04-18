import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/comensales',
    component: () => import('../pages/Comensales/Index.vue'),
  },
  {
    path: '/comensales/nuevo',
    component: () => import('../pages/Comensales/Create.vue'),
  },
  {
    path: '/comensales/editar/:id',
    component: () => import('../pages/Comensales/Edit.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
