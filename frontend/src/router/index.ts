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
  // Rutas para las mesas
  {
    path: '/mesas',
    component: () => import('../pages/Mesas/Index.vue'),
  },
  {
    path: '/mesas/nuevo',
    component: () => import('../pages/Mesas/Create.vue'),
  },
  {
    path: '/mesas/editar/:id',
    component: () => import('../pages/Mesas/Edit.vue'),
  },
  // Rutas para las reservas
  {
    path: '/reservas',
    component: () => import('../pages/Reservas/Index.vue'),
  },
  {
    path: '/reservas/nuevo',
    component: () => import('../pages/Reservas/views/Create.vue'),
  },
  {
    path: '/reservas/editar/:id',
    component: () => import('../pages/Reservas/views/Edit.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
