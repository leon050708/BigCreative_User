<template>
  <div class="view-container cart-view">
    <header class="view-header">
      <h1>我的购物车</h1>
      <p v-if="cartStore.cartItemCount > 0" class="subtitle">共 {{ cartStore.cartItemCount }} 件商品</p>
    </header>

    <section class="main-view-content">
      <div v-if="cartStore.items.length === 0" class="status-message-container empty-state">
        <p>购物车还是空的哦，快去挑选喜爱的商品吧！</p>
        <router-link to="/" class="btn btn-primary mt-2">去逛逛</router-link>
      </div>

      <div v-else>
        <div class="cart-items-list">
          <div v-for="item in cartStore.items" :key="item.product.id" class="cart-item card">
            <img :src="item.product.imageUrl || '/placeholder-image.png'" :alt="item.product.name" class="cart-item-image">
            <div class="cart-item-details">
              <h3>{{ item.product.name }}</h3>
              <p class="price">单价: ¥{{ item.product.price.toFixed(2) }}</p>
              <div class="quantity-controls">
                <button @click="updateQty(item.product.id, item.quantity - 1)" class="btn btn-outline-secondary btn-sm">-</button>
                <input type="number" :value="item.quantity" @change="updateQty(item.product.id, parseInt($event.target.value))" min="1" :max="item.product.stock" class="quantity-input-small">
                <button @click="updateQty(item.product.id, item.quantity + 1)" class="btn btn-outline-secondary btn-sm">+</button>
              </div>
            </div>
            <div class="cart-item-subtotal">
              <p>小计: ¥{{ (item.product.price * item.quantity).toFixed(2) }}</p>
              <button @click="cartStore.removeItem(item.product.id)" class="btn btn-danger btn-sm btn-remove">移除</button>
            </div>
          </div>
        </div>

        <div class="cart-summary card">
          <h2>订单总计</h2>
          <p>商品总数: {{ cartStore.cartItemCount }}</p>
          <p class="total-price">总金额: <strong>¥{{ cartStore.cartTotalPrice }}</strong></p>
          <div class="cart-actions">
            <button @click="cartStore.clearCart()" class="btn btn-outline-danger">清空购物车</button>
            <button @click="handleCheckout" class="btn btn-success">去结算</button> </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart'; //
import { useOrderStore } from '@/store/order'; //

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

function updateQty(productId, newQuantity) {
  cartStore.updateQuantity(productId, newQuantity); //
}

async function handleCheckout() {
  if (cartStore.items.length === 0) {
    alert('购物车是空的！');
    return;
  }
  const orderItems = cartStore.items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }));

  try {
    // 显示加载状态
    const newOrder = await orderStore.placeOrder({ items: orderItems }); //
    cartStore.clearCart(); //
    alert('订单创建成功！'); // 替换为更友好的提示
    router.push('/my-orders'); //
  } catch (error) {
    alert(`创建订单失败: ${orderStore.error}`); //
    // 隐藏加载状态
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 2);
  margin-bottom: calc(var(--spacing-unit) * 2);
  padding: var(--spacing-unit); /* 购物车项卡片内边距 */
}
.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
.cart-item-details {
  flex-grow: 1;
}
.cart-item-details h3 {
  font-size: 1.1rem;
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.cart-item-details .price {
  color: var(--text-color-light);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-unit);
}
.quantity-controls {
  display: flex;
  align-items: center;
}
.quantity-input-small {
  width: 50px;
  text-align: center;
  margin: 0 calc(var(--spacing-unit) * 0.5);
  padding: calc(var(--spacing-unit) * 0.5);
}
.btn-sm { /* 小型按钮样式 */
  padding: calc(var(--spacing-unit) * 0.5) var(--spacing-unit);
  font-size: 0.8rem;
}
.cart-item-subtotal {
  text-align: right;
  min-width: 120px; /* 确保小计和移除按钮有足够空间 */
}
.cart-item-subtotal p {
  font-weight: 500;
  margin-bottom: var(--spacing-unit);
}
.btn-remove {
  margin-top: var(--spacing-unit);
}

.cart-summary {
  margin-top: calc(var(--spacing-unit) * 3);
  padding: calc(var(--spacing-unit) * 2.5);
  background-color: var(--primary-color-light); /* 用浅主色作为背景 */
}
.cart-summary h2 {
  margin-bottom: calc(var(--spacing-unit) * 2);
  color: var(--primary-color);
}
.cart-summary .total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: var(--spacing-unit) 0 calc(var(--spacing-unit) * 2) 0;
}
.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: calc(var(--spacing-unit) * 2);
}
/* 新增成功色按钮 */
.btn-success {
  color: var(--white-color);
  background-color: var(--success-color);
  border-color: var(--success-color);
}
.btn-success:hover:not(:disabled) {
  background-color: var(--success-color-darker);
  border-color: var(--success-color-darker);
}


@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .cart-item-image {
    width: 80px;
    height: 80px;
  }
  .cart-item-subtotal {
    text-align: left;
    margin-top: var(--spacing-unit);
  }
  .cart-actions {
    flex-direction: column;
  }
  .cart-actions .btn {
    width: 100%;
    margin-bottom: var(--spacing-unit);
  }
  .cart-actions .btn:last-child {
    margin-bottom: 0;
  }
}
</style>