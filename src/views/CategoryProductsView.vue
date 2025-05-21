<template>
  <div class="category-products-view">
    <h2 v-if="categoryName">属于 “{{ categoryName }}” 分类的商品</h2>
    <h2 v-else>分类商品</h2>

    <div v-if="productStore.isLoading" class="loading-state">正在加载商品...</div>
    <div v-else-if="productStore.error" class="error-state">{{ productStore.error }}</div>
    <div v-else-if="productStore.currentCategoryProducts.length" class="product-grid">
      <ProductCard
          v-for="product in productStore.currentCategoryProducts"
          :key="product.id"
          :product="product"
      />
    </div>
    <div v-else class="empty-state">该分类下暂无商品。</div>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
import { useProductStore } from '@/store/products';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  categoryId: { // 从路由接收
    type: String,
    required: true
  }
});

const productStore = useProductStore();

const categoryName = computed(() => {
  const cat = productStore.categories.find(c => c.id === props.categoryId);
  return cat ? cat.name : props.categoryId;
});

// 初始加载和当 categoryId 变化时重新加载
const loadProducts = () => {
  if (props.categoryId) {
    productStore.fetchProductsByCategory(props.categoryId);
  }
  // 确保分类信息已加载，以便显示分类名称
  if (!productStore.categories.length) {
    productStore.fetchCategories();
  }
};

onMounted(loadProducts);
watch(() => props.categoryId, loadProducts); // 监听路由参数变化
</script>

<style scoped>
.category-products-view {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.category-products-view h2 {
  margin-top: 0;
  color: #34495e;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
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
.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.back-link:hover {
  background-color: #2980b9;
}
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>