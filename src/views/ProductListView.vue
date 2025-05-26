<template>
  <div class="view-container product-list-view">
    <header class="view-header">
      <h1>{{ effectivePageTitle }}</h1>
      <p v-if="productsToDisplay.length" class="subtitle">共找到 {{ productsToDisplay.length }} 件相关商品</p>
    </header>

    <section class="main-view-content">
      <div v-if="isLoading" class="status-message-container loading-state">
        <p>正在加载商品...</p>
      </div>
      <div v-else-if="error" class="status-message-container error-state">
        <p>加载商品失败: {{ error }}</p>
        <button @click="fetchProductsList" class="btn btn-primary mt-2">重试</button>
      </div>
      <div v-else-if="productsToDisplay.length === 0" class="status-message-container empty-state">
        <p>没有找到符合条件的商品。</p>
        <router-link to="/" class="btn btn-secondary mt-2">返回首页</router-link>
      </div>
      <div v-else class="product-grid">
        <ProductCard v-for="product in productsToDisplay" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/store/products'; //
import ProductCard from '@/components/ProductCard.vue'; // 假设您有这个组件

const props = defineProps({
  categoryId: String, // 从路由接收的小类ID (来自 /category/:categoryId/products)
  searchTerm: String, // 从路由接收的搜索词 (来自 /search?q=...)
});

const productStore = useProductStore();
const productsToDisplay = ref([]);
const isLoading = ref(false);
const error = ref(null); // 用于存储此视图特定的错误信息

const effectivePageTitle = computed(() => {
  if (props.categoryId) {
    // 尝试从已加载的分类数据中获取分类名称
    const category = productStore.categories.find(cat => cat.id === props.categoryId);
    return category ? `分类: ${category.name}` : '分类商品';
  }
  if (props.searchTerm) {
    return `搜索结果: "${props.searchTerm}"`;
  }
  return '商品列表';
});

async function fetchProductsList() {
  isLoading.value = true;
  error.value = null;
  productsToDisplay.value = []; // 清空旧数据

  try {
    if (props.categoryId) {
      await productStore.fetchProductsByCategory(props.categoryId); //
      if (productStore.error) { // 检查 store 中的错误状态
        throw new Error(productStore.error);
      }
      productsToDisplay.value = productStore.currentCategoryProducts; //
    } else if (props.searchTerm) {
      await productStore.searchProducts(props.searchTerm); //
      if (productStore.error) { // 检查 store 中的错误状态
        throw new Error(productStore.error);
      }
      productsToDisplay.value = productStore.searchResults; //
    } else {
      // 如果没有 categoryId 和 searchTerm，可以选择加载所有产品或显示提示
      // await productStore.fetchProducts();
      // productsToDisplay.value = productStore.products;
      productsToDisplay.value = []; // 或者不加载任何内容
      // error.value = "未指定分类或搜索词。"; // 可选提示
    }
  } catch (errCaught) {
    console.error("Error fetching products in ProductListView:", errCaught);
    error.value = typeof errCaught === 'string' ? errCaught : (errCaught.message || '加载商品时发生未知错误。');
  } finally {
    // 根据 productStore 中相应的 loading 状态来设置，而不是全局 isLoading
    if (props.categoryId) {
      isLoading.value = productStore.isLoading; // 假设 fetchProductsByCategory 更新全局 isLoading
    } else if (props.searchTerm) {
      isLoading.value = productStore.isLoadingSearch; //
    } else {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  // 确保在尝试获取分类名称之前，分类列表已加载
  if (productStore.categories.length === 0 && !productStore.isLoadingCategories) {
    productStore.fetchCategories().then(() => { //
      fetchProductsList();
    });
  } else {
    fetchProductsList();
  }
});

// 监听 props 的变化，以便在路由参数改变时重新加载数据
watch(() => [props.categoryId, props.searchTerm], () => {
  fetchProductsList();
});

</script>

<style scoped>
/* 复用 .product-grid, .card 等样式，或者为此视图定义特定样式 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 与 HomeView.vue 中推荐商品一致 */
  gap: calc(var(--spacing-unit) * 2.5); /* 与 HomeView.vue 中推荐商品一致 */
}

.view-header h1 {
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.view-header .subtitle {
  font-size: 1rem;
  color: var(--text-color-light);
  margin-bottom: calc(var(--spacing-unit) * 2);
}

/* 可以在这里添加面包屑导航的样式 (如果实现的话) */
.breadcrumbs {
  margin-bottom: calc(var(--spacing-unit) * 2);
  font-size: 0.9rem;
}
.breadcrumbs a {
  color: var(--primary-color);
  text-decoration: none;
}
.breadcrumbs a:hover {
  text-decoration: underline;
}
.breadcrumbs span {
  color: var(--text-color-light);
}
</style>