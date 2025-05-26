<template>
  <div class="home-view">
    <div class="hero-section">
      <h1>欢迎来到商城</h1>
      <SearchBar @search="handleSearch" class="home-search-bar" />
      <br>
      <CategoryList />
    </div>

    <section
        class="recommendations"
        v-if="!localSearchTerm && productStore.recommendedProducts.length && !productStore.isLoadingRecommendations"
    >
      <h2>推荐商品</h2>
      <div class="product-grid">
        <ProductCard
            v-for="product in productStore.recommendedProducts"
            :key="product.id"
            :product="product"
        />
      </div>
    </section>
    <div v-else-if="!localSearchTerm && productStore.isLoadingRecommendations" class="loading-state">
      正在加载推荐商品...
    </div>

    <div class="main-content-area" v-if="localSearchTerm">
      <section class="search-results-products">
        <h2>
          {{ currentTitle }}
          <span v-if="localSearchTerm" @click="clearSearch" class="clear-search-btn" title="清除搜索结果">&times;</span>
        </h2>
        <div v-if="productStore.isLoadingSearch" class="loading-state">正在加载搜索结果...</div>
        <div v-else-if="productStore.error" class="error-state">{{ productStore.error }}</div>
        <div v-else-if="displayedProducts.length" class="product-grid">
          <ProductCard
              v-for="product in displayedProducts"
              :key="product.id"
              :product="product"
          />
        </div>
        <div v-else class="empty-state">
          <p>没有找到与 "{{ localSearchTerm }}" 相关的商品。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '@/store/products';
import { useRouter, useRoute } from 'vue-router'; // 引入 useRoute
import ProductCard from '@/components/ProductCard.vue';
import CategoryList from '@/components/CategoryList.vue';
import SearchBar from '@/components/SearchBar.vue';

const props = defineProps({
  // searchTerm prop 仍然可以保留，如果直接通过 prop 传递搜索词（尽管通常从路由获取）
  // 但由于我们现在主要依赖路由，可以考虑移除或使其优先级低于路由参数
  // searchTerm: {
  //   type: String,
  //   default: ''
  // }
});

const productStore = useProductStore();
const router = useRouter();
const route = useRoute(); // 使用 useRoute 来访问当前路由的 query 参数

// localSearchTerm 现在主要由路由的 query.q 初始化和更新
const localSearchTerm = ref(route.query.q || '');

// 为推荐和搜索结果分别管理加载状态 (在 store 中实现会更好)
// 为了快速演示，这里假设 store 中有 isLoadingRecommendations 和 isLoadingSearch
// 如果没有，可以先统一用 productStore.isLoading，但体验上分开更好
// 我们需要稍微修改 Pinia store 来支持这个，或者在这里用局部变量模拟
// 为简化，这里我们先继续用 store 里的 isLoading 和 error, 但要确保它们被正确设置

const displayedProducts = computed(() => {
  // 这个计算属性现在只服务于搜索结果
  return productStore.searchResults;
});

const currentTitle = computed(() => {
  if (localSearchTerm.value) {
    return `搜索结果: "${localSearchTerm.value}"`;
  }
  // 当不显示搜索结果时，这个标题理论上用不到
  return "商品列表"; // 或者可以返回空字符串
});

onMounted(async () => {
  // 总是获取推荐商品
  productStore.fetchRecommendedProducts();

  // 检查路由中是否已有搜索词 (例如，用户直接访问带搜索参数的URL)
  const initialSearchTerm = route.query.q;
  if (initialSearchTerm) {
    localSearchTerm.value = initialSearchTerm;
    await productStore.searchProducts(initialSearchTerm);
  } else {
    // 如果没有初始搜索词，确保搜索结果为空
    productStore.searchResults = [];
  }
});

