<template>
  <div class="category-list">
    <h3>商品分类</h3>
    <ul v-if="!productStore.isLoading && productStore.categories.length">
      <li v-for="category in productStore.categories" :key="category.id">
        <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
      </li>
    </ul>
    <div v-else-if="productStore.isLoading">正在加载分类...</div>
    <div v-else-if="productStore.error">{{ productStore.error }}</div>
    <div v-else>暂无分类</div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/store/products';
import { onMounted } from 'vue';

const productStore = useProductStore();

onMounted(() => {
  if (!productStore.categories.length) { // 避免重复加载
    productStore.fetchCategories();
  }
});
</script>

<style scoped>
.category-list {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.category-list h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.category-list ul {
  list-style-type: none;
  padding: 0;
}
.category-list li {
  margin-bottom: 8px;
}
.category-list a {
  text-decoration: none;
  color: #3498db;
  transition: color 0.3s;
}
.category-list a:hover,
.category-list a.router-link-exact-active {
  color: #2980b9;
  font-weight: bold;
}
</style>