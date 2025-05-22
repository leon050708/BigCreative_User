<template>
  <div class="category-section">
    <h3>商品分类</h3>
    <div v-if="productStore.isLoading" class="loading-state">正在加载分类...</div>
    <div v-else-if="productStore.error" class="error-state">{{ productStore.error }}</div>
    <div v-else-if="productStore.categories.length" class="category-grid">
      <router-link
          v-for="category in productStore.categories"
          :key="category.id"
          :to="`/category/${category.id}`"
          class="category-card"
          :aria-label="category.name"
      >
        <img
            :src="category.imageUrl || defaultCategoryImage"
            :alt="category.name + ' 分类图标'"
            class="category-image"
            @error="onImageError"
        />
        <span class="category-name">{{ category.name }}</span>
      </router-link>
    </div>
    <div v-else class="empty-state">暂无分类</div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/store/products';
import { onMounted, ref } from 'vue';

const productStore = useProductStore();
// 提供一个备用图片，以防 category.imageUrl 加载失败或为空
const defaultCategoryImage = ref('https://via.placeholder.com/100x100/cccccc/000000?text=N/A');

onMounted(() => {
  if (!productStore.categories.length || productStore.categories.some(cat => !cat.imageUrl)) { // 如果分类为空或某些分类缺少图片URL，则重新获取
    productStore.fetchCategories();
  }
});

// 图片加载失败时的处理函数
const onImageError = (event) => {
  event.target.src = defaultCategoryImage.value; // 加载失败则显示备用图片
};
</script>

<style scoped>
.category-section {
  background-color: #fff;
  padding: 20px; /* 增加内边距 */
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.1));
  margin-bottom: calc(var(--spacing-unit, 8px) * 3); /* 与其他部分的间距 */
}

.category-section h3 {
  margin-top: 0;
  margin-bottom: calc(var(--spacing-unit, 8px) * 2); /* 16px */
  color: var(--dark-color, #333);
  text-align: center; /* 标题居中 */
  font-size: 1.5rem; /* 调整标题大小 */
  border-bottom: none; /* 移除之前的下划线 */
}

.category-grid {
  display: grid;
  /* 根据您希望每行显示多少个来调整，这里是自适应数量 */
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: calc(var(--spacing-unit, 8px) * 2); /* 卡片间距 16px */
  padding-top: var(--spacing-unit, 8px); /* 顶部留出一些空间 */
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--spacing-unit, 8px) * 1.5); /* 12px */
  text-decoration: none;
  color: var(--text-color, #333);
  border-radius: var(--border-radius, 8px);
  background-color: #f8f9fa; /* 卡片背景色 */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: var(--primary-color, #3498db);
}

.category-image {
  width: 60px; /* 根据图标大小调整 */
  height: 60px; /* 根据图标大小调整 */
  object-fit: cover; /* 或 contain，取决于您的图片类型 */
  margin-bottom: calc(var(--spacing-unit, 8px) * 1); /* 图片和文字间距 8px */
  border-radius: 50%; /* 如果想要圆形图片/图标背景 */
  background-color: #fff; /* 给图片一个白色背景，如果图片本身是透明的 */
  padding: 5px; /* 如果图片本身没有留白，可以加一点内边距 */
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
}

.category-name {
  font-size: 0.9rem; /* 调整文字大小 */
  text-align: center;
  /* 防止文字过长换行影响布局 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 确保文字在卡片内 */
}

/* 加载、错误、空状态的样式 (如果需要，可以从全局CSS继承或自定义) */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 1.1em;
  margin-top: 10px;
}
.error-state {
  color: var(--danger-color, #e74c3c);
}
</style>