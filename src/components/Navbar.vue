<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-brand">Vue Shop</router-link>
    <div class="navbar-links">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/my-orders" class="nav-link">我的订单</router-link> <router-link to="/cart" class="nav-link">
      购物车
      <span v-if="cartStore.cartItemCount > 0" class="cart-count">
          ({{ cartStore.cartItemCount }})
        </span>
    </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useCartStore } from '@/store/cart';

const cartStore = useCartStore();
</script>

<style scoped>
/* ... (Navbar样式保持不变) ... */
.navbar {
  background-color: #3498db;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.navbar-brand {
  font-size: 1.8em;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.navbar-links {
  display: flex;
  gap: 20px;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
  transition: color 0.3s ease;
}
.nav-link:hover,
.nav-link.router-link-exact-active { /* router-link-active for partial matches */
  color: #ecf0f1;
  text-decoration: underline;
}
.cart-count {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8em;
  vertical-align: super;
}
.search-bar-in-nav {
  flex-grow: 0.5;
  max-width: 400px;
}
</style>