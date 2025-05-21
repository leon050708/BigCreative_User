// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CartView from '../views/CartView.vue';
import CategoryProductsView from '../views/CategoryProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import MyOrdersView from '../views/MyOrdersView.vue'; // <--- 添加这一行

const routes = [
    // ... (其他路由保持不变)
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/cart',
        name: 'Cart',
        component: CartView,
    },
    {
        path: '/category/:categoryId',
        name: 'CategoryProducts',
        component: CategoryProductsView,
        props: true
    },
    {
        path: '/product/:productId',
        name: 'ProductDetail',
        component: ProductDetailView,
        props: true
    },
    { // --- 新增：我的订单页路由 ---
        path: '/my-orders',
        name: 'MyOrders',
        component: MyOrdersView
    },
    {
        path: '/search',
        name: 'Search',
        component: HomeView,
        props: route => ({ searchTerm: route.query.q })
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;