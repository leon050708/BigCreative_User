<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="product-image-link">
      <img :src="product.imageUrl" :alt="product.name" class="product-image" />
    </router-link>
    <div class="product-info">
      <router-link :to="`/product/${product.id}`" class="product-name-link">
        <h3 class="product-name">{{ product.name }}</h3>
      </router-link>
      <p class="product-category">{{ product.category.name }}</p>
      <p class="product-description">{{ truncatedDescription }}</p>
      <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
      <p class="product-stock">库存: {{ product.stock }}</p>
    </div>
    <button @click="addToCartHandler" class="add-to-cart-btn" :disabled="product.stock === 0">
      {{ product.stock === 0 ? '已售罄' : '加入购物车' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/store/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const addToCartHandler = () => {
  if (props.product.stock > 0) {
    cartStore.addItem(props.product); // 从卡片添加，默认数量为1
    alert(`${props.product.name} 已添加到购物车!`);
  }
};

const truncatedDescription = computed(() => {
  const maxLength = 60;
  if (props.product.description.length > maxLength) {
    return props.product.description.substring(0, maxLength) + '...';
  }
  return props.product.description;
});
</script>

<style scoped>
/* ... (样式与之前响应 #6 中的 ProductCard.vue 相同) ... */
.product-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transform: translateY(-3px);
}

.product-image-link, .product-name-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.product-name-link {
  color: #333;
}
.product-name-link:hover .product-name {
  color: #3498db;
}

.product-image {
  max-width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
  transition: opacity 0.3s ease;
}
.product-card:hover .product-image {
  opacity: 0.85;
}

.product-info {
  flex-grow: 1;
  padding: 0 5px;
}
.product-name {
  font-size: 1.2em;
  margin: 10px 0 5px;
  transition: color 0.3s ease;
  line-height: 1.3em;
  max-height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.product-category {
  font-size: 0.9em;
  color: #777;
  margin-bottom: 8px;
}
.product-description {
  font-size: 0.9em;
  color: #555;
  min-height: 3.6em;
  line-height: 1.3;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.product-price {
  font-size: 1.3em;
  font-weight: bold;
  color: #e74c3c;
  margin: 10px 0;
}
.product-stock {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 15px;
}
.add-to-cart-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.3s;
  width: 100%;
}
.add-to-cart-btn:hover:not(:disabled) {
  background-color: #27ae60;
}
.add-to-cart-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>