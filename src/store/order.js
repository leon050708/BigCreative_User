// src/store/order.js
import { defineStore } from 'pinia';
import api from '@/services/api'; // <--- 导入新的API服务
import { ref } from 'vue';

export const useOrderStore = defineStore('orders', () => {
    const orders = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchOrders() {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.getOrders();
            orders.value = response.data;
        } catch (err) {
            error.value = `获取订单列表失败: ${err.response?.data?.message || err.message || '未知错误'}`;
            console.error(err);
            orders.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function placeOrder(orderItemsPayload) { // payload: { items: [{ productId, quantity }] }
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.createOrder(orderItemsPayload);
            const newOrder = response.data;
            orders.value.unshift(newOrder); // 添加到列表开头
            return newOrder;
        } catch (err) {
            error.value = `创建订单失败: ${err.response?.data?.message || err.message || '未知错误'}`;
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return { orders, isLoading, error, fetchOrders, placeOrder };
});