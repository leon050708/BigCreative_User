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
// ... (您的 <script setup> 内容保持不变) ...
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '@/store/products';
import { useRouter, useRoute } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import CategoryList from '@/components/CategoryList.vue';
import SearchBar from '@/components/SearchBar.vue';

const productStore = useProductStore();
const router = useRouter();
const route = useRoute();

const localSearchTerm = ref(route.query.q || '');

const displayedProducts = computed(() => {
  return productStore.searchResults;
});

const currentTitle = computed(() => {
  if (localSearchTerm.value) {
    return `搜索结果: "${localSearchTerm.value}"`;
  }
  return "商品列表";
});

onMounted(async () => {
  productStore.fetchRecommendedProducts();
  const initialSearchTerm = route.query.q;
  if (initialSearchTerm) {
    localSearchTerm.value = initialSearchTerm;
    await productStore.searchProducts(initialSearchTerm);
  } else {
    productStore.searchResults = [];
  }
});

watch(() => route.query.q, async (newTerm) => {
  const term = newTerm || '';
  localSearchTerm.value = term;
  if (term) {
    await productStore.searchProducts(term);
  } else {
    productStore.searchResults = [];
  }
});

const handleSearch = (searchTerm) => {
  const trimmedSearchTerm = searchTerm.trim();
  if (trimmedSearchTerm) {
    router.push({ name: 'Home', query: { q: trimmedSearchTerm } });
  } else {
    router.push({ name: 'Home', query: {} });
  }
};

const clearSearch = () => {
  router.push({ name: 'Home', query: {} });
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit, 8px) * 4); /* 增加主要区块之间的间距 (32px) */
}

.hero-section {
  background-color: var(--white-color, #fff);
  padding: calc(var(--spacing-unit, 8px) * 3.5) calc(var(--spacing-unit, 8px) * 2); /* 28px 16px */
  text-align: center;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0,0,0,0.07));
  /* border-bottom: 1px solid var(--border-color, #eee); */ /* 移除，让阴影提供区分 */
}

.hero-section h1 {
  margin-top: 0; /* 因为 .hero-section 有 padding-top */
  margin-bottom: calc(var(--spacing-unit, 8px) * 3); /* 24px */
  font-size: 2.4em; /* 略微增大 */
  color: var(--primary-color, #6b2248); /* 欢迎语使用主色 */
  font-weight: 700; /* 加粗 */
}

.home-search-bar {
  max-width: 650px; /* 可以微调 */
  margin: 0 auto calc(var(--spacing-unit, 8px) * 3); /* 24px */
}
/* CategoryList 会在下方单独美化 */

.recommendations, .search-results-products {
  background-color: var(--white-color, #fff);
  padding: calc(var(--spacing-unit, 8px) * 3) calc(var(--spacing-unit, 8px) * 2); /* 24px 16px */
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 10px rgba(0,0,0,0.07));
}

.recommendations h2, .search-results-products h2 {
  margin-top: 0;
  color: var(--primary-color, #6b2248); /* 区块标题也使用主色 */
  border-bottom: 2px solid var(--primary-color, #6b2248); /* 下划线也用主色 */
  padding-bottom: calc(var(--spacing-unit, 8px) * 1.25); /* 10px */
  margin-bottom: calc(var(--spacing-unit, 8px) * 3); /* 24px */
  font-size: 1.8em; /* 增大标题 */
  font-weight: 600;
  text-align: left; /* 标题靠左，如果需要居中则 text-align: center; */
  display: flex; /* 保持 flex 以便清除按钮能靠右 */
  justify-content: space-between;
  align-items: center;
}

.clear-search-btn { /* 保持不变或按需微调 */
  cursor: pointer;
  font-size: 1.3em;
  color: #95a5a6;
  padding: 0 calc(var(--spacing-unit, 8px));
  background-color: transparent;
  border: none;
}
.clear-search-btn:hover {
  color: var(--danger-color, #e74c3c);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* 调整最小宽度 */
  gap: calc(var(--spacing-unit, 8px) * 2.5); /* 20px */
}

/* 加载、错误、空状态样式可以保持，全局CSS中可能已有定义 */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: calc(var(--spacing-unit, 8px) * 3) calc(var(--spacing-unit, 8px) * 2);
  color: var(--text-color-light, #7f8c8d);
  font-size: 1.1em;
  margin-top: calc(var(--spacing-unit, 8px) * 2);
}
.error-state {
  color: var(--danger-color, #e74c3c);
}

/* --- 响应式调整 --- */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  }
  .hero-section h1 {
    font-size: 2em;
  }
  .recommendations h2, .search-results-products h2 {
    font-size: 1.6em;
  }
}

@media (max-width: 768px) {
  .home-view {
    gap: calc(var(--spacing-unit, 8px) * 3); /* 24px */
  }
  .hero-section {
    padding: calc(var(--spacing-unit, 8px) * 2.5) var(--spacing-unit, 8px); /* 20px 8px */
  }
  .hero-section h1 {
    font-size: 1.8em;
    margin-bottom: calc(var(--spacing-unit, 8px) * 2); /* 16px */
  }
  .home-search-bar {
    margin-bottom: calc(var(--spacing-unit, 8px) * 2); /* 16px */
  }
  .recommendations, .search-results-products {
    padding: calc(var(--spacing-unit, 8px) * 2); /* 16px */
  }
  .recommendations h2, .search-results-products h2 {
    font-size: 1.4em;
    margin-bottom: calc(var(--spacing-unit, 8px) * 2); /* 16px */
  }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: calc(var(--spacing-unit, 8px) * 1.5); /* 12px */
  }
}

@media (max-width: 576px) {
  .hero-section h1 {
    font-size: 1.6em;
  }
  .recommendations h2, .search-results-products h2 {
    font-size: 1.3em;
    text-align: center; /* 小屏幕标题居中 */
  }
  .clear-search-btn { /* 小屏幕上可能不需要清除按钮，或做得非常小 */
    font-size: 1.1em;
  }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); /* 卡片更小 */
    /* 或者单列显示：grid-template-columns: 1fr; */
    gap: var(--spacing-unit, 8px);
  }
}
</style>