<template>
  <div class="card product-card">
    <router-link :to="`/product/${product.id}`" class="product-image-link">
      <img :src="product.imageUrl || '/placeholder-image.png'" :alt="product.name" class="product-image">
    </router-link>
    <div class="product-info">
      <h3 class="product-name">
        <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
      </h3>
      <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
      <p v-if="product.category" class="product-category">{{ product.category.name }}</p>
    </div>
    <div class="card-actions">
      <button @click="addToCart" class="btn btn-primary btn-block">加入购物车</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useCartStore } from '@/store/cart'; //

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

function addToCart() {
  cartStore.addItem(props.product, 1); //
  alert(`${props.product.name} 已加入购物车!`);
  // 考虑使用更友好的通知方式
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 让卡片内容垂直分布 */
}
.product-image-link {
  display: block; /* 让链接占据图片区域 */
  text-align: center; /* 图片居中 */
  padding: var(--spacing-unit); /* 图片周围留白 */
}
.product-image {
  max-width: 100%;
  height: 180px; /* 固定高度，保持卡片大小一致 */
  object-fit: cover; /* 或 contain，根据图片特性选择 */
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-unit);
}
.product-info {
  padding: 0 var(--spacing-unit) var(--spacing-unit); /* 信息区域内边距 */
  text-align: center; /* 文字居中 */
  flex-grow: 1; /* 让信息区占据可用空间 */
}
.product-name {
  font-size: 1.1rem;
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.product-name a {
  text-decoration: none;
  color: var(--dark-color);
}
.product-name a:hover {
  color: var(--primary-color);
}
.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.product-category {
  font-size: 0.85rem;
  color: var(--text-color-light);
  margin-bottom: var(--spacing-unit);
}
.card-actions {
  padding: var(--spacing-unit);
  border-top: 1px solid var(--border-color);
  margin-top: auto; /* 将按钮推到底部 */
}
.btn-block { /* 如果需要按钮占满卡片宽度 */
  width: 100%;
  display: block;
}
.card-actions .btn:not(:last-child) {
  margin-bottom: var(--spacing-unit); /* 如果有多个按钮 */
}
</style>