<template>
  <div class="view-container my-orders-view">
    <header class="view-header">
      <h1>我的订单</h1>
    </header>

    <section class="main-view-content">
      <div v-if="orderStore.isLoading" class="status-message-container loading-state">
        <p>正在加载订单列表...</p>
      </div>
      <div v-else-if="orderStore.error" class="status-message-container error-state">
        <p>{{ orderStore.error }}</p>
      </div>
      <div v-else-if="orderStore.orders.length === 0" class="status-message-container empty-state">
        <p>您还没有订单哦。</p>
        <router-link to="/" class="btn btn-primary mt-2">去购物</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orderStore.orders" :key="order.id" class="order-card card">
          <div class="order-card-header">
            <h3>订单号: {{ order.id }}</h3>
            <span class="order-status">{{ order.status || '已下单' }}</span> </div>
          <div class="order-card-body">
            <p>下单日期: {{ new Date(order.createdAt || Date.now()).toLocaleDateString() }}</p> <p>订单总额: <strong>¥{{ calculateOrderTotal(order).toFixed(2) }}</strong></p>
            <ul class="order-items-preview" v-if="order.items && order.items.length">
              <li v-for="item in order.items.slice(0, 2)" :key="item.productId">
                {{ item.product ? item.product.name : `商品ID: ${item.productId}` }} x {{ item.quantity }}
              </li>
              <li v-if="order.items.length > 2">...等 {{ order.items.length }} 件商品</li>
            </ul>
          </div>
          <div class="order-card-footer">
            <router-link :to="`/order-detail/${order.id}`" class="btn btn-outline-primary btn-sm">查看详情</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '@/store/order'; //

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrders(); //
});

// 辅助函数计算订单总额（如果后端没有直接返回）
// 请根据您的实际 order 数据结构调整
function calculateOrderTotal(order) {
  if (order.totalAmount) return order.totalAmount; // 如果后端已提供总金额
  if (!order.items || !Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => {
    // 假设 item 中有 price 和 quantity，或者需要从 productStore 中查找商品价格
    // 这里的价格计算逻辑需要根据您的数据结构来定
    // 示例：item.price * item.quantity
    const price = item.price || (item.product ? item.product.price : 0);
    return sum + (price * item.quantity);
  }, 0);
}
</script>

<style scoped>
.orders-list {
  display: grid;
  gap: calc(var(--spacing-unit) * 2.5);
}
.order-card {
  padding: calc(var(--spacing-unit) * 2);
}
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-unit);
  padding-bottom: var(--spacing-unit);
  border-bottom: 1px solid var(--border-color);
}
.order-card-header h3 {
  font-size: 1.2rem;
  color: var(--primary-color);
}
.order-status {
  background-color: var(--secondary-color);
  color: var(--white-color);
  padding: calc(var(--spacing-unit) * 0.5) var(--spacing-unit);
  border-radius: var(--border-radius);
  font-size: 0.85rem;
}
.order-card-body p {
  margin-bottom: calc(var(--spacing-unit) * 0.75);
  color: var(--text-color-light);
}
.order-card-body strong {
  color: var(--text-color);
}
.order-items-preview {
  list-style: none;
  padding-left: 0;
  font-size: 0.9em;
  color: var(--text-color-light);
  margin-top: var(--spacing-unit);
}
.order-items-preview li {
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.order-card-footer {
  margin-top: calc(var(--spacing-unit) * 2);
  text-align: right;
}
</style>