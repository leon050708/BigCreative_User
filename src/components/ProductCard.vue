<template>
  <div class="product-card card">
    <router-link :to="`/product/${product.id}`" class="product-image-link">
      <div class="image-container">
        <img
            :src="product.imageUrl"
            :alt="product.name"
            class="product-image"
            @error="handleImageError"
        />
        <div v-if="imageLoadFailed || isPlaceholderTextVisible" class="image-placeholder-text">
          {{ product.name.substring(0, 10) }}... {/* 或者一个通用图标 */}
        </div>
      </div>
    </router-link>
    <div class="product-info">
      <router-link :to="`/product/${product.id}`" class="product-name-link">
        <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
      </router-link>
      <p class="product-category" v-if="product.category">{{ product.category.name }}</p>
      <p class="product-description" :title="product.description">{{ truncatedDescription }}</p>

      <div class="product-meta">
        <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
        <p class="product-stock">库存: {{ product.stock }}</p>
      </div>
    </div>
    <button
        @click="addToCartHandler"
        class="add-to-cart-btn btn btn-primary"
        :disabled="product.stock === 0"
    >
      {{ product.stock === 0 ? '已售罄' : '加入购物车' }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCartStore } from '@/store/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const imageLoadFailed = ref(false);

// 一个简单的判断，如果图片URL是那个固定的Bing URL，并且我们想强制显示备用文本
// 您可以根据实际情况调整这个逻辑，或者如果图片内容真的是“测试商品”，这个逻辑可能不需要
const isPlaceholderTextVisible = computed(() => {
  // 如果你的 Bing URL 返回的图片就是 "测试商品" 字样，你可能需要一种方式来判断
  // 这里我们先假设图片加载失败时显示备用文本
  return imageLoadFailed.value;
});


const handleImageError = (event) => {
  imageLoadFailed.value = true;
  // 可选: 设置一个备用图片
  // event.target.src = 'https://via.placeholder.com/300x200/cccccc/000000?text=Image+Error';
};

const addToCartHandler = () => {
  if (props.product.stock > 0) {
    cartStore.addItem(props.product);
    alert(`${props.product.name} 已添加到购物车!`);
  }
};

const truncatedDescription = computed(() => {
  const maxLength = 45; // 根据卡片大小调整描述长度
  if (props.product.description && props.product.description.length > maxLength) {
    return props.product.description.substring(0, maxLength) + '...';
  }
  return props.product.description;
});
</script>

<style scoped>
/* .card class 继承自全局 main.css */

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  height: 100%; /* 使卡片在网格中高度一致 */
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow-hover, 0 6px 16px rgba(0,0,0,0.12));
}

.product-image-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.image-container {
  width: 100%;
  padding-top: 75%; /* 创建一个4:3的宽高比容器 (300/4*3 = 225, or use aspect-ratio) */
  /* 如果想要1:1的图片容器，可以用 padding-top: 100%; */
  position: relative;
  background-color: var(--light-color, #f4f7f9); /* 图片加载时的背景色 */
  border-radius: var(--border-radius, 8px) var(--border-radius, 8px) 0 0; /*顶部圆角*/
  overflow: hidden; /* 确保图片不溢出 */
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片覆盖整个容器，可能会裁剪 */
  /* object-fit: contain; */ /* 图片完整显示在容器内，可能会留白 */
  transition: transform 0.3s ease;
}
.product-card:hover .product-image {
  transform: scale(1.05); /* 图片轻微放大效果 */
}

.image-placeholder-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color-light, #777);
  text-align: center;
  padding: 10px;
  user-select: none;
}


.product-info {
  padding: calc(var(--spacing-unit, 8px) * 1.5) calc(var(--spacing-unit, 8px) * 1.75); /* 12px 14px */
  text-align: left; /* 信息靠左对齐 */
  flex-grow: 1; /* 占据剩余空间，使得按钮能靠底 */
  display: flex;
  flex-direction: column;
}

.product-name-link {
  text-decoration: none;
}

.product-name {
  font-size: 1.1em; /* 名称字体稍大 */
  font-weight: 600;
  color: var(--dark-color, #2c3e50);
  margin-bottom: calc(var(--spacing-unit, 8px) * 0.5); /* 4px */
  line-height: 1.3;
  /* 最多显示两行，超出部分显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.3em * 2); /* 为两行文本预留最小高度 */
  transition: color 0.2s ease;
}
.product-name-link:hover .product-name {
  color: var(--primary-color, #6b2248);
}

.product-category {
  font-size: 0.8em;
  color: var(--text-color-light, #777);
  margin-bottom: calc(var(--spacing-unit, 8px) * 1); /* 8px */
}

.product-description {
  font-size: 0.85em;
  color: var(--text-color-light, #555);
  line-height: 1.4;
  margin-bottom: calc(var(--spacing-unit, 8px) * 1.5); /* 12px */
  /* 最多显示三行 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 减少到2行，给价格和库存留空间 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.4em * 2);
  flex-grow: 1; /* 使描述区域尽可能填充，将价格和按钮推到底部 */
}

.product-meta {
  margin-top: auto; /* 将价格和库存推到 .product-info 的底部 */
  padding-top: calc(var(--spacing-unit, 8px) * 1); /* 与描述的间隔 */
}

.product-price {
  font-size: 1.35em; /* 价格字体更大更突出 */
  font-weight: bold;
  color: var(--dark-color, #333333); /* 价格用深色文字 */
  margin-bottom: calc(var(--spacing-unit, 8px) * 0.25); /* 2px */
}

.product-stock {
  font-size: 0.85em;
  color: var(--text-color-light, #888);
  margin-bottom: calc(var(--spacing-unit, 8px) * 1); /* 8px */
}

.add-to-cart-btn {
  /* 使用全局 .btn 和 .btn-primary 样式 */
  width: calc(100% - (var(--spacing-unit, 8px) * 3.5)); /* 按钮宽度，左右留出内边距 */
  margin: 0 auto calc(var(--spacing-unit, 8px) * 1.5); /* 底部及左右居中 */
  padding-top: calc(var(--spacing-unit, 8px) * 1.1); /* 调整按钮内边距 */
  padding-bottom: calc(var(--spacing-unit, 8px) * 1.1);
  font-weight: 500;
}
</style>