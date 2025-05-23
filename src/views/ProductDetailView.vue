<template>
  <div class="product-detail-view card">
    <div v-if="productStore.isLoadingProductDetails" class="loading-state">
      <p>正在加载产品详情...</p>
    </div>
    <div v-else-if="productStore.error || !product" class="error-state">
      <p>{{ productStore.error || '产品未找到或加载失败。' }}</p>
      <router-link to="/" class="btn btn-outline-primary mt-2">返回首页</router-link>
    </div>
    <div v-else class="product-content">
      <div class="product-image-gallery">
        <div class="image-container-detail">
          <img
              v-if="!imageLoadFailed"
              :src="product.imageUrl"
              :alt="product.name"
              class="main-product-image"
              @error="handleImageError"
          />
          <div v-if="imageLoadFailed" class="image-placeholder-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-image-alt" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              <path d="M12.5 0H3.5A1.5 1.5 0 0 0 2 1.5v13A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0M3 1.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <span>图片加载失败</span>
          </div>
        </div>
        <router-link to="/" class="continue-shopping-link btn btn-outline-secondary btn-sm mt-2">
          &larr; 继续购物
        </router-link>
      </div>

      <div class="product-info-panel">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-category-detail" v-if="product.category">
          分类: <router-link :to="`/category/${product.category.id}`">{{ product.category.name }}</router-link>
        </p>
        <p class="product-price-detail">价格: <span>¥{{ product.price.toFixed(2) }}</span></p>
        <p class="product-stock-detail">库存: {{ product.stock }} 件</p>

        <div class="product-description-full">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>

        <div class="actions">
          <div class="quantity-selector">
            <label for="quantity-display">数量:</label>
            <button
                type="button"
                @click="decrementQuantity"
                :disabled="quantityToAdd <= 1 || product.stock === 0"
                class="quantity-btn"
                aria-label="减少数量"
            >-</button>
            <input
                type="text"
                id="quantity-display"
                :value="quantityToAdd"
                class="quantity-input"
                readonly
            />
            <button
                type="button"
                @click="incrementQuantity"
                :disabled="quantityToAdd >= product.stock || product.stock === 0"
                class="quantity-btn"
                aria-label="增加数量"
            >+</button>
          </div>
          <button
              @click="handleAddToCart"
              class="add-to-cart-button-detail btn btn-primary"
              :disabled="product.stock === 0 || quantityToAdd > product.stock || quantityToAdd <= 0"
          >
            {{ product.stock === 0 ? '已售罄' : (quantityToAdd > product.stock ? '库存不足' : '加入购物车') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useProductStore } from '@/store/products';
import { useCartStore } from '@/store/cart';

const props = defineProps({
  productId: {
    type: String, // 路由参数通常是字符串
    required: true
  }
});

const productStore = useProductStore();
const cartStore = useCartStore();
const quantityToAdd = ref(1); // 默认值为1
const imageLoadFailed = ref(false);
// 备用图片URL，使用您之前提供的Bing图片链接
const defaultProductImage = ref('https://th.bing.com/th/id/R.96d68d283e87b2a93dd88da383716d7a?rik=%2fyTvHniN%2bmXaPw&pid=ImgRaw&r=0&sres=1&sresct=1');

const product = computed(() => productStore.currentProduct);

const loadProduct = async (id) => {
  imageLoadFailed.value = false;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    productStore.error = "无效的产品ID";
    productStore.currentProduct = null; // 清空当前产品
    productStore.isLoadingProductDetails = false; // 确保加载状态结束
    return;
  }
  await productStore.fetchProductById(numericId);

  if (product.value) {
    if (product.value.stock === 0) {
      quantityToAdd.value = 0;
    } else {
      quantityToAdd.value = 1;
    }
  } else {
    // 如果 product.value 为 null (例如 fetchProductById 失败或未找到产品)
    quantityToAdd.value = 1; // 或者 0，取决于您希望如何处理
  }
};

const handleImageError = (event) => {
  imageLoadFailed.value = true;
  // 可选：如果想在<img>标签本身尝试加载备用图，可以取消下面这行的注释
  // event.target.src = defaultProductImage.value;
  // 但当前的模板逻辑是直接显示 .image-placeholder-detail
};

onMounted(() => {
  loadProduct(props.productId);
});

watch(() => props.productId, (newId, oldId) => {
  if (newId && newId !== oldId) { // 确保只在 productId 实际改变时加载
    loadProduct(newId);
  }
});

