<template>
  <div class="view-container home-view">
    <header class="view-header text-center">
      <h1>欢迎来到 BigCreative</h1>
    </header>

    <section class="main-view-content">
      <div v-if="productStore.isLoadingCategories" class="status-message-container loading-state">
        <p>正在加载分类信息...</p>
      </div>
      <div v-else-if="productStore.mainCategories.length" class="mt-2">
        <h2>探索主要分类</h2>
        <div class="parent-category-grid">
          <router-link
              v-for="pCategory in productStore.mainCategories"
              :key="pCategory.name" :to="`/main-category/${encodeURIComponent(pCategory.name)}`"
              class="parent-category-card card text-center"
          >
            <div class="parent-category-image-wrapper">
              <img
                  :src="pCategory.imageUrl || defaultParentCategoryImage(pCategory.name)"
                  :alt="pCategory.name"
                  class="parent-category-image"
                  @error="handleImageError($event, pCategory.name)"
              />
            </div>
            <h3>{{ pCategory.name }}</h3>
          </router-link>
        </div>
      </div>
      <div v-else-if="!productStore.isLoadingCategories && productStore.mainCategories.length === 0 && !productStore.error" class="status-message-container empty-state">
        <p>暂时没有主要分类可供探索。</p>
      </div>
      <div v-else-if="productStore.error" class="status-message-container error-state">
        <p>加载分类失败: {{ productStore.error }}</p>
      </div>


      <div v-if="productStore.isLoadingRecommendations" class="status-message-container loading-state">
        <p>正在加载推荐商品...</p>
      </div>
      <div v-else-if="productStore.recommendedProducts.length">
        <h2>推荐商品</h2>
        <div class="product-grid">
          <ProductCard
              v-for="product in productStore.recommendedProducts"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>
      <div v-else-if="!productStore.isLoadingRecommendations && productStore.recommendedProducts.length === 0 && !productStore.error" class="status-message-container empty-state">
        <p>暂时没有推荐商品。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useProductStore } from '@/store/products'; //
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();

// 简单的为大类提供默认图片的方法 (可以根据需要扩展)
const defaultParentCategoryImages = {
  '运动器材': '/images/parent-sports-equipment.jpg',
  '健康监测': '/images/parent-health-monitoring.jpg',
  '食物': '/images/parent-food.jpg',
  '运动周边': '/images/parent-sports-accessories.jpg',
  'default': '/placeholder-parent-category-image.png' // 通用备用图片
};

function defaultParentCategoryImage(mainCategoryName) {
  return defaultParentCategoryImages[mainCategoryName] || defaultParentCategoryImages['default'];
}

function handleImageError(event, mainCategoryName) {
  event.target.src = defaultParentCategoryImages['default'];
}

onMounted(() => {
  // 首先获取所有分类数据，这样 mainCategories 才能计算出来
  productStore.fetchCategories(); //
  productStore.fetchRecommendedProducts(); //
});
</script>

<style scoped>
/* 样式基本可以保持和上次讨论的一致 */
/* .parent-category-grid, .parent-category-card, etc. */
.parent-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: calc(var(--spacing-unit) * 3);
  margin-top: var(--spacing-unit);
  margin-bottom: calc(var(--spacing-unit) * 3);
}

@media (min-width: 768px) {
  .parent-category-grid {
    /* 4个大类，在中大屏幕上可以设置为2x2 */
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1200px) {
  .parent-category-grid {
    /* 或者在大屏幕上仍然是2列，但卡片更宽，或者4列并排 */
    grid-template-columns: repeat(4, 1fr); /* 例如4列 */
  }
}


.parent-category-card {
  padding: calc(var(--spacing-unit) * 1.5);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white-color);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
}

.parent-category-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: var(--box-shadow-hover);
}

.parent-category-image-wrapper {
  width: 100%;
  padding-top: 60%; /* 例如 5:3 宽高比 */
  position: relative;
  margin-bottom: calc(var(--spacing-unit) * 1.5);
  overflow: hidden;
  border-radius: var(--border-radius);
  background-color: var(--light-color);
}

.parent-category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.parent-category-card h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-top: auto;
  line-height: 1.4;
  padding: var(--spacing-unit) ;
  width: 100%;
}

.main-view-content h2 {
  margin-top: calc(var(--spacing-unit) * 3);
  margin-bottom: calc(var(--spacing-unit) * 1.5);
}
.main-view-content .mt-2 h2 { /* 确保探索分类标题与其他部分标题一致 */
  margin-top: 0;
}
</style>