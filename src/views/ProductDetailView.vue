<template>
  <div class="product-detail-view">
    <div v-if="productStore.isLoading" class="loading-state">
      <p>正在加载产品详情...</p>
    </div>
    <div v-else-if="productStore.error" class="error-state">
      <p>{{ productStore.error }}</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
    <div v-else-if="product" class="product-content">
      <div class="product-image-gallery">
        <img :src="product.imageUrl" :alt="product.name" class="main-product-image" />
      </div>
      <div class="product-info-panel">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-category-detail">分类:
          <router-link :to="`/category/${product.category.id}`">{{ product.category.name }}</router-link>
        </p>
        <p class="product-price-detail">价格: <span>¥{{ product.price.toFixed(2) }}</span></p>
        <p class="product-stock-detail">库存: {{ product.stock }} 件</p>
        <div class="product-description-full">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>
        <div class="actions">
          <div class="quantity-selector">
            <label for="quantity">数量:</label>
            <input type="number" id="quantity" v-model.number="quantityToAdd" min="1" :max="product.stock" />
          </div>
          <button
              @click="handleAddToCart"
              class="add-to-cart-button-detail"
              :disabled="product.stock === 0 || quantityToAdd > product.stock || quantityToAdd < 1"
          >
            {{ product.stock === 0 ? '已售罄' : (quantityToAdd > product.stock ? '库存不足' : '加入购物车') }}
          </button>
        </div>
        <router-link to="/" class="continue-shopping-link">继续购物</router-link>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>未找到该产品的信息。</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useProductStore } from '@/store/products';
import { useCartStore } from '@/store/cart';
// import { useRoute } from 'vue-router'; // 如果不使用props，可以用这个获取路由参数

const props = defineProps({
  productId: {
    type: String,
    required: true
  }
});

const productStore = useProductStore();
const cartStore = useCartStore();
// const route = useRoute(); // productId 也可以从 route.params.productId 获取

const quantityToAdd = ref(1);

const product = computed(() => productStore.currentProduct);

const loadProduct = async (id) => {
  await productStore.fetchProductById(id);
  if (product.value && product.value.stock > 0) {
    quantityToAdd.value = 1; // 如果有库存，重置为1
  } else {
    quantityToAdd.value = 0; // 如果没库存，设为0
  }
};

onMounted(() => {
  loadProduct(props.productId);
});

// 监听 productId prop 的变化，以应对通过程序化导航到同一组件但不同产品的情况
watch(() => props.productId, (newId) => {
  if (newId) {
    loadProduct(newId);
  }
});

const handleAddToCart = () => {
  if (product.value && product.value.stock > 0 && quantityToAdd.value > 0 && quantityToAdd.value <= product.value.stock) {
    cartStore.addItem(product.value, quantityToAdd.value);
    alert(`${quantityToAdd.value} 件 ${product.value.name} 已添加到购物车!`);
  } else if (product.value && quantityToAdd.value > product.value.stock) {
    alert(`库存不足！${product.value.name} 仅剩 ${product.value.stock} 件。`);
  }
};

</script>

<style scoped>
.product-detail-view {
  max-width: 1100px;
  margin: 20px auto;
  padding: 25px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px 20px;
  font-size: 1.2em;
  color: #555;
}
.error-state p, .empty-state p {
  margin-bottom: 20px;
}
.error-state {
  color: #e74c3c;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr; /* Image gallery vs info panel */
  gap: 30px;
}

.product-image-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-product-image {
  width: 100%;
  max-width: 450px;
  height: auto;
  border-radius: 8px;
  border: 1px solid #eee;
  object-fit: cover;
}
/* Add styles for thumbnails if you implement them */

.product-info-panel {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 2.2em;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
}

.product-category-detail {
  font-size: 1em;
  color: #7f8c8d;
  margin-bottom: 15px;
}
.product-category-detail a {
  color: #3498db;
  text-decoration: none;
}
.product-category-detail a:hover {
  text-decoration: underline;
}

.product-price-detail {
  font-size: 1.8em;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 15px;
}
.product-price-detail span {
  vertical-align: middle;
}

.product-stock-detail {
  font-size: 1em;
  color: #27ae60; /* Green for positive stock indication */
  margin-bottom: 20px;
  font-weight: 500;
}

.product-description-full {
  margin-bottom: 25px;
}
.product-description-full h3 {
  font-size: 1.3em;
  color: #34495e;
  margin-bottom: 8px;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 5px;
}
.product-description-full p {
  font-size: 1em;
  line-height: 1.7;
  color: #555;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}
.quantity-selector label {
  font-size: 1em;
  color: #333;
}
.quantity-selector input[type="number"] {
  width: 70px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 1em;
}
/* Hide spinner for number input */
.quantity-selector input[type="number"]::-webkit-outer-spin-button,
.quantity-selector input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.quantity-selector input[type="number"] {
  -moz-appearance: textfield;
}


.add-to-cart-button-detail {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s;
}
.add-to-cart-button-detail:hover:not(:disabled) {
  background-color: #27ae60;
}
.add-to-cart-button-detail:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.continue-shopping-link, .back-link {
  display: inline-block;
  margin-top: 15px;
  color: #3498db;
  text-decoration: none;
  font-size: 1em;
  padding: 8px 0;
}
.continue-shopping-link:hover, .back-link:hover {
  text-decoration: underline;
  color: #2980b9;
}

@media (max-width: 900px) {
  .product-content {
    grid-template-columns: 1fr; /* Stack image and info on smaller screens */
  }
  .main-product-image {
    max-width: 100%; /* Allow image to fill container */
  }
  .product-title {
    font-size: 1.8em;
  }
  .product-price-detail {
    font-size: 1.5em;
  }
}

@media (max-width: 480px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  .add-to-cart-button-detail {
    width: 100%;
  }
  .quantity-selector {
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>