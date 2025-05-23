<template>
  <div class="cart-view">
    <h2>我的购物车</h2>
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>您的购物车是空的。</p>
      <router-link to="/" class="shop-now-btn">马上去购物</router-link>
    </div>
    <div v-else>
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
          <img :src="item.product.imageUrl" :alt="item.product.name" class="item-image" />
          <div class="item-details">
            <h3 class="item-name">{{ item.product.name }}</h3>
            <p class="item-price">单价: ¥{{ item.product.price.toFixed(2) }}</p>
            <div class="item-quantity">
              <label :for="`quantity-${item.product.id}`">数量:</label>
              <input
                  type="number"
                  :id="`quantity-${item.product.id}`"
                  :value="item.quantity"
                  @input="updateItemQuantity(item.product.id, $event.target.value)"
                  min="1"
                  :max="item.product.stock"
                  class="quantity-input"
              />
              <span class="item-stock">(库存: {{ item.product.stock }})</span>
            </div>
            <p class="item-subtotal">小计: ¥{{ (item.product.price * item.quantity).toFixed(2) }}</p>
          </div>
          <button @click="cartStore.removeItem(item.product.id)" class="remove-item-btn">移除</button>
        </div>
      </div>

      <div class="cart-summary">
        <p class="total-items">总计 {{ cartStore.cartItemCount }} 件商品</p>
        <p class="total-price">总金额: ¥{{ cartStore.cartTotalPrice }}</p>
        <button @click="handleCheckout" class="checkout-btn" :disabled="isProcessingOrder">
          {{ isProcessingOrder ? '正在处理...' : '去结算' }}
        </button>
        <button @click="cartStore.clearCart()" class="clear-cart-btn" :disabled="isProcessingOrder">清空购物车</button>
      </div>
      <p v-if="checkoutError" class="checkout-error-message">{{ checkoutError }}</p>
    </div>
  </div>
</template>

<script setup>
// ...
import { ref } from 'vue';
import { useCartStore } from '@/store/cart';
import { useOrderStore } from '@/store/order';
import { useRouter } from 'vue-router';
// ...

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const isProcessingOrder = ref(false);
const checkoutError = ref(null);


const handleCheckout = async () => {
  if (cartStore.items.length === 0) {
    alert("购物车是空的！");
    return;
  }

  isProcessingOrder.value = true;
  checkoutError.value = null;

  // 转换购物车项目为后端期望的格式
  const orderItemsPayload = {
    items: cartStore.items.map(item => ({
      productId: item.product.id, // 确保这里的 id 是 Long 类型，或者后端能处理 String
      quantity: item.quantity
    }))
  };

  try {
    const createdOrder = await orderStore.placeOrder(orderItemsPayload);
    alert(`订单 ${createdOrder.id} 已成功创建！`);
    cartStore.clearCart();
    router.push({ name: 'MyOrders' });
  } catch (error) {
    checkoutError.value = `下单失败: ${error.message || '请稍后再试。'}`;
    console.error("Checkout failed:", error);
  } finally {
    isProcessingOrder.value = false;
  }
};
</script>

<style scoped>
/* ... (CartView 样式保持不变，可以添加 checkout-error-message 的样式) ... */
.cart-view {
  max-width: 1920px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.cart-view h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.empty-cart {
  text-align: center;
  padding: 30px 0;
}
.empty-cart p {
  font-size: 1.2em;
  color: #777;
  margin-bottom: 20px;
}
.shop-now-btn {
  display: inline-block;
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.1em;
  transition: background-color 0.3s;
}
.shop-now-btn:hover {
  background-color: #2980b9;
}

.cart-items {
  margin-bottom: 30px;
}
.cart-item {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}
.cart-item:last-child {
  border-bottom: none;
}
.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}
.item-details {
  flex-grow: 1;
}
.item-name {
  font-size: 1.3em;
  color: #333;
  margin: 0 0 8px 0;
}
.item-price, .item-subtotal, .item-stock {
  font-size: 1em;
  color: #555;
  margin: 4px 0;
}
.item-subtotal {
  font-weight: bold;
}
.item-stock {
  font-size: 0.9em;
  color: #888;
  margin-left: 5px;
}
.item-quantity {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.item-quantity label {
  margin-right: 8px;
  font-size: 1em;
}
.quantity-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 1em;
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.quantity-input[type=number] {
  -moz-appearance: textfield;
}

.remove-item-btn {
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 0.9em;
  align-self: center;
}
.remove-item-btn:hover {
  background-color: #e74c3c;
  color: white;
}

.cart-summary {
  border-top: 2px solid #3498db;
  padding-top: 20px;
  text-align: right;
}
.total-items {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 8px;
}
.total-price {
  font-size: 1.4em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}
.checkout-btn, .clear-cart-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}
.checkout-btn {
  background-color: #2ecc71;
  color: white;
}
.checkout-btn:hover:not(:disabled) {
  background-color: #27ae60;
}
.checkout-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
.clear-cart-btn {
  background-color: #e74c3c;
  color: white;
}
.clear-cart-btn:hover:not(:disabled) {
  background-color: #c0392b;
}
.clear-cart-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
.checkout-error-message {
  color: #e74c3c;
  text-align: right;
  margin-top: 10px;
  font-weight: bold;
}


@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .item-image {
    margin-right: 0;
    margin-bottom: 15px;
  }
  .item-details {
    width: 100%;
  }
  .remove-item-btn {
    margin-top: 15px;
    width: 100%;
  }
  .cart-summary {
    text-align: center;
  }
  .checkout-btn, .clear-cart-btn {
    width: 100%;
    margin: 10px 0 0 0;
  }
}
</style>