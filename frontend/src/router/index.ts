import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

// Replace these imports with your actual component paths
// import Diners from '../views/Diners.vue'
// import Tables from '../views/Tables.vue'
// import Reservations from '../views/Reservations.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/diners',
        name: 'diners',
        // Replace with your actual component or use lazy loading
        component: () => import('../views/Diners.vue')
    },
    {
        path: '/tables',
        name: 'tables',
        // Replace with your actual component or use lazy loading
        component: () => import('../views/Tables.vue')
    },
    {
        path: '/reservations',
        name: 'reservations',
        // Replace with your actual component or use lazy loading
        component: () => import('../views/Reservations.vue')
    },
    // Add more routes as needed for your specific context
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router