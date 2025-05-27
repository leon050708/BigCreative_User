// src/services/api.js
import axios from 'axios';

// 从环境变量获取 API 基础 URL，如果没有则使用默认值
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    getProducts(params = {}) { // params: { categoryId, recommended, searchTerm }
        const queryParams = {};
        if (params.categoryId) queryParams.categoryId = params.categoryId;
        if (params.recommended !== undefined) queryParams.recommended = params.recommended;
        if (params.searchTerm) queryParams.searchTerm = params.searchTerm; // searchTerm 参数名不变

        return apiClient.get('/products', { params: queryParams });
    },
    getProductById(id) {
        return apiClient.get(`/products/${id}`);
    },
    getCategories() {
        // 注意：我们已将此端点移至 CategoryController
        return apiClient.get('/categories');
    },
    createOrder(orderData) {
        // orderData 结构应为 { items: [{ productId: Long, quantity: Integer }] }
        return apiClient.post('/orders', orderData);
    },
    getOrders() {
        return apiClient.get('/orders');
    },
    getOrderById(id) {
        return apiClient.get(`/orders/${id}`);
    }
};