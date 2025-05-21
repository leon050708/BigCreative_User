<template>
  <div class="home-view">
    <div class="hero-section">
      <h1>欢迎来到 Vue 商城</h1>
      <p>发现最新、最棒的商品</p>
      <SearchBar @search="handleSearch" class="home-search-bar" />
    </div>

    <section class="recommendations" v-if="productStore.recommendedProducts.length && !productStore.isLoading">
      <h2>店长推荐</h2>
      <div class="product-grid">
        <ProductCard
            v-for="product in productStore.recommendedProducts"
            :key="product.id"
            :product="product"
        />
      </div>
    </section>
    <div v-else-if="productStore.isLoading" class="loading-state">正在加载推荐商品...</div>

    <div class="main-content-area">
      <aside class="sidebar">
        <CategoryList />
      </aside>
      <section class="all-products">
        <h2>
          {{ currentTitle }}
          <span v-if="props.searchTerm" @click="clearSearch" class="clear-search-btn" title="清除搜索结果">&times;</span>
        </h2>
        <div v-if="productStore.isLoading" class="loading-state">正在加载商品...</div>
        <div v-else-if="productStore.error" class="error-state">{{ productStore.error }}</div>
        <div v-else-if="displayedProducts.length" class="product-grid">
          <ProductCard
              v-for="product in displayedProducts"
              :key="product.id"
              :product="product"
          />
        </div>
        <div v-else class="empty-state">
          <p v-if="props.searchTerm">没有找到与 "{{ props.searchTerm }}" 相关的商品。</p>
          <p v-else>暂无商品展示。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '@/store/products';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import CategoryList from '@/components/CategoryList.vue';
import SearchBar from '@/components/SearchBar.vue';

const props = defineProps({
  searchTerm: { // 从路由接收搜索词
    type: String,
    default: ''
  }
});

const productStore = useProductStore();
const router = useRouter();
const localSearchTerm = ref(props.searchTerm); // 本地搜索词，用于显示

const displayedProducts = computed(() => {
  if (localSearchTerm.value) {
    return productStore.searchResults;
  }
  return productStore.products; // 默认显示所有产品
});

const currentTitle = computed(() => {
  if (localSearchTerm.value) {
    return `搜索结果: "${localSearchTerm.value}"`;
  }
  return "所有商品";
});

onMounted(async () => {
  productStore.fetchRecommendedProducts();
  if (props.searchTerm) {
    localSearchTerm.value = props.searchTerm;
    await productStore.searchProducts(props.searchTerm);
  } else {
    // 仅当没有搜索词且产品列表为空时加载所有产品
    if (!productStore.products.length) {
      productStore.fetchProducts();
    }
  }
  // 分类列表组件会自己获取分类数据
});

// 监听路由传递的 searchTerm 变化
watch(() => props.searchTerm, async (newTerm) => {
  localSearchTerm.value = newTerm || '';
  if (newTerm) {
    await productStore.searchProducts(newTerm);
  } else {
    // 如果从搜索结果页通过导航回到首页（searchTerm变为空）
    // 可以选择重新加载所有产品，或者依赖缓存
    if (!productStore.products.length && !productStore.isLoading) {
      productStore.fetchProducts();
    }
    productStore.searchResults = []; // 清空搜索结果
  }
});

const handleSearch = async (searchTerm) => {
  if (searchTerm.trim()) {
    router.push({ name: 'Search', query: { q: searchTerm } });
  } else {
    router.push('/'); // 清除搜索，返回首页
  }
};

const clearSearch = () => {
  router.push('/');
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.hero-section {
  background-color: #e9ecef;
  padding: 40px 20px;
  text-align: center;
  border-radius: 8px;
}
.hero-section h1 {
  margin-top: 0;
  font-size: 2.5em;
  color: #333;
}
.hero-section p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 20px;
}
.home-search-bar {
  max-width: 600px;
  margin: 0 auto;
}

.recommendations, .all-products {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.recommendations h2, .all-products h2 {
  margin-top: 0;
  color: #34495e;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-search-btn {
  cursor: pointer;
  font-size: 1.5em;
  color: #95a5a6;
  padding: 0 5px;
}
.clear-search-btn:hover {
  color: #e74c3c;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 1.1em;
}
.error-state {
  color: #e74c3c;
}

.main-content-area {
  display: flex;
  gap: 20px;
}
.sidebar {
  flex: 0 0 250px; /* 固定宽度，不伸缩 */
}
.all-products {
  flex-grow: 1; /* 占据剩余空间 */
}

@media (max-width: 768px) {
  .main-content-area {
    flex-direction: column;
  }
  .sidebar {
    flex: 0 0 auto; /* 恢复自动宽度 */
    width: 100%;
    margin-bottom: 20px;
  }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>