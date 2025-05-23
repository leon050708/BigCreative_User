<template>
  <div class="category-section-inner"> <h3>商品分类</h3>
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
const defaultCategoryImage = ref('https://th.bing.com/th/id/R.96d68d283e87b2a93dd88da383716d7a?rik=%2fyTvHniN%2bmXaPw&pid=ImgRaw&r=0&sres=1&sresct=1'); // 使用用户提供的图片

onMounted(() => {
  if (!productStore.categories.length || productStore.categories.some(cat => !cat.imageUrl)) {
    productStore.fetchCategories();
  }
});

const onImageError = (event) => {
  event.target.src = defaultCategoryImage.value;
};
</script>

<style scoped>
.category-section-inner {
  padding-top: calc(var(--spacing-unit, 8px) * 2); /* 与上方元素的间距 */
  /* background-color: var(--white-color, #fff); /* 此区块不再需要独立背景，它在hero-section内 */
  /* border-radius: var(--border-radius, 8px); */
  /* box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.1)); */
}

.category-section-inner h3 {
  margin-top: 0;
  margin-bottom: calc(var(--spacing-unit, 8px) * 2.5); /* 20px */
  color: var(--dark-color, #333); /* 分类标题用深色文字 */
  text-align: center;
  font-size: 1.4rem; /* 调整标题大小 */
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); /* 卡片更小，以便在一行容纳更多 */
  gap: calc(var(--spacing-unit, 8px) * 1.5); /* 卡片间距 12px */
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 顶部对齐 */
  padding: var(--spacing-unit, 8px); /* 减小内边距 */
  text-decoration: none;
  color: var(--text-color-light, #555);
  border-radius: var(--border-radius, 8px);
  background-color: transparent; /* 卡片背景透明，融入hero-section背景 */
  /* border: 1px solid var(--border-color, #eee); 可选的细边框 */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  background-color: color-mix(in srgb, var(--primary-color, #6b2248) 8%, var(--white-color, #fff)); /* 主色调的浅色背景 */
  color: var(--primary-color, #6b2248);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.category-image {
  width: 50px; /* 减小图标/图片尺寸 */
  height: 50px;
  object-fit: cover;
  margin-bottom: calc(var(--spacing-unit, 8px) * 0.75); /* 6px */
  border-radius: 50%; /* 圆形图片 */
  background-color: var(--light-color, #f4f9f9); /* 给图片一个非常浅的背景 */
  padding: 4px; /* 轻微内边距，如果图片本身没有留白 */
  /* box-shadow: 0 1px 2px rgba(0,0,0,0.05); */ /* 可以移除或保留 */
  border: 1px solid var(--border-color, #e0e0e0); /* 给图片一个细边框 */
}

.category-name {
  font-size: 0.8rem; /* 减小分类名称字体 */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.3; /* 调整行高 */
}

/* 响应式调整 CategoryList 内部的网格 */
@media (max-width: 576px) {
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); /* 移动端更小的分类卡片 */
    gap: var(--spacing-unit, 8px);
  }
  .category-section-inner h3 {
    font-size: 1.2rem;
  }
  .category-image {
    width: 40px;
    height: 40px;
  }
  .category-name {
    font-size: 0.75rem;
  }
}
</style>