const handleAddToCart = () => {
  if (!product.value) return;

  if (product.value.stock > 0 && quantityToAdd.value > 0 && quantityToAdd.value <= product.value.stock) {
    cartStore.addItem(product.value, quantityToAdd.value);
    alert(`${quantityToAdd.value} 件 ${product.value.name} 已添加到购物车!`);
  } else if (product.value.stock > 0 && quantityToAdd.value > product.value.stock) {
    alert(`库存不足！${product.value.name} 仅剩 ${product.value.stock} 件。`);
  }
};

const incrementQuantity = () => {
  if (product.value && typeof product.value.stock === 'number' && quantityToAdd.value < product.value.stock) {
    quantityToAdd.value++;
  }
};

const decrementQuantity = () => {
  if (product.value && product.value.stock > 0 && quantityToAdd.value > 1) {
    quantityToAdd.value--;
  } else if (product.value && product.value.stock === 0) {
    // 如果库存为0，数量不应该能从0再减少，但保持为0
    quantityToAdd.value = 0;
  }
  // 如果库存大于0，但数量已经是1，则不应再减少
};
</script>

<style scoped>
/* .card class 会从全局 main.css 继承基础样式 (背景、阴影、圆角、内边距) */
.product-detail-view {
  /* 如果需要覆盖全局 .card 的内边距，可以在此设置 */
  /* padding: calc(var(--spacing-unit, 8px) * 3); */
}

.loading-state, .error-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-color-light, #7f8c8d);
}
.error-state .btn {
  margin-top: calc(var(--spacing-unit, 8px) * 2);
}

.product-content {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: calc(var(--spacing-unit, 8px) * 4); /* 32px */
}