// 监听路由 query.q 的变化
watch(() => route.query.q, async (newTerm) => {
  const term = newTerm || '';
  localSearchTerm.value = term;
  if (term) {
    await productStore.searchProducts(term);
  } else {
    // 当搜索词清空时 (例如通过 clearSearch 或导航到首页)
    productStore.searchResults = []; // 清空搜索结果
    // 推荐商品应该已经在 onMounted 时获取，或者如果需要，可以在这里重新获取
    // if (!productStore.recommendedProducts.length) {
    //   productStore.fetchRecommendedProducts();
    // }
  }
});

const handleSearch = (searchTerm) => {
  const trimmedSearchTerm = searchTerm.trim();
  if (trimmedSearchTerm) {
    // 更新路由，这将触发上面的 watch
    router.push({ name: 'Home', query: { q: trimmedSearchTerm } });
  } else {
    // 如果搜索框清空并提交，也清除路由中的q参数
    router.push({ name: 'Home', query: {} });
  }
};

const clearSearch = () => {
  // 清除路由中的q参数，这将触发 watch
  router.push({ name: 'Home', query: {} });
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 30px; /* 各个部分之间的间距 */
}

.hero-section {
  /* background-color: #e9ecef; */ /* 可以保留或移除，全局CSS已有背景 */
  background-color: #fff; /* 给顶部一个白色背景，使其与推荐/搜索区区分 */
  padding: 20px; /* 调整内边距 */
  text-align: center;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.05));
}
.hero-section h1 {
  margin-top: calc(var(--spacing-unit, 8px) * 2); /* 调整与搜索框的间距 */
  margin-bottom: calc(var(--spacing-unit, 8px) * 2);
  font-size: 2.2em; /* 调整字体大小 */
  color: var(--dark-color, #333);
}
.home-search-bar {
  max-width: 700px; /* 可以适当加宽 */
  margin: 0 auto calc(var(--spacing-unit, 8px) * 2); /* 底部增加间距 */
}
/* CategoryList 默认会撑开，如果需要限制其宽度或样式，可以在 CategoryList.vue 中调整，或在这里加选择器 */


.recommendations, .search-results-products { /* 改名为 search-results-products */
  background-color: #fff;
  padding: 20px;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.05));
}
.recommendations h2, .search-results-products h2 {
  margin-top: 0;
  color: var(--dark-color, #34495e);
  border-bottom: 1px solid var(--light-color, #f0f0f0); /* 细一点的下划线 */
  padding-bottom: calc(var(--spacing-unit, 8px) * 1.5); /* 12px */
  margin-bottom: calc(var(--spacing-unit, 8px) * 2.5); /* 20px */
  font-size: 1.6em; /* 调整标题大小 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-search-btn {
  cursor: pointer;
  font-size: 1.3em; /* 调整大小 */
  color: #95a5a6;
  padding: 0 8px; /* 调整内边距 */
  background-color: transparent;
  border: none;
}
.clear-search-btn:hover {
  color: var(--danger-color, #e74c3c);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); /* 微调最小宽度 */
  gap: calc(var(--spacing-unit, 8px) * 2.5); /* 20px */
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: calc(var(--spacing-unit, 8px) * 3) calc(var(--spacing-unit, 8px) * 2); /* 24px 16px */
  color: #7f8c8d;
  font-size: 1.1em;
  /* background-color: #f8f9fa; */ /* 可选背景色 */
  /* border-radius: var(--border-radius, 8px); */
  /* margin-top: var(--spacing-unit, 8px) * 2; */
}
.error-state {
  color: var(--danger-color, #e74c3c);
  /* background-color: color-mix(in srgb, var(--danger-color, #e74c3c) 10%, white); */
}

/* main-content-area 现在只包裹搜索结果，之前的 sidebar 相关的 flex 布局不再需要 */
.main-content-area {
  /* 如果需要，可以添加特定于搜索结果区域的样式 */
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 1.8em;
  }
  .recommendations h2, .search-results-products h2 {
    font-size: 1.4em;
  }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 移动端更小的卡片 */
    gap: var(--spacing-unit, 8px); /* 减小间距 */
  }
}
</style>