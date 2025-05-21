<template>
  <div class="my-orders-view">
    <h2>我的订单</h2>
    <div v-if="orderStore.isLoading" class="loading-state">
      <p>正在加载订单...</p>
    </div>
    <div v-else-if="orderStore.error" class="error-state">
      <p>{{ orderStore.error }}</p>
    </div>
    <div v-else-if="orders.length === 0" class="empty-orders">
      <p>您还没有任何订单。</p>
      <router-link to="/" class="shop-now-btn">马上去购物</router-link>
    </div>
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>订单号: {{ order.id }}</h3>
          <span :class="['order-status', order.status.toLowerCase()]">{{ getStatusText(order.status) }}</span>
        </div>
        <div class="order-body">
          <p class="order-date">下单日期: {{ formatDate(order.orderDate) }}</p>
          <p class="order-total">总金额: ¥{{ order.totalAmount.toFixed(2) }}</p>
          <h4>订单商品:</h4>
          <ul class="order-items-list">
            <li v-for="item in order.items" :key="item.productId + '-' + order.id" class="order-item">
              <img :src="item.imageUrl" :alt="item.name" class="item-thumbnail" />
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price-qty">
                  ¥{{ item.priceAtOrder.toFixed(2) }} x {{ item.quantity }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/store/order';

const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);

onMounted(() => {
  // 如果订单列表为空，则获取一次
  if (orderStore.orders.length === 0) {
    orderStore.fetchOrders();
  }
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusText = (status) => {
  const statusMap = {
    'processing': '处理中',
    'shipped': '已发货',
    'delivered': '已送达',
    'cancelled': '已取消'
  };
  return statusMap[status.toLowerCase()] || status;
}
</script>

<style scoped>
.my-orders-view {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.my-orders-view h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.loading-state, .error-state, .empty-orders {
  text-align: center;
  padding: 30px 0;
  font-size: 1.1em;
  color: #777;
}
.error-state {
  color: #e74c3c;
}
.shop-now-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.shop-now-btn:hover {
  background-color: #2980b9;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.order-header {
  padding: 15px 20px;
  background-color: #ecf0f1;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.order-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #2c3e50;
}
.order-status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: bold;
  color: white;
}
.order-status.processing { background-color: #3498db; } /* 蓝色 */
.order-status.shipped { background-color: #f39c12; } /* 橙色 */
.order-status.delivered { background-color: #2ecc71; } /* 绿色 */
.order-status.cancelled { background-color: #e74c3c; } /* 红色 */


.order-body {
  padding: 15px 20px;
}
.order-body p {
  margin: 5px 0 10px;
  color: #555;
}
.order-date {
  font-size: 0.9em;
  color: #7f8c8d;
}
.order-total {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}
.order-body h4 {
  margin-top: 15px;
  margin-bottom: 8px;
  font-size: 1em;
  color: #34495e;
}

.order-items-list {
  list-style: none;
  padding: 0;
}
.order-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}
.order-item:last-child {
  border-bottom: none;
}
.item-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid #ddd;
}
.item-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.item-name {
  font-size: 0.95em;
  color: #333;
}
.item-price-qty {
  font-size: 0.85em;
  color: #777;
}
</style>