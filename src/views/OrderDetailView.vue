<template>
  <div class="view-container order-detail-view">
    <header class="view-header">
      <h1>订单详情</h1>
      <router-link to="/my-orders" class="btn btn-outline-secondary btn-sm back-link">返回我的订单</router-link>
    </header>

    <section class="main-view-content">
      <div v-if="orderStore.isLoadingDetails" class="status-message-container loading-state">
        <p>正在加载订单详情...</p>
      </div>
      <div v-else-if="orderStore.error" class="status-message-container error-state">
        <p>{{ orderStore.error }}</p>
        <button @click="loadOrderDetails" class="btn btn-primary mt-2">重试</button>
      </div>
      <div v-else-if="order" class="order-details-card card">
        <div class="order-summary-section">
          <h2>订单号: {{ order.id }}</h2>
          <p><strong>下单时间:</strong> {{ new Date(order.orderDate || Date.now()).toLocaleString() }}</p> <p><strong>订单状态:</strong> <span :class="`status-${order.status?.toLowerCase()}`">{{ order.status || '处理中' }}</span></p>
          <p><strong>订单总额:</strong> <span class="total-amount">¥{{ order.totalAmount.toFixed(2) }}</span></p> </div>

        <div class="order-items-section">
          <h3>商品列表 ({{ order.items?.length || 0 }}件)</h3>
          <div v-if="order.items && order.items.length > 0" class="order-items-list">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <div class="item-image-wrapper">
                <img :src="item.imageUrl || '/placeholder-image.png'" :alt="item.productName" class="item-image">
              </div>
              <div class="item-info">
                <h4>
                  <router-link :to="`/product/${item.productId}`">{{ item.productName }}</router-link>
                </h4>
                <p>单价: ¥{{ (item.priceAtOrder || 0).toFixed(2) }}</p>
                <p>数量: {{ item.quantity }}</p>
              </div>
              <div class="item-subtotal">
                小计: ¥{{ ((item.priceAtOrder || 0) * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
          <p v-else>此订单没有商品项。</p>
        </div>
      </div>
      <div v-else class="status-message-container empty-state">
        <p>未找到指定的订单信息。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/store/order'; //

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
});

const orderStore = useOrderStore();
const order = computed(() => orderStore.currentOrderDetails);

function loadOrderDetails() {
  orderStore.fetchOrderById(props.orderId); //
}

// calculateOrderTotal 函数不再需要，因为后端直接返回了 order.totalAmount
// function calculateOrderTotal(currentOrder) { ... }

onMounted(() => {
  loadOrderDetails();
});

watch(() => props.orderId, (newId) => {
  if (newId) {
    loadOrderDetails();
  }
});
</script>

<style scoped>
/* 样式保持不变，或者按需调整 */
.order-detail-view .view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(var(--spacing-unit) * 2.5);
}

.order-detail-view .back-link {
  font-weight: 500;
}

.order-details-card {
  padding: calc(var(--spacing-unit) * 2.5);
}

.order-summary-section {
  margin-bottom: calc(var(--spacing-unit) * 3);
  padding-bottom: calc(var(--spacing-unit) * 2);
  border-bottom: 1px solid var(--border-color);
}
.order-summary-section h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-unit);
}
.order-summary-section p {
  margin-bottom: calc(var(--spacing-unit) * 0.75);
  font-size: 1rem;
  color: var(--text-color-light);
}
.order-summary-section p strong {
  color: var(--text-color);
  margin-right: calc(var(--spacing-unit) * 0.5);
}
.order-summary-section .total-amount {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary-color);
}
.status-pending, .status-processing { color: var(--warning-color); font-weight: 500; } /* 对应 "Processing" */
.status-shipped { color: var(--secondary-color); font-weight: 500; }
.status-delivered, .status-completed { color: var(--success-color); font-weight: 500; }
.status-cancelled { color: var(--danger-color); font-weight: 500; }


.order-items-section h3 {
  font-size: 1.3rem;
  margin-bottom: calc(var(--spacing-unit) * 2);
  color: var(--dark-color);
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-unit) * 2);
}

.order-item {
  display: flex;
  gap: calc(var(--spacing-unit) * 2);
  padding: var(--spacing-unit);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--light-color);
}

.item-image-wrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background-color: var(--white-color);
  border-radius: var(--border-radius-small, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.item-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-info {
  flex-grow: 1;
}
.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}
.item-info h4 a {
  color: var(--primary-color);
  text-decoration: none;
}
.item-info h4 a:hover {
  text-decoration: underline;
}
.item-info p {
  font-size: 0.9rem;
  color: var(--text-color-light);
  margin-bottom: calc(var(--spacing-unit) * 0.25);
}

.item-subtotal {
  flex-shrink: 0;
  text-align: right;
  font-weight: 500;
  color: var(--text-color);
  min-width: 100px;
  align-self: center;
}

@media (max-width: 600px) {
  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .item-subtotal {
    text-align: left;
    margin-top: var(--spacing-unit);
    align-self: flex-start;
  }
  .order-detail-view .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .order-detail-view .back-link {
    margin-top: var(--spacing-unit);
  }
}
</style>