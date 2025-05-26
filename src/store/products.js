// src/store/products.js
import { defineStore } from 'pinia';
import api from '@/services/api'; //
import { ref, computed } from 'vue';

export const useProductStore = defineStore('products', () => {
    const products = ref([]);
    // 'categories' 现在存储的是从后端获取的所有分类，每个分类对象都包含 mainCategory 和 description
    const categories = ref([]);
    const recommendedProducts = ref([]);
    const currentCategoryProducts = ref([]);
    const searchResults = ref([]);
    const currentProduct = ref(null);
    const isLoading = ref(false); // 考虑细化或移除全局isLoading
    const error = ref(null);
    const isLoadingRecommendations = ref(false);
    const isLoadingSearch = ref(false);
    const isLoadingCategories = ref(false); // 新增：用于分类加载
    const isLoadingDetails = ref(false);

    // --- 大类相关 ---
    // computed property to get unique main categories from the fetched categories
    const mainCategories = computed(() => {
        if (!categories.value || categories.value.length === 0) {
            return [];
        }
        const mainCategoryMap = new Map();
        categories.value.forEach(cat => {
            if (cat.mainCategory && !mainCategoryMap.has(cat.mainCategory)) {
                // 假设我们为每个大类也需要一个 "ID"。
                // 如果后端没有为大类提供单独的ID或图片，我们可以基于mainCategory名称生成一个，
                // 或者在前端定义大类的图片等元数据。
                // 为了简化，这里我们仅使用 mainCategory 名称作为标识。
                // 后端返回的 category 对象中应该包含 mainCategory 字段。
                mainCategoryMap.set(cat.mainCategory, {
                    // id: cat.mainCategory.toLowerCase().replace(/\s+/g, '-'), // 生成一个ID
                    name: cat.mainCategory,
                    // 假设大类的图片和描述信息需要另外处理或在前端定义
                    // imageUrl: `/images/parent-${cat.mainCategory.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                    // description: `探索 ${cat.mainCategory} 分类下的所有商品`
                });
            }
        });
        return Array.from(mainCategoryMap.values());
    });

    // 根据 mainCategory 名称获取其下所有小类 (这些小类带有自己的description)
    function getSubcategoriesByMainCategoryName(mainCategoryName) {
        return categories.value.filter(cat => cat.mainCategory === mainCategoryName);
    }

    async function fetchAndSetData(apiCall, targetRef, loadingRef, errorMessagePrefix) {
        if (loadingRef) loadingRef.value = true;
        else isLoading.value = true; // Fallback to global isLoading
        error.value = null;
        try {
            const response = await apiCall();
            targetRef.value = response.data;
        } catch (err) {
            console.error(errorMessagePrefix, err);
            error.value = `${errorMessagePrefix}: ${err.response?.data?.message || err.message || '未知错误'}`;
            targetRef.value = [];
        } finally {
            if (loadingRef) loadingRef.value = false;
            else isLoading.value = false;
        }
    }

    async function fetchProducts() {
        await fetchAndSetData(api.getProducts, products, null, '获取产品列表失败');
    }

    async function fetchRecommendedProducts() {
        await fetchAndSetData(() => api.getProducts({ recommended: true }), recommendedProducts, isLoadingRecommendations, '获取推荐产品失败');
    }

    async function fetchCategories() { // 获取所有分类（包含 mainCategory 和 description）
        await fetchAndSetData(api.getCategories, categories, isLoadingCategories, '获取分类列表失败');
    }

    async function fetchProductsByCategory(categoryId) { // categoryId 是小类的ID
        // 这里的 loading 状态可能需要一个 currentCategoryProductsLoading
        await fetchAndSetData(() => api.getProducts({ categoryId: categoryId }), currentCategoryProducts, isLoading, `获取分类 ${categoryId} 产品失败`);
    }

    async function searchProducts(searchTerm) {
        await fetchAndSetData(() => api.getProducts({ searchTerm: searchTerm }), searchResults, isLoadingSearch, '搜索产品失败');
    }

    async function fetchProductById(productId) {
        await fetchAndSetData(() => api.getProductById(productId), currentProduct, isLoadingDetails, '获取产品详情失败');
        if (!currentProduct.value) { // fetchAndSetData 不处理空数据的情况，这里单独处理
            error.value = '产品未找到。';
        }
    }

    return {
        products,
        categories, // 所有分类（小类），每个对象包含 mainCategory 和 description
        recommendedProducts,
        currentCategoryProducts,
        searchResults,
        currentProduct,
        isLoading,
        error,
        isLoadingRecommendations,
        isLoadingSearch,
        isLoadingCategories,
        isLoadingDetails,

        fetchProducts,
        fetchRecommendedProducts,
        fetchCategories,
        fetchProductsByCategory,
        searchProducts,
        fetchProductById,

        mainCategories, // 计算得出的大类列表 (只含名称，可能需要补充图片等元数据)
        getSubcategoriesByMainCategoryName, // 方法：根据大类名称获取小类
    };
});