.product-image-gallery {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.image-container-detail {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  background-color: var(--light-color, #f4f7f9);
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  border: 1px solid var(--border-color, #dee2e6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-product-image {
  display: block; /* 确保 v-if 生效时图片正确显示/隐藏 */
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-color-light, #888);
  text-align: center;
  padding: var(--spacing-unit, 8px);
}
.image-placeholder-detail svg {
  width: 50px;
  height: 50px;
  margin-bottom: var(--spacing-unit, 8px);
}
.image-placeholder-detail span {
  font-size: 0.9em;
}

.continue-shopping-link.btn { /* 确保按钮样式应用 */
  margin-top: calc(var(--spacing-unit, 8px) * 2);
  font-size: 0.9em;
  align-self: flex-start; /* 按钮靠左 */
}

.product-info-panel {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 2em;
  color: var(--primary-color, #6b2248);
  font-weight: 700;
  margin-top: 0;
  margin-bottom: calc(var(--spacing-unit, 8px) * 1);
  line-height: 1.3;
}

.product-category-detail {
  font-size: 0.95em;
  color: var(--text-color-light, #7f8c8d);
  margin-bottom: calc(var(--spacing-unit, 8px) * 2);
}
.product-category-detail a {
  color: var(--secondary-color, #7c7dbf);
  text-decoration: none;
  font-weight: 500;
}
.product-category-detail a:hover {
  text-decoration: underline;
  color: color-mix(in srgb, var(--secondary-color, #7c7dbf) 80%, black);
}

.product-price-detail {
  font-size: 1.8em;
  color: var(--dark-color, #2c3e50);
  font-weight: 600;
  margin-bottom: calc(var(--spacing-unit, 8px) * 0.5);
}
.product-price-detail span {
  vertical-align: middle;
}

.product-stock-detail {
  font-size: 0.9em;
  color: var(--secondary-color, #7c7dbf);
  margin-bottom: calc(var(--spacing-unit, 8px) * 2.5);
  font-weight: 500;
}

.product-description-full {
  margin-bottom: calc(var(--spacing-unit, 8px) * 3);
  flex-grow: 1;
}
.product-description-full h3 {
  font-size: 1.2em;
  color: var(--primary-color, #6b2248);
  margin-bottom: var(--spacing-unit, 8px);
  padding-bottom: calc(var(--spacing-unit, 8px) * 0.5);
  border-bottom: 1px solid var(--border-color, #eee);
  font-weight: 600;
}
.product-description-full p {
  font-size: 1em;
  line-height: 1.7;
  color: var(--text-color-light, #555);
}

.actions {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit, 8px) * 2);
  margin-top: auto;
  padding-top: calc(var(--spacing-unit, 8px) * 2);
  border-top: 1px solid var(--border-color, #f0f0f0);
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color, #ccc);
  border-radius: var(--border-radius, 6px);
  overflow: hidden;
}

.quantity-selector label {
  font-size: 0.95em;
  color: var(--text-color, #333);
  padding: 0 calc(var(--spacing-unit, 8px) * 1.5);
  white-space: nowrap;
}

.quantity-btn {
  background-color: var(--light-color, #f8f9fa);
  color: var(--text-color, #333);
  border: none;
  padding: 0; /* 内边距由宽高和flex控制 */
  cursor: pointer;
  font-size: 1.3rem; /* +/- 号字体 */
  line-height: 1;
  transition: background-color 0.2s ease;
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-btn:first-of-type { /* 减号按钮 */
  border-right: 1px solid var(--border-color, #ccc);
}
.quantity-btn:last-of-type { /* 加号按钮 */
  border-left: 1px solid var(--border-color, #ccc);
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--border-color, #e9ecef);
}
.quantity-btn:disabled {
  color: var(--grey-color-medium, #aaa);
  cursor: not-allowed;
  background-color: color-mix(in srgb, var(--light-color, #f8f9fa) 50%, transparent ) ;
}

.quantity-input {
  width: 55px;
  height: 36px; /* 比按钮略小一点，因为按钮有边框感 */
  text-align: center;
  border: none;
  font-size: 1rem;
  color: var(--text-color, #333);
  background-color: var(--white-color, #fff);
  -moz-appearance: textfield; /* Firefox */
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button { /* Chrome, Safari, Edge, Opera */
  -webkit-appearance: none;
  margin: 0;
}
.quantity-input:focus {
  outline: none;
}

.add-to-cart-button-detail.btn { /* 确保按钮样式应用 */
  flex-grow: 1;
  padding-top: calc(var(--spacing-unit, 8px) * 1); /* 统一按钮高度 */
  padding-bottom: calc(var(--spacing-unit, 8px) * 1);
  min-height: 40px;
  font-size: 1rem;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: calc(var(--spacing-unit, 8px) * 3);
  }
  .product-image-gallery {
    align-items: center;
  }
  .main-product-image, .image-container-detail {
    max-width: 450px;
    width: 100%;
  }
  .continue-shopping-link.btn {
    align-self: center; /* 按钮也居中 */
  }
  .product-info-panel {
    margin-top: var(--spacing-unit, 8px) * 1; /* 减小信息面板与图片的间距 */
    text-align: center; /* 信息面板内容也居中 */
  }
  .product-description-full h3 {
    text-align: left; /* 描述标题保持靠左，或也居中 */
  }
  .product-description-full p {
    text-align: left; /* 描述内容保持靠左，或也居中 */
  }
  .product-category-detail, .product-stock-detail {
    justify-content: center; /* 如果它们是flex容器 */
  }
  .actions {
    justify-content: center; /* 操作按钮组也居中 */
    flex-direction: column; /* 中等屏幕上也开始堆叠 */
    align-items: stretch;
    gap: var(--spacing-unit, 8px);
  }
  .quantity-selector {
    width: auto; /* 恢复自动宽度或设为合适值 */
    max-width: 200px; /* 例如，限制最大宽度 */
    margin: 0 auto var(--spacing-unit, 8px); /* 居中并与下方按钮留有间距 */
    justify-content: center;
  }
  .add-to-cart-button-detail.btn {
    width: 100%;
    max-width: 300px; /* 限制最大宽度 */
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 576px) {
  .product-detail-view.card {
    padding: calc(var(--spacing-unit, 8px) * 1.5); /* 12px */
  }
  .product-title {
    font-size: 1.5em;
  }
  .product-price-detail {
    font-size: 1.3em;
  }
  .product-description-full h3 {
    font-size: 1.05em;
  }
  .product-description-full p {
    font-size: 0.85em;
  }
  .quantity-selector label { /* 在非常小的屏幕上，标签可以简化或移位 */
    padding-left: var(--spacing-unit, 8px) * 1;
    margin-right: calc(var(--spacing-unit, 8px) * 0.5);
  }
  .quantity-btn {
    min-width: 34px;
    height: 34px;
    font-size: 1.1rem;
  }
  .quantity-input {
    width: 45px;
    height: 32px;
    font-size: 0.9rem;
  }
  .add-to-cart-button-detail.btn {
    font-size: 0.9rem;
    min-height: 38px;
    max-width: none; /* 占满 */
  }
}
</style>