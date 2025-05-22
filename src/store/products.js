// src/store/products.js
import { defineStore } from 'pinia';
import api from '@/services/api'; // <--- 导入新的API服务
import { ref } from 'vue';

export const useProductStore = defineStore('products', () => {
    const products = ref([]);
    const categories = ref([]);
    const recommendedProducts = ref([]);
    const currentCategoryProducts = ref([]); // 用于分类页
    const searchResults = ref([]);
    const currentProduct = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const isLoadingRecommendations = ref(false); // 用于推荐商品
    const isLoadingSearch = ref(false);       // 用于搜索结果
    const isLoadingProductList = ref(false);  // 用于通用产品列表（如果其他地方需要）
    const isLoadingDetails = ref(false);      // 用于单个产品详情

    async function fetchRecommendedProducts() {
        isLoadingRecommendations.value = true;
        // ... api call ...
        isLoadingRecommendations.value = false;
    }

    async function searchProducts(searchTerm) {
        isLoadingSearch.value = true;
        // ... api call ...
        isLoadingSearch.value = false;
    }

    async function fetchAndSetProducts(apiCall, targetRef, errorMessagePrefix) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiCall();
            targetRef.value = response.data; // Axios data is in response.data
        } catch (err) {
            console.error(errorMessagePrefix, err);
            error.value = `${errorMessagePrefix}: ${err.response?.data?.message || err.message || '未知错误'}`;
            targetRef.value = []; // 出错时清空
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchProducts() {
        await fetchAndSetProducts(api.getProducts, products, '获取产品列表失败');
    }

    async function fetchRecommendedProducts() {
        await fetchAndSetProducts(() => api.getProducts({ recommended: true }), recommendedProducts, '获取推荐产品失败');
    }

    async function fetchCategories() {
        await fetchAndSetProducts(api.getCategories, categories, '获取分类列表失败');
    }

    async function fetchProductsByCategory(categoryId) {
        await fetchAndSetProducts(() => api.getProducts({ categoryId: categoryId }), currentCategoryProducts, `获取分类 ${categoryId} 产品失败`);
    }

    async function searchProducts(searchTerm) {
        await fetchAndSetProducts(() => api.getProducts({ searchTerm: searchTerm }), searchResults, '搜索产品失败');
    }

    async function fetchProductById(productId) {
        isLoading.value = true;
        error.value = null;
        currentProduct.value = null;
        try {
            const response = await api.getProductById(productId);
            currentProduct.value = response.data;
            if (!currentProduct.value) {
                error.value = '产品未找到。';
            }
        } catch (err) {
            console.error('获取产品详情失败', err);
            error.value = `获取产品详情失败: ${err.response?.data?.message || err.message || '未知错误'}`;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        products, categories, recommendedProducts, currentCategoryProducts,
        searchResults, currentProduct, isLoading, error,
        fetchProducts, fetchRecommendedProducts, fetchCategories,
        fetchProductsByCategory, searchProducts, fetchProductById,isLoadingRecommendations,
        isLoadingSearch
    };
});