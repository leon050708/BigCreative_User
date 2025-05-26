// src/store/order.js
import { defineStore } from 'pinia';
import api from '@/services/api'; //
import { ref } from 'vue';

export const useOrderStore = defineStore('orders', () => {
    const orders = ref([]);
    const currentOrderDetails = ref(null); // 新增: 存储当前查看的订单详情
    const isLoading = ref(false);
    const isLoadingDetails = ref(false); // 新增: 单个订单详情的加载状态
    const error = ref(null);

    async function fetchOrders() {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.getOrders(); //
            orders.value = response.data;
        } catch (err) {
            error.value = `获取订单列表失败: ${err.response?.data?.message || err.message || '未知错误'}`;
            console.error(err);
            orders.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function placeOrder(orderItemsPayload) {
        isLoading.value = true; // 或者使用一个 placeOrderLoading 状态
        error.value = null;
        try {
            const response = await api.createOrder(orderItemsPayload); //
            const newOrder = response.data;
            orders.value.unshift(newOrder); // 添加到列表开头
            return newOrder;
        } catch (err) {
            error.value = `创建订单失败: ${err.response?.data?.message || err.message || '未知错误'}`;
            console.error(err);
            throw err; // 抛出错误，以便组件中可以捕获
        } finally {
            isLoading.value = false;
        }
    }

    // --- 新增: 获取单个订单详情的 action ---
    async function fetchOrderById(orderId) {
        isLoadingDetails.value = true;
        error.value = null;
        currentOrderDetails.value = null;
        try {
            // 假设您的 api service 中有 getOrderById 方法
            // 如果没有，您需要先在 src/services/api.js 中添加它：
            // getOrderById(id) { return apiClient.get(`/orders/${id}`); },
            const response = await api.getOrderById(orderId); // 确保 api.js 中有此方法
            currentOrderDetails.value = response.data;
            if (!currentOrderDetails.value) {
                error.value = '订单未找到。';
            }
        } catch (err) {
            console.error(`获取订单 ${orderId} 详情失败`, err);
            error.value = `获取订单详情失败: ${err.response?.data?.message || err.message || '未知错误'}`;
        } finally {
            isLoadingDetails.value = false;
        }
    }

    return {
        orders,
        currentOrderDetails,
        isLoading,
        isLoadingDetails,
        error,
        fetchOrders,
        placeOrder,
        fetchOrderById, // 暴露新的 action
    };
});