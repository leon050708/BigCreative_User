// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CartView from '../views/CartView.vue';
import SubCategoryView from '../views/SubCategoryView.vue';
import ProductListView from '../views/ProductListView.vue'; // <--- 引入新的视图
import ProductDetailView from '../views/ProductDetailView.vue';
import MyOrdersView from '../views/MyOrdersView.vue'; //
import OrderDetailView from '../views/OrderDetailView.vue';

const routes = [
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
        path: '/main-category/:mainCategoryNameParam', // :mainCategoryNameParam 是为了清晰区分
        name: 'SubCategoryList',
        component: SubCategoryView,
        props: true // 将 mainCategoryNameParam 作为 prop 传递
    },
    {
        path: '/category/:categoryId/products', // categoryId 是小类的ID
        name: 'CategoryProducts',
        component: ProductListView, // <--- 改为指向 ProductListView
        props: route => ({
            categoryId: route.params.categoryId
        })
    },
    {
        path: '/product/:productId',
        name: 'ProductDetail',
        component: ProductDetailView,
        props: true
    },
    {
        path: '/my-orders',
        name: 'MyOrders',
        component: MyOrdersView
    },
    {
        path: '/search',
        name: 'Search',
        component: ProductListView, // <--- 改为指向 ProductListView
        props: route => ({
            searchTerm: route.query.q
        })
    },
    {
        path: '/order-detail/:orderId', // 使用 orderId 作为参数
        name: 'OrderDetail',
        component: OrderDetailView,
        props: true // 将路由参数 orderId 作为 prop 传递给组件
    },
    {
        path: '/search',
        name: 'Search',
        component: ProductListView,
        props: route => ({ searchTerm: route.query.q })
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;